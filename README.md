# biojs-vis-pmccitation

[![NPM version](http://img.shields.io/npm/v/biojs-vis-pmccitation.svg)](https://www.npmjs.org/package/biojs-vis-pmccitation) 

> Reads principal data connected to the citation specified in the Europe PMC system 

## Getting Started
Install the module with: `npm install biojs-vis-pmccitation`

```javascript
var pmc = require('biojs-vis-pmccitation');
var instance = pmc.Citation(opts); (or CitationList)
//triggers the citation data loading process that will use the Europe PMC RESTFUL Web service
instance.load();
```

This component consists of two view `Citation` and `CitationList`.

## Options

### Citation

@param {Object} options An object with the options for Citation component.
   
@option {string} [target='YourOwnDivId']
   Identifier of the DIV tag where the component should be displayed.
   
@option {int} width 
   Width in pixels.
   
@option {int} [height=undefined] 
   Height in pixels. Optional parameter. 
   Where specified the div container will extend its length up to that value, and
   if the actual length exceeds that value a "Show more Data/Show fewer Data" link will be displayed at the bottom.    
   
@option {string} citation_id
   Identifier of the citation of which we want to show the data. 
   The type of the identifier is defined through the parameter source.

@option {string} source
    Source of the citation of which we want to show the data. It could be one of the following constants: 
    <ul>
    	<li> Citation.MED_SOURCE:"MED"</li>
       <li> Citation.PMC_SOURCE:"PMC"</li>
   	<li> Citation.PAT_SOURCE:"PAT"</li>
   	<li> Citation.ETH_SOURCE:"ETH"</li>
   	<li> Citation.HIR_SOURCE:"HIR"</li>
   	<li> Citation.CTX_SOURCE:"CTX"</li>
   	<li> Citation.CBA_SOURCE:"CBA"</li>
   	<li> Citation.AGR_SOURCE:"AGR"</li>
   	<li> Citation.DOI_SOURCE:"DOI"</li>
    </ul>
    

@option {string} [loadingStatusImage="{BIOJS_HOME}/css/images/ajax-loader-1.gif"] 
   Relative path of the image to be displayed on loading status. If it's empty no loading image will be displayed.
   
@option {string} [proxyUrl="{BIOJS_HOME}/dependencies/proxy/proxy.php"] 
   Relative path of the proxy to be used to make the call to the Europe PMC RESTFUL web service    
 
@option {bool} [showAbstract=true] 
	  If it's true then the abstract text is displayed at the bottom of the div container

@option {string} [elementOrder="TITLE_FIRST"] 
	  It decides the order of display of the citation data. It could be one of the following:
<ul>
		<li>Citation.TITLE_FIRST:"TITLE_FIRST".  
         In this case the order of the elements will be:
      	<ol>
      		<li>TITLE</li>
         	<li>AUTHORS</li>
         	<li>JOURNAL</li>
         	<li>SOURCE/IDENTIFIER</li>
      	</ol>
      </li>
      <li>Citation.AUTHORS_FIRST:"AUTHORS_FIRST". 
      In this case the order of the elements will be:
      	<ol>
      		<li>AUTHORS</li>
         	<li>TITLE</li>
         	<li>JOURNAL</li>
         	<li>SOURCE/IDENTIFIER</li>
      	</ol>
      </li>
</ul>

@option {string} [displayStyle="FULL_STYLE"] 
It decides which citation data to display. It could be one of the following:

 <ul>
		<li>Citation.FULL_STYLE:"FULL_STYLE".  
         In this case all the citation data will be displayed:
      	<ol>
      		<li>TITLE</li>
         	<li>AUTHORS</li>
         	<li>JOURNAL</li>
         	<li>SOURCE/IDENTIFIER</li>
      	</ol>
      </li>
      <li>Citation.TITLE_ONLY_STYLE:"TITLE_ONLY_STYLE". 
      In this case only the citation title will be displayed
      </li>
 </ul>
 	
 
### CitationList

@param {Object} options An object with the options for CitationList component.
   
@option {string} [target='YourOwnDivId']
   Identifier of the DIV tag where the component should be displayed.
   
@option {int} width
   Width in pixels.
   
@option {int} [height=undefined] 
   Height in pixels. Optional parameter. 
   If it's specified the div container will extend its length up to that value and
   if the actual length exceeds that value a "Show more Results/Show fewer Results" link will be displayed at the bottom.    
   
@option {string} query 
    The query used to find the matching citations in the Europe PMC system to display.

@option {string} [loadingStatusImage="{BIOJS_HOME}/css/images/ajax-loader-1.gif"] 
   Relative path of the image to be displayed on loading status. If it's empty no loading image will be displayed.

@option {string} [proxyUrl="{BIOJS_HOME}/dependencies/proxy/proxy.php"] 
   Relative path of the proxy to be used to make the call to the Europe PMC RESTFUL web service    
   
@option {int} [numberResults=25] 
	  The number of citations displayed into the container from the results list set retrieved from the Europe PMC system. Therefore only the first X citations will be displayed,
   and if the number of total results is greater than X, there will be a link "See All Results" pointing to complete results list
   on the Europe PMC web site at the bottom of the container. The value could be between 1 and 25.

@option {string} [elementOrder="TITLE_FIRST"] 
	  It decides the order of display of the citations data. It could be one of the following:
<ul>
		<li>CitationList.TITLE_FIRST:"TITLE_FIRST".  
         In this case the order of the elements will be:
      	<ol>
      		<li>TITLE</li>
         	<li>AUTHORS</li>
         	<li>JOURNAL</li>
         	<li>SOURCE/IDENTIFIER</li>
      	</ol>
      </li>
      <li>CitationList.AUTHORS_FIRST:"AUTHORS_FIRST". 
      In this case the order of the elements will be:
      	<ol>
      		<li>AUTHORS</li>
         	<li>TITLE</li>
         	<li>JOURNAL</li>
         	<li>SOURCE/IDENTIFIER</li>
      	</ol>
      </li>
</ul>

@option {string} [displayStyle="FULL_STYLE"] 
It decides which citations data to display. It could be one of the following:

 <ul>
		<li>CitationList.FULL_STYLE:"FULL_STYLE".  
         In this case all the citations data will be displayed:
      	<ol>
      		<li>TITLE</li>
         	<li>AUTHORS</li>
         	<li>JOURNAL</li>
         	<li>SOURCE/IDENTIFIER</li>
      	</ol>
      </li>
      <li>CitationList.TITLE_ONLY_STYLE:"TITLE_ONLY_STYLE". 
      In this case only the citations title will be displayed
      </li>
 </ul>
	

## Contributing

Please submit all issues and pull requests to the [ftalo/biojs-vis-pmccitation](http://github.com/ftalo/biojs-vis-pmccitation) repository!

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/ftalo/biojs-vis-pmccitation/issues).

## License 


This software is licensed under the Apache 2 license, quoted below.

Copyright (c) 2014, Francesco Talo

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
