/*------------------------------------------------------------------------------------
	MSF Dashboard - module-multiadm.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file enables the management of multiple 'nested' administrative maps. Switching from one level to an other is made through tabs. Simple principles are fixed to facilitate browsing and avoid mis-interpretation of the maps.
 * @since 0.2
 * @module module:module_multiadm
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 * @requires js/main-core.js
 * @requires js/module-colorscale.js
 * @todo Could probably be merged with chart warper somehow.
 * @todo Could we avoid module_colorscale dependency?
 * @todo Behavior when re-selecting feature and when back and forth in adm levels could be improved.
 **/
var module_multiadm = {};
/*------------------------------------------------------------------------------------	
	Components:
	0) Setup
	1) Data Processing
	2) Display
	3) Interactions
		a. Tabs Interactions
		b. 'Jumpto' dropdown list Interactions
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.multiadm = true;

/**
 * Stores all the global variables used by the {@link module:module_multiadm}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_multiadm
 */
g.module_multiadm = {};

// 1) Data Processing
//------------------------------------------------------------------------------------

// 2) Display
//------------------------------------------------------------------------------------

/**
 * Defines titles, filters container and tabs and parses it to the containter with if <code>chart-multiadm</code> that has been defined in the index.html layout.
 * <br>
 * Requires - *complete list [x]*:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:module_colorscale.mapunitcurrent}</li>
 *  <li>{@link module:g.geometry_keylist}</li>
 * </ul>
 * <br> Triggered in {@link module:main_core~chartInstancer}.
 * @type {Function}
 * @method
 * @alias module:module_multiadm.display
 * @todo Revise hard dependance on module_colorscale just for unit to appear in map title...
 */
module_multiadm.display = function(){

	var html = '<div class="row">';
	html += '<div class="col-md-12" style="height:30px;">';
	html += '<div id=buttons-multiadm></div>';
	html += '</div></div>';

	// Title + filters
	if (g.new_layout) {
		html += '<div class="row">';
		//html += '<div class="col-md-7" style="height:30px;">';
		html += '<div class="col-md-7" id="map-title">';
		html += '<span id="map-unit" class="map-unit-title">'+g.module_lang.text[g.module_lang.current].map_unit[g.module_colorscale.mapunitcurrent]+'</span>';
		g.module_colorscale.mapunitlist.forEach(function(unit,unitnum) {
			if (unitnum == 0) {
				var text = g.module_lang.text[g.module_lang.current].colorscale_unitintro;
			} else {
				var text = '';
			};
			if (unit == g.module_colorscale.mapunitcurrent) {
				html += '<button id='+unit+' class="btn_map button_mapunit on">'+g.module_lang.text[g.module_lang.current].map_unit_title[unit]+'</button>';
				//html += '<button id='+unit+' class="button_mapunit on checked">'+g.module_lang.text[g.module_lang.current].map_unit_title[unit]+'</button>';
			} else {
				html += '<button id='+unit+' class="btn_map button_mapunit">'+g.module_lang.text[g.module_lang.current].map_unit_title[unit]+'</button>';
			};
			//html += '<button id='+unit+' class="button_mapunit">'+g.module_lang.text[g.module_lang.current].map_unit_title[unit]+'</button>';
		});
		html += '</div>';

		html += '<div class="col-md-3" id="map-text">';
		html += '<span class="map-text">View by:</span><br>'; //HEIDI - need to add this to module-lang.js
		//html += '<span class="map-unit-title">'+g.module_lang.text[g.module_lang.current].jumpto+'</span>';
		//var temp_key = 'admN1';
		g.geometry_keylist.forEach(function(key,keynum){
			//console.log(key, keynum);
			if (keynum == 0) {
				//var temp_key = key;
				//var temp = 'map-'+key+'-btn';
				//console.log('map id = ', temp);
				html += '<button id="map-'+key+'-btn" class="btn_map button_mapadm on">'+g.module_lang.text[g.module_lang.current]['map_'+key].title+'</button>';
			} else {
				//var tab_status ='inactive';
				//var temp = 'map-'+key+'-btn';
				//console.log('map id = ', temp);
				html += '<button id="map-'+key+'-btn" class="btn_map button_mapadm">'+g.module_lang.text[g.module_lang.current]['map_'+key].title+'</button>';
			}			
		});
		html += '</div>';

		html += '<div class="col-md-2">';
		html += '<span class="map-text">Quick zoom:</span><br>'; //HEIDI - need to add this to module-lang.js
					
		//console.log("tabcurrent now: ", g.module_multiadm.tabcurrentnum, g.module_multiadm.tabcurrent);			
		// 'jumpto' dropdown list
		g.geometry_keylist.forEach(function(key,keynum){
			//console.log(key, keynum);
			html +=  '<div class="list-content" id="map-'+key+'-jumpto"></div>';
		});
		//html +=  '<div class="tab-content" id="map-'+temp_key+'-jumpto"></div>';
		html +=  '</div>';

		html += '</div></div>';
	} else {
		html += '<b>'+g.module_lang.text[g.module_lang.current].map_title+' - <small><span id="map-unit">'+g.module_lang.text[g.module_lang.current].map_unit[g.module_colorscale.mapunitcurrent]+'</b></span></small> | '+g.module_lang.text[g.module_lang.current].filtext +' ';
		g.geometry_keylist.forEach(function(key,keynum,keylist){
			html +=  '<span id="map-'+key+'-filter"></span>';
			if (!(keynum == keylist.length - 1)) {
				html += ' >';
			}
		});
	}
		
		//Map Units (i.e. Cases, Deaths, Incidence Rate, Mortality Rate, Completeness) go here
		//if (g.new_layout) {
			//html += '<div class="col-md-4">';
			// Unit
			/*html += '<p><table style="font-size:1em;">';

				g.module_colorscale.mapunitlist.forEach(function(unit,unitnum) {
					if(unitnum == 0){
						var text = g.module_lang.text[g.module_lang.current].colorscale_unitintro;
					}else{
						var text = '';
					}
					if(unit == g.module_colorscale.mapunitcurrent){
						html += '<tr><td>'+text+' </td><td><input type="radio" name="group1" id="'+unit+'" value='+unitnum+' checked> '+unit+'</td></tr>';
					}else{
						html += '<tr><td>'+text+'</td><td><input type="radio" name="group1" id="'+unit+'" value='+unitnum+'> '+unit+'</td></tr>';
					}
				});
				
			html +=	'</table></p>';*/

			/*g.module_colorscale.mapunitlist.forEach(function(unit,unitnum) {
				html += '<button id='+unit+' class="button_mapunit">'+g.module_lang.text[g.module_lang.current].map_unit_title[unit]+'</button>';
			});*/

			//if(g.medical_datatype == 'surveillance'){html += '</div><div class="col-md-4">';}
			//html += '</div>';
		//}

		// Tabs + 'jumpto' dropdown lists
		if (!(g.new_layout)) {
			html += '<div>';
				g.geometry_keylist.forEach(function(key,keynum){
					if (keynum == 0) {
						var tab_status ='active';
					} else {
						var tab_status ='inactive';
					}
					html +=  '<div id="map-'+key+'-tab" class="'+tab_status+' tab">';
					
					// Tab title
					html +=  '<div class="col-md-7 tab-content">'+g.module_lang.text[g.module_lang.current]['map_'+key].title+'</div>';
					
					// 'jumpto' dropdown list
					html +=  '<div class="col-md-5 tab-content" id="map-'+key+'-jumpto"></div>';
					html +=  '</div>';
				});
			html += '</div>';
		}

	html += '</div>';

	// Maps
	html += '<div class="row">';
	html += '<div class="col-md-12 viz" style="height:425px; width:108%;">';
		g.geometry_keylist.forEach(function(key){
			html += '<div id="map-'+key+'" class="map"></div>'; 
		});
	html += '</div>';
	html += '</div>';

	$('#chart-multiadm').html(html);

}

