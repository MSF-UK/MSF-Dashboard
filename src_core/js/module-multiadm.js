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

	var html = '<div class="col-md-12">';
		html += '<div id=buttons-multiadm></div>';
		// Title + filters
		html += '<p><b>'+g.module_lang.text[g.module_lang.current].map_title+' - <small><span id="map-unit">'+g.module_lang.text[g.module_lang.current].map_unit[g.module_colorscale.mapunitcurrent]+'</b></span></small> | '+g.module_lang.text[g.module_lang.current].filtext +' ';
		g.geometry_keylist.forEach(function(key,keynum,keylist){
			html +=  '<span id="map-'+key+'-filter"></span>';
			if (!(keynum == keylist.length - 1)) {
				html += ' >';
			}
		});
		html +='</p>';

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
	html += '</div>';

	// Maps
	html += '<div class="col-md-12 viz" style="height:425px; width:110%;">';
		g.geometry_keylist.forEach(function(key){
			html += '<div id="map-'+key+'" class="map"></div>'; 
		});
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
	console.log("ASSIGNED TABCURRENTNUM HERE: ", g.module_multiadm.tabcurrentnum);

	// Tabs 'onclick' events
	g.geometry_keylist.forEach(function(key1,key1num){

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
            if(!(loc_new == g.module_multiadm.focuscurrent[key1])){module_multiadm.zoomTo(key1,loc_new);};
            
            g.module_multiadm.focuscurrent[key1] = loc_new;

            // Initialize the next dropdown list
            var key2num = key1num + 1; 
            if(g.geometry_keylist[key2num]){
            	var key2 = g.geometry_keylist[key2num];
            	var html = '<select class="select-adm" id="select-'+key2+'">';
	            html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';   
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
		

        // Initialize first jumpto
	    var html = '<select class="select-adm" id="select-admN1">';
	    html +='<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';
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
module_multiadm.resetGoto = function(key){	  //key=adm level, e.g. admN2
	// Reset jumpto dropdown lists content
    var html = '<select class="select-adm" id="select-'+ key +'">';
    html += '<option value="NA">'+g.module_lang.text[g.module_lang.current].jumpto+'</option>';
    g.medical_loclists[key].sort().forEach(function(loc){	
        html +='<option value="'+loc+'">'+loc+'</option>';
    });
    html += '</select></div>';
    $('#map-'+key+'-jumpto').html(html);
    g.module_multiadm.focuscurrent[key] = 'NA';
}
