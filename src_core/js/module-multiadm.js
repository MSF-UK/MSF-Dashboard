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
 * Defines titles, filters container and tabs and parses it to the container with if <code>chart-multiadm</code> that has been defined in the index.html layout.
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
		if (g.geometry_keylist.length<=1) {
			html += '<div class="col-md-8" id="map-title">';
		} else {
			html += '<div class="col-md-7" id="map-title">';
		};
		html += '<span id="map-unit" class="map-unit-title">'+g.module_lang.text[g.module_lang.current].map_unit_title[g.module_colorscale.mapunitcurrent]+'</span>';
		
		//Map unit buttons (i.e. Cases, Deaths, Incidence Rate, Mortality Rate, Completeness)
		g.module_colorscale.mapunitlist.forEach(function(unit,unitnum) {
			if (unitnum == 0) {
				var text = g.module_lang.text[g.module_lang.current].colorscale_unitintro;
			} else {
				var text = '';
			};
			if (unit == g.module_colorscale.mapunitcurrent) {
				html += '<button id='+unit+' class="btn_map button_mapunit on">'+g.module_lang.text[g.module_lang.current].map_unit[unit]+'</button>';
			} else {
				html += '<button id='+unit+' class="btn_map button_mapunit">'+g.module_lang.text[g.module_lang.current].map_unit[unit]+'</button>';
			};
		});
		html += '</div>';

		if (g.geometry_keylist.length<=1) {
			html += '<div class="col-md-2" id="map-text">';
		} else {
			html += '<div class="col-md-3" id="map-text">';
		}

		html += '<span class="map-text">'+g.module_lang.text[g.module_lang.current].map_viewby_text+'</span><br>'; 
		g.geometry_keylist.forEach(function(key,keynum){
			if (keynum == 0) {
				html += '<button id="map-'+key+'-btn" class="btn_map button_mapadm on">'+g.module_lang.text[g.module_lang.current]['map_'+key].title+'</button>';
			} else {
				html += '<button id="map-'+key+'-btn" class="btn_map button_mapadm">'+g.module_lang.text[g.module_lang.current]['map_'+key].title+'</button>';
			}	
		});
		html += '</div>';

		html += '<div class="col-md-2">';
		html += '<span class="map-text">'+g.module_lang.text[g.module_lang.current].map_quickzoom_text+'</span><br>'; 
					
		g.geometry_keylist.forEach(function(key,keynum){
			html +=  '<div class="list-content" id="map-'+key+'-jumpto"></div>';
		});
		html += '</div></div>';

	} else {
		html += '<b>'+g.module_lang.text[g.module_lang.current].map_title+' - <small><span id="map-unit">'+g.module_lang.text[g.module_lang.current].map_unit[g.module_colorscale.mapunitcurrent]+'</b></span></small> | '+g.module_lang.text[g.module_lang.current].filtext +' ';
		g.geometry_keylist.forEach(function(key,keynum,keylist){
			html +=  '<span id="map-'+key+'-filter"></span>';
			if (!(keynum == keylist.length - 1)) {
				html += ' >';
			}
		});

		// Tabs + 'jumpto' dropdown lists
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
	g.module_multiadm.tabcurrent = 'map-' + g.geometry_keylist[0];   //Initialise current display with first map in g.geometry_keylist

	/**
     * Contains the number associated with the tab currently displayed {@link module:module_multiadm.tabcurrent}. 
     * <br> Defined in {@link module:module_multiadm.interaction_tab}.
     * @type {Object}
     * @constant
     * @alias module:module_multiadm.tabcurrentnum
     * @todo Could we avoid module_colorscale dependency here?
     */
	g.module_multiadm.tabcurrentnum = 0;
	
	g.module_multiadm.focuscurrent = {};
		g.geometry_keylist.forEach(function(key){ 
			g.module_multiadm.focuscurrent[key] = 'NA';
		});

	g.module_multiadm.prev_layer = g.module_multiadm.tabcurrent.substring(4);
	g.module_multiadm.current_zoom = {};
		g.geometry_keylist.forEach(function(key){ 
			g.module_multiadm.current_zoom[key] = 'NA';
		});

	// Tabs 'onclick' events
	g.geometry_keylist.forEach(function(key1,key1num){
		if (g.new_layout) {

			$('#map-'+key1+'-btn').on('click',function(){  	

				if (!(g.module_multiadm.tabcurrent == 'map-'+key1)) {	//if user clicks on new button

					//Disable non-compatible buttons if selected
					g.dev_defined.incompatible_buttons.forEach(function(btn_set) {
						if (key1==btn_set.geo) {
							$('#'+btn_set.unit).attr('disabled', true);
						} else {
							$('#'+btn_set.unit).attr('disabled', false);
						}
					})

					//Temporarily store previous button (tab)
			    	var key0 = g.module_multiadm.tabcurrent;
			    	var key0num = g.module_multiadm.tabcurrentnum;

			        //Swich current displayed map 
			        g.module_multiadm.tabcurrent = 'map-'+key1;
					g.module_multiadm.tabcurrentnum = key1num;

					$('#'+key0+'-btn').removeClass('on');
			        $('#'+key0).css('z-index', 1);		
			        $('#map-'+key1+'-btn').addClass('on');
			        $('#map-'+key1).css('z-index', 9999);	

			        //Switch between zooms
		        	var top_layer = module_multiadm.getTopLayer(); 
		        	if (key1==top_layer) {	
			        	g.geometry_keylist.forEach(function(key2) {	        		
			        		if (key1!=key2) {
			        			if (key2==g.module_multiadm.prev_layer) {     	//click from layer key2
				        			g.module_multiadm.current_zoom[key2] = 'NA';//reset key2 zoom variable to no zoom
						        	$('#select-'+key2).val('NA');				//reset key2 zoom text to no zoom
						        	module_multiadm.enableGoto(key1);			//enable key1 zoom list
					        		module_multiadm.zoomTo(key1, g.module_multiadm.current_zoom[key1]);   //zoom map to key1 zoom	
				        		}
				        		module_multiadm.disableGoto(key2);  //disable all other zoom lists except top layer
				        	};
			        	});

			    	} else {  //clicked on new layer that is not top layer - i.e. clicked from key2 TO key1
			    		g.geometry_keylist.forEach(function(key2) {	    			
			    			if (key1!=key2) { 
				    			if (key2==g.module_multiadm.prev_layer) {

					    			if (key2==top_layer) {		//clicking from top layer to another
										module_multiadm.enableGoto(key1);			//enable key1 zoom list 
					        			if (g.module_multiadm.current_zoom[key2] != 'NA') {		//if admN1 was already zoomed then keep zoom
					        				module_multiadm.zoomTo(key2, g.module_multiadm.current_zoom[key2]); //zoom to selection of admN1
					        				module_multiadm.subsetGoto(key1, g.module_multiadm.current_zoom[key2]);  
					        			} else {	
					        				module_multiadm.zoomTo(key1, g.module_multiadm.current_zoom[key1]); 
					        			}
						        		module_multiadm.enableGoto(key2);
						        		g.geometry_keylist.forEach(function(key3) {	 
						        			if ((key3!=key2) && (module_multiadm.isSibling(key1, key3))) {
						        				module_multiadm.disableGoto(key3);  //here we need to disable buttons that are siblings to key1 and not top layer
					    					}
					    				});

					    			} else {   //clicking between layers that are not top layer - assume they are siblings;
										g.module_multiadm.current_zoom[key2] = 'NA';   //remove zoom from key2
							        	$('#select-'+key2).val('NA');
										if (g.module_multiadm.current_zoom[top_layer] != 'NA') {		//if admN1 was already zoomed then keep zoom
					        				module_multiadm.zoomTo(top_layer, g.module_multiadm.current_zoom[top_layer]); //zoom to selection of admN1
					        				module_multiadm.subsetGoto(key1, g.module_multiadm.current_zoom[top_layer]);  
					        			} else {		
					        				module_multiadm.zoomTo(key1, g.module_multiadm.current_zoom[key1]);	//zoom to extent of admN2
					        			}
						        		module_multiadm.enableGoto(top_layer);
						        		module_multiadm.enableGoto(key1);
						        		module_multiadm.disableGoto(key2);

					    			}
					    		}
				    		}
			    		});

			    	}

		        	dc.redrawAll();
		        	g.module_multiadm.prev_layer = key1;
				};

			    // Why? - 'lockcolor' only locks color on current adm level map.
	    		module_colorscale.lockcolor('Auto');   
			})	

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
	module_multiadm.propGoto = function(key1,key1num) {	

		$('#select-'+key1).change(function(){
			var loc_new = $('#select-' + key1).val();
            if (!(loc_new == g.module_multiadm.focuscurrent[key1])) {
            	module_multiadm.zoomTo(key1,loc_new);
            };
            g.module_multiadm.focuscurrent[key1] = loc_new;

            // Initialize the next dropdown list
            var key2num = key1num + 1; 
            if(g.geometry_keylist[key2num]){
            	var key2 = g.geometry_keylist[key2num];
            	var html = '<select class="select-adm" id="select-'+key2+'">';
            	console.log(' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')');
	            html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key2].title+')'+'</option>'; 
  
			    g.medical_loclists[key2].forEach(function(loc){
			        if (loc.slice(0,loc_new.length) == loc_new) {
			        	html +='<option value="'+loc+'">'+loc+'</option>';
			    	}
			    });
			    html += '</select></div>';
			    $('#map-'+key2+'-jumpto').html(html);
			    module_multiadm.propGoto(key2,key2num);
            } 
            
		});

	}

	module_multiadm.setupGoto = function() {	

		g.geometry_keylist.forEach(function(key1) {		
			$('#select-'+key1).on('change', function(){  //user selects zoom from drop down list - key1
				var loc_new = $('#select-' + key1).val();
				g.module_multiadm.current_zoom[key1] = loc_new;	

				var top_layer = module_multiadm.getTopLayer(); 	
				if (key1==top_layer) {		//if selected zoom is from top layer drop down list (key1)

					g.geometry_keylist.forEach(function(key2) {	  //check which layer button is on - key2
						if (($('#map-'+key2+'-btn').hasClass('on')) && (key2==key1)) {	//if top layer button is also on
							module_multiadm.zoomTo(key1,loc_new);
							g.geometry_keylist.forEach(function(key3) {	 
			        			if (key1!=key3) {
			        				module_multiadm.disableGoto(key3);  //disable all other zoom lists besides top layer
		    					}
	    					});
	    				} else if ($('#map-'+key2+'-btn').hasClass('on')) {
					    	module_multiadm.zoomTo(key1,loc_new);				
					    	module_multiadm.subsetGoto(key2, g.module_multiadm.current_zoom[key1]);
						    module_multiadm.enableGoto(key2);
						    g.geometry_keylist.forEach(function(key3) {	 
			        			if ((key1!=key3) && (key2!=key3)) {
			        				module_multiadm.disableGoto(key3);  //disable all other zoom lists besides top layer
		    					}
	    					});
	    				};
					});

				} else {   //if selected zoom is NOT from top layer drop down list e.g. key1 = 'admN2' or 'hosp'

					g.geometry_keylist.forEach(function(key2) {	  //check which layer button is on - key2
						if (($('#map-'+key2+'-btn').hasClass('on')) && (key2==key1)) {					
							if ((g.module_multiadm.current_zoom[top_layer]=='NA') && (g.module_multiadm.current_zoom[key1]=='NA')) {
								module_multiadm.zoomTo(key1, g.module_multiadm.current_zoom[key1]);
								module_multiadm.enableGoto(key1);
							} else if ((g.module_multiadm.current_zoom[top_layer]!='NA') && (g.module_multiadm.current_zoom[key1]=='NA')) {
								module_multiadm.zoomTo(top_layer, g.module_multiadm.current_zoom[top_layer]);
					    		module_multiadm.subsetGoto(key1, g.module_multiadm.current_zoom[top_layer]);
							    module_multiadm.enableGoto(key1);
							} else if (g.module_multiadm.current_zoom[key1]!='NA') {
								module_multiadm.zoomTo(key1, g.module_multiadm.current_zoom[key1]);					
							} 
							g.geometry_keylist.forEach(function(key3) {	 
			        			if ((top_layer!=key3) && (module_multiadm.isSibling(key2,key3))) {
			        				module_multiadm.disableGoto(key3);  //disable siblings, not top layer
		    					}
	    					});
						};
					});

			    };
			})
		})

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
		
		if (g.new_layout) {
	        // Initialize zoom dropdown lists
	        g.geometry_keylist.forEach(function(key, keynum){
				var html = '<select class="select-adm" id="select-' + key + '">'; 
			    html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key].title+')'+'</option>';
			    g.medical_loclists[key].sort().forEach(function(loc){
			        html +='<option value="'+loc+'">'+loc+'</option>';
			    });
			    html += '</select></div>';
			    $('#map-' + key + '-jumpto').html(html);
			    if (keynum!=0) {
			    	module_multiadm.disableGoto(key);
			    };
	        });

		    module_multiadm.setupGoto();

		} else {
	        // Initialize first jumpto
		    var html = '<select class="select-adm" id="select-admN1">';
		    html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_admN1'].title+')'+'</option>';
		    g.medical_loclists.admN1.sort().forEach(function(loc){
		        html +='<option value="'+loc+'">'+loc+'</option>';
		    });
		    html += '</select></div>';
		    $('#map-admN1-jumpto').html(html);

		    module_multiadm.propGoto('admN1',0);
		}
		
	}

	// Initialisation
	module_multiadm.initGoto();
	if (!(g.new_layout)) {
		g.geometry_keylist.forEach(function(key,keynum){
			if (!(keynum == 0)) {
				module_multiadm.resetGoto(key);			
			}   
		});
	};

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
    if (loc == "NA") {
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
module_multiadm.resetGoto = function(key){	  //populates dropdown list with all locations

	// Reset jumpto dropdown lists content
    var html = '<select class="select-adm" id="select-'+ key +'">';
    html += '<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key].title+')'+'</option>';
    g.medical_loclists[key].sort().forEach(function(loc){	
        html +='<option value="'+loc+'">'+loc+'</option>';
    });
    html += '</select></div>';
    $('#map-'+key+'-jumpto').html(html);
    g.module_multiadm.focuscurrent[key] = 'NA';		//g.module_multiadm.focuscurrent[key] - current value selected in zoom list
    g.module_multiadm.current_zoom[key] = 'NA';
}


module_multiadm.subsetGoto = function(key, region){	  //populates dropdown list with all locations
	
	// Reset dropdown list options
    var html = '';   
    html += '<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+' ('+g.module_lang.text[g.module_lang.current]['map_'+key].title+')'+'</option>';
    g.medical_loclists[key].sort().forEach(function(loc){	
        if ((region=='NA') || (loc.slice(0,region.length) == region)) {
        	html +='<option value="'+loc+'">'+loc+'</option>';
    	}
    });
    $('#select-'+key).html(html);
}

//Disable zoom dropdown list
module_multiadm.disableGoto = function(key){	 
    $('#select-'+key).attr('disabled', true);	
}

//Enable zoom dropdown list
module_multiadm.enableGoto = function(key){	  
    $('#select-'+key).attr('disabled', false);	
}


module_multiadm.mapunit_interaction = function() {

	//Map unit 'onclick' events
	g.module_colorscale.mapunitlist.forEach(function(unit,unitnum) {  //unit = Cases, Deaths, IncidenceProp, MortalityProp, Completeness
		$('#'+unit).on('click',function(){   
			if (!($('#'+unit).hasClass('on'))) {
				$('.button_mapunit').removeClass('on');
				$('#'+unit).addClass('on');
				g.module_colorscale.mapunitcurrent = unit;
				changeMapUnit(unit);
			};
		});
	});

	changeMapUnit = function(unit) {

		if ($('#'+unit).hasClass('on')) {

			// Saves last disease displayed when 'Completeness' is selected
			if (g.module_colorscale.mapunitcurrent == 'Completeness') {
				
				$('#selectform1').val('ReversedDiverging');	
				g.module_colorscale.colorscurrent = 'ReversedDiverging';

				if (typeof g.viz_definition.disease.chart.filter() == 'string') {
		            var temp_disease = g.medical_currentdisease.substring(0,g.medical_currentdisease.length);
					g.medical_pastdisease = temp_disease;
					g.viz_definition.disease.chart.filterAll();
					g.medical_currentdisease = g.medical_pastdisease; 
				}

				$('#chart_case_ser_title').html('<b>Completeness</b>');		//Note: hard-coded chart names - case_ser, case_lin, disease, fyo
				$('#chart_case_lin_title').html('<b>Completeness</b>');	

                $('#chart-disease').addClass("noclick");
                $('#chart-fyo').addClass("noclick");

			} else if(g.module_colorscale.mapunitcurrent == 'Cases' || g.module_colorscale.mapunitcurrent == 'Deaths') {

				$('#selectform1').val('Classic');	
				g.module_colorscale.colorscurrent = 'Classic';
				if(g.viz_definition.disease && g.viz_definition.disease.chart.filter() == undefined && g.medical_currentdisease){
		            g.viz_definition.disease.chart.filter(g.medical_currentdisease);
				}

				$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_title+'</b>');		
				$('#chart_case_lin_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_title+'</b>');		

				$('#chart-disease').removeClass("noclick");
				$('#chart-fyo').removeClass("noclick");

			} else if(g.module_colorscale.mapunitcurrent == 'IncidenceProp' || g.module_colorscale.mapunitcurrent == 'MortalityProp'){

				$('#selectform1').val('Classic');	
				g.module_colorscale.colorscurrent = 'Classic';
	            if(g.viz_definition.disease && g.viz_definition.disease.chart.filter() == undefined && g.medical_currentdisease){
		            g.viz_definition.disease.chart.filter(g.medical_currentdisease);
				}
				
				if (g.module_lang.text[g.module_lang.current].chart_case_ser_imr_title) {
					$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_imr_title+'</b>');		
				} else {
					$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_title+'</b>');
				}

				if (g.module_lang.text[g.module_lang.current].chart_case_lin_imr_title) {
					$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_imr_title+'</b>');		
				} else {
					$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_title+'</b>');
				}
				
				$('#chart-disease').removeClass("noclick");
				$('#chart-fyo').removeClass("noclick");
				dc.redrawAll(); 
          	}

          	if (g.dev_defined.incompatible_buttons) {
	          	for (var btn_set of g.dev_defined.incompatible_buttons) {
	          		$('#map-'+btn_set.geo+'-btn').attr('disabled', false);  //default - don't disable button
	          		if (btn_set.unit==unit) {
	          			$('#map-'+btn_set.geo+'-btn').attr('disabled', true);
	          			break;
	          		};
	          	};
	        };

          	module_colorscale.changeMapColors();
			module_colorscale.lockcolor('Manual');

			$('#map-unit').html(g.module_lang.text[g.module_lang.current].map_unit_title[g.module_colorscale.mapunitcurrent]);  //map title
		}

	};
};



