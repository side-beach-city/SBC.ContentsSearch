function doGet(request) {
  const template = HtmlService.createTemplateFromFile('res/index');
  template.sbcast = `const entry_casts = ${JSON.stringify(getRSS())}`;
  return template.evaluate();
}
