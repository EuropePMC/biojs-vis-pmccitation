var app = require("biojs-vis-pmccitation");

var instance = new app.CitationList({
  target: yourDiv.id,
  query:'p53',
  width: 400,
  numberResults: 10,
  displayStyle: app.CitationList.FULL_STYLE,
  elementOrder: app.CitationList.TITLE_FIRST
});	

//triggers the citation data loading process that will use the Europe PMC RESTFUL Web service
instance.load();
