var app = require("biojs-vis-pmccitation");

var instance = new app.Citation({
  target: yourDiv.id,
  source: app.Citation.MED_SOURCE,
  citation_id: '23962577',
  width: 400,
  proxyUrl: 'https://cors-anywhere.herokuapp.com/',
  displayStyle: app.Citation.FULL_STYLE,
  elementOrder: app.Citation.TITLE_FIRST,
  showAbstract: true
});	

//triggers the citation data loading process that will use the Europe PMC RESTFUL Web service
instance.load();