module_multiadm.getTopLayer = function() {
	var name='';
	for (var lyr in g.viz_layer_pos) {
    	if (g.viz_layer_pos[lyr]=='0') {
    		name = lyr;
    	}
    } 
    return name;
}

//check whether lyr1 and lyr2 are siblings in tree structure of map layers - return true or false
module_multiadm.isSibling = function(lyr1, lyr2) {
	var lyrpos1 = g.viz_layer_pos[lyr1];
	var depth1 = lyrpos1.split(".").length;
	var branch1 = lyrpos1.substring(0, lyrpos1.lastIndexOf("."));
	var lyrpos2 = g.viz_layer_pos[lyr2];
	var depth2 = lyrpos2.split(".").length;
	var branch2 = lyrpos2.substring(0, lyrpos2.lastIndexOf("."));
	var isSibling = false;

	var cond_0 = (lyr1!=lyr2);						//not the same layer
	var cond_1 = (depth1==depth2);					//layers have same depth
    var cond_2 = (branch1==branch2);				//layers have same leading branch

    return cond_0 && cond_1 && cond_2;
};

//check whether lyr has siblings in tree structure of map layers - return true or false
module_multiadm.hasSiblings = function(lyr1) {
	var hasSiblings = false;

	for (var lyr2 in g.viz_layer_pos) {
	    if (module_multiadm.isSibling(lyr1, lyr2)) {
	    	hasSiblings = true;
	    	break;
	    }
	};  

	return hasSiblings;
};

