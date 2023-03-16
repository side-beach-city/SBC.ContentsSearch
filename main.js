function doGet(request) {
  return getHTML();
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
