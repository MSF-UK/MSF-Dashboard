/*------------------------------------------------------------------------------------
    MSF Dashboard - module-chartwarper.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file gives the necessary instructions to setup a 'chartwarper' (puts charts containers under tabs).
 * <br>
 * 'index.html' must be adapted accordingly.
 * @since 0.7
 * @module module:module_chartwarper
 * @requires index.html
 * @requires dev/dev-defined.js
 * @todo Put 'tabcontainer_id' and 'chartcontainers_list' in dev-defined.js.
 * @todo Checks if 'tabcontainer_id' or 'chartcontainers_list' is empty.
 **/
 var module_chartwarper = {};
/*------------------------------------------------------------------------------------
	Components:
	0) Setup
	1) Display
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.chartwarper = true;

/**
 * Stores all the global variables used by the {@link module:module_chartwarper}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_chartwarper
 */
g.module_chartwarper = {};

// 1) Display
//------------------------------------------------------------------------------------
/**
 * Stores the id of the tabs container.
 * <br> Defined in {@link module:module_datatable.setup}.
 * @type {String} 
 * @alias module:module_chartwarper.tabcontainer_id
 */
g.module_chartwarper.tabcontainer_id = 'containter_bar_lin_tabs';			//default value
if (g.dev_defined.tabcontainer_id) {
	g.module_chartwarper.tabcontainer_id = g.dev_defined.tabcontainer_id;	//HEIDI - can be overwritten in dev_defined.js
}

/**
 * Stores the names of the charts/containers to warp behind tabs.
 * <br> Defined in {@link module:module_datatable.setup}.
 * @type {Array} 
 * @alias module:module_chartwarper.chartcontainers_list
 */
g.module_chartwarper.chartcontainers_list = ['containter_bar','containter_lin'];  	//default value
if (g.dev_defined.chartcontainers_list) {
	g.module_chartwarper.chartcontainers_list = g.dev_defined.chartcontainers_list;	//HEIDI - can be overwritten in dev_defined.js
} 
//g.module_chartwarper.chartcontainers_list = ['containter_ser','containter_lin'];   //HEIDI - added 'containter_ser', removed 'containter_bar'
//g.module_chartwarper.chartcontainers_list = g.dev_defined.chartcontainers_list;



/**
 * Defines the tabs layout.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 * </ul>
 * <br> Triggered by the end of {@link module:main_core~generateDashboard}.
 * @param {String} tabcontainer_id Typically: {@link g.module_chartwarper.tabcontainer_id}
 * @param {Array} chartcontainers_list Typically: {@link g.module_chartwarper.chartcontainers_list}
 * @method
 * @type {Function}
 * @alias module:module_chartwarper.display
 */
module_chartwarper.display = function(tabcontainer_id,chartcontainers_list) {

	if (g.new_layout) {
		var html = '<div>';
		html += '<big><b><span id="chart_case_ser_title">'+g.module_lang.text[g.module_lang.current]['chart_case_ser_title']+'</span></b></big>';    //HEIDI - ***need to alternate with '<span id="chart_case_lin_title"></span>'
		//console.log("chartcontainers_list: ", chartcontainers_list);
		chartcontainers_list.forEach(function(key,keynum){
			//console.log(key, keynum);
			if (keynum == 0) {
				var tab_status ='new_active-cw';
			} else {
				var tab_status ='new_inactive-cw';
			}
			html +=  '<div id="'+key.container+'-tab" class="'+tab_status+' new_tab-cw">';
			
			// Tab title
			if (g.new_layout) {
				html +=  g.module_lang.text[g.module_lang.current]['chartwarper_tab_'+key.container];
			} else {
				html +=  g.module_lang.text[g.module_lang.current]['chartwarper_tab_'+key.container];
			}
							
			html +=  '</div>';
		});
		html += '</div>';

	} else {

		var html = '<div>';
		chartcontainers_list.forEach(function(key,keynum){
			if (keynum == 0) {
				var tab_status ='active-cw';
			} else {
				var tab_status ='inactive-cw';
			}
			html +=  '<div id="'+key+'-tab" class="'+tab_status+' tab-cw">';
			
			// Tab title
			if (g.new_layout) {
				html +=  '<b><big>'+g.module_lang.text[g.module_lang.current]['chartwarper_tab_'+key]+'</big></b>';
			} else {
				html +=  g.module_lang.text[g.module_lang.current]['chartwarper_tab_'+key];
			}
							
			html +=  '</div>';
		});
		html += '</div>';
	}

	$('#' + tabcontainer_id).html(html);
}

/**
 * Defines the tab interactions (show/hide containers).
 * <br>
 * Returns:
 * <ul>
 *  <li>{@link module:module_chartwarper.tabcurrent}</li>
 *  <li>{@link module:module_chartwarper.tabcurrentnum}</li>
 * </ul>
 * <br> Triggered by the end of {@link module:main_core~generateDashboard}.
 * @param 
 * @method
 * @type {Function}
 * @alias module:module_chartwarper.interaction
 */
