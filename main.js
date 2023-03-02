function doGet(request) {
  const template = HtmlService.createTemplateFromFile('res/index');
  template.sbcast = `const entry_casts = ${JSON.stringify(getRSS())};`;
  template.openmic = `const entry_openmic = ${JSON.stringify(getData())};`;
  return template.evaluate();
}

function test(){
  const template = HtmlService.createTemplateFromFile('res/index');
  template.sbcast = `const entry_casts = ${JSON.stringify(getRSS())};`;
  template.openmic = `const entry_openmic = ${JSON.stringify(getData())};`;
  Logger.log(template.sbcast);
  Logger.log(template.openmic);
  Logger.log(template.evaluate().getContent());
}
