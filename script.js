(() => {
  'use strict';
  const steps = [
    {kicker:'THE RIGHT START',caption:'Arc cabinet handle · Satin nickel',value:'80',unit:'units available',title:'A promise you can keep.',description:'See what’s on the shelf and what’s already reserved. Start every customer conversation with a clear picture.',first:'80 available',second:'0 reserved',available:100,reserved:0,outcome:'Clarity before commitment.'},
    {kicker:'THE ORDER HAS ITS PLACE',caption:'Northline Studio · 12 Arc handles',value:'68',unit:'units still available',title:'Sold. And accounted for.',description:'A confirmed order reserves 12 handles for Northline Studio. Your team can see what is committed and what is still available to sell.',first:'68 available',second:'12 reserved',available:85,reserved:15,outcome:'One order. A shared picture.'},
    {kicker:'READY FOR THE NEXT STEP',caption:'Northline Studio · Order 024',value:'12',unit:'units to prepare',title:'The right items. The right order.',description:'Use the order’s details to prepare the packing list and review the invoice. Keep quantities and customer information together.',first:'68 available',second:'12 reserved',available:85,reserved:15,outcome:'From information to action.'},
    {kicker:'THE STORY STAYS TOGETHER',caption:'Northline Studio · Order 024',value:'01',unit:'connected order history',title:'A clear record, from start to finish.',description:'With the sale recorded and the parcel dispatched, its invoice, packing list and shipment reference remain linked to the order.',first:'68 available',second:'Order completed',available:100,reserved:0,outcome:'Ready for what comes next.'}
  ];
  const tabs = Array.from(document.querySelectorAll('[data-step]'));
  const panel = document.getElementById('story-panel');
  const content = document.querySelector('.story-content');
  let currentStep = 0;
  const text = (id,value) => { document.getElementById(id).textContent=value; };
  function showStep(index,focusTab=false) {
    currentStep=(index+steps.length)%steps.length;
    const s=steps[currentStep];
    tabs.forEach((tab,i)=> { const selected=i===currentStep; tab.classList.toggle('active',selected); tab.setAttribute('aria-selected',String(selected)); tab.tabIndex=selected?0:-1; });
    panel.setAttribute('aria-labelledby',tabs[currentStep].id);
    text('story-kicker',s.kicker);text('story-caption',s.caption);text('story-value',s.value);text('story-unit',s.unit);text('story-title',s.title);text('story-description',s.description);text('legend-first',s.first);text('legend-second',s.second);text('story-outcome',s.outcome);
    document.getElementById('track-available').style.width=s.available+'%';
    document.getElementById('track-reserved').style.width=s.reserved+'%';
    document.getElementById('next-step').innerHTML=(currentStep===3?'Start again':'Next step')+' <span aria-hidden="true">+</span>';
    content.classList.remove('animate'); void content.offsetWidth; content.classList.add('animate');
    if(focusTab) tabs[currentStep].focus();
  }
  tabs.forEach((tab,i)=> {
    tab.addEventListener('click',()=>showStep(i));
    tab.addEventListener('keydown',e=> {
      let target;
      if(e.key==='ArrowDown'||e.key==='ArrowRight')target=currentStep+1;
      if(e.key==='ArrowUp'||e.key==='ArrowLeft')target=currentStep-1;
      if(e.key==='Home')target=0;
      if(e.key==='End')target=steps.length-1;
      if(target!==undefined){e.preventDefault();showStep(target,true);}
    });
  });
  document.getElementById('next-step').addEventListener('click',()=>showStep(currentStep+1));
  const answers=[
    'See which orders have the stock they need, and which are still waiting on missing items.',
    'Bring attention to products with limited availability and the orders affected by those shortages.',
    'Find the recorded packing details and order references for the shipment you are asking about.',
    'Review incoming purchase shipments, their suppliers and recorded delivery stages. Spot missing tracking references and shipments with no recent update.'
  ];
  document.querySelectorAll('[data-prompt]').forEach(button=>button.addEventListener('click',()=> {
    document.querySelectorAll('[data-prompt]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    text('assistant-answer',answers[Number(button.dataset.prompt)]);
  }));
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.getElementById('main-nav');
  function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');nav.classList.remove('open');}
  toggle.addEventListener('click',()=> {const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();toggle.focus();}});
  const mobile=matchMedia('(max-width: 600px)');
  const updateOrientation=()=>document.querySelector('[role="tablist"]').setAttribute('aria-orientation',mobile.matches?'horizontal':'vertical');
  mobile.addEventListener('change',()=>{updateOrientation();closeMenu();});updateOrientation();
  text('year',new Date().getFullYear());
})();