//return array of siblings in tree structure of map layers - returns array of 
module_multiadm.getSiblings = function(lyr1) {
	var siblings = [];

	for (var lyr2 in g.viz_layer_pos) {
		if (module_multiadm.isSibling(lyr1, lyr2)) {
			siblings.push(lyr2);
		}
	};  

	return siblings;
};

module_multiadm.getChildren = function(lyr) {
	var lyrpos1 = g.viz_layer_pos[lyr];
	var depth1 = lyrpos1.split(".").length;
	var children = [];

	for (var lyr2 in g.viz_layer_pos) {
		var depth2 = g.viz_layer_pos[lyr2].split(".").length;
		var branch2 = g.viz_layer_pos[lyr2].substring(0, g.viz_layer_pos[lyr2].lastIndexOf("."));

		var cond_0 = (depth1==depth2 - 1);		//lyr2 is one level deeper
	    var cond_1 = (lyrpos1==branch2);		//lyr2's leading branch is the same as lyr

	    if (cond_0 && cond_1) {
	    	children.push(lyr2);
	    }
	};    

	return children;
}

//check whether lyr has children in tree structure of map layers - return true or false
module_multiadm.hasChildren = function(lyr) {
	var hasChildren = false;

	if (module_multiadm.getChildren(lyr).length>0) {
		hasChildren = true;
	}

	return hasChildren;
}


module_multiadm.isParent = function(lyr) {
	var lyrpos1 = g.viz_layer_pos[lyr];
	var depth1 = lyrpos1.split(".").length;
	var isParent = false;

	for (var lyr2 in g.viz_layer_pos) {
		var depth2 = g.viz_layer_pos[lyr2].split(".").length;
		var branch2 = g.viz_layer_pos[lyr2].substring(0, g.viz_layer_pos[lyr2].lastIndexOf("."));

		var cond_0 = (depth1==depth2-1);
		var cond_1 = (branch2==lyrpos1);

		if (cond_0 && cond_1) {
	    	isParent = true;
	    	break;
	    }
	}

	return isParent;
}

//returns parent of layer in tree structure of map layers (string) - note there can only be 1 parent
module_multiadm.getParent = function(lyr) {
	var lyrpos1 = g.viz_layer_pos[lyr];
	var parent = '';

	if (lyrpos1!=0) {  //if layer is not top layer
		for (var lyr2 in g.viz_layer_pos) {
			if (g.viz_layer_pos[lyr2] == lyrpos1.substring(0, lyrpos1.lastIndexOf("."))) {
				parent = lyr2;
				break;
			}
		}
	}

	return parent;
}