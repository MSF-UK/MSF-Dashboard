/*------------------------------------------------------------------------------------
    MSF Dashboard - module-datacheck.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file implements the datacheck module. This module combines functions ranging from data quality check to data processing as it runs through all the medical data records. In details:  
 * <br>
 * <ul>
 *	<li>It defines a set of datachecks and runs the data quality tests following instructions given by the developper in dev/dev-defined.js: {@link module:module_datacheck.definition_value}. Then it prepares the display to enable their visualization by the user. 
 *	<br>
 *	In order to run these tests and manage the outputs properly, the global values listed as members are stored in <code>g</code>, consult {@link module:g.module_datacheck} for the complete list.</li>
 *	<li>It computes values that are parsed directly to <code>g</code> and are required for other functions all over the place to work properly (which is particularly confusing):
 *		<ul>
 *			<li>{@link module:g.medical_completeness} which is used to display completeness rates on the map,</li>
 *			<li>{@link module:g.medical_loclists} which is used to setup the 'Goto' drop-down lists on the map,</li>
 *			<li>{@link module:g.medical_weeklist} which is not currently used,</li>
 *			<li>{@link module:g.medical_yearlist} which is used to setup the 'series' charts and 'pie' charts to visualize data by years.</li>
 *		</ul>
 *	</li>
 * </ul>
 * <br>
 * @since 0.1
 * @module module:module_datacheck
 * @requires index.html
 * @requires lang/module-lang.js
 * @requires js/main-loadfiles.js
 * @todo The distinction between the two function (data check and processing) could be made in future versions.
 **/
 
var module_datacheck = {};
 /*------------------------------------------------------------------------------------
	Components:
	0) Setup  /!\ USER DEFINED ELEMENTS
	1) Data Processing
	2) Display
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.datacheck = true;

/**
 * Stores all the global variables used by the {@link module:module_datacheck}. To simplify, variables in the 'sub-module' domain will only appear there. Here is the complete list:
 <ul>
 	<li>{@link module:module_datacheck.showempty}</li>
 	<li>{@link module:module_datacheck.diseasecheck}</li>
 	<li>{@link module:module_datacheck.}</li>
 	<li>{@link module:module_datacheck.}</li>
 	<li>{@link module:module_datacheck.}</li>
 </ul>
 * @type {Object} 
 * @alias module:g.module_datacheck
 */
if(!g.module_datacheck){
    g.module_datacheck = {}; 
}

/**
 * Store the current state of visibility of <code>empty</code> errors by the end user in the errorlog. It is changed by the user in {@link module:module_datacheck~showlog} > {@link module:module_datacheck~ShowEmpty} and will affect {@link module:module_datacheck~showlog} in return.
 <br>
 Stored in {@link module:g.module_datacheck}.
 * @type {String} 
 * @alias module:module_datacheck.showempty
 */
g.module_datacheck.showempty = false;

/**
 * Check if disease array {@link module:g.medical_diseaseslist} is provided empty. If true, the list of diseases is created in {@link module:module_datacheck~dataprocessing}. If the list is not provided empty, it is used to perform a datacheck in the same function ({@link module:module_datacheck~dataprocessing}).
 <br>
 Stored in {@link module:g.module_datacheck}.
 * @type {Boolean} 
 * @alias module:module_datacheck.diseasecheck
 */
g.module_datacheck.diseasecheck = g.medical_diseaseslist.length == 0;

// 1) Data Processing
//------------------------------------------------------------------------------------
/**
 * Takes a string and returns the same string with title case (first letter of each word is capitalized). Used to normalize strings such as administrative division names or disease names.
 * @type {Function} 
 * @param {String} str
 * @returns {String}
 * @alias module:module_datacheck~toTitleCase
 */
function toTitleCase(str){
    //return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function(match) {return match.toUpperCase()});

}

/**
 * *Procedural component: should be rethought to be modular (OO programming...).*
 <br>
 * Main procedure of the datacheck module. 
 <br>
 Contains the definition of the data checks at value and at record levels. Browses all the records of {@link module:g.medical_data} and all the values of each record, perform tests and produces an error log {@link module:module_datacheck.log} as well as a quantitative summary {@link module:module_datacheck.sum}.
 <br>
 Also produces some essential outputs along the way as mentioned in introduction {@link module:module_datacheck}. This has been coded this way in order to avoid browsing all the data multiple times but it brings some confusion and should be revised.
 <br>
 Is triggered in {@link module:main_loadfiles~read_medical}.
 <br><br>
 * **Requires:**
 <ul>
 	<li>{@link module:g.medical_headerlist}</li>
 	<li>{@link module:g.geometry_keylist}</li>
 	<li>{@link module:g.geometry_levellist}</li>
 	<li>{@link module:g.geometry_loclists}</li>
 	<li>{@link module:module_datacheck.definition_record}</li>
 	<li>{@link module:g.geometry_subnum}</li>
 	<li>{@link module:module_datacheck.diseasecheck}</li>
 	<li>{@link module:g.medical_data} (filters empty records)</li>
 	<li>{@link module:module_datacheck~toTitleCase}</li>
 </ul>
* **Intermediaries:**
 <ul>
 	<li>{@link module:module_datacheck~testvalue}</li>
 	<li>{@link module:module_datacheck~testrecord}</li>
 	<li>{@link module:module_datacheck~errorlogging}</li>
 	<li>{@link module:module_datacheck~completenessCheck}</li>
 </ul>
 * **Returns:**
 <ul>
 	<li>{@link module:module_datacheck.sum}</li>
 	<li>{@link module:module_datacheck.log}</li>
 	<li>{@link module:g.medical_loclists}</li>
 	<li>{@link module:g.medical_yearlist}</li>
 	<li>{@link module:g.medical_weeklist}</li>
 	<li>{@link module:g.medical_completeness}</li>
 </ul>

 * @type {Function} 
 * @alias module:module_datacheck~dataprocessing
 * @todo The distinction between the two function (data check and processing) could be made in futur versions.
 * @todo Should be broken down in smaller pieces.
 */
