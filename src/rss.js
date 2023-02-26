function getRSS() {
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
        img: v.getChild("image", itunes).getAttribute("href").getValue(),
        length: v.getChild("duration", itunes).getText(),
        tags: v.getChildren("category")
          .filter((c) => { return !c.getText().includes("SBCast.") && !c.getText().includes("支援") })
          .map((c) => { return c.getText() })
      });
      Logger.log(v.getChild("title").getText());
    }
  });
  Logger.log("Load End");
  return data;
}

function test(){
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
