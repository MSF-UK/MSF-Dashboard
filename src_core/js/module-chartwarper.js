/*------------------------------------------------------------------------------------
    MSF Dashboard - module-chartwarper.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file gives the necessary instructions to setup a 'chartwarper' (puts charts containers behind buttons or under tabs). It requires g.new_layout.
 * <br>
 * 'index.html' must be adapted accordingly.
 * @since 0.7
 * @module module:module_chartwarper
 * @requires index.html
 * @requires dev/dev-defined.js
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
if(!g.module_chartwarper){
    g.module_chartwarper = {}; 
}

// 1) Display
//------------------------------------------------------------------------------------
/**
 * Defines the buttons/tabs layout.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 * </ul>
 * <br> Triggered by the end of {@link module:main_core~generateDashboard}.
 * @param {String} container_id Typically: {@link g.module_chartwarper.container_btns_id}
 * @param {Array} containers_list Typically: {@link g.module_chartwarper.container_chartlist}
 * @method
 * @type {Function}
 * @alias module:module_chartwarper.display
 */
module_chartwarper.display = function(container_id, containers_list) {

	var html = '<div>';
	html += '<big><b><span id="chart_case_ser_title">'+g.module_lang.text[g.module_lang.current]['chart_case_ser_title']+'</span></b></big>';
	    		
	containers_list.forEach(function(key,keynum){
		if (keynum == 0) {
			var btn_status ='new_active-cw';
		} else {
			var btn_status ='new_inactive-cw';
		}
		html +=  '<div id="'+key.container+'-btn" class="'+btn_status+' new_btn-cw">';					
		html +=  g.module_lang.text[g.module_lang.current]['chartwarper_btn_'+key.container];	//button title							
		html +=  '</div>';
	});
	html += '</div>';

	$('#' + container_id).html(html);
}

/**
 * Defines the buttons/tab interactions (show/hide containers).
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
	
	// Buttons/tabs Interactions
	//------------------------------------------------------------------------------------

	// Initialisations tabs (maps draw order)
	chartcontainers_list.forEach(function(key,keynum){
		$('#'+key.container).addClass('chart_container-cw');
		if (keynum == 0) {
			$('#'+key.container).css('display', 'inline');
		} else {
			$('#'+key.container).css('display', 'none');
		}
	});

	// Initialisations zoom/jumpto dropdown lists common variables
	/**
	 * Stores the current tab name.
     * <br> Defined in {@link module:module_chartwarper.interaction}.
	 * @type {String} 
	 * @alias module:module_chartwarper.tabcurrent
	 */

	g.module_chartwarper.btncurrent = chartcontainers_list[0].container;
	g.module_chartwarper.btncurrentnum = 0;


	/**
	 * Stores the current button/tab number.
     * <br> Defined in {@link module:module_chartwarper.interaction}.
	 * @type {Integer} 
	 * @alias module:module_chartwarper.tabcurrentnum
	 */

	// Tabs 'onclick' events

	chartcontainers_list.forEach(function(key1,key1num){
	
		$('#'+key1.container+'-btn').on('click',function(){ 
      
		    if (!(g.module_chartwarper.btncurrent == key1.container)) {
		    	var filter_html = $('#' + key1.container +'_filter').html();

		    	// Temporarily store previous btn keys
		    	var key0 = g.module_chartwarper.btncurrent;
		    	var key0num = g.module_chartwarper.btncurrentnum;

		        // Swich current displayed chart container in global variable
		        g.module_chartwarper.btncurrent = key1.container;
				g.module_chartwarper.btncurrentnum = key1num;
			
				$('#'+key0+'-btn').removeClass('new_active-cw');
		        $('#'+key0+'-btn').addClass('new_inactive-cw');
		        $('#'+key0).css('display', 'none');		
		        $('#'+key1.container+'-btn').removeClass('new_inactive-cw');
		        $('#'+key1.container+'-btn').addClass('new_active-cw');
		        $('#'+key1.container).css('display', 'inline');	

		        $('#'+g.module_chartwarper.container_allcharts_id).css('height', chartcontainers_list[key1num].height);	
		    };          
		})   	
	});	

}