module_datacheck.dataprocessing = function(){
	// Test Value 
	/**
	 Defines datacheck tests on values.<br>
	 The association between keys in {@link module:g.medical_data} and these definitions are made in {@link module:module_datacheck.definition_value}.
	 <br>
	 * **Requires** {@link module:g.medical_headerlist}, eventually some more elements for specific tests.
	 <br> 
	 Tests are coded in the following way:
	 <pre>'test_key': function(rec,key,none){
				var value = rec[g.medical_headerlist[key]];
				var cond = ... *performs the test on the value*
				return cond;
			},</pre>
	 <br>
	 Currently implemented test_types are:
	 <ul>
        <li><code>none</code> which does not check anything,</li>
	    <li><code>integer</code> which checks if the value is an integer,</li>
	    <li><code>float</code> which checks if the value is a float,</li>
	    <li><code>positivefloat</code> which checks if the value is a positivefloat,</li>
	    <li><code>epiwk</code> which checks format is 'YYYY-WW',</li>
	    <li><code>inlist</code> which checks if the value is in a list (typically parsed in {@link module:module_datacheck.definition_value} <code>setup</code>),</li>
	    <li><code>ingeometry</code> which checks whether the location name in the {@link module:g.medical_data} matches any location name in the {@link module:g.geometry_loclists} and populates {@link module:g.medical_loclists} with matching location names,</li>
	    <li><code>empty</code> which checks if the value either equals <code>undefined</code> or <code>''</code> - this test is performed to all values.</li>
	</ul>
	 * @param {Object} rec A record from the {@link module:g.medical_data} Array.
	 * @param {String} key A key to read a value in <code>rec</code> taken from {@link module:g.medical_headerlist} Array.
	 * @param {} other A third argument that have to be parsed in some specific cases (currently an Array of elements in <code>inlist</code> test).
	 * @returns {Boolean}
	 * @type {Object.<Function>} 
	 * @method
	 * @alias module:module_datacheck~testvalue
	 * @example <caption>Example usage for <code>epiwk</code> test.</caption>
epiwk: function(rec,key,none){
	var value = rec[g.medical_headerlist[key]];
	var year = value.split('-')[0];
	var week = value.split('-')[1];
	var cond_1 = (year.length == 4) && (week.length == 2);
	var cond_2 = year > 0;
	var cond_3 = week > 0 && week < 54;
	return cond_1 && cond_2 && cond_3;
},
	 */

	if (g.geometry_altnames_data) {
		var geonamesWithAlt = [];
		for (var a in g.geometry_altnames_data.alt) {
			geonamesWithAlt.push(g.geometry_altnames_data.alt[a]['data_province'] + ', ' +  g.geometry_altnames_data.alt[a]['data_zone']);
		}
		console.log('geonamesWithAlt: ', geonamesWithAlt);
	}

	module_datacheck.testvalue = {
		integer: function(rec,key,none){
			var value = rec[g.medical_headerlist[key]];
			var cond_1 = value >= 0;
			var cond_2 = parseInt(Number(value),10) == value;
			return cond_1 && cond_2;
		},
		float: function(rec,key,none){
			var value = rec[g.medical_headerlist[key]];
			var cond_1 = !isNaN(Number(value));
			var cond_2 = !(value == '');
			return cond_1 && cond_2;
		},
		positivefloat: function(rec,key,none){
			var value = rec[g.medical_headerlist[key]];
			var cond_1 = !isNaN(Number(value));
			var cond_2 = !(value == '');
			var cond_3 = value >= 0;
			return cond_1 && cond_2 && cond_3;
		},
		epiwk: function(rec,key,none){
			var value = rec[g.medical_headerlist[key]];
			var year = value.split('-')[0];
			var week = value.split('-')[1];
			var cond_1 = (year.length == 4) && (week.length == 2);
			var cond_2 = year > 0;
			var cond_3 = week > 0 && week < 54;
			return cond_1 && cond_2 && cond_3;
		},
		date: function(rec,key,none){
			var value = rec[g.medical_headerlist[key]];
			var year = value.split('-')[0];
			var month = value.split('-')[1];
			var day = value.split('-')[2];
			var cond_1 = (year.length == 4) && (month.length == 2) && (day.length == 2);
			var cond_2 = year > 0;
			var cond_3 = month > 0 && month < 13;
			var cond_4 = day > 0 && day < 32;
			var now = new Date();
			var cond_5 = year < now.getFullYear() || (year == now.getFullYear() && month < (now.getMonth() + 1 )) || (year == now.getFullYear() && month == (now.getMonth() + 1 ) && day <= now.getDate());
			return cond_1 && cond_2 && cond_3 && cond_4 && cond_5;
		},
		inlist: function(rec,key,valuelist){
			var value = rec[g.medical_headerlist[key]];
			var cond_1 = !(valuelist.indexOf(value) == -1);
			return cond_1;
		},
		ingeometry: function(rec,key,option){		
			//console.log("ingeometry: ", rec[key], key, option);	  
			//var keylist = g.geometry_keylist;			
			//var count = g.geometry_levellist[key];		

            if(option == 'normalize'){      
                var loc_current = toTitleCase(rec[g.medical_headerlist[key]].trim().split('_').join(' '));
            }else{
                var loc_current = rec[g.medical_headerlist[key]].trim().split('_').join(' ');
            }

			if (g.new_layout) {	

                var pos = g.viz_layer_pos[key];
                var depth = g.viz_layer_pos[key].split('.').length-1;
				while (depth > 0){			//add names of higher levels into full g.medical_loclists name
                    depth--;
                    pos = pos.substring(0, pos.lastIndexOf("."));
                    var name = '';
                    for (var lyr in g.viz_layer_pos) {
                    	if (g.viz_layer_pos[lyr]==pos) {
                    		name = lyr;
                    	}
                    } 
                    if(option == 'normalize'){      
                        loc_current = toTitleCase(rec[g.medical_headerlist[name]].trim().split('_').join(' '))+', '+loc_current;
                    }else{
                        loc_current = rec[g.medical_headerlist[name]].trim().split('_').join(' ')+', '+loc_current;
                    }
                }

                if (g.geometry_altnames_data) {
	                if (geonamesWithAlt.indexOf(loc_current) != -1) {
	                	for (var a in g.geometry_altnames_data.alt) {
	                		if (g.geometry_altnames_data.alt[a]['data_province'] + ', ' +  g.geometry_altnames_data.alt[a]['data_zone'] == loc_current) {
	                			loc_current = g.geometry_altnames_data.alt[a]['geo_province'] + ', ' +  g.geometry_altnames_data.alt[a]['geo_zone']
	                			rec[g.medical_headerlist[key]] = g.geometry_altnames_data.alt[a]['geo_'+[g.medical_headerlist[key]]];
	                		}
	                	}
	                }
	            }

                var cond_1 = !(g.geometry_loclists[key].indexOf(loc_current) == -1);  	//true = loc_current is in list of geojson adm names
				if (!(cond_1)) {
					var cond_1a = false;
					var shared_attr_lists = module_datacheck.getSharedAttributes();
					for (var i=0; i<=shared_attr_lists.length-1; i++) {
						shared_attr = shared_attr_lists[i];
						if (shared_attr.indexOf(key) != -1) {				//if not in list but shares its attributes
							shared_attr.forEach(function(sh_key) {			//for each shared attribute
								if ((sh_key!=key) && (g.geometry_loclists[sh_key].indexOf(loc_current) != -1)) {	//check if loc_current is in that list; if it is then don't consider it empty geometry
									cond_1a = true;
								};
							});
						};
					};
				}

				var cond_2 = g.medical_loclists[key].indexOf(loc_current) == -1;		//true = loc_current is not in medical locations list (because list not yet populated)
				if (cond_1 && cond_2) {		//checking if loc_current is in geojson and not yet in medical locations list
					g.medical_loclists[key].push(loc_current);
					g.medical_loclists.all.push(loc_current);
				};

            } else {
            	var keylist = g.geometry_keylist;			
				var count = g.geometry_levellist[key];

            	while(count > 0){
                    count--;
                    if(option == 'normalize'){      
                        loc_current = toTitleCase(rec[g.medical_headerlist[keylist[count]]].trim().split('_').join(' '))+', '+loc_current;
                    }else{
                        loc_current = rec[g.medical_headerlist[keylist[count]]].trim().split('_').join(' ')+', '+loc_current;
                    }
                }

	            var cond_1 = !(g.geometry_loclists[key].indexOf(loc_current) == -1);  	//true = loc_current is in list of geojson adm names
				var cond_2 = g.medical_loclists[key].indexOf(loc_current) == -1;		//true = loc_current is not in medical locations list (because list not yet populated)
				if(cond_1 && cond_2){		//checking if loc_current is in geojson and not yet in medical locations list
					g.medical_loclists[key].push(loc_current);
					g.medical_loclists.all.push(loc_current);
				}    

            }

			if (g.new_layout) {
				return cond_1 || cond_1a;
			} else {
				return cond_1;
			}
			
		},
		empty: function(rec,key,none){
			//console.log(rec[g.medical_headerlist[key]], rec,key,none);
			if(rec[g.medical_headerlist[key]] == undefined || rec[g.medical_headerlist[key]] == '_NA'){
				var cond_1 = true;
				
			} else {
				var cond_1 = rec[g.medical_headerlist[key]] === '';
			}
			return cond_1;
		},
		none: function(rec,key,none){
			return true;
		}
	};

	// Test whole record
	
	// Builder of: list of keys for duplicate check
	var uniquereclist = {};
	var duplicatereclist = {};
	/**
	 *  Defines datacheck tests on entire records.<br>
	 <br>
	 * **Requires** {@link module:g.medical_headerlist}
	 <br> 
	 Currently implemented test_types is:
	 <ul>
	    <li><code>duplicates</code> which checks if the record is a duplicate - test performed on all records. Uses intermediary uniquereclist and duplicatereclist objects to perform the test.</li>
	 </ul>
	 * @type {Object.<Function>} 
	 * @method
	 * @param {Object} rec A record from the {@link module:g.medical_data} Array.
	 * @returns {Boolean}
	 * @alias module:module_datacheck~testrecord
	 */
	module_datacheck.testrecord = {
		duplicate: function(rec) {
			var key = '';
			g.module_datacheck.definition_record.forEach(function(check) {
				key += rec[check.key] + ";";			//'key' appends values of all attributes in definition_record into string
			});
			if (!uniquereclist[key]){					//check if 'key' exists as element of object
				uniquereclist[key] = true;		
				return false;
			}else{
				duplicatereclist[key] = true;
		        return true;
		    }
		}
	};

	// Logging errors
	/**
	 * Write the results from a value or record check performed in {@link module:module_datacheck~dataprocessing} while browsing all the data. The log is written in a 'csv' style and stored in {@link module:module_datacheck.log}.
	 * @type {Function} 
	 * @param {Boolean} test Result of a value check test from {@link module:module_datacheck~testvalue} or of a record check test from {@link module:module_datacheck~testrecord}.
	 * @param {String} test_type Name of the value check test from {@link g.module_datacheck.definition_value} <code>test_type</code> or directly parsed by {@link module:module_datacheck~dataprocessing} for <code>empty</code> ord <code>duplicate</code> test types.
	 * @param {String} key A key to read a value in <code>rec</code> taken from {@link module:g.medical_headerlist} Array.
	 * @param {Object} rec A record from the {@link module:g.medical_data} Array.
	 * @alias module:module_datacheck~errorlogging
	 */
	module_datacheck.errorlogging = function(test,test_type,key,rec){
		if (!test) {
			if(test_type == 'empty'){
				g.module_datacheck.sum.empty[key]++;
			}else{
				g.module_datacheck.sum.error[key]++;
			}
			g.module_datacheck.sum.all++;
			if (test_type == 'duplicate'){
				var value = '';
			}else{
				var value = rec[g.medical_headerlist[key]];
			}
			var temp_log = ''+g.module_datacheck.sum.all +',"'+key+'","'+value+'","'+test_type+'"';
			g.module_datacheck.definition_record.forEach(function(log) {
				if(log.isnumber){	
					temp_log += ','+Number(rec[log.key]);
				}else{
					temp_log += ',"'+rec[log.key]+'"';
				}
			});
			g.module_datacheck.log.push(temp_log+'');
		}
	}

	// Log initiation

	/**
	 * A log of all errors and missing data found during the datacheck process. Written in 'csv' style to be easy to export, use and analyze by the user with any external software. All the elements of the array are 'csv' strings. Element 0 contains the headers and other elements contain values parsed by {@link module:module_datacheck~dataprocessing} > {@link module:module_datacheck~errorlogging}.
	 <br>
	 This log is then displayed to the user by {@link module:module_datacheck~showlog}.
	 <br>
	 Stored in {@link module:g.module_datacheck}.
	 * @type {Array.<String>} 
	 * @alias module:module_datacheck.log
	 */
	g.module_datacheck.log = [];
	g.module_datacheck.log.push('"er_id","er_field","er_value","er_type"')
	g.module_datacheck.definition_record.forEach(function(log) {
		g.module_datacheck.log[0] += ',"'+log.key+'"';
	});
	g.module_datacheck.log[0] += '';

	// Error counters initation
	/**
	 * A quantitative summary of the datacheck process. Stores separately for each key, number of errors on values and number of empty values. Also aggregates per error and per empty values and sums overall.
	 <br>
	 The object is populated in {@link module:module_datacheck~dataprocessing} > {@link module:module_datacheck~errorlogging}.
	 <br>
	 Stored in {@link module:g.module_datacheck}.
	 * @type {Object.<Object>} 
	 * @alias module:module_datacheck.sum
	 */
	g.module_datacheck.sum = {};
	g.module_datacheck.sum.error = {};
	g.module_datacheck.sum.empty = {};
	
	/**
	 * Stores the name of the administrative elements extracted from {@link module:g.medical_data} by {@link module:module_datacheck~testvalue}. Names are formatted in the following way: <code>'AdmN0', 'AdmN1',...</code> in order to manage efficiently pyramids and possible duplicates at lowest administrative levels. They are matched against names in {@link module:g.geometry_loclists} and names not corresponding are discarded.<br>
	 Each administrative level is stored in a different Object.
	 	 <br>
	 * Processing triggered in {@link module:module_datacheck~dataprocessing}.
	 * @constant
	 * @type {Object.<Array.<String>>} 
	 * @alias module:g.medical_loclists
	 */
	g.medical_loclists = {};
	
	g.medical_keylist.forEach(function(key){
		g.module_datacheck.sum.error[key] = 0;
		g.module_datacheck.sum.empty[key] = 0;
	});
	g.module_datacheck.sum.all = 0;

	
	// Locations in dataset initiation
	g.geometry_keylist.forEach(function(key) {
		g.medical_loclists[key] = [];
	});
	
	g.medical_loclists.all = [];

	// Years in dataset initiation
	/**
	 * Stores the list of years from <code>epiwk</code> fields of {@link module:g.medical_data}.
	 <br>
	 * Processing triggered in {@link module:module_datacheck~dataprocessing}.
	 * @type {Array} 
	 * @alias module:g.medical_yearlist
	 */
	g.medical_yearlist = [];
	/**
	 * Stores the list of weeks from <code>epiwk</code> fields of {@link module:g.medical_data}.
	 <br>
	 * Processing triggered in {@link module:module_datacheck~dataprocessing}.
	 * @type {Array} 
	 * @alias module:g.medical_weeklist
	 */
	g.medical_weeklist = [];

	// Surveillance
	//------------------------------------------------------------------------------------
	// Completeness
	/**
	* Stores a percentage of completeness for each combination of administrative level and epiweek. All the {@link module:g.medical_data} is browsed in {@link module:module_datacheck~dataprocessing}. Percentage calculation is performed by {@link module:module_datacheck~completenessCheck}, combining records counting and numbers of lowest administrative division per administrative division stored in {@link module:g.geometry_subnum}.
	<br>
	 Each combination of administrative level and epiweek is stored in a different Object.
	 <br>
	 * Processing triggered in {@link module:module_datacheck~dataprocessing}.
	 * @type {Object}
	 * @alias module:g.medical_completeness
	 */
	g.medical_completeness = {};
	g.geometry_keylist.forEach(function(key) {
		g.medical_completeness[key] = {};
	});
	
	/**
	 * Computes completeness percentage for each combination of administrative level and epiweek, combining records counting from {@link module:g.medical_data} is browsed in {@link module:module_datacheck~dataprocessing} and numbers of lowest administrative division per administrative division stored in {@link module:g.geometry_subnum}.
	 * Processing triggered in {@link module:module_datacheck~dataprocessing}.
	 * @type {Function} 
	 * @param {Object} rec A record from the {@link module:g.medical_data} Array.
	 * @alias module:module_datacheck~completenessCheck
	 */
	module_datacheck.completenessCheck = function(rec) {

		addToCompletenessRecord = function(temp_loc) {
			var temp_key = rec[g.medical_headerlist.epiwk] + temp_loc;	//add epiweek to beginning of string
			var temp_loc2 = temp_loc.substring(2, temp_loc.length);		//remove ',' at beginning of string

		 	if(!(g.medical_completeness[temp_key])){			//if not already in g.medical_completeness
				g.medical_completeness[temp_key] = {			//then add it 
					admNx: temp_loc2,
					epiwk: rec[g.medical_headerlist.epiwk],
					value: 1/ g.geometry_subnum[temp_loc2]
				};
			}else{												//if already in g.medical_completeness
				g.medical_completeness[temp_key].value += 1/ g.geometry_subnum[temp_loc2];	//then add in value
			}

		}

		var temp_loc = '';

		if (g.new_layout) {		
			var top_layer = module_multiadm.getTopLayer();				//create single geometry name in format 'admN1, admN2' etc
			if(g.module_datacheck.definition_value[top_layer].setup == 'normalize'){		
				temp_loc += ', ' + toTitleCase(rec[g.medical_headerlist[top_layer]].trim().split('_').join(' '));
			}else{
				temp_loc += ', ' + rec[g.medical_headerlist[top_layer]].trim().split('_').join(' ');
			}
			var lyr = top_layer;
			while (module_multiadm.hasChildren(lyr)) {
				var children = module_multiadm.getChildren(lyr);
				if (children.length>1) {
					//choose which child - choose first child with children; if no children choose first non-empty child
					var child = '';
					for (var i=0; i<=children.length-1; i++) {
						if (module_multiadm.hasChildren(children[i])) {
							child = children[i];
							break;
						};
					}
					if (child=='') {
						for (var i=0; i<=children.length-1; i++) {
							if (children[i]!='') {
								child = children[i];
								break;
							};
						}
					}
					if (child=='') {
						child = children[0];
					};
				} else {
					var child = children[0];
				};
				if(g.module_datacheck.definition_value[lyr].setup == 'normalize'){		
					temp_loc += ', ' + toTitleCase(rec[g.medical_headerlist[child]].trim().split('_').join(' '));
				}else{
					temp_loc += ', ' + rec[g.medical_headerlist[child]].trim().split('_').join(' ');
				}
				lyr = child;
			}

		} else {
			g.geometry_keylist.forEach(function(key,keynum) {		//create single geometry name in format 'admN1, admN2' etc
				if(g.module_datacheck.definition_value[key].setup == 'normalize'){		
					temp_loc += ', ' + toTitleCase(rec[g.medical_headerlist[key]].trim().split('_').join(' '));
				}else{
					temp_loc += ', ' + rec[g.medical_headerlist[key]].trim().split('_').join(' ');
				}
			});
		};

		var temp_key = rec[g.medical_headerlist.epiwk] + temp_loc;  //add epiweek to beginning of string
		temp_loc = temp_loc.substring(2, temp_loc.length);			//remove ',' at beginning of string

		if(!(g.medical_completeness[temp_key])){					//if not already in g.medical_completeness
			g.medical_completeness[temp_key] = {					//then add it
				admNx: temp_loc,
				epiwk: rec[g.medical_headerlist.epiwk],
				value: 1
			};

			if (g.new_layout) {					//move through all parent layers to sum up completeness
				var top_layer = module_multiadm.getTopLayer();		
				var temp_loc = '';			

				var lyrs = [top_layer];   //add up completenessCheck for all parent layers

				for (var i=0; i<=lyrs.length-1; i++) {
					if(g.module_datacheck.definition_value[lyrs[i]].setup == 'normalize'){		
						temp_loc += ', ' + toTitleCase(rec[g.medical_headerlist[lyrs[i]]].trim().split('_').join(' '));
					}else{
						temp_loc += ', ' + rec[g.medical_headerlist[lyrs[i]]].trim().split('_').join(' ');
					}
					if (module_multiadm.isParent(lyrs[i])) {		//if has child
						var children = module_multiadm.getChildren(lyrs[i]);

						for (var j=0; j<=children.length-1; j++) {
							
							if (module_multiadm.isParent(children[j])) {
								if(g.module_datacheck.definition_value[children[j]].setup == 'normalize'){		
									temp_loc += ', ' + toTitleCase(rec[g.medical_headerlist[children[j]]].trim().split('_').join(' '));
								}else{
									temp_loc += ', ' + rec[g.medical_headerlist[children[j]]].trim().split('_').join(' ');
								}

							} else {
								if (g.data_spec[children[j]]) {			//list of locations to include
									if (g.data_spec[children[j]].indexOf(rec[g.medical_headerlist[children[j]]]) != -1) {
										addToCompletenessRecord(temp_loc);
									}
								} else { 						//get locations to exclude (from siblings lists)
									var exclude_locs = [];
									if (children.length>1) {
										for (var k=0; k<=children.length-1; k++) {
											if (children[j] != children[k]) {
												if (g.data_spec[children[k]]) {
													exclude_locs = exclude_locs.concat(g.data_spec[children[k]]);
												}
											}
										}
									}
									if (exclude_locs.indexOf(rec[g.medical_headerlist[children[j]]]) == -1) {
										addToCompletenessRecord(temp_loc);
									}
								};

							}
						}
					} 
				};

			} else {

				for (var i = g.geometry_keylist.length - 2; i >= 0; i--) {  //move through all parent layers to sum up completeness
				 	var temp_loc = '';
					for (var j = 0; j <= i; j++) {						//get name, e.g. j=0,1 then j=0
						if(g.module_datacheck.definition_value[g.geometry_keylist[j]].setup == 'normalize'){		
							temp_loc += ', ' + toTitleCase(rec[g.medical_headerlist[g.geometry_keylist[j]]].trim().split('_').join(' '));
						}else{
							temp_loc += ', ' + rec[g.medical_headerlist[g.geometry_keylist[j]]].trim().split('_').join(' ');
						}
					}
					addToCompletenessRecord(temp_loc);
				}

			}
		} 
	}

	var empty_recs = [];

	module_datacheck.getSharedAttributes = function() {    //returns list of shared attributes, e.g. admN2 & hosp both share PHU
		var shared = [];
		for (var head1 in g.medical_headerlist) {
			var shared_list = [];			
			for (var head2 in g.medical_headerlist) {
				if ((g.medical_headerlist[head1] == g.medical_headerlist[head2]) && (head1 != head2)) {		
					shared_list.push(head2); 				
				}
			}
			if (shared_list.length>0) {	
				shared_list.push(head1);
				shared_list.sort();

				if ((JSON.stringify(shared)).indexOf(JSON.stringify(shared_list)) == -1) {
					shared.push(shared_list);
				};
				
			}		
		}
		return shared;
	};
	var shared_attr_lists = module_datacheck.getSharedAttributes();

	var combined_data=[];
	if (g.data_spec) {
		if (g.data_spec.combine_data) {
			for (var i=0; i<=g.data_spec.combine_data.length-1; i++) {
				combined_data.push(g.data_spec.combine_data[i].geo_name);
			};
		};
	};

	// Data browse
	g.medical_data.forEach(function(rec,recnum){		//for each record in medical_data
		var error_temp = false;
		var empty_temp = true;
		var test_duplicate = module_datacheck.testrecord.duplicate(rec);
		module_datacheck.errorlogging(!(test_duplicate),'duplicate','',rec);

		//For shared attributes, copy them to appropriate attribute heading
		for (var i=0; i<=shared_attr_lists.length-1; i++) {
			shared_attr = shared_attr_lists[i];
			shared_attr.forEach(function(sh_key) {
				if (g.data_spec[sh_key]) {				//if there is a list of names that are shared e.g. g.hosp 			
					if (g.data_spec[sh_key].indexOf(rec[g.medical_headerlist[sh_key]]) != -1) {
						rec[sh_key] = rec[g.medical_headerlist[sh_key]];
					};
				}
			});
		};


		g.medical_keylist.forEach(function(key){				//for each column/attribute in data

			if (combined_data.indexOf(rec[g.medical_headerlist[key]])!=-1) {	//account for data records that should be added into a geometry with a different name
				for (var i=0; i<=g.data_spec.combine_data.length-1; i++) {
					if ((g.data_spec.combine_data[i].geo_name==rec[g.medical_headerlist[key]]) && (g.data_spec.combine_data[i].geo_level==key)) {
						rec[g.medical_headerlist[key]] = g.data_spec.combine_data[i].add_into;
					};
				};
			};

			var is_empty = module_datacheck.testvalue.empty(rec,key,'none');
			if (is_empty) {														//if its empty log it
				module_datacheck.errorlogging(!(is_empty),'empty',key,rec);
				if(g.dev_defined.ignore_empty == false){error_temp = true;}		//if ignore_empty is true then don't add it 
			} else {
				if (key!=='disease' || !g.module_datacheck.diseasecheck) {  
					var test_value = module_datacheck.testvalue[g.module_datacheck.definition_value[key].test_type](rec,key,g.module_datacheck.definition_value[key].setup);
					module_datacheck.errorlogging(test_value,g.module_datacheck.definition_value[key].test_type,key,rec);
					
					if (!test_value) {
						error_temp = true;
					} else {
						empty_temp = false;
					}
				}

			}
		});

		if(!(module_datacheck.testvalue.empty(rec,'epiwk','none')) && module_datacheck.testvalue[g.module_datacheck.definition_value['epiwk'].test_type](rec,'epiwk',g.module_datacheck.definition_value['epiwk'].setup)){
			if(g.medical_yearlist.indexOf(rec[g.medical_headerlist.epiwk].split('-')[0]) == -1){
				g.medical_yearlist.push(rec[g.medical_headerlist.epiwk].split('-')[0]);
			}
			if(g.medical_weeklist.indexOf(rec[g.medical_headerlist.epiwk]) == -1){
				g.medical_weeklist.push(rec[g.medical_headerlist.epiwk]);
			}			
		}

		if(!error_temp){
			module_datacheck.completenessCheck(rec);
		}


		// Surveillance
		//------------------------------------------------------------------------------------
		// If disease array is provided empty
		/*if(!(module_datacheck.testvalue.empty(rec,'disease','none')) && (g.medical_diseaseslist.indexOf(toTitleCase(rec[g.medical_headerlist.disease].trim().split('_').join(' '))) == -1) && g.module_datacheck.diseasecheck ){
			g.medical_diseaseslist.push(toTitleCase(rec[g.medical_headerlist.disease].trim().split('_').join(' ')));
			//console.log("Add to diseaselist: ", rec[g.medical_headerlist.disease].trim().split('_').join(' '))
		}*/
		if(!(module_datacheck.testvalue.empty(rec,'disease','none')) && (g.medical_diseaseslist.indexOf(rec[g.medical_headerlist.disease].trim().split('_').join(' ')) == -1) && g.module_datacheck.diseasecheck ){
			g.medical_diseaseslist.push(rec[g.medical_headerlist.disease].trim().split('_').join(' '));
			//console.log("Add to diseaselist: ", rec[g.medical_headerlist.disease].trim().split('_').join(' '))
		}

		if(empty_temp){
			empty_recs.push(recnum);
		}
		
	});

	console.log('module-datacheck.js ~l530: Empty records: ', empty_recs);
	for (var i = empty_recs.length - 1; i >= 0; i--) {
		g.medical_data.splice(empty_recs[i],1);
	}

}

