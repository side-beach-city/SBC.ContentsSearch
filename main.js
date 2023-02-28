function doGet(request) {
  const template = HtmlService.createTemplateFromFile('res/index');
  template.sbcast = `const entry_casts = ${JSON.stringify(getRSS())};`;
  template.openmic = `const entry_openmic = ${JSON.stringify(getData())};`;
  return template.evaluate();
}
