/** 
 * Europe PMC citation viewer (http://www.europepmc.org). It retrieves and displays the principal data (such as authors list, title, journal, source and abstract text) connected to the citation specified in the Europe PMC system (http://europepmc.org).
 * 
 * @class Citation
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
 * @param {Object} options An object with the options for Citation component.
 *    
 * @option {string} [target='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 *    
 * @option {int} width 
 *    Width in pixels.
 *    
 * @option {int} [height=undefined] 
 *    Height in pixels. Optional parameter. 
 *    Where specified the div container will extend its length up to that value, and
 *    if the actual length exceeds that value a "Show more Data/Show fewer Data" link will be displayed at the bottom.    
 *    
 * @option {string} citation_id
 *    Identifier of the citation of which we want to show the data. 
 *    The type of the identifier is defined through the parameter source.

 * @option {string} source
 *     Source of the citation of which we want to show the data. It could be one of the following constants: 
 *     <ul>
 *     	<li> Citation.MED_SOURCE:"MED"</li>
 *	    <li> Citation.PMC_SOURCE:"PMC"</li>
 *		<li> Citation.PAT_SOURCE:"PAT"</li>
 *		<li> Citation.ETH_SOURCE:"ETH"</li>
 *		<li> Citation.HIR_SOURCE:"HIR"</li>
 *		<li> Citation.CTX_SOURCE:"CTX"</li>
 *		<li> Citation.CBA_SOURCE:"CBA"</li>
 *		<li> Citation.AGR_SOURCE:"AGR"</li>
 *		<li> Citation.DOI_SOURCE:"DOI"</li>
 *     </ul>
 *     
 * 
 * @option {string} [loadingStatusImage="{BIOJS_HOME}/css/images/ajax-loader-1.gif"] 
 *    Relative path of the image to be displayed on loading status. If it's empty no loading image will be displayed.
 *    
 * @option {string} [proxyUrl="{BIOJS_HOME}/dependencies/proxy/proxy.php"] 
 *    Relative path of the proxy to be used to make the call to the Europe PMC RESTFUL web service    
 *  
 * @option {bool} [showAbstract=true] 
 * 	  If it's true then the abstract text is displayed at the bottom of the div container
 * 
 * @option {string} [elementOrder="TITLE_FIRST"] 
 * 	  It decides the order of display of the citation data. It could be one of the following:
 * <ul>
 * 		<li>Citation.TITLE_FIRST:"TITLE_FIRST".  
 *          In this case the order of the elements will be:
 *       	<ol>
 *       		<li>TITLE</li>
 *          	<li>AUTHORS</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 *       <li>Citation.AUTHORS_FIRST:"AUTHORS_FIRST". 
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
 * It decides which citation data to display. It could be one of the following:
 * 
 *  <ul>
 * 		<li>Citation.FULL_STYLE:"FULL_STYLE".  
 *          In this case all the citation data will be displayed:
 *       	<ol>
 *       		<li>TITLE</li>
 *          	<li>AUTHORS</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 *       <li>Citation.TITLE_ONLY_STYLE:"TITLE_ONLY_STYLE". 
 *       In this case only the citation title will be displayed
 *       </li>
 *  </ul>
 * 	
 * 
 * @example 
 * // Example of viewing the data of a Europe PMC citation
 * //All the data will be retrieved through the Europe PMC RESTFUL web service located at http://www.ebi.ac.uk/europepmc/webservices/rest/search/
 * 
 * var instance = new  Citation({
 *			target: 'YourOwnDivId',
 *			source: Citation.MED_SOURCE,
 *			citation_id: '23962577',
 *			width: 400,
 *	    	proxyUrl: '../biojs/dependencies/proxy/proxy.jsp',
 *	    	displayStyle: Citation.FULL_STYLE,
 *	    	elementOrder: Citation.TITLE_FIRST,
 *	    	showAbstract: true
 *	    });	
 *     
 *      instance.onCitationLoaded(function (){
 *   	  alert ('Citation loaded successfully');
 *      });
      
 *      instance.onRequestError(function (err){
 *    	  alert ('Error during citation data retrieving:'+err.error);
 *     });
 *     
 *     //triggers the citation data loading process that will use the Europe PMC RESTFUL Web service
 *     instance.loadCitation();
 *
 * 
 */