/**
 * Converts {@link module:g.module_datacheck.log} into html to be displayed for user. Includes buttons to show/hide missing values (current states stored in {@link module: module:module_datacheck.showempty}) and copy to clipboard. The html string is parsed to #datalog div defined in {@link module:main_loadfiles~generate_display} and this showlog function is also triggerd by the same function.
 * @type {Function} 
 * @alias module:module_datacheck~showlog
 */
module_datacheck.showlog = function(){

	var html = '<p><br><a id="more-datacheck"></a></p>';
	html += '<div id="datacheck_log">'; /*hidden="false">'*/
    html += '<pre id="datacheck_pre"><small>';
   	g.module_datacheck.log.forEach(function(rec){
   		if(g.module_datacheck.showempty || !(rec.split(',')[3] == '"empty"')){
	   		html += rec +'<br>';
   		}
    });
    html +='</small></pre>';
    if (g.module_datacheck.showempty) { 
    	var temp_text = g.module_lang.text[g.module_lang.current].datacheck_emptless;
    }else{
    	var temp_text = g.module_lang.text[g.module_lang.current].datacheck_emptmore;
    }
    html += '<button class="col-md-6" onclick=\'ShowEmpty()\'>'+temp_text+'</button>';
    html += '<button class="col-md-6" onclick=\'CopyText("datacheck_pre")\'>'+g.module_lang.text[g.module_lang.current].datacheck_copy+'</button></div>';
	
    $('#datalog').html(html);
}

