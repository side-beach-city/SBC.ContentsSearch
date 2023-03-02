const playlistId = "PLrPVslFukDQo7l5RCqAZtKDl6tUyMAFWH";
let OMCACHE_KEY = "OpenMic.Data";
let OMCACHE_AMOUNT = 21600;

function _getDataToken(token){
  const params = {
    playlistId: playlistId,
  };
  if(token) params["pageToken"] = token;
  const list = YouTube.PlaylistItems.list(["snippet", "status"], params);
  return list.nextPageToken ? list.items.concat(_getDataToken(list.nextPageToken)) : list.items;
}

function getData() {
  const cache = CacheService.getScriptCache();
  let c = cache.get(OMCACHE_KEY);
  if(c != null){
    return JSON.parse(c);
  }else{
    const list = _getDataToken();
    const data = [];
    list.forEach((v) => {
      if(v.status.privacyStatus == "public"){
        data.push({
          title: v.snippet.title,
          img: v.snippet.thumbnails.default.url,
          link: `https://www.youtube.com/watch?v=${v.snippet.resourceId.videoId}&list=${v.snippet.playlistId}`,
          description: v.snippet.description,
          date: new Date(v.snippet.publishedAt).toISOString().split("T").shift().replaceAll("-", "/")
        });
        Logger.log(v.snippet.title);
      }
    });
    cache.put(OMCACHE_KEY, JSON.stringify(data), OMCACHE_AMOUNT);
    return data;
  }
}

function testOMCache(){
  OMCACHE_KEY += "_TEST";
  OMCACHE_AMOUNT = 5;
  console.log("noCache");
  const noCache = getData();
  console.log("cached");
  const cached = getData();
  console.log("getRSS() Finished");
  console.log(`Test ${JSON.stringify(noCache) == JSON.stringify(cached) ? "OK": "NG"}`);
}

function testOMGetDataToken(){
  const list = _getDataToken();
  list.forEach(e => {
    Logger.log(e.snippet.title);
  });
  Logger.log("_getDataToken() Finished");
  Logger.log(`Test ${list.length >= 10 ? "OK": "NG"}`);

}

function testOMGetData(){
  const data = getData();
  const ytrexp = /(SBC\.?オープンマイク\s*#\d+)/;
  let success = true;
  data.forEach((e) => {
    console.log(`> ${e.title}`);
    let m = ytrexp.exec(e.title);
    let s = e.title && e.link && e.img && e.description && e.date && m && m.length == 2;
    console.log(s ? "OK": "NG");
    success = s;
  });
  console.log("getData() Finished");
  console.log(`Test ${success ? "OK": "NG"}`);
}