var extend = require('js-extend').extend;
var Class = require('js-class');
var Citation;

module.exports = Citation = Class(
/** @lends Citation# */
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

		this._container.addClass("Citation");
		
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
		
		this.resetContainer();
	},
	
	 /** 
	    * Default options (and its values) for the Citation component. 
	    * @name Citation-opt
	    * @type Object
	    */
	opt: {
	   target: 'YourOwnDivId',
	   citation_id: undefined,
	   source: undefined,
	   restEpmcUrl: 'http://www.ebi.ac.uk/europepmc/webservices/rest/search/',
	   height: undefined,
	   width: undefined,
	   loadingStatusImage: '../css/images/ajax-loader-1.gif',
	   collapsable: true,
	   showAbstract: true,
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
	 * @name Citation-eventTypes
	 */
	eventTypes : [
  		/**
  		 * @name Citation#onRequestError
  		 * @event Event raised when there's a problem during the citation data loading. An example could be that some mandatory parameters are missing, or no citation is identified by the specified parameters in the Europe PMC system.
  		 * @param {function} actionPerformed A function which receives an {@link Event} object as argument.
  		 * @eventData {Object} source The component which did triggered the event.
  		 * @eventData {string} error Error message explaining the reason of the failure.
  		 * 
  		 * @example 
  		 * instance.onRequestError(
  		 *    function( e ) {
  		 *       alert ('Error during citation data retrieving:'+e.error);
  		 *    }
  		 * ); 
  		 * 
  		 * */
  		"onRequestError",
  		/**
  		 * @name Citation#onCitationLoaded
  		 * @event  Event raised when the citation data loading process is successful
  		 * @param {function} actionPerformed A function which receives an {@link Event} object as an argument.
  		 * 
  		 * @example 
  		 * instance.onCitationLoaded(
  		 *    function( e ) {
  		 *      alert ('Citation loaded successfully');
  		 *    }
  		 * ); 
  		 * 
  		 * */
  		"onCitationLoaded"
	],
	
	/**
	 * Private function to reset the div container before the start of the loading process
	 */
	resetContainer : function(){
		this._container.html('');
		this._datacontainer = jQuery('<div class="epmc_Citation_data_container"></div>').appendTo(this._container);
		this._datacontainer.width(this.opt.width);
		if (this.opt.height!=undefined){ 
			this._datacontainer.height(this.opt.height);
		}
		
		this._logoContainer = jQuery('<div class="epmc_display_container"></div>').appendTo(this._datacontainer);
		this._logoContainer.width(this.opt.width -10);
		
		if (this.opt.displayStyle == Citation.TITLE_ONLY_STYLE){
			this._titleContainer = jQuery('<div class="epmc_Citation_title"></div>').appendTo(this._datacontainer);
		}else{
			if (this.opt.elementOrder == Citation.AUTHORS_FIRST){
				 
				 this._authorsContainer = jQuery('<div class="epmc_Citation_authors"></div>').appendTo(this._datacontainer);
				 this._subContainer = jQuery('<div class="epmc_Citation_subdata"></div>').appendTo(this._datacontainer);
				 this._titleContainer = jQuery('<div class="epmc_Citation_title"></div>').appendTo(this._subContainer);
				 this._journalContainer = jQuery('<div class="epmc_Citation_journal"></div>').appendTo(this._subContainer);
				 this._sourceContainer = jQuery('<div class="epmc_Citation_source"></div>').appendTo(this._subContainer);
			 }else{
				 this._titleContainer = jQuery('<div class="epmc_Citation_title"></div>').appendTo(this._datacontainer);
				 this._subContainer = jQuery('<div class="epmc_Citation_subdata"></div>').appendTo(this._datacontainer);
				 this._authorsContainer = jQuery('<div class="epmc_Citation_authors"></div>').appendTo(this._subContainer);
				 this._journalContainer = jQuery('<div class="epmc_Citation_journal"></div>').appendTo(this._subContainer);
				 this._sourceContainer = jQuery('<div class="epmc_Citation_source"></div>').appendTo(this._subContainer);
			 }
			 if (this.opt.showAbstract){ 
			    	this._abstractContainer = jQuery('<div class="epmc_Citation_abstract"></div>').appendTo(this._subContainer);
			 }
			
		}
		
		
		if (this.opt.loadingStatusImage!=null && this.opt.loadingStatusImage!=''){ 
			this._loadingContainer = jQuery('<div class="epmc_Citation_loading_image"></div>').appendTo(this._datacontainer);
			if (this.opt.height!=undefined){ 
				this._loadingContainer.height(this.opt.height);
			}
			this._loadingContainer.width(this.opt.width);
		}
	},
  load: function(){
    this.loadCitation();
  },
	/**
    * Function to trigger the citation data loading from the Europe PMC RESTFUL web service
    * 
    */
	loadCitation: function() {
		
		
		if (this.opt.width==undefined || this.opt.width ==0){
			 this.trigger(Citation.EVT_ON_REQUEST_ERROR, {error:"width parameter mandatory"});
		}else if (this.opt.source==undefined || this.opt.source ==''){
			 this.trigger(Citation.EVT_ON_REQUEST_ERROR, {error:"source parameter mandatory"});
		}else if (this.opt.citation_id==undefined || this.opt.citation_id ==''){
			 this.trigger(Citation.EVT_ON_REQUEST_ERROR, {error:"citation_id parameter mandatory"});
		}else{
		
			this.resetContainer();
					
			var filter="";
			
			if (this.opt.source==Citation.PMC_SOURCE){
				filter="PMCID:"+this.opt.citation_id;
			}else if (this.opt.source==Citation.DOI_SOURCE){
				filter="DOI:"+this.opt.citation_id;
			}else if ((this.opt.source==Citation.MED_SOURCE) || (this.opt.source==Citation.PAT_SOURCE) || (this.opt.source==Citation.AGR_SOURCE) ||
					(this.opt.source==Citation.ETH_SOURCE) || (this.opt.source==Citation.HIR_SOURCE) || (this.opt.source==Citation.CBA_SOURCE) || (this.opt.source==Citation.CTX_SOURCE)){
				filter="EXT_ID:"+this.opt.citation_id+"%20AND%20SRC:"+this.opt.source;
			}
			
			if (filter!=""){ 
				
				if (this.opt.loadingStatusImage!=null && this.opt.loadingStatusImage!=''){ 
					this._loadingContainer.html('<img class=\"epmc_image_citation_loading\" alt=\"Loading Citation SRC:'+this.opt.source+' ID:'+this.opt.citation_id+'\" src=\"'+this.opt.loadingStatusImage+'\"/>');
					this._loadingContainer.css("padding-left", ((this.opt.width - jQuery('#'+this.opt.target+' img.epmc_image_citation_loading').width())/2));
					if (this.opt.height!=undefined){ 
						this._loadingContainer.css("padding-top", ((this.opt.height - jQuery('#'+this.opt.target+' img.epmc_image_citation_loading').height())/2));
					}
				
				}
				
				var urlRequest = this.opt.restEpmcUrl + "query="+filter+"&resultType=core&format=json";
				
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
			            //data: {"url": urlRequest},
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
				               self.trigger(Citation.EVT_ON_CITATION_LOADED, {});
			              }else{
			            	   self.trigger(Citation.EVT_ON_REQUEST_ERROR, {error:"Impossible to find a citation identified by id "+self.opt.citation_id+" and source "+self.opt.source});
			              }
			              
			            },
			            error: function(e) {
			            	if (self.opt.loadingStatusImage!=null && self.opt.loadingStatusImage!=''){ 
			        			self._loadingContainer.hide();
			        		}
			            	self.trigger(Citation.EVT_ON_REQUEST_ERROR, {error:"Generic error"});
			            }
			      });
			
			}else{
				this.trigger(Citation.EVT_ON_REQUEST_ERROR, {error:"Source "+this.opt.source+" not recognized"});
			}
		}
	},
	
	/**
	 * Private function to build the div container starting from the RESTFUL web service response
	 * 
	 *  @param resp RESTFUL web service response containing the citation data in a JSON format
	 */
	buildPanel: function (resp){
		
		//showing number of results displayed and eventually 
		if (this.opt.logoImage!=null && this.opt.logoImage!=''){ 
			this._logoContainer.html('<img id="epmc_logo_single" src="'+this.opt.logoImage+'">');
		}
		
		
		this._innerWidth = this.opt.width + 17;
		
		var resultElement = resp.resultList.result[0];
		var continueCitation = true
		if (this.opt.displayStyle == Citation.TITLE_ONLY_STYLE){
			//TITLE INFO ONLY
			var abstractUrl=this.getAbstractUrl(resultElement);
			this._titleContainer.html("<a class=\"epmc_citation_link\" href=\""+abstractUrl+"\">"+resultElement.title+"</a>");
		}else if (this.opt.elementOrder == Citation.AUTHORS_FIRST){
			var numCurrentRows=0;
			var tempWidth= 0;
			
			if (continueCitation){
				//AUTHOR INFO
				var fontSizeAuthors = this._authorsContainer.css('font-size');
				var fontfamilyAuthors = this._authorsContainer.css('font-family');
				var authorsHtml = this.getAuthorsElement(resultElement, fontSizeAuthors, numCurrentRows, fontfamilyAuthors);
				tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyAuthors+';font-size:'+fontSizeAuthors+'px;">' + this._tempLabel + '</span>'));
				numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
				this._authorsContainer.html(authorsHtml);
			}
			
			if (this.opt.displayStyle == Citation.COMPACT_STYLE){
				continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
			}
			
			if (continueCitation){
				//TITLE INFO
				var abstractUrl=this.getAbstractUrl(resultElement);
				var fontsizeTitle = this._titleContainer.css('font-size');
				var fontfamilyTitle = this._titleContainer.css('font-family');
				var labelTitle = this.getLabelTitle(resultElement, fontsizeTitle, numCurrentRows, fontfamilyTitle);
				tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyTitle+';font-size:'+fontsizeTitle+'px;">' + labelTitle + '</span>'));
				numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
				this._titleContainer.html("<a class=\"epmc_citation_link\" href=\""+abstractUrl+"\">"+labelTitle+"</a>");
			}
			
			
			if (this.opt.displayStyle == Citation.COMPACT_STYLE){
				continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
			}
			
			if (continueCitation){
				//SOURCE INFO
				var sourceString= this.getSourceElement(resultElement);
				this._sourceContainer.html(sourceString);
				numCurrentRows = numCurrentRows + 1;
			}
			
			if (this.opt.displayStyle == Citation.COMPACT_STYLE){
				continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
			}
			
			if (continueCitation){
				//JOURNAL INFO;
				var journalHTML = this.getJournalElement(resultElement);
				this._journalContainer.html(journalHTML);
				numCurrentRows = numCurrentRows + 1;
			}
		}else if (this.opt.elementOrder == Citation.TITLE_FIRST){
			numCurrentRows=0;
			tempWidth= 0;
			
			if (continueCitation){
				//TITLE INFO
				var abstractUrl=this.getAbstractUrl(resultElement);
				var fontsizeTitle = this._titleContainer.css('font-size');
				var fontfamilyTitle = this._titleContainer.css('font-family');
				var labelTitle = this.getLabelTitle(resultElement, fontsizeTitle, numCurrentRows, fontfamilyTitle);
				tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyTitle+';font-size:'+fontsizeTitle+'px;">' + labelTitle + '</span>'));
				numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
				this._titleContainer.html("<a class=\"epmc_citation_link\" href=\""+abstractUrl+"\">"+labelTitle+"</a>");
			}
			
			
			if (this.opt.displayStyle == Citation.COMPACT_STYLE){
				continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
			}
			
			if (continueCitation){
				//AUTHOR INFO
				var fontSizeAuthors = this._authorsContainer.css('font-size');
				var fontfamilyAuthors = this._authorsContainer.css('font-family');
				var authorsHtml = this.getAuthorsElement(resultElement, fontSizeAuthors, numCurrentRows, fontfamilyAuthors)
				tempWidth = this.textWidth(jQuery('<span style="font-family:'+fontfamilyAuthors+';font-size:'+fontSizeAuthors+'px;">' + this._tempLabel + '</span>'));
				numCurrentRows = numCurrentRows +  Math.ceil(tempWidth/this._innerWidth);
				this._authorsContainer.html(authorsHtml);
			}
			
			if (this.opt.displayStyle == Citation.COMPACT_STYLE){
				continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
			}
			
			if (continueCitation){
				//JOURNAL INFO;
				var journalHTML = this.getJournalElement(resultElement);
				this._journalContainer.html(journalHTML);
				numCurrentRows = numCurrentRows + 1;
			}
			
			if (this.opt.displayStyle == Citation.COMPACT_STYLE){
				continueCitation = ((numCurrentRows + 1)<=this.opt.numRowCompact);
			}
			
			if (continueCitation){
				//SOURCE INFO
				var sourceString= this.getSourceElement(resultElement);
				this._sourceContainer.html(sourceString);
				numCurrentRows = numCurrentRows + 1;
			}
			
			
		}
		
		//ABSTRACT INFO
		if ((resp.resultList.result[0].abstractText!=null) && (this.opt.showAbstract) && (this.opt.displayStyle != Citation.TITLE_ONLY_STYLE)){
			this._abstractContainer.html("<div class=\"epmc_Citation_abstract_text\">"+resultElement.abstractText+"</div>");
		}
		
		//adjust height of the container
		var OriginalHeight;
		if (this.opt.collapsable){
			OriginalHeight = this._container.height();
		}else{
			OriginalHeight = this._datacontainer[0].scrollHeight;
		}
		
		this._datacontainer.css("height","");
		this._container.css("height","");
		
		
		var fullHeight = this._container[0].scrollHeight;
		var containerHtml = this._container;
		var citationsContainerHtml = this._datacontainer;
		var idTarget = this.opt.target;
		var widthContainer = this.opt.width;
		var collapsableContainer = this.opt.collapsable;
		this._datacontainer.animate({
			maxHeight: OriginalHeight
		}, 500, function() {
			
			if ((collapsableContainer) && (fullHeight> OriginalHeight)){
			
				 citationsContainerHtml.css("overflow-y","scroll");
				 var scriptAnimation ='jQuery(\'#'+idTarget+' .epmc_Citation_data_container\').animate({'+
						'maxHeight:'+fullHeight+
					'}, 500, function() {'+
						'jQuery(\'#'+idTarget+' .epmc_extend_data_citation\').hide();'+
						'jQuery(\'#'+idTarget+' .epmc_collapse_data_citation\').show();'+
					' });'+
					'return false;';
					
				var expanderContainer = jQuery('<div class=\"epmc_extend_data_citation\"><a class=\"epmc_citation_link\" href=\"#\" onClick=\"'+scriptAnimation+'\">Show more Data</a></div>').appendTo(containerHtml);
				expanderContainer.width(widthContainer);
				
				scriptAnimation='jQuery(\'#'+idTarget+' .epmc_Citation_data_container\').animate({\n\r'+
				'maxHeight:'+OriginalHeight+'\n\r'+
			'}, 500, function() {\n\r'+
				'\tjQuery(\'#'+idTarget+' .epmc_extend_data_citation\').show();\n\r'+
				'\tjQuery(\'#'+idTarget+' .epmc_collapse_data_citation\').hide();\n\r'+
			' });'+
			'return false;';
				
				var collpaseContainer =  jQuery('<div style=\"display:none\" class=\"epmc_collapse_data_citation\"><a class=\"epmc_citation_link\" href=\"#\" onClick=\"'+scriptAnimation+'\">Show fewer Data</a></div>').appendTo(containerHtml);
				collpaseContainer.width(widthContainer);
			}
			
			if ((collapsableContainer==false) && (fullHeight> OriginalHeight)){
				containerHtml.height(fullHeight);
				citationsContainerHtml.height(fullHeight);
			}
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
	},
	
	/**
	 * Private function to get the abstract URL of the citation
	 * 
	 *  @param resultElement RESTFUL web service response containing the citation data in a JSON format
	 */
	getAbstractUrl: function(resultElement){ 
		var abstractUrl="";
		if (resultElement.source==Citation.PMC_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/PMC/"+resultElement.id;
		}else if ((resultElement.source==Citation.DOI_SOURCE) || (resultElement.source==Citation.MED_SOURCE)){
			abstractUrl = "http://europepmc.org/abstract/med/"+resultElement.id;
		}else if (resultElement.source==Citation.ETH_SOURCE){
			abstractUrl = "http://europepmc.org/theses/ETH/"+resultElement.id;
		}else if (resultElement.source==Citation.PAT_SOURCE){
			abstractUrl = "http://europepmc.org/patents/pat/"+resultElement.id;
		}else if (resultElement.source==Citation.HIR_SOURCE){
			abstractUrl = "http://europepmc.org/guidelines/HIR/"+resultElement.id;
		}else if (resultElement.source==Citation.AGR_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/AGR/"+resultElement.id;
		}else if (resultElement.source==Citation.CBA_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/CBA/"+resultElement.id;
		}else if (resultElement.source==Citation.CTX_SOURCE){
			abstractUrl = "http://europepmc.org/abstract/CTX/"+resultElement.id;
		}else{
			abstractUrl = "http://europepmc.org/abstract/med/"+resultElement.id;
		}
		return abstractUrl;
	},
	
	/**
	 * Private function to get the label for the title of the citation
	 * 
	 *  @param resultElement RESTFUL web service response containing the citation data in a JSON format
	 *  @param fontsize font size of the div containing the title
	 *  @param numCurrentRows number of current rows containing the citation data
	 *  @param fontfamily font-family of the div containing the title
	 */
    getLabelTitle: function(resultElement, fontsize, numCurrentRows, fontfamily){
		var labelTitle = resultElement.title;
		
		if (this.opt.displayStyle == Citation.COMPACT_STYLE){
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
	 * Private function to get the source/identifier of the citation
	 * 
	 *  @param resultElement RESTFUL web service response containing the citation data in a JSON format
	 */
	getSourceElement: function(resultElement){ 
		var sourceString="";
		if (resultElement.source==Citation.PMC_SOURCE){
			sourceString="PMCID:"+resultElement.id;
		}else if (resultElement.source==Citation.DOI_SOURCE){
			sourceString="DOI:"+resultElement.id;
		}else if (resultElement.source==Citation.MED_SOURCE){
			sourceString="PMID:"+resultElement.id;
			if (resultElement.pmcid!=null && resultElement.pmcid!=""){
				sourceString += " PMCID:"+resultElement.pmcid;
			}
		}else if (resultElement.source==Citation.PAT_SOURCE){
			sourceString="PATENT:"+resultElement.id;
		}else if (resultElement.source==Citation.ETH_SOURCE){
			sourceString="THESIS:"+resultElement.id;
		}else{
			sourceString=resultElement.source+":"+resultElement.id;
		}
		return sourceString;
	},
	/**
	 * Private function to get the journal information of the citation
	 * 
	 *  @param resultElement RESTFUL web service response containing the citation data in a JSON format
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
					journalHTML +="[";
					journalHTML +=yearOfPubblication;
					journalHTML +="]";
				}
			}
		}
		
		return journalHTML;
	},
	/**
	 * Private function to get the label for the authors of the citation
	 * 
	 *  @param resultElement RESTFUL web service response containing the citation data in a JSON format
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
				
				if (this.opt.displayStyle == Citation.COMPACT_STYLE){
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
	EVT_ON_CITATION_LOADED: "onCitationLoaded",
	EVT_ON_REQUEST_ERROR: "onRequestError"
};
for(var key in consts){
  Citation[key] = consts[key];
}

var Events = require('biojs-events');
Events.mixin(Citation.prototype);