/**
 * Triggered when the show/hide missing errors button is pressed by the user in {@link module:module_datacheck~showlog}. Toggles {@link module: module:module_datacheck.showempty}, redraws the log with {@link module:module_datacheck~showlog} and resettle show/hide error log interaction with {@link module:module_datacheck~interaction}.
 * @type {Function} 
 * @alias module:module_datacheck~ShowEmpty
 */
function ShowEmpty(){
	g.module_datacheck.showempty = !(g.module_datacheck.showempty);
	module_datacheck.showlog();
    module_datacheck.interaction();
}

/**
 * Triggered when the copy to clipboard button is pressed by the user in {@link module:module_datacheck~showlog} > {@link module:module_datacheck~CopyText}. Selects all the 'csv'-style text of the error log.
 * @type {Function}
 * @param {String} id of the div from which the text will be selected. 
 * @alias module:module_datacheck~SelectText
 */
function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

/**
 * Triggered when the copy to clipboard button is pressed by the user in {@link module:module_datacheck~showlog}. Copies to clipboard the text previously selected by {@link module:module_datacheck~SelectText}.
 * @type {Function} 
 * @param {String} id of the div from which the text will be selected. 
 * @alias module:module_datacheck~CopyText
 */
function CopyText(element) {
		var output = SelectText("datacheck_pre");
		var hiddenDiv = $('<div/>')
			.css( {
				height: 1,
				width: 1,
				overflow: 'hidden',
				position: 'fixed',
				top: 0,
				left: 0
			} );

		var textarea = $('<textarea readonly/>')
			.val( output )
			.appendTo( hiddenDiv );

		// For browsers that support the copy execCommand, try to use it
		if ( document.queryCommandSupported('copy') ) {
			hiddenDiv.appendTo(output);
			textarea[0].focus();
			textarea[0].select();

			try {
				document.execCommand( 'copy' );
				hiddenDiv.remove();
				return;
			}
			catch (t) {}
		}
}

