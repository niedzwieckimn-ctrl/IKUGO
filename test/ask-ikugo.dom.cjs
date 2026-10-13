// node --test tests/ask-ikugo.dom.cjs (development dependency: jsdom 26)
const {JSDOM} = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = path.resolve(process.env.IKUGO_SITE_ROOT || path.join(__dirname, '..'));
const read = file => fs.readFileSync(path.join(root,file),'utf8');
function setup(mobile=false,url='https://static.example/') {
  const dom = new JSDOM(read('index.html'),{url,runScripts:'outside-only'});
  const w=dom.window, calls=[];
  for(const name of ['fetch','XMLHttpRequest','WebSocket','EventSource']) w[name]=function(){calls.push(name);throw new Error('Network forbidden');};
  w.navigator.sendBeacon=()=>{calls.push('beacon');throw new Error('Network forbidden');};
  w.matchMedia=()=>({matches:mobile,addEventListener(){}});
  w.Element.prototype.scrollIntoView=function(){this.dataset.scrolled='true';};
  w.eval(read('ask-ikugo-scenarios.js'));
  w.eval(read('ask-ikugo.js'));
  const q=selector=>w.document.querySelector(selector);
  const qa=selector=>[...w.document.querySelectorAll(selector)];
  function search(value){q('#ask-search').value=value;q('#ask-search').dispatchEvent(new w.Event('input'));}
  function choose(id){q('#ask-all').click();search(id);q('[data-scenario="'+id+'"].ask-example').click();}
  return {dom,w,q,qa,calls,search,choose};
}
test('66 unique catalog identifiers, seven exact category totals and four operation types',()=>{
  const h=setup();const data=h.w.IKUGO_LIBRARY;
  assert.equal(data.scenarios.length,66);
  assert.deepEqual(Array.from(data.scenarios,s=>s.id),Array.from({length:66},(_,i)=>`NOVA-${String(i+1).padStart(2,'0')}`));
  assert.deepEqual(Array.from(data.categories,c=>c.count),[10,10,14,8,8,10,6]);
  for(const category of data.categories) assert.equal(data.scenarios.filter(s=>s.category===category.id).length,category.count);
  for(const [type,count] of [['read',23],['analysis',23],['approval',10],['write',10]])assert.equal(data.scenarios.filter(s=>s.type===type).length,count);
  assert.equal(new Set(data.scenarios.map(s=>s.view.kind)).size,8);
  for(const s of data.scenarios){assert.ok(s.question&&s.answer&&s.note);for(const id of s.related)assert.ok(data.scenarios.some(row=>row.id===id));}
  h.w.close();
});
test('every scenario can be reached through categories and paginated selection',()=>{
  const h=setup();const seen=new Set();
  for(const category of h.w.IKUGO_LIBRARY.categories){
    h.q(`[data-category="${category.id}"]`).click();
    assert.equal(h.q(`[data-category="${category.id}"]`).getAttribute('aria-pressed'),'true');
    let pages=0;
    do {
      if(pages++)h.q('#ask-page-next').click();
      const ids=h.qa('.ask-example').map(node=>node.dataset.scenario);
      assert.ok(ids.length>0&&ids.length<=6);
      for(const id of ids){h.q(`[data-scenario="${id}"].ask-example`).click();assert.equal(h.q('#ask-detail').dataset.scenario,id);assert.equal(h.q('.ask-example[aria-current]').dataset.scenario,id);seen.add(id);}
    }while(!h.q('#ask-page-next').disabled);
  }
  assert.equal(seen.size,66);assert.equal(h.calls.length,0);h.w.close();
});
test('previous and next traverse all 66 examples and handle boundaries',()=>{
  const h=setup();h.q('#ask-all').click();assert.equal(h.q('#ask-prev').disabled,true);
  for(let i=1;i<=66;i++){assert.equal(h.q('#ask-detail').dataset.scenario,`NOVA-${String(i).padStart(2,'0')}`);if(i<66)h.q('#ask-next').click();}
  assert.equal(h.q('#ask-next').disabled,true);h.q('#ask-prev').click();assert.equal(h.q('#ask-detail').dataset.scenario,'NOVA-65');h.w.close();
});
test('search filters prepared content, category and IDs locally; empty state resets',()=>{
  const h=setup();h.q('#ask-all').click();h.search(' POWERBANK shortage ');
  assert.ok(h.qa('.ask-example').length>=2);assert.ok(h.q('.ask-example[data-scenario="NOVA-47"]'));
  h.search('NOVA–58');assert.equal(h.qa('.ask-example').length,1);assert.equal(h.q('#ask-detail').dataset.scenario,'NOVA-58');
  h.search('stock count');assert.ok(h.qa('.ask-example').length>0);
  h.search('noexample-xyz');assert.equal(h.qa('.ask-example').length,0);assert.equal(h.q('#ask-empty').hidden,false);assert.equal(h.q('#ask-sequence').hidden,true);
  h.q('#ask-reset').click();assert.equal(h.q('#ask-search').value,'');assert.match(h.q('#ask-result-count').textContent,/66 examples/);
  h.search('invoice');h.q('[data-category="customers"]').click();assert.ok(h.qa('.ask-example').length>0);
  h.q('#ask-clear-search').click();assert.match(h.q('#ask-result-count').textContent,/6 examples/);assert.equal(h.w.document.activeElement.id,'ask-search');h.w.close();
});
test('all ten approvals reveal human decision before result, and replay resets',()=>{
  const h=setup();
  for(const item of h.w.IKUGO_LIBRARY.scenarios.filter(s=>s.type==='approval')){
    h.choose(item.id);assert.equal(h.q('#ask-detail').dataset.stage,'0');assert.equal(h.q('.ask-operation-result'),null);assert.equal(h.q('.ask-confirmation'),null);
    assert.match(h.q('.ask-operation-state').textContent,/Proposed.*awaiting/);
    h.q('#ask-stage-button').click();assert.equal(h.q('#ask-detail').dataset.stage,'1');assert.equal(h.q('.ask-confirmation p').textContent,item.steps[0]);assert.equal(h.q('.ask-operation-result'),null);
    h.q('#ask-stage-button').click();assert.equal(h.q('#ask-detail').dataset.stage,'2');assert.equal(h.q('.ask-operation-result p').textContent,item.steps[1]);
    assert.ok(h.q('.ask-confirmation').compareDocumentPosition(h.q('.ask-operation-result'))&h.w.Node.DOCUMENT_POSITION_FOLLOWING);
    assert.equal(h.q('#ask-stage-button').textContent,'Replay example');h.q('#ask-stage-button').click();assert.equal(h.q('#ask-detail').dataset.stage,'0');
  }
  assert.equal(h.calls.length,0);h.w.close();
});
test('ten direct writes add no approval stage; pause continuation keeps its own procedure',()=>{
  const h=setup();
  for(const item of h.w.IKUGO_LIBRARY.scenarios.filter(s=>s.type==='write')){h.choose(item.id);assert.equal(h.q('.ask-stage-list'),null);assert.equal(h.q('.ask-response p').textContent,item.answer);if(!item.steps.length)assert.equal(h.q('#ask-stage-button'),null);}
  h.choose('NOVA-17');h.q('#ask-stage-button').click();assert.equal(h.q('#ask-detail').dataset.stage,'2');assert.match(h.q('.ask-operation-result p').textContent,/resumed/);assert.equal(h.q('.ask-facts'),null);assert.doesNotMatch(h.q('.ask-confirmation').textContent,/APPROVAL/);h.w.close();
});
test('changing examples resets illustrated operations without altering data',()=>{
  const h=setup();const before=JSON.stringify(h.w.IKUGO_LIBRARY);h.choose('NOVA-14');h.q('#ask-stage-button').click();h.q('#ask-stage-button').click();h.choose('NOVA-01');assert.match(h.q('.ask-response').textContent,/2 units/);h.choose('NOVA-14');assert.equal(h.q('#ask-detail').dataset.stage,'0');assert.equal(JSON.stringify(h.w.IKUGO_LIBRARY),before);assert.equal(h.w.localStorage.length+h.w.sessionStorage.length,0);h.w.close();
});
test('related shortage and ETA examples preserve exact supported evidence and conditions',()=>{
  const h=setup();h.choose('NOVA-47');assert.match(h.q('.ask-response').textContent,/60.*38|38.*60/);h.q('.ask-related-button').click();assert.equal(h.q('#ask-detail').dataset.scenario,'NOVA-48');assert.match(h.q('.ask-response').textContent,/16 October 2026/);assert.match(h.q('#ask-detail').textContent,/guarantee|estimate|tracking/i);
  h.choose('NOVA-57');assert.match(h.q('.ask-condition').textContent,/neither checks a bank nor transfers money/);h.choose('NOVA-58');assert.match(h.q('.ask-condition').textContent,/verified PDF/);h.w.close();
});
test('mobile selection moves focus and scrolls to details; typing does not steal focus',()=>{
  const h=setup(true);h.q('.ask-example').click();assert.equal(h.w.document.activeElement.id,'ask-detail-title');assert.equal(h.q('#ask-detail').dataset.scrolled,'true');h.q('.ask-back').click();assert.equal(h.w.document.activeElement.className,'ask-example');assert.equal(h.q('.ask-tools').dataset.scrolled,'true');h.q('#ask-search').focus();h.search('stock');assert.equal(h.w.document.activeElement.id,'ask-search');h.w.close();
});
test('search input stays text; no form, conversation, timers, tokens or remote resources',()=>{
  const h=setup();h.q('#ask-all').click();h.search('<img src=x onerror=alert(1)>');assert.equal(h.q('#ask-ikugo img'),null);
  assert.equal(h.qa('#ask-ikugo input').length,1);assert.equal(h.q('#ask-ikugo input').type,'search');assert.equal(h.q('#ask-ikugo textarea, #ask-ikugo form, #demo-messages, #demo-question'),null);
  for(const node of h.qa('[src],[href]')){const value=node.getAttribute('src')||node.getAttribute('href');assert.doesNotMatch(value,/^(https?:|\/\/|data:|javascript:)/i);}
  for(const name of ['script.js','ask-ikugo.js','ask-ikugo-scenarios.js'])assert.doesNotMatch(read(name),/fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|apiBase|IKUGO_DEMO|setTimeout\s*\(/);
  assert.match(h.q('meta[http-equiv="Content-Security-Policy"]').content,/connect-src 'none'/);assert.match(read('netlify.toml'),/connect-src 'none'/);assert.equal(h.calls.length,0);h.w.close();
});
test('offline file URL works with scripts loaded in order and no fetch',()=>{
  const h=setup(false,'file:///C:/local-preview/index.html');h.q('#ask-all').click();h.search('NOVA-66');assert.equal(h.q('#ask-detail').dataset.scenario,'NOVA-66');assert.equal(h.calls.length,0);h.w.close();
});
test('all local resources and anchor destinations exist; unique accessible IDs',()=>{
  const h=setup();const ids=h.qa('[id]').map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
  for(const node of h.qa('[src],link[href]')){const url=node.getAttribute('src')||node.getAttribute('href');assert.ok(fs.existsSync(path.join(root,url.split('?')[0])),url);}
  for(const link of h.qa('a[href^="#"]')){const href=link.getAttribute('href');if(href!=='#')assert.ok(h.q(href),href);}
  for(const input of h.qa('#ask-ikugo input'))assert.ok(h.q(`label[for="${input.id}"]`));
  assert.match(read('ask-ikugo.css'),/prefers-reduced-motion:reduce/);assert.match(read('ask-ikugo.css'),/max-width:580px/);assert.match(read('ask-ikugo.css'),/max-width:900px/);
  h.w.close();
});
