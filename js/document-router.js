(function(){
  'use strict';

  function basePath(){ return (window.__APP_BASE__ || '').replace(/\/+$/, ''); }
  function url(path){ return basePath() + '/' + String(path || '').replace(/^\/+/, ''); }
  function reveal(){
    document.documentElement.classList.remove('route-pending');
    document.documentElement.classList.add('route-ready');
  }
  function show404(){
    var errorPage = '<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error 404</title><style>html,body{margin:0;width:100%;min-height:100%;background:#fff;color:#111;direction:ltr!important}body{min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Arial,Helvetica,sans-serif;text-align:center}.error404{direction:ltr!important;unicode-bidi:isolate}.error404 h1{font-family:Arial,Helvetica,sans-serif!important;font-size:32px;line-height:1.2;margin:0 0 10px;font-weight:700;direction:ltr!important;unicode-bidi:isolate;font-variant-numeric:lining-nums}.error404 p{font-size:14px;margin:0;color:#444;direction:ltr!important}</style></head><body><main class="error404"><h1>Error &#52;&#48;&#52;</h1><p>Page not found.</p></main></body></html>';
    try {
      document.open('text/html','replace');
      document.write(errorPage);
      document.close();
    } catch (_) {
      document.documentElement.lang='en';
      document.documentElement.dir='ltr';
      document.title='Error 404';
      document.body.setAttribute('dir','ltr');
      document.body.innerHTML='<main class="error404" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#111;text-align:center;direction:ltr"><div><h1 style="font-size:32px;margin:0 0 10px;font-weight:700;direction:ltr">Error &#52;&#48;&#52;</h1><p style="font-size:14px;margin:0;color:#444;direction:ltr">Page not found.</p></div></main>';
    }
  }
  function routeKeysFromUrl(){
    var p = location.pathname.replace(/\/index\.html(?=\/|$)/ig, '').replace(/\/+$/, '');
    if(!/\/Requests\/ScanQR\.aspx$/i.test(p)) return null;

    var decoded = new URLSearchParams(location.search).get('TrID');
    if(!decoded) return null;
    decoded = String(decoded).trim();
    if(!decoded || decoded.indexOf('/') >= 0 || decoded.indexOf('\\') >= 0) return null;

    var rawMatch = location.search.match(/(?:^|[?&])TrID=([^&]*)/i);
    var raw = rawMatch ? String(rawMatch[1] || '').trim() : '';
    var keys = [decoded];
    if(raw && keys.indexOf(raw) < 0) keys.push(raw);
    var pipeNormalized = raw.replace(/%7c/ig, '|');
    if(pipeNormalized && keys.indexOf(pipeNormalized) < 0) keys.push(pipeNormalized);
    return keys;
  }
  async function fetchJson(path){
    var r=await fetch(url(path),{cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    return await r.json();
  }
  function put(id,value){
    var el=document.getElementById(id);
    if(el) el.textContent=(value==null?'':String(value));
  }

  (async function(){
    var routeKeys=routeKeysFromUrl();
    if(!routeKeys){ show404(); return; }

    var routes;
    try { routes=await fetchJson('data/routes.json'); }
    catch(_){ show404(); return; }

    var matchedKey=null;
    for(var k=0;k<routeKeys.length;k++){
      if(Object.prototype.hasOwnProperty.call(routes,routeKeys[k])){ matchedKey=routeKeys[k]; break; }
    }
    if(matchedKey===null){ show404(); return; }

    var id=String(routes[matchedKey] == null ? '' : routes[matchedKey]).trim();
    if(!id || !/^[A-Za-z0-9._-]+$/.test(id)){ show404(); return; }

    var data;
    try { data=await fetchJson('data/'+encodeURIComponent(id)+'.json'); }
    catch(_){ show404(); return; }

    put('MainContent_txtOrgName',data.organizationName);
    put('MainContent_txtNationalNumber',data.nationalNumber);
    put('MainContent_txtMemberNo',data.memberNumber);
    put('MainContent_txtTransNumber',data.documentNumber);
    put('MainContent_txtStatus',data.status);

    var st=document.getElementById('MainContent_txtStatus');
    if(st){
      st.className='label-value';
      if(data.statusClass) st.classList.add(String(data.statusClass));
      else if(String(data.status||'').trim()==='مصدقة') st.classList.add('lbl-success');
    }

    // Optional PDF support: if data/<id>.pdf exists, restore the report button.
    var pdf=url('data/'+encodeURIComponent(id)+'.pdf');
    var panel=document.getElementById('MainContent_PnlOpenReportInfomation');
    var btn=document.getElementById('MainContent_btnOpenReportAccess');
    if(panel && btn){
      try {
        var head=await fetch(pdf,{method:'HEAD',cache:'no-store'});
        if(head.ok){
          panel.style.display='';
          btn.onclick=function(e){ e.preventDefault(); window.open(pdf,'_blank','noopener'); };
        } else panel.style.display='none';
      } catch(_){ panel.style.display='none'; }
    }

    reveal();
  })().catch(show404);
})();
