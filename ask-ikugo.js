/* ASK IKUGO: a local editorial library. No agent, network, persistence or business writes. */
(() => {
  'use strict';
  const library = window.IKUGO_LIBRARY;
  const root = document.getElementById('ask-ikugo');
  if (!root || !library) return;
  const $ = selector => root.querySelector(selector);
  const pageSize = 6;
  const kinds = {read:'Data read', analysis:'Analysis', approval:'Approval required', write:'Direct action'};
  const categories = new Map(library.categories.map(item => [item.id, item]));
  const scenarios = new Map(library.scenarios.map(item => [item.id, item]));
  const state = {category:'inventory', query:'', page:0, active:library.scenarios[0].id, stage:0};
  const normalize = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[–—-]/g, ' ');
  const searchIndex = new Map(library.scenarios.map(item => [item.id, normalize([item.id,item.title,item.question,item.answer,item.note,item.keywords,...item.steps,categories.get(item.category).label].join(' '))]));
  let results = [];
  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }
  function button(label, className, handler) {
    const node = el('button', className, label);
    node.type = 'button';
    node.addEventListener('click', handler);
    return node;
  }
  function announce(text) { $('#ask-announcement').textContent = text; }
  function badge(item) { return el('span', `ask-badge ask-badge--${item.type}`, kinds[item.type]); }
  function focusDetail() {
    const heading = $('#ask-detail-title');
    if (heading) heading.focus({preventScroll:true});
    if (window.matchMedia('(max-width: 900px)').matches) $('#ask-detail').scrollIntoView({block:'start',behavior:'instant'});
  }
  function select(id, focus = false) {
    state.active = id;
    state.stage = 0;
    state.page = Math.floor(results.findIndex(item => item.id === id) / pageSize);
    renderList();
    renderDetail();
    announce(`${id}. ${scenarios.get(id).title}. ${kinds[scenarios.get(id).type]}.`);
    if (focus) focusDetail();
  }
  function filter() {
    const words = normalize(state.query.trim()).split(/\s+/).filter(Boolean);
    const identifier = state.query.trim().match(/^nova[\s–—-]*(\d{2})$/i);
    results = library.scenarios.filter(item => (state.category === 'all' || item.category === state.category) && (identifier ? item.id === `NOVA-${identifier[1]}` : words.every(word => searchIndex.get(item.id).includes(word))));
    state.page = 0;
    state.stage = 0;
    state.active = results[0]?.id || null;
    for (const node of $('#ask-categories').children) node.setAttribute('aria-pressed', String(node.dataset.category === state.category));
    $('#ask-all').setAttribute('aria-pressed', String(state.category === 'all'));
    $('#ask-clear-search').hidden = !state.query;
    $('#ask-list-title').textContent = state.category === 'all' ? 'All examples' : categories.get(state.category).label;
    $('#ask-result-count').textContent = `${results.length} ${results.length === 1 ? 'example' : 'examples'}${state.query ? ' matching your search' : ' to explore'}`;
    renderList();
    renderDetail();
    announce(`${results.length} examples. ${state.category === 'all' ? 'All categories' : categories.get(state.category).label}.`);
  }
  function renderList() {
    const list = $('#ask-list');
    list.replaceChildren();
    const start = state.page * pageSize;
    list.start = start + 1;
    results.slice(start, start + pageSize).forEach(item => {
      const row = el('li');
      const control = button('', 'ask-example', () => select(item.id, true));
      control.dataset.scenario = item.id;
      if (item.id === state.active) control.setAttribute('aria-current', 'true');
      const top = el('span', 'ask-example-top');
      top.append(el('span', 'ask-example-id', item.id), el('span', `ask-type-dot ask-type-dot--${item.type}`, kinds[item.type]));
      control.append(top, el('span', 'ask-example-question', item.question), el('span', 'ask-example-arrow', '↗'));
      control.lastElementChild.setAttribute('aria-hidden','true');
      row.append(control);
      list.append(row);
    });
    $('#ask-empty').hidden = !!results.length;
    $('.ask-pages').hidden = !results.length;
    $('#ask-page-count').textContent = results.length ? `${start + 1}–${Math.min(start + pageSize, results.length)} of ${results.length}` : '';
    $('#ask-page-prev').disabled = state.page === 0;
    $('#ask-page-next').disabled = start + pageSize >= results.length;
  }
  function viewFor(view) {
    const box = el('section', `ask-result ask-result--${view.kind}`);
    box.append(el('h4', 'ask-result-title', view.title));
    if (view.kind === 'metrics') {
      const grid = el('dl', 'ask-metrics');
      view.items.forEach(item => {
        const cell = el('div');
        cell.append(el('dt','',item.label),el('dd','',item.value),el('span','',item.detail));
        grid.append(cell);
      });
      box.append(grid);
    } else if (view.kind === 'facts') {
      const list = el('dl', 'ask-facts');
      view.items.forEach(item => {
        const row = el('div');
        row.append(el('dt','',item.label),el('dd','',item.value));
        list.append(row);
      });
      box.append(list);
    } else if (view.kind === 'table') {
      const scroll = el('div', 'ask-table-scroll');
      scroll.tabIndex = 0;
      scroll.setAttribute('role','region');
      scroll.setAttribute('aria-label',`${view.title}. Scroll horizontally if needed.`);
      const table = el('table');
      table.append(el('caption','ask-sr-only',view.title));
      const head = el('thead');
      const row = el('tr');
      view.columns.forEach(label => {const th = el('th','',label);th.scope='col';row.append(th);});
      head.append(row);
      const body = el('tbody');
      view.rows.forEach(values => {
        const tr = el('tr');
        values.forEach((value,index) => {const cell=el(index ? 'td' : 'th','',value);if(!index)cell.scope='row';tr.append(cell);});
        body.append(tr);
      });
      table.append(head,body);scroll.append(table);box.append(scroll);
    } else if (view.kind === 'ranking' || view.kind === 'comparison') {
      const list = el('ol', 'ask-bars');
      const max = Math.max(...view.items.map(item => item.value),1);
      view.items.forEach(item => {
        const row = el('li');
        const label = el('div','ask-bar-label');
        label.append(el('span','',item.label),el('strong','',`${item.value.toLocaleString('en-GB')} ${view.unit}`));
        const track = el('div','ask-bar-track');track.setAttribute('aria-hidden','true');
        const fill=el('span');fill.style.width=`${item.value / max * 100}%`;track.append(fill);
        row.append(label,track);list.append(row);
      });
      box.append(list);
      if(view.delta) box.append(el('p','ask-delta',view.delta));
    } else if (view.kind === 'change') {
      const change = el('div','ask-change');
      for (const [label,value] of [['Before',view.before],['After',view.after]]) {
        const cell=el('div');cell.append(el('span','',label),el('strong','',value));change.append(cell);
      }
      box.append(change,el('p','ask-change-label',view.label));
    } else if (view.kind === 'invoice') {
      const header=el('div','ask-invoice-heading');header.append(el('span','',view.customer),el('span','ask-invoice-status',view.status));
      const totals=el('dl','ask-facts');
      for(const [label,value] of [['Net amount',view.net],['Gross amount',view.gross],['Due date',view.due]]) {
        const row=el('div');row.append(el('dt','',label),el('dd','',value));totals.append(row);
      }
      box.append(header,totals);
    } else if (view.kind === 'documents') {
      const documents=el('ul','ask-documents');
      view.items.forEach(item => {const row=el('li');row.append(el('span','ask-document-icon','▤'),el('strong','',item),el('small','','Illustrated document'));row.firstElementChild.setAttribute('aria-hidden','true');documents.append(row);});
      box.append(documents);
    }
    if(view.foot) box.append(el('p','ask-result-foot',view.foot));
    return box;
  }
  function renderDetail() {
    const panel = $('#ask-detail');
    panel.replaceChildren();
    $('#ask-sequence').hidden = !state.active;
    panel.removeAttribute('data-scenario');
    if (!state.active) {
      panel.append(el('p','ask-panel-empty','A useful example is a good place to start. Choose another category or clear your search.'));
      panel.removeAttribute('aria-labelledby');
      return;
    }
    panel.setAttribute('aria-labelledby','ask-detail-title');
    const item = scenarios.get(state.active);
    panel.dataset.scenario = item.id;
    panel.dataset.stage = String(state.stage);
    const content = el('div','ask-detail-content');
    const back = button('↑ Back to examples','ask-back',() => {
      $('#ask-list button')?.focus({preventScroll:true});
      $('.ask-tools').scrollIntoView({block:'start',behavior:'instant'});
    });
    content.append(back);
    const meta=el('div','ask-detail-meta');meta.append(el('span','',`${item.id} / ${categories.get(item.category).label}`),badge(item));
    content.append(meta,el('p','ask-case-note',`Separate illustrative case · ${library.snapshot}`));
    const heading=el('h3','',item.title);heading.id='ask-detail-title';heading.tabIndex=-1;content.append(heading);
    const request=el('div','ask-request');request.append(el('span','ask-label','EXAMPLE REQUEST'),el('p','',item.question));content.append(request);
    if(item.type === 'approval') {
      const timeline=el('ol','ask-stage-list');timeline.setAttribute('aria-label','Illustrative operation stages');
      ['Prepared','Human approval','Result'].forEach((label,index) => {
        const step=el('li', index <= state.stage ? 'is-reached' : '', `${index+1}. ${label}`);
        if(index === state.stage)step.setAttribute('aria-current','step');
        timeline.append(step);
      });
      content.append(timeline);
    }
    const response=el('div','ask-response');
    const responseTitle=item.type === 'approval' ? 'IKUGO · PREPARED OPERATION' : item.type === 'write' ? 'IKUGO · EXAMPLE RECORDED' : 'IKUGO · PREPARED ANSWER';
    response.append(el('span','ask-label',responseTitle),el('p','',item.answer));content.append(response);
    if(state.stage === 0) {
      if(item.type === 'approval')content.append(el('p','ask-operation-state','Proposed operation · awaiting example approval'));
      content.append(viewFor(item.view));
    }
    if(state.stage >= 1 && item.steps.length) {
      const confirmation=el('div','ask-confirmation');
      confirmation.append(el('span','ask-label',item.type === 'approval' ? 'EXAMPLE HUMAN APPROVAL' : 'EXAMPLE FOLLOW-UP'),el('p','',item.steps[0]));
      content.append(confirmation);
    }
    if(state.stage === 2 && item.steps.length) {
      const result=el('div','ask-operation-result');result.append(el('span','ask-label','IKUGO · ILLUSTRATED RESULT'),el('p','',item.steps[1]));content.append(result);
      if(item.type === 'approval') {
        const resultView = {...item.view, title:item.view.title.replace(/^Proposed /,'Approved ')};
        content.append(viewFor(resultView));
      }
    }
    if(item.type === 'approval' || item.steps.length) {
      const controls=el('div','ask-operation-controls');
      const label=state.stage === 2 ? 'Replay example' : item.type === 'write' ? 'Show continuation' : state.stage === 0 ? 'Show example approval' : 'Show example result';
      const advance=button(label,'ask-button ask-button-primary',() => {
        state.stage=state.stage === 2 ? 0 : item.type === 'write' ? 2 : state.stage+1;
        renderDetail();
        $('#ask-stage-button').focus({preventScroll:true});
        announce(state.stage === 0 ? 'Example reset.' : state.stage === 1 ? `Example human approval: ${item.steps[0]}` : `Illustrated result: ${item.steps[1]}`);
      });
      advance.id='ask-stage-button';controls.append(advance,el('small','','Only reveals the next part of this example.'));
      content.append(controls);
    }
    const condition=el('aside','ask-condition');condition.setAttribute('aria-label','Conditions for this example');condition.append(el('span','ask-label','IN PRACTICE'),el('p','',item.note));content.append(condition);
    if(item.related.length) {
      const related=el('div','ask-related');related.append(el('span','ask-label','EXPLORE A RELATED EXAMPLE'));
      item.related.forEach(id => {
        const target=scenarios.get(id);
        related.append(button(`${target.title} ↗`,'ask-related-button',() => {
          state.category=target.category;state.query='';$('#ask-search').value='';filter();select(id,true);
        }));
      });
      content.append(related);
    }
    panel.append(content);
    const index=results.findIndex(row=>row.id===state.active);
    $('#ask-prev').disabled=index===0;
    $('#ask-next').disabled=index===results.length-1;
    $('#ask-position').textContent=`${index+1} / ${results.length}`;
  }
  library.categories.forEach((category,index) => {
    const control=button('','ask-category',()=>{state.category=category.id;filter();});
    control.dataset.category=category.id;
    control.setAttribute('aria-pressed','false');
    control.append(el('span','ask-category-index',`0${index+1}`),el('span','ask-category-name',category.label),el('span','ask-category-count',String(category.count)));
    $('#ask-categories').append(control);
  });
  $('#ask-search').addEventListener('input',event=>{state.query=event.target.value;filter();});
  $('#ask-clear-search').addEventListener('click',()=>{state.query='';$('#ask-search').value='';filter();$('#ask-search').focus();});
  $('#ask-all').addEventListener('click',()=>{state.category='all';filter();});
  $('#ask-reset').addEventListener('click',()=>{state.category='all';state.query='';$('#ask-search').value='';filter();$('#ask-search').focus();});
  for(const [selector,direction] of [['#ask-page-prev',-1],['#ask-page-next',1]]) {
    $(selector).addEventListener('click',()=>{
      state.page+=direction;renderList();
      announce($('#ask-page-count').textContent+' examples.');
      $('#ask-list button')?.focus({preventScroll:true});
    });
  }
  for(const [selector,direction] of [['#ask-prev',-1],['#ask-next',1]]) {
    $(selector).addEventListener('click',()=>{const index=results.findIndex(item=>item.id===state.active);select(results[index+direction].id,true);});
  }
  filter();
})();
