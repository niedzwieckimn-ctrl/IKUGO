// Real Chromium rendering and interaction test. No model/backend calls or response fixtures.
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(process.env.IKUGO_SITE_ROOT||path.join(__dirname,'..'));
const out=path.resolve(process.argv[2]||'.browser-results');
fs.mkdirSync(out,{recursive:true});
const publicFiles=new Set(['index.html','styles.css','script.js','ask-ikugo.css','ask-ikugo.js','ask-ikugo-scenarios.js',...fs.readdirSync(path.join(root,'assets')).map(name=>'assets/'+name)]);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp'};
const policy="connect-src 'none'; form-action 'none'; object-src 'none'; base-uri 'self'";
const server=http.createServer((req,res)=>{
  const file=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
  if(req.method!=='GET'||!publicFiles.has(file)){res.writeHead(404).end();return;}
  fs.readFile(path.join(root,file),(error,data)=>{res.writeHead(error?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Security-Policy':policy});res.end(error?'':data);});
});
const report={widths:[],errors:[],screenshots:[]};
(async()=>{
  let browser;
  try {
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const origin=`http://127.0.0.1:${server.address().port}`;
    browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
    for(const width of [1440,768,390]){
      const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
      const page=await context.newPage();const errors=[],requests=[],unexpected=[];
      page.on('pageerror',error=>errors.push(error.message));
      page.on('request',request=>{requests.push({url:request.url(),type:request.resourceType(),method:request.method()});if(!request.url().startsWith(origin+'/')||['fetch','xhr','websocket'].includes(request.resourceType()))unexpected.push(request.url());});
      await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
      await page.goto(origin+'/#ask-ikugo');
      await page.locator('.ask-example').first().waitFor();
      assert.equal(await page.locator('.ask-category').count(),7);
      assert.equal(await page.locator('#ask-ikugo textarea, #ask-ikugo form').count(),0);
      async function checkOverflow(id){
        const measure=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
        assert.ok(measure.scroll<=measure.client+1,`${width}px overflow at ${id}: ${JSON.stringify(measure)}`);
      }
      await checkOverflow('initial');
      const initial=path.join(out,`ask-ikugo-${width}.png`);
      await page.locator('#ask-ikugo').screenshot({path:initial});report.screenshots.push(initial);
      await page.locator('#ask-all').click();
      for(let n=1;n<=66;n++){
        const id=`NOVA-${String(n).padStart(2,'0')}`;
        await page.locator('#ask-search').fill(id);
        await page.locator(`.ask-example[data-scenario="${id}"]`).click();
        assert.equal(await page.locator('#ask-detail').getAttribute('data-scenario'),id);
        await checkOverflow(id);
        if(await page.locator('.ask-stage-list').count()){
          assert.equal(await page.locator('.ask-operation-result').count(),0);
          await page.locator('#ask-stage-button').click();
          assert.equal(await page.locator('#ask-detail').getAttribute('data-stage'),'1');
          assert.equal(await page.locator('.ask-operation-result').count(),0);
          await page.locator('#ask-stage-button').click();
          assert.equal(await page.locator('#ask-detail').getAttribute('data-stage'),'2');
          assert.equal(await page.locator('.ask-operation-result').count(),1);
          await checkOverflow(id+' result');
          if(n===14){const target=path.join(out,`ask-ikugo-approval-${width}.png`);await page.locator('.ask-detail-shell').screenshot({path:target});report.screenshots.push(target);}
        }
      }
      await page.locator('#ask-search').fill('noexample-xyz');assert.equal(await page.locator('#ask-empty').isVisible(),true);
      await page.locator('#ask-reset').click();assert.equal(await page.locator('.ask-example').count(),6);
      await page.locator('#ask-search').focus();await page.keyboard.type('powerbank');assert.ok(await page.locator('.ask-example').count()>0);
      await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'ask-clear-search');
      await page.keyboard.press('Enter');assert.equal(await page.locator('#ask-search').inputValue(),'');
      assert.deepEqual(errors,[]);assert.deepEqual(unexpected,[]);
      assert.ok(requests.every(request=>request.method==='GET'));
      report.widths.push({width,scenarios:66,approvalSequences:10,overflow:false,pageErrors:errors,apiRequests:unexpected,requests});
      await context.close();
    }
    report.status='passed';
  }catch(error){report.status='failed';report.errors.push(String(error.stack||error));process.exitCode=1;}
  finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));}
})();
