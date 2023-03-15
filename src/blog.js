let BLOGCACHE_KEY = "BLOG.Data";
let BLOGCACHE_AMOUNT = 21600;
const BLOG_DEFAULTIMG = "https://sbc.yokohama/cms/wp-content/uploads/2018/09/sbc-topbg3.jpg";

function getBLOGRSS() {
  const cache = CacheService.getScriptCache();
  let c = cache.get(BLOGCACHE_KEY);
  if(c != null){
    return JSON.parse(c);
  }else{
    return _getBLOGRSS();
  }
}

function _getBLOGRSS() {
  // XMLデータを取得
  const response = UrlFetchApp.fetch("https://sbc.yokohama/feed");
  const xml = response.getContentText();

  // XMLデータをパース
  const document = XmlService.parse(xml);
  const root = document.getRootElement();
  const itunes = XmlService.getNamespace("http://www.itunes.com/dtds/podcast-1.0.dtd");
  const items = root.getChild("channel").getChildren("item").filter(v => !v.getChild("summary", itunes)).slice(0, 20);

  Logger.log("RSS Load Start");
  const data = [];

  items.forEach((v) => {
    let d = {
      title : v.getChild("title").getText(),
      link: v.getChild("link").getText(),
      date: new Date(v.getChild("pubDate").getText()).toISOString().split("T").shift().replaceAll("-", "/"),
      description: v.getChild("description").getText(),
      tags: v.getChildren("category")
        .map((c) => { return c.getText() })
    }
    d.img = getURLtoImageURL(d.link);
    Logger.log(v.getChild("title").getText());
    Logger.log(v.getChild("description").getText());
    data.push(d);
  });
  Logger.log("Load End");
  const cache = CacheService.getScriptCache();
  cache.put(BLOGCACHE_KEY, JSON.stringify(data), BLOGCACHE_AMOUNT);
  return data;
}

function getURLtoImageURL(htmlurl){
  try{
    const html = UrlFetchApp.fetch(htmlurl).getContentText();
    const m = /<meta\s+property="og:image"\s+content="([^"]+)"/i.exec(html);
    return m ? m[1] : BLOG_DEFAULTIMG;
  }catch(e){
    Logger.log(e);
  }

}

function testBLOGCache(){
  BLOGCACHE_KEY += "_TEST";
  BLOGCACHE_AMOUNT = 5;
  console.log("noCache");
  const noCache = getBLOGRSS();
  console.log("cached");
  const cached = getBLOGRSS();
  console.log("getBLOGRSS() Finished");
  console.log(`Test ${JSON.stringify(noCache) == JSON.stringify(cached) ? "OK": "NG"}`);
}

function testGetBLOGRSS(){
  const rss = _getBLOGRSS();
  const rexp = /^([^\n。]+(?:[\n。]))/;
  let success = true;
  rss.forEach((e) => {
    console.log(`> ${e.title}`);
    Logger.log(e);
    let s = e.title && e.link && e.img && e.date && e.description && e.tags;
    console.log(s ? "OK": "NG");
    success = success && s;
  });
  console.log("getBLOGRSS() Finished");
  console.log(`Test ${success ? "OK": "NG"}`);
}

function testGetURLtoImageURL(){
  const t = (url, except) => {
    console.log(`> ${url}`);
    console.log(getURLtoImageURL(url).startsWith(except) ? "OK": "NG");
  }
  t("https://sbc.yokohama/sbcast/90-we_create_3-inoueshinya", "https://i0.wp.com/sbc.yokohama/cms/wp-content/uploads/2023/03/90-We_Create_3-InoueShinya.jpg");
  t("https://sbc.yokohama/events/202303_sbc-openmic", "https://i0.wp.com/sbc.yokohama/cms/wp-content/uploads/2023/02/2303.png");
  t("https://onpu-tamago.net/about", BLOG_DEFAULTIMG);
}





