/**
 * Show/hide error log interaction by user click on button defined in {@link module:module_datacheck~showlog}. 
 <br>
 Function triggered in {@link module:main_loadfiles~generate_display}.
 * @type {Function}
 * @alias module:module_datacheck~interaction
 */
module_datacheck.interaction = function(){

	$('#more-datacheck').html(g.module_lang.text[g.module_lang.current].datacheck_less);

    $('#more-datacheck').on('click',function(e) {
        if ($('#datacheck_log').is(':hidden') == true) {
            $('#datacheck_log').slideToggle();
            $('#more-datacheck').html(g.module_lang.text[g.module_lang.current].datacheck_less);
        }else{
            $('#datacheck_log').slideToggle();
            $('#more-datacheck').html(g.module_lang.text[g.module_lang.current].datacheck_more);
        }
    });
}

// 2) Display
//------------------------------------------------------------------------------------

/**
 * Converts {@link module:g.module_datacheck.sum} into html to be displayed for user.
 <br>
 Function triggered in {@link module:main_loadfiles~generate_display}.
 * @type {Function} 
 * @alias module:module_datacheck~display
 */
module_datacheck.display = function(){
	
	// Title
	var html = '<p><b>'+g.module_lang.text[g.module_lang.current].datacheck_title+'</b></p>';

	// Intro
	html += '<p>'+g.module_lang.text[g.module_lang.current].datacheck_intro+'</p>';
	
	// Content
	html += '<table style="font-size:13px;">';
	html += '<tr><th>'+g.module_lang.text[g.module_lang.current].datacheck_header+'</th><th>&nbsp;#'+g.module_lang.text[g.module_lang.current].datacheck_error+'</th><th>&nbsp;(%'+g.module_lang.text[g.module_lang.current].datacheck_error+')</th><th>&nbsp;#'+g.module_lang.text[g.module_lang.current].datacheck_empty+'</th><th>&nbsp;(%'+g.module_lang.text[g.module_lang.current].datacheck_empty+')</th></tr>'


	var all_shared = [];
	if (g.new_layout) {
		var shared_attr_lists = module_datacheck.getSharedAttributes();
		for (var i=0; i<=shared_attr_lists.length-1; i++) {
			all_shared = all_shared.concat(shared_attr_lists[i]);
		};
	};

	function createRow(temp_name, opt){
		var temp_data = {};
		temp_data.error = g.module_datacheck.sum.error[temp_name];
		temp_data.empty = g.module_datacheck.sum.empty[temp_name];
		var temp_value = {};
		temp_value.error = Math.round((temp_data.error / g.medical_data.length)*100);
		temp_value.empty = Math.round((temp_data.empty / g.medical_data.length)*100);

		return '<tr><td>'+ g.medical_headerlist[temp_name] + opt +':&nbsp;</td><td>&nbsp;' + temp_data.error + '</td><td>&nbsp;(or ' + temp_value.error + '%)</td>&nbsp;</td><td>&nbsp;' + temp_data.empty + '</td><td>&nbsp;(or ' + temp_value.empty + '%)</td></tr>'; 
	}

	

	Object.keys(g.medical_headerlist).forEach(function(key){
		var opt = '';
		if (all_shared.indexOf(key)!=-1) {
			opt = ' (' + key + ')';
		}
		
		html += createRow(key, opt);
	})

	html += '</table>';

	return html;
}
