let SCCACHE_KEY = "SBCast.Data";
let SCCACHE_AMOUNT = 21600;
const SBCAST_DEFAULTIMG = "https://sbc.yokohama/cms/wp-content/uploads/powerpress/cover.png";

function getRSS() {
  const cache = CacheService.getScriptCache();
  let c = cache.get(SCCACHE_KEY);
  if(c != null){
    return JSON.parse(c);
  }else{
    // XMLデータを取得
    const response = UrlFetchApp.fetch("https://sbc.yokohama/category/sbcast/feed");
    const xml = response.getContentText();

    // XMLデータをパース
    const document = XmlService.parse(xml);
    const root = document.getRootElement();
    const itunes = XmlService.getNamespace("http://www.itunes.com/dtds/podcast-1.0.dtd");
    const items = root.getChild("channel").getChildren("item");

    Logger.log("RSS Load Start");
    const data = [];
    items.forEach((v) => {
      if(v.getChild("summary", itunes)){
        data.push({
          title : v.getChild("title").getText(),
          link: v.getChild("link").getText(),
          img: v.getChild("image", itunes) ? v.getChild("image", itunes).getAttribute("href").getValue() : SBCAST_DEFAULTIMG,
          length: v.getChild("duration", itunes).getText(),
          description: v.getChild("description").getText(),
          tags: v.getChildren("category")
            .filter((c) => { return !c.getText().includes("SBCast.") && !c.getText().includes("支援") })
            .map((c) => { return c.getText() })
        });
        Logger.log(v.getChild("title").getText());
        Logger.log(v.getChild("description").getText());
      }
    });
    Logger.log("Load End");
    cache.put(SCCACHE_KEY, JSON.stringify(data), SCCACHE_AMOUNT);
    return data;
  }
}

function testSCCache(){
  SCCACHE_KEY += "_TEST";
  SCCACHE_AMOUNT = 5;
  console.log("noCache");
  const noCache = getRSS();
  console.log("cached");
  const cached = getRSS();
  console.log("getRSS() Finished");
  console.log(`Test ${JSON.stringify(noCache) == JSON.stringify(cached) ? "OK": "NG"}`);
}

function testSCGetRSS(){
  const rss = getRSS();
  const rexp = /SBCast\.\s*(#\d+[^(]+)\(([^)]*)\)?/;
  const rexp2 = /SBCast\.\s*(#\d+)[\s:]+(.*)/;
  let success = true;
  rss.forEach((e) => {
    console.log(`> ${e.title}`);
    let m = rexp.exec(e.title);
    if(!m){
      m = rexp2.exec(e.title);
    }
    let s = e.title && e.link && e.img && m && m.length == 3;
    console.log(s ? "OK": "NG");
    success = s;
  });
  console.log("getRSS() Finished");
  console.log(`Test ${success ? "OK": "NG"}`);
}
