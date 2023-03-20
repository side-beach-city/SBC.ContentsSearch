function doGet(request) {
  return getHTML();
}

function refreshCache(){
  const cache = CacheService.getScriptCache();
  [SCCACHE_KEY, OMCACHE_KEY, BLOGCACHE_KEY].forEach((n) => {
    cache.remove(n);
  });
  getBLOGRSS();
  getRSS();
  getData();
}

function getHTML(){
  const template = HtmlService.createTemplateFromFile('res/index');
  template.sbcast = `const entry_casts = ${JSON.stringify(getRSS())};`;
  template.openmic = `const entry_openmic = ${JSON.stringify(getData())};`;
  template.blog = `const entry_blog = ${JSON.stringify(getBLOGRSS())};`;
  const html = template.evaluate();
  const title = html.getContent().match(/<title>(.*?)<\/title>/i)[1];  
  html.setTitle(title);
  return html;
}

function testHTML(){
  const html = getHTML();
  Logger.log(html.getTitle());
  Logger.log(`Test${html.getTitle() ? "OK" : "NG"}`);
}

function testRefreshCache(){
  const cache = CacheService.getScriptCache();
  const cs = [SCCACHE_KEY, OMCACHE_KEY, BLOGCACHE_KEY];
  let cacheCreate = true;
  let cacheRefresh = true;
  cs.forEach((n) => {
    cache.remove(n);
  });
  refreshCache();
  cs.forEach((n) => {
    cacheCreate = cacheCreate && (cache.get(n) !== null);
  });
  refreshCache();
  cs.forEach((n) => {
    cacheRefresh = cacheRefresh && (cache.get(n) !== null);
  });
  console.log("refreshCache() Finished");
  console.log(`Cache none -> create ${cacheCreate ? "OK" : "NG"}`);
  console.log(`Cache has -> refresh ${cacheRefresh ? "OK" : "NG"}`);
 
}