// 3) Interactions
//------------------------------------------------------------------------------------

/**
 * Defines the tab interactions as well as the 'Goto' dropdown list interactions.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:g.geometry_keylist}</li>
 *  <li>{@link module:g.viz_definition}</li>
 *  <li>{@link module:module_multiadm.interaction_tab}</li>
 *  <li>{@link module:module_multiadm.initGoto}</li>
 *  <li>{@link module:module_multiadm.propGoto}</li>
 *  <li>{@link module:module_multiadm.resetGoto}</li>
 *  <li>{@link module:module_colorscale.lockcolor}</li>
 * </ul>
 * Returns:
 * <ul>
 *  <li>{@link module:module_multiadm.tabcurrent}</li>
 *  <li>{@link module:module_multiadm.tabcurrentnum}</li>
 * </ul>
 * <br> Triggered by the end of {@link module:main_core~generateDashboard}.
 * @type {Function}
 * @method
 * @alias module:module_multiadm.interaction
 */
module_multiadm.interaction = function(){

	/*//Map unit 'onclick' events
	g.module_colorscale.mapunitlist.forEach(function(unit,unitnum) {
		$('#'+unit).on('click',function(){   
			if (!($('#'+unit).hasClass('on'))) {
				console.log('CLICKED ON: ', unit);
				$('.button_mapunit').removeClass('on')
				$('.button_mapunit').removeClass('checked')
				$('#'+unit).addClass('on');
				$('#'+unit).addClass('checked');
			};
		});
	});*/

	// 3) a. Tabs Interactions
	//------------------------------------------------------------------------------------

	/**
	 * Defines the tab interactions (show/hide containers).
	 * <br>
	 * Requires - *complete list [x]*:
	 * <ul>
	 *  <li>{@link module:g.geometry_keylist}</li>
	 *  <li>{@link module:g.viz_definition}</li>
	 *  <li>{@link module:module_multiadm.resetGoto}</li>
	 *  <li>{@link module:module_multiadm.propGoto}</li>
	 *  <li>{@link module:module_colorscale.lockcolor}</li>
	 * </ul>
	 * Returns - *complete list [x]*:
	 * <ul>
	 *  <li>{@link module:module_multiadm.tabcurrent}</li>
	 *  <li>{@link module:module_multiadm.tabcurrentnum}</li>
	 * </ul>
	 * <br> Triggered in {@link module:module_multiadm.interaction}.
	 * @type {Function}
	 * @method
	 * @alias module:module_multiadm.interaction_tab
     * @todo Define properly.
	 */
	 module_multiadm.interaction_tab = function(){};
	/***************************************************************/
	// Initialisations tabs (maps draw order)
	g.geometry_keylist.forEach(function(key,keynum){
		if (keynum == 0) {
			$('#map-'+key).css('z-index', 9999);
		} else {
			$('#map-'+key).css('z-index', 1);
		}   
	});

	// Initialisations jumpto dropdown lists common variables

	/**
     * Contains the tab currently displayed.
     * <br> Defined in {@link module:module_multiadm.interaction_tab}.
     * @type {Object}
     * @constant
     * @alias module:module_multiadm.tabcurrent
     */
	g.module_multiadm.tabcurrent = 'map-admN1';
	/**
     * Contains the number associated with the tab currently displayed {@link module:module_multiadm.tabcurrent}. 
     * <br> Defined in {@link module:module_multiadm.interaction_tab}.
     * @type {Object}
     * @constant
     * @alias module:module_multiadm.tabcurrentnum
     * @todo Could we avoid module_colorscale dependency here?
     */
	g.module_multiadm.tabcurrentnum = 0;
	//console.log("ASSIGNED TABCURRENTNUM HERE: ", g.module_multiadm.tabcurrentnum, g.module_multiadm.tabcurrent);

	// Tabs 'onclick' events
	g.geometry_keylist.forEach(function(key1,key1num){
		if (g.new_layout) {
			$('#map-'+key1+'-btn').on('click',function(){  
				console.log("CLICKED ON ", key1);			//HEIDI - will need to enable/disable lists here

				if (!(g.module_multiadm.tabcurrent == 'map-'+key1)) {

					if (key1=='hosp') {
						$('#IncidenceProp').attr('disabled', true);
						$('#MortalityProp').attr('disabled', true);

						//filter to hospitals list
						g.viz_definition.multiadm.charts[key1].filterAll();	
						g.medical_hospitals_fullname.forEach(function(h) {
							//console.log(h);
							g.viz_definition.multiadm.charts[key1].filter(h);
						});

						dc.redrawAll();
					} else {
						$('#IncidenceProp').attr('disabled', false);
						$('#MortalityProp').attr('disabled', false);
					}

					// Temporarily store previous tab keys
			    	var key0 = g.module_multiadm.tabcurrent;
			    	var key0num = g.module_multiadm.tabcurrentnum;

			        // Swich current displayed map in global variable
			        g.module_multiadm.tabcurrent = 'map-'+key1;
					g.module_multiadm.tabcurrentnum = key1num;

					$('#'+key0+'-btn').removeClass('on');
			        //$('#'+key0+'-btn').addClass('inactive');
			        $('#'+key0).css('z-index', 1);		
			        //$('#map-'+key1+'-btn').removeClass('inactive');
			        $('#map-'+key1+'-btn').addClass('on');
			        $('#map-'+key1).css('z-index', 9999);	


			        if (g.new_layout) {
			        // For maps of lower administrative level: reset 'jumpto' dropdown list
			        	if (key1=='admN1') {
			        		module_multiadm.enableGoto(key1);
			        		module_multiadm.disableGoto('admN2');
			        		module_multiadm.disableGoto('hosp');
			        	} else if (key1=='admN2') {
			        		module_multiadm.enableGoto(key1);
			        		module_multiadm.enableGoto('admN1');
			        		module_multiadm.disableGoto('hosp');
			        	} else if (key1=='hosp') {
			        		module_multiadm.enableGoto('admN1');
			        		module_multiadm.disableGoto('admN2');
			        		module_multiadm.enableGoto(key1);
			        	}
			        	dc.redrawAll();
				    
					} else {
				        // For maps of lower administrative level: reset 'jumpto' dropdown list
				        if (key1num < key0num){
					        g.geometry_keylist.forEach(function(key2,key2num){
					        	console.log(key0, key0num, key1, key1num, key2, key2num);
					        	if (key2num>key1num) {
						        	module_multiadm.resetGoto(key2);
						        	g.viz_definition.multiadm.charts[key2].filterAll();		
					        	}
					        });
					        dc.redrawAll();
					    }
					}

				    // Why? - To maintain coherence if a feature is selected in the new adm level? Does that work? 
				    console.log("about to go to propGoto: ", key1, key1num);
				    module_multiadm.propGoto(key1,key1num);		

				};

			    // Why? - 'lockcolor' only locks color on current adm level map.
	    		module_colorscale.lockcolor('Auto');   
			})	


/*		if (g.new_layout) {
			$('#map-'+key1+'-btn').on('click',function(){  
				console.log("CLICKED ON ", key1);

				if (!(g.module_multiadm.tabcurrent == 'map-'+key1)) {
					if (key1=='hosp') {
						if ((g.module_colorscale.mapunitcurrent=='IncidenceProp') || (g.module_colorscale.mapunitcurrent=='MortalityProp')) {
							$('#Cases').click();
						}
						$('#IncidenceProp').attr('disabled', true);
						$('#MortalityProp').attr('disabled', true);

						//filter to hospitals list
						g.viz_definition.multiadm.charts[key1].filterAll();	

						g.medical_hospitals_fullname.forEach(function(h) {
							console.log(h);
							g.viz_definition.multiadm.charts[key1].filter(h);
						});

						//g.viz_definition.multiadm.charts[key1].filter('Gbonkolenken, Lion Heart Medical Centre');
						var filters = g.viz_definition.multiadm.charts[key1].filters();
						console.log("filters: ", filters);
						dc.redrawAll();
					} else {
						$('#IncidenceProp').attr('disabled', false);
						$('#MortalityProp').attr('disabled', false);
					}

					// Temporarily store previous tab keys
			    	var key0 = g.module_multiadm.tabcurrent;
			    	var key0num = g.module_multiadm.tabcurrentnum;

			        // Swich current displayed map in global variable
			        g.module_multiadm.tabcurrent = 'map-'+key1;
					g.module_multiadm.tabcurrentnum = key1num;

					$('#'+key0+'-btn').removeClass('on');
			        //$('#'+key0+'-btn').addClass('inactive');
			        $('#'+key0).css('z-index', 1);		
			        //$('#map-'+key1+'-btn').removeClass('inactive');
			        $('#map-'+key1+'-btn').addClass('on');
			        $('#map-'+key1).css('z-index', 9999);	

			        // For maps of lower administrative level: reset 'jumpto' dropdown list
			        if (key1num < key0num){
				        g.geometry_keylist.forEach(function(key2,key2num){
				        	if (key2num>key1num) {
					        	module_multiadm.resetGoto(key2);
					        	g.viz_definition.multiadm.charts[key2].filterAll();		
				        	}
				        });
				        dc.redrawAll();
				    }

				    // Why? - To maintain coherence if a feature is selected in the new adm level? Does that work? 
				    module_multiadm.propGoto(key1,key1num);		

				};

			    // Why? - 'lockcolor' only locks color on current adm level map.
			    //console.log("about to autolock color");
	    		module_colorscale.lockcolor('Auto');    	
	    		//console.log("autolocked color");
			})	*/

		} else {
			$('#map-'+key1+'-tab').on('click',function(){        
			    if (!(g.module_multiadm.tabcurrent == 'map-'+key1)) {

			    	// Temporarily store previous tab keys
			    	var key0 = g.module_multiadm.tabcurrent;
			    	var key0num = g.module_multiadm.tabcurrentnum;

			        // Swich current displayed map in global variable
			        g.module_multiadm.tabcurrent = 'map-'+key1;
					g.module_multiadm.tabcurrentnum = key1num;

			        $('#'+key0+'-tab').removeClass('active');
			        $('#'+key0+'-tab').addClass('inactive');
			        $('#'+key0).css('z-index', 1);		
			        $('#map-'+key1+'-tab').removeClass('inactive');
			        $('#map-'+key1+'-tab').addClass('active');
			        $('#map-'+key1).css('z-index', 9999);		

			        // For maps of lower administrative level: reset 'jumpto' dropdown list
			        if (key1num < key0num){
				        g.geometry_keylist.forEach(function(key2,key2num){
				        	if (key2num>key1num) {
					        	module_multiadm.resetGoto(key2);
					        	g.viz_definition.multiadm.charts[key2].filterAll();		
				        	}
				        });
				        dc.redrawAll();
				    }

				    // Why? - To maintain coherence if a feature is selected in the new adm level? Does that work? 
				    module_multiadm.propGoto(key1,key1num);	
			    };

			    // Why? - 'lockcolor' only locks color on current adm level map.
	    		module_colorscale.lockcolor('Auto');             
			}) 	
		}

	});
	/***************************************************************/


	// 3) b. 'Jumpto' dropdown list Interactions
	//------------------------------------------------------------------------------------
	
	// Onclick initialize the next dropdown lists: propagate (inside jumpto divs)
	/**
	 * Modifies the 'Goto' dropdown lists of immediate lower level after a dropdownlist change event (populates with features in the selected area).
	 * <br>
	 * Requires - *complete list [.]*:
	 * <ul>
	 *  <li>{@link module:module_multiadm.focuscurrent}</li>
	 *  <li>{@link module:module_multiadm.zoomTo}</li>
	 *  <li>{@link module:g.geometry_keylist}</li>
	 *  <li>{@link module:module_lang.text}</li>
 	 *  <li>{@link module:module_lang.current}</li>
	 *  <li>{@link module:g.medical_loclists}</li>
	 * </ul>
	 * <br> Triggered in {@link module:module_multiadm.interaction}.
	 * @type {Function}
	 * @method
	 * @alias module:module_multiadm.propGoto
	 */
	module_multiadm.propGoto = function(key1,key1num) {		//HEIDI - should be list changes only (not button changes)
		console.log("propGoto: ", key1, key1num);
		$('#select-'+key1).change(function(){
			console.log("propGoto changed for: ", key1, key1num);

        	var loc_new = $('#select-' + key1).val();
            if (!(loc_new == g.module_multiadm.focuscurrent[key1])) {
            	module_multiadm.zoomTo(key1,loc_new);
            };
            
            g.module_multiadm.focuscurrent[key1] = loc_new;

           if (g.new_layout) {
			//HEIDI - if there is a 'shared' adm level
				if ((key1=='admN1') && ($('#map-admN1-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
					console.log("selected from admN1 (Chiefdom) list, and View by is on admN1 (Chiefdom)");

					module_multiadm.disableGoto('admN2');
					module_multiadm.disableGoto('hosp');
			    	//if selected from admN1 (Chiefdom) list, and View by is on admN1 (Chiefdom)
			    	/*var key2 = 'admN1';
			    	module_multiadm.enableGoto(key2);
					var html = '<select class="select-adm" id="select-'+key2+'">';
	            	//console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')');
		            html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')'+'</option>'; 
		            //console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key1].title+')');  
				    //html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';   
				    g.medical_loclists[key2].forEach(function(loc){
				        if (loc.slice(0,loc_new.length) == loc_new) {
				        	html +='<option value="'+loc+'">'+loc+'</option>';
				    	}
				    });
				    html += '</select></div>';
				    $('#map-'+key2+'-jumpto').html(html);*/
				};

			    if ((key1=='admN1') && ($('#map-admN2-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
			    	console.log("selected from admN1 (Chiefdom) list, and View by is on admN2 (PHU)");
			    	//if selected from admN1 (Chiefdom) list, and View by is on admN2 (PHU)
			    	var key2 = 'admN2';
			    	module_multiadm.enableGoto(key2);
					var html = '<select class="select-adm" id="select-'+key2+'">';
	            	//console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')');
		            html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')'+'</option>'; 
		            //console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key1].title+')');  
				    //html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';   
				    g.medical_loclists[key2].forEach(function(loc){
				        if (loc.slice(0,loc_new.length) == loc_new) {
				        	html +='<option value="'+loc+'">'+loc+'</option>';
				    	}
				    });
				    html += '</select></div>';
				    $('#map-'+key2+'-jumpto').html(html);
				};

				if ((key1=='admN1') && ($('#map-hosp-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
					console.log("selected from admN1 (Chiefdom) list, and View by is on hosp (Hospitals)");
					//if selected from admN1 (Chiefdom) list, and View by is on hosp (Hospitals)
				    var key2 = 'hosp';
				    module_multiadm.enableGoto(key2);
					var html = '<select class="select-adm" id="select-'+key2+'">';
	            	//console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')');
		            html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')'+'</option>'; 
		            //console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key1].title+')');  
				    //html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';   
				    g.medical_loclists[key2].forEach(function(loc){
				        if (loc.slice(0,loc_new.length) == loc_new) {
				        	html +='<option value="'+loc+'">'+loc+'</option>';
				    	}
				    });
				    html += '</select></div>';
				    $('#map-'+key2+'-jumpto').html(html);
			    };

			    if ((key1=='admN2') && ($('#map-admN1-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
			    	console.log("selected from admN2 (PHU) list, and View by is on admN1 (Chiefdom)");
					//if selected from admN2 (PHU) list, and View by is on admN1 (Chiefdom)
					var key2 = 'admN1';
				    module_multiadm.enableGoto(key2);
				    console.log("SHOULDN'T EVER HAPPEN???");
				    module_multiadm.disableGoto('admN2');
					module_multiadm.disableGoto('hosp');
			    };

			    if ((key1=='admN2') && ($('#map-admN2-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
			    	console.log("selected from admN2 (PHU) list, and View by is on admN2 (PHU)");
					//if selected from admN2 (PHU) list, and View by is on admN2 (PHU)
					var key2 = 'admN2';
				    module_multiadm.enableGoto(key2);
				    /*var html = '<select class="select-adm" id="select-'+key2+'">';
	            	//console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')');
		            html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')'+'</option>'; 
		            //console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key1].title+')');  
				    //html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';   
				    g.medical_loclists[key2].forEach(function(loc){
				        if (loc.slice(0,loc_new.length) == loc_new) {
				        	html +='<option value="'+loc+'">'+loc+'</option>';
				    	}
				    });
				    html += '</select></div>';
				    $('#map-'+key2+'-jumpto').html(html);*/
			    };

			    if ((key1=='admN2') && ($('#map-hosp-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
			    	console.log("selected from admN2 (PHU) list, and View by is on hosp (Hospitals)");
					//if selected from admN2 (PHU) list, and View by is on hosp (Hospitals)
					var key2 = 'hosp';
				    module_multiadm.enableGoto(key2);
				    module_multiadm.disableGoto('admN2');
			    };

			    if ((key1=='hosp') && ($('#map-admN1-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
			    	console.log("selected from hosp (Hospitals) list, and View by is on admN1 (Chiefdom)");
					//if selected from hosp (Hospitals) list, and View by is on admN1 (Chiefdom)
					var key2 = 'admN1';
				    module_multiadm.enableGoto(key2);
				    console.log("SHOULDN'T EVER HAPPEN???");
				    module_multiadm.disableGoto('admN2');
					module_multiadm.disableGoto('hosp');
			    };

			    if ((key1=='hosp') && ($('#map-admN2-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
			    	console.log("selected from hosp (Hospitals) list, and View by is on admN2 (PHU)");
					//if selected from hosp (Hospitals) list, and View by is on admN2 (PHU)
					var key2 = 'admN2';
				    module_multiadm.enableGoto(key2);
					module_multiadm.disableGoto('hosp');
			    };

			    if ((key1=='hosp') && ($('#map-hosp-btn').hasClass('on'))) {		//HEIDI - fix direct reference here
			    	console.log("selected from hosp (Hospitals) list, and View by is on hosp (Hospitals)");
					//if selected from hosp (Hospitals) list, and View by is on hosp (Hospitals)
					var key2 = 'hosp';
				    module_multiadm.enableGoto(key2);
			    };


			} else {
	            // Initialize the next dropdown list
	            var key2num = key1num + 1; 
	            if(g.geometry_keylist[key2num]){
	            	var key2 = g.geometry_keylist[key2num];
	            	var html = '<select class="select-adm" id="select-'+key2+'">';
	            	console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')');
		            html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')'+'</option>'; 
		            //console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key1].title+')');  
				    //html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';   
				    g.medical_loclists[key2].forEach(function(loc){
				        if (loc.slice(0,loc_new.length) == loc_new) {
				        	html +='<option value="'+loc+'">'+loc+'</option>';
				    	}
				    });
				    html += '</select></div>';
				    $('#map-'+key2+'-jumpto').html(html);
				    module_multiadm.propGoto(key2,key2num);
	            } 
	        }

            
		});
		console.log("propGoto could still implement here: ", key1, key1num);

	}

	/**
	 * Initiates the 'Goto' dropdown lists for the highest administrative level. Other lower administrative levels will be initiated by {@link module:module_multiadm.resetGoto}.
	 <br>
	 Further modifications on the 'Goto' dropdown lists are managed either by {@link module:module_multiadm.propGoto} (due to dropdownlist change event) or {@link module:module_multiadm.resetGoto} (due to tab swtiching to a higher administrative level).
	 * <br>
	 * Requires - *complete list [x]*:
	 * <ul>
	 *  <li>{@link module:g.geometry_keylist}</li>
	 *  <li>{@link module:module_lang.text}</li>
 	 *  <li>{@link module:module_lang.current}</li>
	 *  <li>{@link module:g.medical_loclists}</li>
	 *  <li>{@link module:module_multiadm.propGoto}</li>
	 * </ul>
	 * Returns - *complete list [x]*:
	 * <ul>
	 *  <li>{@link module:module_multiadm.focuscurrent}</li>
	 * </ul>
	 * <br> Triggered in {@link module:module_multiadm.interaction}.
	 * @type {Function}
	 * @method
	 * @alias module:module_multiadm.initGoto
	 */
	module_multiadm.initGoto = function(){	
		// Initialize jumpto's focus trackers
		/**
	     * Contains the name last features accessed via the 'Goto' dropdown lists. One value per administrative level.
	     * <br> Defined in {@link module:module_multiadm.initGoto}.
	     * <br> Populated in {@link module:module_multiadm.propGoto}.
	     * @type {Object.<String>}
	     * @constant
	     * @alias module:module_multiadm.focuscurrent
	     */
		g.module_multiadm.focuscurrent = {};
		g.geometry_keylist.forEach(function(key){ 
			g.module_multiadm.focuscurrent[key] = 'NA';
		});
		
		console.log("in initGoto: ", g.medical_loclists.admN1);
        // Initialize first jumpto
	    var html = '<select class="select-adm" id="select-admN1">';
	    //console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key1].title+')');  
	    html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_admN1'].title+')'+'</option>';
	    g.medical_loclists.admN1.sort().forEach(function(loc){
	        html +='<option value="'+loc+'">'+loc+'</option>';
	    });
	    html += '</select></div>';
	    $('#map-admN1-jumpto').html(html);

		module_multiadm.propGoto('admN1',0);
	}

	// Initialisation
	module_multiadm.initGoto();
	g.geometry_keylist.forEach(function(key,keynum){
		if (!(keynum == 0)) {
			module_multiadm.resetGoto(key);
			module_multiadm.disableGoto(key);
		}   
	});

}

// zoomTo the selected location on the current map
/**
 * Defines enables the use of the {@link module:main-core~zoomToGeom} function via the 'Goto' dropdown lists on change events. Zoom to selected features or back to complete view of layer if 'NA' is selected.
 * <br>
 * Requires - *complete list [x]*:
 * <ul>
 *  <li>{@link module:main-core~zoomToGeom}</li>
 *  <li>{@link module:g.geometry_data}</li>
 *  <li>{@link module:g.viz_definition}</li>
 * </ul>
 * <br> Triggered in {@link module:module_multiadm.propGoto}.
 * @type {Function}
 * @param {String} key
 * @param {String} loc
 * @method
 * @alias module:module_multiadm.zoomTo
 */		 
module_multiadm.zoomTo = function(key,loc){
	console.log("zoomTo: ", key, loc);
    if (loc == "NA") {
    	console.log("should be zooming out here for ", key);
        zoomToGeom(g.geometry_data[key],g.viz_definition.multiadm.maps[key]);
    }else{
        var mapLayers = g.viz_definition.multiadm.maps[key]._layers;
        var bounds;
        Object.keys(mapLayers).forEach(function(i){
            if (mapLayers[i]['key'] == loc) {
                bounds = mapLayers[i].getBounds();
            };
        });
       g.viz_definition.multiadm.maps[key].fitBounds(bounds);
    }
}

// Reset jumpto dropdown lists content
/**
 * Defines the 'Goto' dropdown lists reset procedure triggered to initiate administrative levels others than the highest and then to reset the lists of lower administrative levels when the user moves back to a higher administrative level. 
 * <br>
 * Requires - *complete list [x]*:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:module_multiadm.focuscurrent}</li>
 * </ul>
 * <br> Triggered in {@link module:module:module_multiadm.interaction} and in {@link module:module:module_multiadm.interaction_tab}.
 * @type {Function}
 * @method
 * @alias module:module_multiadm.resetGoto
 */
module_multiadm.resetGoto = function(key){	  //key=adm level, e.g. admN2 		//this function populates list with all locations
	console.log("resetGoto: ", key);
	// Reset jumpto dropdown lists content
    var html = '<select class="select-adm" id="select-'+ key +'">';
    //console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key].title+')');
    html += '<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key].title+')'+'</option>';
    g.medical_loclists[key].sort().forEach(function(loc){	
        html +='<option value="'+loc+'">'+loc+'</option>';
    });
    html += '</select></div>';
    $('#map-'+key+'-jumpto').html(html);
    g.module_multiadm.focuscurrent[key] = 'NA';		//g.module_multiadm.focuscurrent[key] - current value selected in zoom list
}

//HEIDI - new functions:
module_multiadm.disableGoto = function(key){	  //key=adm level, e.g. admN2
	console.log("disableGoto: ", key);
	module_multiadm.resetGoto(key);
	g.viz_definition.multiadm.charts[key].filterAll();
	dc.redrawAll();
	// Disable jumpto dropdown lists content
    $('#select-'+key).attr('disabled', true);	
    g.module_multiadm.focuscurrent[key] = 'NA';	  //g.module_multiadm.focuscurrent[key] - current value selected in zoom list
}

module_multiadm.enableGoto = function(key){	  //key=adm level, e.g. admN2
	console.log("enableGoto: ", key);
	// Enable jumpto dropdown lists content
    $('#select-'+key).attr('disabled', false);	
    g.module_multiadm.focuscurrent[key] = 'NA';	  //g.module_multiadm.focuscurrent[key] - current value selected in zoom list
}


module_multiadm.mapunit_interaction = function() {

	//Map unit 'onclick' events
	g.module_colorscale.mapunitlist.forEach(function(unit,unitnum) {
		$('#'+unit).on('click',function(){   
			if (!($('#'+unit).hasClass('on'))) {
				console.log('mapunit_interaction CLICKED ON: ', unit);
				$('.button_mapunit').removeClass('on')
				//$('.button_mapunit').removeClass('checked')
				$('#'+unit).addClass('on');
				//$('#'+unit).addClass('checked');
				g.module_colorscale.mapunitcurrent = unit;
				changeMapUnit(unit);
			};
		});
	});

	//g.module_colorscale.mapunitlist.forEach(function(unit){
	changeMapUnit = function(unit) {
		//$('#'+unit).on('change',function(){			//whenever selection changes
			//if ($('#'+unit).is(':checked')) {		//if it is checked (i.e. changed to this 'unit')
			if ($('#'+unit).hasClass('on')) {
				//g.module_colorscale.mapunitcurrent = g.module_colorscale.mapunitlist[$('#'+unit).val()];  //set .mapunitcurrent variable to selected
				//console.log("CLICKED ON: ", g.module_colorscale.mapunitcurrent);

				// Saves last disease displayed when 'Completeness' is selected
				if (g.module_colorscale.mapunitcurrent == 'Completeness') {
					//console.log("SELECTED Completeness: ", g.module_colorscale.mapunitcurrent);

					$('#map-hosp-btn').attr('disabled', false);		//HEIDI - need to automate hosp here

					$('#selectform1').val('ReversedDiverging');	
					g.module_colorscale.colorscurrent = 'ReversedDiverging';
					//console.log("g.module_colorscale.colorscurrent: ", g.module_colorscale.colorscurrent);
					if (typeof g.viz_definition.disease.chart.filter() == 'string') {
			            var temp_disease = g.medical_currentdisease.substring(0,g.medical_currentdisease.length);
						g.medical_pastdisease = temp_disease;
						g.viz_definition.disease.chart.filterAll();
						g.medical_currentdisease = g.medical_pastdisease; 
					}

					$('#chart_case_ser_title').html('<b>Completeness</b>');		//HEIDI added - not sure about this!!!
					$('#chart_case_lin_title').html('<b>Completeness</b>');	

	                $('#chart-disease').addClass("noclick");
	                $('#chart-fyo').addClass("noclick");

				} else if(g.module_colorscale.mapunitcurrent == 'Cases' || g.module_colorscale.mapunitcurrent == 'Deaths') {
					//console.log("SELECTED Cases OR Deaths: ", g.module_colorscale.mapunitcurrent);

					$('#map-hosp-btn').attr('disabled', false);		//HEIDI - need to automate hosp here

					$('#selectform1').val('Classic');	
					g.module_colorscale.colorscurrent = 'Classic';
					//console.log("g.module_colorscale.colorscurrent: ", g.module_colorscale.colorscurrent);
					//console.log("g.viz_definition.disease = ", g.viz_definition.disease);
					//console.log("g.viz_definition.disease.chart.filter() = ", g.viz_definition.disease.chart.filter());
					//console.log("g.medical_currentdisease = ", g.medical_currentdisease);
					if(g.viz_definition.disease && g.viz_definition.disease.chart.filter() == undefined && g.medical_currentdisease){
			            g.viz_definition.disease.chart.filter(g.medical_currentdisease);
			            //console.log("IN IF for Cases or Deaths: ", g.medical_currentdisease);
					}

					$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_title+'</b>');		//HEIDI added
					$('#chart_case_lin_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_title+'</b>');		//HEIDI added

					$('#chart-disease').removeClass("noclick");
					$('#chart-fyo').removeClass("noclick");

				} else if(g.module_colorscale.mapunitcurrent == 'IncidenceProp' || g.module_colorscale.mapunitcurrent == 'MortalityProp'){
					//console.log("SELECTED Incidence or Mortality: ", g.module_colorscale.mapunitcurrent);

					$('#map-hosp-btn').attr('disabled', true);		//HEIDI - need to automate hosp here

					$('#selectform1').val('Classic');	
					g.module_colorscale.colorscurrent = 'Classic';
					//console.log("g.module_colorscale.colorscurrent: ", g.module_colorscale.colorscurrent);
		            if(g.viz_definition.disease && g.viz_definition.disease.chart.filter() == undefined && g.medical_currentdisease){
			            g.viz_definition.disease.chart.filter(g.medical_currentdisease);
					}
					
					if (g.module_lang.text[g.module_lang.current].chart_case_ser_imr_title) {
						$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_imr_title+'</b>');		//HEIDI added
					} else {
						$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_title+'</b>');
					}

					if (g.module_lang.text[g.module_lang.current].chart_case_lin_imr_title) {
						$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_imr_title+'</b>');		//HEIDI added
					} else {
						$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_title+'</b>');
					}
					
					$('#chart-disease').removeClass("noclick");
					$('#chart-fyo').removeClass("noclick");
					dc.redrawAll(); //HEIDI ADDED TO TEST
	          	}

	          	module_colorscale.changeMapColors();
				module_colorscale.lockcolor('Manual');

				$('#map-unit').html(g.module_lang.text[g.module_lang.current].map_unit[g.module_colorscale.mapunitcurrent]);  //map title
			}
		//});
	//});
	};
};