module_chartwarper.interaction = function(chartcontainers_list) {
	
	// Tabs Interactions
	//------------------------------------------------------------------------------------

	// Initialisations tabs (maps draw order)
	if (g.new_layout) {
		chartcontainers_list.forEach(function(key,keynum){
			$('#'+key.container).addClass('chart_container-cw');
			if (keynum == 0) {
				$('#'+key.container).css('display', 'inline');
			} else {
				$('#'+key.container).css('display', 'none');
			}
		});
	} else {
		chartcontainers_list.forEach(function(key,keynum){
			$('#'+key).addClass('chart_container-cw');
			if (keynum == 0) {
				$('#'+key).css('display', 'inline');
			} else {
				$('#'+key).css('display', 'none');
			}
		});
	}

	// Initialisations jumpto dropdown lists common variables
	/**
	 * Stores the current tab name.
     * <br> Defined in {@link module:module_chartwarper.interaction}.
	 * @type {String} 
	 * @alias module:module_chartwarper.tabcurrent
	 */
	if (g.new_layout) {
		g.module_chartwarper.tabcurrent = chartcontainers_list[0].container;
	} else {
		g.module_chartwarper.tabcurrent = chartcontainers_list[0];
	}
	//g.module_chartwarper.tabcurrent = chartcontainers_list[0];

	/**
	 * Stores the current tab number.
     * <br> Defined in {@link module:module_chartwarper.interaction}.
	 * @type {Integer} 
	 * @alias module:module_chartwarper.tabcurrentnum
	 */
	g.module_chartwarper.tabcurrentnum = 0;

	// Tabs 'onclick' events

	if (g.new_layout) {

		chartcontainers_list.forEach(function(key1,key1num){
		
			$('#'+key1.container+'-tab').on('click',function(){ 
				//console.log("key1 on tab: ", key1.container);
	      
			    if (!(g.module_chartwarper.tabcurrent == key1.container)) {
			    	var filter_html = $('#' + key1.container +'_filter').html();

			    	// Temporarily store previous tab keys
			    	var key0 = g.module_chartwarper.tabcurrent;
			    	var key0num = g.module_chartwarper.tabcurrentnum;

			        // Swich current displayed chart container in global variable
			        g.module_chartwarper.tabcurrent = key1.container;
					g.module_chartwarper.tabcurrentnum = key1num;

					
					$('#'+key0+'-tab').removeClass('new_active-cw');
			        $('#'+key0+'-tab').addClass('new_inactive-cw');
			        $('#'+key0).css('display', 'none');		
			        $('#'+key1.container+'-tab').removeClass('new_inactive-cw');
			        $('#'+key1.container+'-tab').addClass('new_active-cw');
			        $('#'+key1.container).css('display', 'inline');	

			        //console.log(g.dev_defined.epiweek_container_id, chartcontainers_list[key1num].height);
			        $('#'+g.dev_defined.epiweek_container_id).css('height', chartcontainers_list[key1num].height);	
			    };          
			})   	
		});	




	} else {
	chartcontainers_list.forEach(function(key1,key1num){
		
		$('#'+key1+'-tab').on('click',function(){ 
			console.log("key1 on tab: ", key1);
      
		    if (!(g.module_chartwarper.tabcurrent == key1)) {
		    	var filter_html = $('#' + key1 +'_filter').html();

		    	// Temporarily store previous tab keys
		    	var key0 = g.module_chartwarper.tabcurrent;
		    	var key0num = g.module_chartwarper.tabcurrentnum;

		        // Swich current displayed chart container in global variable
		        g.module_chartwarper.tabcurrent = key1;
				g.module_chartwarper.tabcurrentnum = key1num;

				if (g.new_layout) {
					$('#'+key0+'-tab').removeClass('new_active-cw');
			        $('#'+key0+'-tab').addClass('new_inactive-cw');
			        $('#'+key0).css('display', 'none');		
			        $('#'+key1+'-tab').removeClass('new_inactive-cw');
			        $('#'+key1+'-tab').addClass('new_active-cw');
			        $('#'+key1).css('display', 'inline');	

			        console.log(g.module_chartwarper.epiweek_container_id);
			        if (key1=="containter_ser") { 
			        	$('#'+g.dev_defined.epiweek_container_id).css('height', '600px');
			        } else if (key1=="containter_lin") {
			        	$('#'+g.dev_defined.epiweek_container_id).css('height', '400px');
			        }
				} else {
			        $('#'+key0+'-tab').removeClass('active-cw');
			        $('#'+key0+'-tab').addClass('inactive-cw');
			        $('#'+key0).css('display', 'none');		
			        $('#'+key1+'-tab').removeClass('inactive-cw');
			        $('#'+key1+'-tab').addClass('active-cw');
			        $('#'+key1).css('display', 'inline');	
			    }	
		    };          
		})   	
	});	
	};
}