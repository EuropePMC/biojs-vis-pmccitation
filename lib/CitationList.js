/** 
 * Europe PMC citations viewer (http://www.europepmc.org). It retrieves and displays the principal data (such as authors list, title, journal and source) of the citations list that matches the query specified in the Europe PMC system (http://europepmc.org).
 * 
 * @class CitationList
 * @extends Biojs
 *
 * @author <a href="mailto:ftalo@ebi.ac.uk">Francesco Talo'</a>
 * @version 1.0.0
 * @category 3
 * 
 * @requires <a href='http://blog.jquery.com/2012/09/20/jquery-1-8-2-released/'>jQuery Core 1.8.2</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/jquery/jquery-1.8.2.js"></script>
 * 
 * @requires <a href='../biojs/css/Citations.css'>EPMC Citations CSS</a>
 * @dependency <link href="../biojs/css/Citations.css" rel="stylesheet" type="text/css" />
 * 
 * @param {Object} options An object with the options for CitationList component.
 *    
 * @option {string} [target='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 *    
 * @option {int} width
 *    Width in pixels.
 *    
 * @option {int} [height=undefined] 
 *    Height in pixels. Optional parameter. 
 *    If it's specified the div container will extend its length up to that value and
 *    if the actual length exceeds that value a "Show more Results/Show fewer Results" link will be displayed at the bottom.    
 *    
 * @option {string} query 
 *     The query used to find the matching citations in the Europe PMC system to display.
 * 
 * @option {string} [loadingStatusImage="{BIOJS_HOME}/css/images/ajax-loader-1.gif"] 
 *    Relative path of the image to be displayed on loading status. If it's empty no loading image will be displayed.
 *
 * @option {string} [proxyUrl="{BIOJS_HOME}/dependencies/proxy/proxy.php"] 
 *    Relative path of the proxy to be used to make the call to the Europe PMC RESTFUL web service    
 *    
 * @option {int} [numberResults=25] 
 * 	  The number of citations displayed into the container from the results list set retrieved from the Europe PMC system. Therefore only the first X citations will be displayed,
 *    and if the number of total results is greater than X, there will be a link "See All Results" pointing to complete results list
 *    on the Europe PMC web site at the bottom of the container. The value could be between 1 and 25.
 * 
 * @option {string} [elementOrder="TITLE_FIRST"] 
 * 	  It decides the order of display of the citations data. It could be one of the following:
 * <ul>
 * 		<li>CitationList.TITLE_FIRST:"TITLE_FIRST".  
 *          In this case the order of the elements will be:
 *       	<ol>
 *       		<li>TITLE</li>
 *          	<li>AUTHORS</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 *       <li>CitationList.AUTHORS_FIRST:"AUTHORS_FIRST". 
 *       In this case the order of the elements will be:
 *       	<ol>
 *       		<li>AUTHORS</li>
 *          	<li>TITLE</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 * </ul>
 * 
 * @option {string} [displayStyle="FULL_STYLE"] 
 * It decides which citations data to display. It could be one of the following:
 * 
 *  <ul>
 * 		<li>CitationList.FULL_STYLE:"FULL_STYLE".  
 *          In this case all the citations data will be displayed:
 *       	<ol>
 *       		<li>TITLE</li>
 *          	<li>AUTHORS</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 *       <li>CitationList.TITLE_ONLY_STYLE:"TITLE_ONLY_STYLE". 
 *       In this case only the citations title will be displayed
 *       </li>
 *  </ul>
 * 	
 * 
 * @example 
 * // Example of viewing a list of Europe PMC citations matching a query
 * //All the citations data will be retrieved through the Europe PMC RESTFUL web service located at http://www.ebi.ac.uk/europepmc/webservices/rest/search/
 * 
 *       var instance = new  CitationList({
 *			target: 'YourOwnDivId',
 *			query:'p53',
 *	    	width: 400,
 *          height: 400,
 *	    	proxyUrl: '../biojs/dependencies/proxy/proxy.jsp',
 *	    	numberResults: 10,
 *	    	displayStyle: CitationList.FULL_STYLE,
 *	    	elementOrder: CitationList.TITLE_FIRST
 *	    });	
 *      
 *      instance.onResultsLoaded(function (){
 *    	 alert ('Citations loaded successfully');
 *     });
 *     
 *     instance.onRequestError(function (err){
 *   	  alert ('Error during citations data retrieving:'+err.error);
 *     });
 *     
 *      //triggers the citation data loading process that will use the Europe PMC RESTFUL Web service
 *     instance.loadResults();
 *     
 */

var extend = require('js-extend').extend;
var Class = require('js-class');
var CitationList;

module.exports = CitationList = Class(
/** @lends CitationList# */
{
	constructor: function(options){

		// load default opts
		extend(this.opt, options);

		if ( "string" == (typeof this.opt.target) ) {
			this._container = jQuery( "#" + this.opt.target );
		} else {			
			this.opt.target = "biojs_Citation_" + this.getId();
			this._container = jQuery('<div id="'+ this.opt.target +'"></div>');
		}

		this._container.addClass("Citation_list");
		
		var width = this.opt.width;
		var height = this.opt.height;
		if ( width != undefined ) {
			this._container.width( width );
		}
		
		if ( height != undefined ) {
			this._container.height( height );
		}
		
		if ( height == undefined ) {
			this.opt.collapsable = false;
		}else{
			this.opt.collapsable = true;
		}
		
		if (this.opt.proxyUrl != undefined){
			this._proxyUrl = this.opt.proxyUrl;
		}else{
			this._proxyUrl = 'https://cors-anywhere.herokuapp.com/';
		}
		
		if (this.opt.numberResults > 25){
			this.opt.numberResults = 25;
		}
		
		if ((this.opt.elementOrder == undefined) || (this.opt.elementOrder=='')){
			this.opt.elementOrder = CitationList.TITLE_FIRST;
		}
		
		if ((this.opt.displayStyle == undefined) || (this.opt.displayStyle=='')){
			this.opt.displayStyle = CitationList.FULL_STYLE;
		} 

		this.resetListContainer();
	},
	/** 
	    * Default options (and its values) for the CitationList component. 
	    * @name CitationList-opt
	    * @type Object
	    */
	opt: {
	   target: 'YourOwnDivId',
	   query: undefined,
	   restEpmcUrl: 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/',
	   height: undefined,
	   width: undefined,
	   loadingStatusImage: '../css/images/ajax-loader-1.gif',
	   numberResults:25,
	   collapsable: true,
	   elementOrder: 'TITLE_FIRST',
	   displayStyle: 'FULL_STYLE',
	   numRowCompact: 4,
	   logoImage: 'http://www.europepmc.org/docs/images/europe_pmc_standard.jpg'
		//logoImage: 'http://www.europepmc.org/images/epmc-logo.png'
	},
	
	_innerWidth:0,
	_tempLabel:'',
	
	 /**
	 * Array containing the supported event names
	 * @name CitationList-eventTypes
	 */
	eventTypes : [
      	/**
  		 * @name CitationList#onRequestError
  		 * @event Event raised when there's a problem during the citations data loading. An example could be that some mandatory parameters are missing, or no citations matching the specified query are found in the Europe PMC system.
  		 * @param {function} actionPerformed A function which receives an {@link Event} object as an argument.
  		 * @eventData {Object} source The component which did triggered the event.
  		 * @eventData {string} error Error message explaining the reason of the failure.
  		 * 
  		 * @example 
  		 * instance.onRequestError(
  		 *    function( e ) {
  		 *       alert ('Error during citations data retrieving:'+e.error);
  		 *    }
  		 * ); 
  		 * 
  		 * */
  		"onRequestError",
  		/**
  		 * @name CitationList#onResultsLoaded
  		 * @event  Event raised when the citations data loading process is successful
  		 * @param {function} actionPerformed A function which receives an {@link Event} object as an argument.
  		 * 
  		 * @example 
  		 * instance.onResultsLoaded(
  		 *    function( e ) {
  		 *      alert ('Citations loaded successfully');
  		 *    }
  		 * ); 
  		 * 
  		 * */
  		"onResultsLoaded"
	],
	
	/**
	 * Private function to reset the div container before the start of the loading process
	 */
	resetListContainer : function(){
		this._container.html('');
		
		this._citationsContainer = jQuery('<div class="epmc_Citations_data_container"></div>').appendTo(this._container);
		this._citationsContainer.width(this.opt.width);
		if ( this.opt.height != undefined ) {
			this._citationsContainer.height(this.opt.height);
		}
		
		if (this.opt.loadingStatusImage!=null && this.opt.loadingStatusImage!=''){ 
			this._loadingContainer = jQuery('<div class="epmc_Results_loading_image"></div>').appendTo(this._citationsContainer);
			if ( this.opt.height != undefined ) {
				this._loadingContainer.height(this.opt.height);
			}
			this._loadingContainer.width(this.opt.width);
		}
	},
  load: function(){
    this.loadResults();
  },

	/**
    * Function to trigger the citations data loading from the Europe PMC RESTFUL web service
    * 
    */
	loadResults: function() {
		if (this.opt.width==undefined || this.opt.width ==0){
			 this.trigger(CitationList.EVT_ON_REQUEST_ERROR, {error:"width parameter mandatory"});
		}else if (this.opt.query==undefined || this.opt.query ==''){
			this.trigger(CitationList.EVT_ON_REQUEST_ERROR, {error:"query parameter mandatory"});
		}else{
		
			this.resetListContainer();
					
			var filter= encodeURIComponent(this.opt.query);
			
			if (filter!=""){ 
				
				if (this.opt.loadingStatusImage!=null && this.opt.loadingStatusImage!=''){ 
					this._loadingContainer.html('<img class=\"epmc_image_citation_loading\" alt=\"Loading Citations for query '+this.opt.query+'\" src=\"'+this.opt.loadingStatusImage+'\"/>');
					this._loadingContainer.css("padding-left", ((this.opt.width - jQuery('#'+this.opt.target+' img.epmc_image_citation_loading').width())/2));
					if ( this.opt.height != undefined ) {
						this._loadingContainer.css("padding-top", ((this.opt.height - jQuery('#'+this.opt.target+' img.epmc_image_citation_loading').height())/2));
					}
				
				}
				
				var urlRequest = this.opt.restEpmcUrl + "query="+filter+"&resultType=core&format=json&page=1";
				
				var params = { 
						"url":	urlRequest, 
				};
				
				var self = this;
				 jQuery.ajax({
			            type: "GET",
			            url: self._proxyUrl + urlRequest,
			            dataType: 'json',
			            encoding:"UTF-8",
			            contentType: "text/plain; charset=UTF-8",
			     //       data: {"url": urlRequest},
			            headers: {
			                Accept: "application/json",
			                "Access-Control-Allow-Origin": "*"
			            },
			            success: function(resp) {
			            	if (self.opt.loadingStatusImage!=null && self.opt.loadingStatusImage!=''){ 
			        			self._loadingContainer.hide();
			        		}
			               if (resp.hitCount > 0){
				               self.buildPanel(resp);
				               self.trigger(CitationList.EVT_ON_RESULTS_LOADED, {});
			              }else{
			            	   self.trigger(CitationList.EVT_ON_REQUEST_ERROR, {error:"Impossible to find any citation matching the query "+self.opt.query});
			              }
			              
			            },
			            error: function(e) {
			            	if (self.opt.loadingStatusImage!=null && self.opt.loadingStatusImage!=''){ 
			        			self._loadingContainer.hide();
			        		}
			            	self.trigger(CitationList.EVT_ON_REQUEST_ERROR, {error:"Generic error"});
			            }
			      });
			
			}else{
				this.trigger(CitationList.EVT_ON_REQUEST_ERROR, {error:"query parameter mandatory"});
			}
		}
	},
	/**
	 * Private function to get the abstract URL of a single citation
	 * 
	 *  @param resultElement single citation data in a JSON format
	 */
	getAbstractUrl: function(resultElement){ 
		var abstractUrl="";
		if (resultElement.source==CitationList.PMC_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/PMC/"+resultElement.id;
		}else if ((resultElement.source==CitationList.DOI_SOURCE) || (resultElement.source==CitationList.MED_SOURCE)){
			abstractUrl = "http://europepmc.org/abstract/med/"+resultElement.id;
		}else if (resultElement.source==CitationList.ETH_SOURCE){
			abstractUrl = "http://europepmc.org/theses/ETH/"+resultElement.id;
		}else if (resultElement.source==CitationList.PAT_SOURCE){
			abstractUrl = "http://europepmc.org/patents/pat/"+resultElement.id;
		}else if (resultElement.source==CitationList.HIR_SOURCE){
			abstractUrl = "http://europepmc.org/guidelines/HIR/"+resultElement.id;
		}else if (resultElement.source==CitationList.AGR_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/AGR/"+resultElement.id;
		}else if (resultElement.source==CitationList.CBA_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/CBA/"+resultElement.id;
		}else if (resultElement.source==CitationList.CTX_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/CTX/"+resultElement.id;
		}else{
			abstractUrl = "http://europepmc.org/abstract/med/"+resultElement.id;
		}
		return abstractUrl;
	},
	/**
	 * Private function to get the label for the title of a single citation
	 * 
	 *  @param resultElement single citation data in a JSON format
	 *  @param fontsize font size of the div containing the title
	 *  @param numCurrentRows number of current rows containing the citation data
	 *  @param fontfamily font-family of the div containing the title
	 */
    getLabelTitle: function(resultElement, fontsize, numCurrentRows, fontfamily){
		var labelTitle = resultElement.title;
		
		if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
			var tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamily+';font-size:'+fontsize+'px;">' + labelTitle + '</span>'));
			var titleRows = Math.ceil(tempWidth/this._innerWidth);
			
			if (titleRows > (this.opt.numRowCompact - numCurrentRows)){
				var indexLastTitle = (labelTitle.length * (this.opt.numRowCompact - numCurrentRows)) /  titleRows;
				indexLastTitle = indexLastTitle -3;
				labelTitle = labelTitle.substring(0, indexLastTitle)
				labelTitle += "...";
			}
		}
		
		return labelTitle;
	},
	/**
	 * Private function to get the source/identifier of a single citation
	 * 
	 *  @param resultElement single citation data in a JSON format
	 */
	getSourceElement: function(resultElement){ 
		var sourceString="";
		if (resultElement.source==CitationList.PMC_SOURCE){
			sourceString="PMCID:"+resultElement.id;
		}else if (resultElement.source==CitationList.DOI_SOURCE){
			sourceString="DOI:"+resultElement.id;
		}else if (resultElement.source==CitationList.MED_SOURCE){
			sourceString="PMID:"+resultElement.id;
			if (resultElement.pmcid!=null && resultElement.pmcid!=""){
				sourceString += " PMCID:"+resultElement.pmcid;
			}
		}else if (resultElement.source==CitationList.PAT_SOURCE){
			sourceString="PATENT:"+resultElement.id;
		}else if (resultElement.source==CitationList.ETH_SOURCE){
			sourceString="THESIS:"+resultElement.id;
		}else{
			sourceString=resultElement.source+":"+resultElement.id;
		}
		return sourceString;
	},
	/**
	 * Private function to get the journal information of a single citation
	 * 
	 *  @param resultElement single citation data in a JSON format
	 */
	getJournalElement: function(resultElement){
		var journalHTML="";
		var journalInfo = null;
		if (resultElement.journalInfo != undefined){
			journalInfo = resultElement.journalInfo.journal;
		}
		var journalTitle="";
		
		if (journalInfo !=null){
			journalTitle = journalInfo.medlineAbbreviation;
		}
		
		if (journalTitle!= ""){
			var filter = "JOURNAL:&quot;"+ journalTitle+"&quot;";
			journalHTML= "<a class=\"epmc_citation_link\" href=\"http://europepmc.org/search?\query="+filter+"&page=1\">"+journalTitle+"</a>";
			
			var yearOfPubblication = resultElement.journalInfo.yearOfPublication;
			var issue = resultElement.journalInfo.issue;
			var volume = resultElement.journalInfo.volume;
			var pageNo= resultElement.pageInfo;
			if (yearOfPubblication!=null || issue!=null || volume !=null){
				journalHTML +=" <span>[";
				if (yearOfPubblication!=null){
					journalHTML +=yearOfPubblication;
				}
				
				if (volume!=null){
					
					if (yearOfPubblication!=null){
						journalHTML +=", ";
					}
					journalHTML +=volume;
				}
				
				if (issue!=null){
					journalHTML +="("+issue+")";
				}
				
				if (pageNo!=null){
					journalHTML +=":"+pageNo;
				}
				
				journalHTML +="]</span>";
			}
		}else{
			
			if ((resultElement.bookOrReportDetails != undefined) && (resultElement.bookOrReportDetails.publisher !=null)){ 
			
				journalTitle = resultElement.bookOrReportDetails.publisher;
				
				var filter = "PUBLISHER:&quot;"+ journalTitle+"&quot;";
				journalHTML= "<a class=\"epmc_citation_link\" href=\"http://europepmc.org/search?\query="+filter+"&page=1\">"+journalTitle+"</a>";
				
				var yearOfPubblication = resultElement.bookOrReportDetails.yearOfPublication;
				if (yearOfPubblication!=null){
					journalHTML +="<span>[";
					journalHTML +=yearOfPubblication;
					journalHTML +="]</span>";
				}
			}
		}
		
		return journalHTML;
	},
	/**
	 * Private function to get the label for the authors of a single citation
	 * 
	 *  @param resultElement single citation data in a JSON format
	 *  @param fontsize font size of the div containing the authors
	 *  @param numCurrentRows number of current rows containing the citation data
	 *  @param fontfamily font-family of the div containing the authors
	 */
	getAuthorsElement: function (resultElement, fontSize, numCurrentRows, fontfamily){
		
		var authors = resultElement.authorList.author;
		
		var authorsHtml="";
		var labelAuth="";
		var authorName="";
		var labelAuthNew="";
		var filter="";
		var tempWidth=0;
		var numAuthRows = 0;
		for (i=0; i < authors.length; i++){
			author = authors[i];
			if (i >0){
				authorsHtml += ", ";
				labelAuth += ", ";
			}
			
			if (author.fullName!=""){
				authorName = author.fullName;
			}else if (author.lastName!=""){
				authorName = author.lastName;
			}else if (author.collectiveName!=""){
				authorName = author.collectiveName;
			}else{
				authorName = "";
			}
			
			if (authorName!=undefined && authorName!=""){ 
				labelAuthNew =  labelAuth + authorName;
				filter = "AUTH:&quot;"+authorName+"&quot;";
				authorsHtmlNew =authorsHtml + "<a class=\"epmc_citation_link\" href=\"http://europepmc.org/search?query="+filter+"&page=1\">"+authorName+"</a>";
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamily+';font-size:'+fontSize+'px;">' + labelAuthNew  + '</span>'));
					numAuthRows = Math.ceil(tempWidth/this._innerWidth);
					if (numAuthRows > (this.opt.numRowCompact - numCurrentRows)){
						numAuthRows = (this.opt.numRowCompact - numCurrentRows);
						authorsHtml = authorsHtml + "...";
						labelAuth = labelAuth + "...";
						break;
					}else{
						labelAuth = labelAuthNew;
						authorsHtml = authorsHtmlNew;
					}
				}else{
					labelAuth = labelAuthNew;
					authorsHtml = authorsHtmlNew;
				}
			}
		}
		
		this._tempLabel = labelAuth;
		return authorsHtml;
	},
	/**
	 * Private function to build the div container starting from the Europe PMC RESTFUL web service response
	 * 
	 *  @param resp RESTFUL web service response containing the citations data in a JSON format
	 */
	buildPanel: function (resp){
		
		this._citationsContainer.css('border','0px');
		var displaying;
		if (resp.hitCount > this.opt.numberResults){
			displaying = this.opt.numberResults;
		}else{
			displaying = resp.hitCount;
		}
		
		//showing number of results displayed and eventually 
		if (this.opt.logoImage!=null && this.opt.logoImage!='' && (this.opt.width>=150)){ 
			jQuery('<div class="epmc_display_container"><span>Displaying '+ displaying+' results of '+resp.hitCount+'</span>  <img id="epmc_logo" src="'+this.opt.logoImage+'"></div>').appendTo(this._citationsContainer);
		}else{
			jQuery('<div class="epmc_display_container"><span>Displaying '+ displaying+' results of '+resp.hitCount+'</span></div>').appendTo(this._citationsContainer);
		}
		
		jQuery('.epmc_display_container').width(this.opt.width -10);
		
		var numCitations = resp.resultList.result.length;
		
		if (numCitations > this.opt.numberResults){
			numCitations = this.opt.numberResults;
		}
		
		var numCurrentRows=0;
		var tempWidth=0;
		var continueCitation = true;
		this._innerWidth = this.opt.width + 17;
		
		for (k=0; k<numCitations; k++){
		
			continueCitation = true;
			resultElement = resp.resultList.result[k];
			
			citationContainer = jQuery('<div class="epmc_Citation_container"></div>').appendTo(this._citationsContainer);
			var titleContainer;
			var authorsContainer;
			var subContainer;
			var journalContainer;
			var sourceContainer;
			if (this.opt.displayStyle == CitationList.TITLE_ONLY_STYLE){
				titleContainer = jQuery('<div class="epmc_Citation_title"></div>').appendTo(citationContainer);
			}else{
				if (this.opt.elementOrder == CitationList.AUTHORS_FIRST){
					authorsContainer = jQuery('<div class="epmc_Citation_authors"></div>').appendTo(citationContainer);
					subContainer = jQuery('<div class="epmc_Citation_subdata"></div>').appendTo(citationContainer);
					titleContainer = jQuery('<div class="epmc_Citation_title"></div>').appendTo(subContainer);
					journalContainer = jQuery('<div class="epmc_Citation_journal"></div>').appendTo(subContainer);
					sourceContainer = jQuery('<div class="epmc_Citation_source"></div>').appendTo(subContainer);
				 }else{
					titleContainer = jQuery('<div class="epmc_Citation_title"></div>').appendTo(citationContainer);
					subContainer = jQuery('<div class="epmc_Citation_subdata"></div>').appendTo(citationContainer);
					authorsContainer = jQuery('<div class="epmc_Citation_authors"></div>').appendTo(subContainer);
					journalContainer = jQuery('<div class="epmc_Citation_journal"></div>').appendTo(subContainer);
					sourceContainer = jQuery('<div class="epmc_Citation_source"></div>').appendTo(subContainer);
				 }
			}
			
			if (this.opt.displayStyle == CitationList.TITLE_ONLY_STYLE){
				//TITLE INFO ONLY
				var abstractUrl=this.getAbstractUrl(resultElement);
				titleContainer.html("<a class=\"epmc_citation_link\" href=\""+abstractUrl+"\">"+resultElement.title+"</a>");
			}else if (this.opt.elementOrder == CitationList.AUTHORS_FIRST){
				numCurrentRows=0;
				tempWidth= 0;
				
				if (continueCitation){
					//AUTHOR INFO
					var fontSizeAuthors = authorsContainer.css('font-size');
					var fontfamilyAuthors = authorsContainer.css('font-family');
					var  authorsHtml = this.getAuthorsElement(resultElement, fontSizeAuthors, numCurrentRows, fontfamilyAuthors);
					tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyAuthors+';font-size:'+fontSizeAuthors+'px;">' + this._tempLabel + '</span>'));
					numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
					authorsContainer.html(authorsHtml);
				}
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
				}
				
				if (continueCitation){
					//TITLE INFO
					var abstractUrl=this.getAbstractUrl(resultElement);
					var fontsizeTitle = titleContainer.css('font-size');
					var fontfamilyTitle = titleContainer.css('font-family');
					var labelTitle = this.getLabelTitle(resultElement, fontsizeTitle, numCurrentRows, fontfamilyTitle);
					tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyTitle+';font-size:'+fontsizeTitle+'px;">' + labelTitle + '</span>'));
					numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
					titleContainer.html("<a class=\"epmc_citation_link\" href=\""+abstractUrl+"\">"+labelTitle+"</a>");
				}
				
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
				}
				
				if (continueCitation){
					//SOURCE INFO
					var sourceString= this.getSourceElement(resultElement);
					sourceContainer.html(sourceString);
					numCurrentRows = numCurrentRows + 1;
				}
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
				}
				
				if (continueCitation){
					//JOURNAL INFO;
					var journalHTML = this.getJournalElement(resultElement);
					journalContainer.html(journalHTML);
					numCurrentRows = numCurrentRows + 1;
				}
			}else if (this.opt.elementOrder == CitationList.TITLE_FIRST){
				numCurrentRows=0;
				tempWidth= 0;
				
				if (continueCitation){
					//TITLE INFO
					var abstractUrl=this.getAbstractUrl(resultElement);
					var fontsizeTitle = titleContainer.css('font-size');
					var fontfamilyTitle = titleContainer.css('font-family');
					var labelTitle = this.getLabelTitle(resultElement, fontsizeTitle, numCurrentRows, fontfamilyTitle);
					tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyTitle+';font-size:'+fontsizeTitle+'px;">' + labelTitle + '</span>'));
					numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
					titleContainer.html("<a class=\"epmc_citation_link\" href=\""+abstractUrl+"\">"+labelTitle+"</a>");
				}
				
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
				}
				
				if (continueCitation){
					//AUTHOR INFO
					var fontSizeAuthors = authorsContainer.css('font-size');
					var fontfamilyAuthors = authorsContainer.css('font-family');
					var authorsHtml = this.getAuthorsElement(resultElement, fontSizeAuthors, numCurrentRows, fontfamilyAuthors)
					tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyAuthors+';font-size:'+fontSizeAuthors+'px;">' + this._tempLabel + '</span>'));
					numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
					authorsContainer.html(authorsHtml);
				}
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
				}
				
				if (continueCitation){
					//JOURNAL INFO;
					var journalHTML = this.getJournalElement(resultElement);
					journalContainer.html(journalHTML);
					numCurrentRows = numCurrentRows + 1;
				}
				
				if (this.opt.displayStyle == CitationList.COMPACT_STYLE){
					continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
				}
				
				if (continueCitation){
					//SOURCE INFO
					var sourceString= this.getSourceElement(resultElement);
					sourceContainer.html(sourceString);
					numCurrentRows = numCurrentRows + 1;
				}
				
				
			}
		}
	
		
		//display the "See All Results" link at the bottom if there are more results to show
		if (resp.hitCount > this.opt.numberResults){
			jQuery('<div class=\"epmc_more_resuts\"><a class=\"epmc_citation_link\" href=\"http://europepmc.org/search?\query='+this.opt.query+'&page=1">See All Results...</a></div>').appendTo(this._citationsContainer);
			jQuery('.epmc_more_resuts').width(this.opt.width -10);
		}
		
		
		//adjust height of the container
		var OriginalHeight;
		if (this.opt.collapsable){
			OriginalHeight = this._container.height();
		}else{
			OriginalHeight = this._container[0].scrollHeight;
		}
		
		this._citationsContainer.css("height","");
		this._container.css("height","");
		
		
		var fullHeight = this._container[0].scrollHeight;
		var containerHtml = this._container;
		var citationsContainerHtml = this._citationsContainer;
		var idTarget = this.opt.target;
		var widthContainer = this.opt.width;
		var collapsableContainer = this.opt.collapsable;
		this._citationsContainer.animate({
			maxHeight: OriginalHeight
		}, 500, function() {
			
			if ((collapsableContainer) && (fullHeight> OriginalHeight)){
			
				 citationsContainerHtml.css("overflow-y","scroll");
				 var scriptAnimation ='jQuery(\'#'+idTarget+' .epmc_Citations_data_container\').animate({'+
						'maxHeight:'+fullHeight+
					'}, 500, function() {'+
						'jQuery(\'#'+idTarget+' .epmc_extend_data_citation\').hide();'+
						'jQuery(\'#'+idTarget+' .epmc_collapse_data_citation\').show();'+
					' });'+
					'return false;';
					
				var expanderContainer = jQuery('<div class=\"epmc_extend_data_citation\"><a class=\"epmc_citation_link\" href=\"#\" onClick=\"'+scriptAnimation+'\">Show more Results</a></div>').appendTo(containerHtml);
				expanderContainer.width(widthContainer);
				
				scriptAnimation='jQuery(\'#'+idTarget+' .epmc_Citations_data_container\').animate({\n\r'+
				'maxHeight:'+OriginalHeight+'\n\r'+
			'}, 500, function() {\n\r'+
				'\tjQuery(\'#'+idTarget+' .epmc_extend_data_citation\').show();\n\r'+
				'\tjQuery(\'#'+idTarget+' .epmc_collapse_data_citation\').hide();\n\r'+
			' });'+
			'return false;';
				
				var collpaseContainer =  jQuery('<div style=\"display:none\" class=\"epmc_collapse_data_citation\"><a class=\"epmc_citation_link\" href=\"#\" onClick=\"'+scriptAnimation+'\">Show fewer Results</a></div>').appendTo(containerHtml);
				collpaseContainer.width(widthContainer);
			}
			
			if ((collapsableContainer==false) || (fullHeight <OriginalHeight)){
				containerHtml.height(fullHeight);
				citationsContainerHtml.height(fullHeight);
			}
			
			//citationsContainerHtml.css('border','1px solid #D6D6D6');
		});	
				
	},
	/**
	 * Private function to calculate the width of the specified div 
	 * @param textContainer the div of which we want to calculate the width. 
	 */
	textWidth: function(textContainer){
	    var html_calc = jQuery('<span>' + textContainer.html() + '</span>');
	    html_calc.css('font-size',textContainer.css('font-size')).hide();
	    html_calc.css('font-family',textContainer.css('font-family')).hide();
	    html_calc.css('white-space','nowrap').hide();
	    html_calc.prependTo('body');
	    var width = html_calc.width();
	    html_calc.remove();
	    return width;
	}
	
});

var consts = {

	//List of possible citation sources 
	MED_SOURCE:"MED",
	PMC_SOURCE:"PMC",
	PAT_SOURCE:"PAT",
	ETH_SOURCE:"ETH",
	HIR_SOURCE:"HIR",
	CTX_SOURCE:"CTX",
	CBA_SOURCE:"CBA",
	AGR_SOURCE:"AGR",
	DOI_SOURCE:"DOI",
	//possible elements ordering
	TITLE_FIRST:"TITLE_FIRST",
	AUTHORS_FIRST:"AUTHORS_FIRST",
	//style of visualization
	FULL_STYLE:"FULL_STYLE",
	COMPACT_STYLE:"COMPACT_STYLE",
	TITLE_ONLY_STYLE:"TITLE_ONLY_STYLE",
	//Events 
	EVT_ON_RESULTS_LOADED: "onResultsLoaded",
	EVT_ON_REQUEST_ERROR: "onRequestError"
};
for(var key in consts){
  CitationList[key] = consts[key];
}

var Events = require('biojs-events');
Events.mixin(CitationList.prototype);
