/*------------------------------------------------------------------------------------
	MSF Dashboard - module-colorscale.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file enables the colorscale module that managers all the aspects related to data representation on the map.
 * @since 0.6
 * @module module:module_colorscale
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 * @requires lang/main-core.js
 * @requires lang/module-interface.js
 * @todo Create presets.
 * @todo Limit dependency to module_multiadm.
 **/
var module_colorscale = {};
/*------------------------------------------------------------------------------------	
	Components:
	0) Setup /!\ USER DEFINED ELEMENTS
	1) Display
	2) Interaction
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.colorscale = true;

/**
 * Stores all the global variables used by the {@link module:module_colorscale}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_colorscale
 */
if(!g.module_colorscale){
    g.module_colorscale = {}; 
}

/**
 * Contains the name of the map unit currently in use. Picked from {@link module:module_colorscale.mapunitlist}.
 * <br> Used in:
 <ul>
 	<li>{@link module:module_colorscale}</li>
 	<li>{@link module:main_core}</li>
 	<li>{@link module:module_interface}</li>
 	<li>{@link module:module_multiadm}</li>
 </ul>
 * <br> Defined in {@link module:module_colorscale}.
 * @type {String}
 * @constant
 * @alias module:module_colorscale.mapunitcurrent
 */
g.module_colorscale.mapunitcurrent = 'Cases';

// Adjust type

/**
 * Contains the list of mode of colorscale automatic adjusting to current data. 'Auto' is whenever a filtering event is triggered by the user (or as a consequence of an other action in some cases where apropriate), 'Manual' is only when the user clicks on the colorlock button of the map.
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Array.<String>}
 * @constant
 * @alias module:module_colorscale.modelist
 */
g.module_colorscale.modelist = ['Auto'/*,'Presets'*/,'Manual'];

/**
 * Contains mode of colorscale automatic adjusting to current data. Picked from {@link module:module_colorscale.modelist}.
 * <br> Used in:
  <ul>
 	<li>{@link module:module_colorscale}</li> 
 	<li>{@link module:main_core}</li>
 	<li>{@link module:module_interface}</li>
 </ul>
 * <br> Defined in {@link module:module_colorscale}.
 * @type {String}
 * @constant
 * @alias module:module_colorscale.modecurrent
 */
g.module_colorscale.modecurrent = 'Auto';

/**
 * Contains default limits of colorscale categories. Currently only used for initialization...
 * <br>
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Object.<Array>}
 * @constant
 * @alias module:module_colorscale.values
 * @todo Replace with presets?
 */
g.module_colorscale.values = {
	cases: ['NA',0,50,100,250,500,500]
};

/**
 * Contains the current limits of colorscale categories. Populated by {@link module:module_colorscale.lockcolor}.
 * <br>
 * Initialized with {@link module:module_colorscale.values}.
 * <br> Used in:
  <ul>
 	<li>{@link module:module_colorscale}</li> 
 	<li>{@link module:main_core}</li>
 </ul>
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Object}
 * @constant
 * @alias module:module_colorscale.valuescurrent
 */
g.module_colorscale.valuescurrent = g.module_colorscale.values.cases;

/**
 * Contains different sets of hexadecimal color values.
  * <br> Used in:
  <ul>
 	<li>{@link module:module_colorscale}</li> 
 	<li>{@link module:main_core}</li>
 </ul>
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Object.<Array>}
 * @constant
 * @alias module:module_colorscale.colors
 */
g.module_colorscale.colors = {
	Classic: ['#DDDDDD','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15','#fee5d9'],
	Diverging: ['#DDDDDD','#1a9641','#a6d96a','#ffffbf','#fdae61','#d7191c'],
	Qualitative: ['#DDDDDD','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33'], 
	ReversedDiverging: ['#DDDDDD','#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641'],
};

/**
 * Contains the list of sets of hexadecimal color values from {@link module:module_colorscale.colors}.
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Array}
 * @constant
 * @alias module:module_colorscale.colorslist
 */
g.module_colorscale.colorslist = Object.keys(g.module_colorscale.colors);

/**
 * Contains the set of hexadecimal color values currently in use. Picked from {@link module:module_colorscale.colorlist}.
 * <br> Used in:
  <ul>
 	<li>{@link module:module_colorscale}</li> 
 	<li>{@link module:main_core}</li>
 </ul>
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Object}
 * @constant
 * @alias module:module_colorscale.colorscurrent
 */
g.module_colorscale.colorscurrent = 'Classic';

/**
 * Contains the list of limits of colorscale categories calculation methods (from geostats.js).
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Object}
 * @constant
 * @alias module:module_colorscale.scaletypelist
 */
g.module_colorscale.scaletypelist = ['Jenks','EqInterval'/*,'StdDeviation'*/,'ArithmeticProgression','GeometricProgression','Quantile'];

/**
 * Contains the limits of colorscale categories calculation methods currently in use. Picked from {@link module:module_colorscale.scaletypelist}.
 * <br> Defined in {@link module:module_colorscale}.
 * @type {Object}
 * @constant
 * @alias module:module_colorscale.scaletypecurrent
 */
g.module_colorscale.scaletypecurrent = 'Jenks';


// 1) Display
//------------------------------------------------------------------------------------
/**
 * Creates the interface so the user can switch between:
 <ul>
 	<li>'mapunits' {@link module:module_colorscale.mapunitcurrent}</li>
 	<li>'auto-adjustment modes' {@link module:module_colorscale.modecurrent}</li>
 	<li>'color tones' {@link module:module_colorscale.colorscurrent}</li>
 	<li>'categories limits computation modes' {@link module:module_colorscale.scaletypecurrent}</li>
 </ul>
 Returns the html code as a string.
 <br>
 Reactions to changes are defined in {@link module:module_colorscale.interaction}.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:g.medical_datatype}</li>
 *  <li>{@link module:module_colorscale.mapunitlist}</li>
 *  <li>{@link module:module_colorscale.mapunitcurrent}</li>
 *  <li>{@link module:module_colorscale.modelist}</li>
 *  <li>{@link module:module_colorscale.modecurrent}</li>
 *  <li>{@link module:module_colorscale.colorslist}</li>
 *  <li>{@link module:module_colorscale.colorscurrent}</li>
 *  <li>{@link module:module_colorscale.scaletypelist}</li>
 *  <li>{@link module:module_colorscale.scaletypecurrent}</li>
 * </ul>
 * <br> Triggered in {@link module:module_interface~buttoninteraction}.
 * @type {Function}
 * @method
 * @alias module:module_colorscale.display
 */
module_colorscale.display = function() {
	//console.log("module_colorscale.display being run");

	// Title
	var html = '<div><p><b>'+g.module_lang.text[g.module_lang.current].colorscale_title+'</b></p>';
	
	//if(g.medical_datatype == 'surveillance'){html += '<div class="col-md-4">';}
	html += '<div class="col-md-4">';

	// Unit
	html += '<p><table style="font-size:1em;">';

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
		
	html +=	'</table></p>';
	
	//if(g.medical_datatype == 'surveillance'){html += '</div><div class="col-md-4">';}
	html += '</div><div class="col-md-4">';

	// Colorscale mode
	html += '<p><table style="font-size:1em;">';

	g.module_colorscale.modelist.forEach(function(mode,modenum) {
		if(modenum == 0){
			var text = g.module_lang.text[g.module_lang.current].colorscale_modeintro;
		}else{
			var text = '';
		}
		if(mode == g.module_colorscale.modecurrent){
			html += '<tr><td>'+text+' </td><td><input type="radio" name="group2" id="'+mode+'" value='+modenum+' checked> '+mode+'</td></tr>';
		}else if(mode == 'Presets'){
			html += '<tr><td>'+text+'</td><td><input type="radio" name="group2" id="'+mode+'" value='+modenum+' disabled=true> '+mode+'</td></tr>';
		}else{
			html += '<tr><td>'+text+'</td><td><input type="radio" name="group2" id="'+mode+'" value='+modenum+'> '+mode+'</td></tr>';
		}
	});

	html +=	'</table></p>';

	//if(g.medical_datatype == 'surveillance'){html += '</div><div class="col-md-4">';}
	html += '</div><div class="col-md-4">'

	// Colors and intervals
	html += '<p>'+g.module_lang.text[g.module_lang.current].colorscale_choosecolor+'<select class="select-cs" id="selectform1">';
	html +='<option value="'+g.module_colorscale.colorscurrent+'">'+g.module_colorscale.colorscurrent+'</option>';
	g.module_colorscale.colorslist.forEach(function(f){
		if (f!==g.module_colorscale.colorscurrent) {html +='<option value="'+f+'">'+f+'</option>';};
	});
	html +='</p></select>';

	html += '<p>'+g.module_lang.text[g.module_lang.current].colorscale_choosetype+'<select class="select-cs" id="selectform2">';
	html +='<option value="'+g.module_colorscale.scaletypecurrent+'">'+g.module_colorscale.scaletypecurrent+'</option>';
	g.module_colorscale.scaletypelist.forEach(function(f){
		if (f!==g.module_colorscale.scaletypecurrent) {html +='<option value="'+f+'">'+f+'</option>';};
	});
	html +='</p></select>';

	//if(g.medical_datatype == 'surveillance'){html += '</div>';}
	html += '</div>';

	html += '</div></div>';

	return html;
}

// 2) Interaction
//------------------------------------------------------------------------------------
/**
 * Defines reactions when the user, thanks to the interface created with {@link module:module_colorscale.display}, switches between:
 <ul>
 	<li>'mapunits' {@link module:module_colorscale.mapunitcurrent}</li>
 	<li>'auto-adjustment modes' {@link module:module_colorscale.modecurrent}</li>
 	<li>'color tones' {@link module:module_colorscale.colorscurrent}</li>
 	<li>'categories limits computation modes' {@link module:module_colorscale.scaletypecurrent}</li>
 </ul>
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_colorscale.colorscurrent}</li>
 *  <li>{@link module:g.viz_definition}</li>
 *  <li>{@link module:module_colorscale.colors}</li>
 *  <li>{@link module:module_colorscale.colorscurrent}</li>
 *  <li>{@link module:module_colorscale.valuescurrent}</li>
 *  <li>{@link module:module_colorscale.mapunitcurrent}</li>
 *  <li>{@link module:module_colorscale.mapunitlist}</li>
 *  <li>{@link module:g.geometry_keylist}</li>
 *  <li>{@link module:module_colorscale.scaletypecurrent}</li>
 *  <li>{@link module:module_colorscale.modecurrent}</li>
 *  <li>{@link module:module_colorscale.modelist}</li>
 *  <li>{@link module:module_colorscale.lockcolor}</li>
 *  <li>{@link module:g.medical_currentdisease}</li>
 *  <li>{@link module:g.medical_pastdisease}</li>
 * </ul>
 * <br> Triggered in {@link module:module_interface~buttoninteraction}.
 * @type {Function}
 * @method
 * @alias module:module_colorscale.interaction
 */
module_colorscale.interaction = function(){

	// Reacts on color tone change
    $("#selectform1").on('change',function(){
		g.module_colorscale.colorscurrent = $('#selectform1').val();

		if (g.viz_definition.multiadm.display_colors) {
            var color_list = [];
            g.viz_definition.multiadm.display_colors.forEach(function(num) {
                color_list.push(g.module_colorscale.colors[g.module_colorscale.colorscurrent][num]);
            });
            var color_domain = [0,color_list.length - 1];
        }

        // Duplicate from main-core.js
	    function colorAccessor(d){
            //console.log('from module-colorscale');
	    	var col = g.module_colorscale.valuescurrent.length - 1;
	        if(d || (!(d == undefined) && g.module_colorscale.mapunitcurrent == 'Completeness')){
	            while ((d <= g.module_colorscale.valuescurrent[col]) && (col > 1)){
	                col--;
	            }
	        }else{
	            col = 0;
	        }
	        return col;
	    }

	    // Updates the map
		$('.legend').remove();
	    g.geometry_keylist.forEach(function(adm) {
	    	g.viz_definition.multiadm.charts[adm]
	    		.colors(color_list)
	    		//.valueAccessor(valueAccessor)
                .colorDomain(color_domain)
                .colorAccessor(colorAccessor); 
		    g.viz_definition.multiadm.legend[adm].addTo(g.viz_definition.multiadm.maps[adm]);
	    })
	    //console.log("ABOUT TO REDRAW ALL from module_colorscale.interaction...");
		dc.redrawAll();	
	});

    // Reacts on scale type change
	$("#selectform2").on('change',function(){
		g.module_colorscale.scaletypecurrent = $('#selectform2').val();

		// Updates the map
		module_colorscale.lockcolor(g.module_colorscale.modecurrent);	
	});

	// Reacts on automation mode change
	g.module_colorscale.modelist.forEach(function(mode){
		$('#'+mode).on('change',function(){
			if($('#'+mode).is(':checked')) {
				g.module_colorscale.modecurrent = g.module_colorscale.modelist[$('#'+mode).val()];

				if(g.module_colorscale.modecurrent == g.module_colorscale.modelist[0]){
				    $(g.module_colorscale.lockcolor_id).addClass('buttonlocked');
				}else{
				    $(g.module_colorscale.lockcolor_id).removeClass('buttonlocked'); 
				}
			}
			console.log(['mode',g.module_colorscale.modecurrent]);

			// Shouldn't we update the map?
			// module_colorscale.lockcolor(g.module_colorscale.modecurrent);
		});
	});

	// Reacts on mapunit change
	g.module_colorscale.mapunitlist.forEach(function(unit){
		$('#'+unit).on('change',function(){
			if($('#'+unit).is(':checked')) {
				g.module_colorscale.mapunitcurrent = g.module_colorscale.mapunitlist[$('#'+unit).val()];
				//console.log("SELECTED MAP PARAMETER: ", g.module_colorscale.mapunitcurrent);
				// Saves last disease displayed when 'Completeness' is selected
				if(g.module_colorscale.mapunitcurrent == 'Completeness'){
					$('#selectform1').val('ReversedDiverging');	
					g.module_colorscale.colorscurrent = 'ReversedDiverging';
					if(typeof g.viz_definition.disease.chart.filter() == 'string'){
			            var temp_disease = g.medical_currentdisease.substring(0,g.medical_currentdisease.length);
						g.medical_pastdisease = temp_disease;
						g.viz_definition.disease.chart.filterAll();
						g.medical_currentdisease = g.medical_pastdisease; 
					}

					$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_title+'</b>');		//HEIDI added
					$('#chart_case_lin_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_title+'</b>');		//HEIDI added

	                $('#chart-disease').addClass("noclick");
	                $('#chart-fyo').addClass("noclick");

				}else if(g.module_colorscale.mapunitcurrent == 'Cases' || g.module_colorscale.mapunitcurrent == 'Deaths'){
					console.log("SELECTED Cases OR Deaths: ", g.module_colorscale.mapunitcurrent);
					$('#selectform1').val('Classic');	
					g.module_colorscale.colorscurrent = 'Classic';
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

				}else if(g.module_colorscale.mapunitcurrent == 'IncidenceProp' || g.module_colorscale.mapunitcurrent == 'MortalityProp'){
					//console.log("SELECTED Incidence or Mortality: ", g.module_colorscale.mapunitcurrent);
					$('#selectform1').val('Classic');	
					g.module_colorscale.colorscurrent = 'Classic';
		            if(g.viz_definition.disease && g.viz_definition.disease.chart.filter() == undefined && g.medical_currentdisease){
			            g.viz_definition.disease.chart.filter(g.medical_currentdisease);
					}
					
					$('#chart_case_ser_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_ser_imr_title+'</b>');		//HEIDI added
					$('#chart_case_lin_title').html('<b>'+g.module_lang.text[g.module_lang.current].chart_case_lin_imr_title+'</b>');		//HEIDI added

					$('#chart-disease').removeClass("noclick");
					$('#chart-fyo').removeClass("noclick");
					dc.redrawAll(); //HEIDI ADDED TO TEST
	          	}

				$("#selectform1").change();

				// Updates the map
				module_colorscale.lockcolor('Manual');
				//console.log(['mapunit',g.module_colorscale.mapunitcurrent]);
				$('#map-unit').html(g.module_lang.text[g.module_lang.current].map_unit[g.module_colorscale.mapunitcurrent]);
			}
		});
	});
}

/**
 * Auto adjusts the categories limits of the colorscales according to:
 <ul>
 	<li>the current adm level - {@link module:module_multiadm.tabcurrent}</li>
 	<li>the current values associated to the features - {@link module:g.viz_currentvalues}</li>
 	<li>the current map unit - {@link module:module_colorscale.mapunitcurrent}</li> 
 	<li>the current medical data type - {@link module:g.medical_datatype}</li> 
 	<li>the current mode of limits computation - {@link module:module_colorscale.scaletypecurrent}</li>
 </ul>
 <br>
 * Uses geostats.js
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_colorscale.modecurrent}</li>
 *  <li>{@link module:module_multiadm.tabcurrent}</li>
 *  <li>{@link module:module_colorscale.mapunitcurrent}</li>
 *  <li>{@link module:g.medical_datatype}</li>
 *  <li>{@link module:g.viz_definition}</li>
 *  <li>{@link module:g.medical_headerlist}</li>
 *  <li>{@link module:g.viz_currentvalues}</li>
 *  <li>{@link module:module_colorscale.scaletypecurrent}</li>
 *  <li>{@link module:g.geometry_keylist}</li>
 * </ul>
 * <br> Used in:
 * <ul>
 *  <li>{@link module:main_core~onFiltered}</li>
 *  <li>{@link module:module_interface~buttoninteraction}</li>
 *  <li>{@link module:module_interface~menuinteractions}</li>
 *  <li>{@link module:module_interface.menu_reset}</li>
 *  <li>{@link module:module_multiadm.interaction_tab}</li>
 *  <li>{@link module:module_colorscale.interaction}</li>
 * </ul>
 * @type {Function}
 * @method
 * @alias module:module_colorscale.lockcolor
 * @todo Limit dependency to module_multiadm.
 */
module_colorscale.lockcolor = function(source){
	//console.log("in module_colorscale.lockcolor: ", source)
	if(source == g.module_colorscale.modecurrent || source == 'Manual'){
		//console.log("************ in lockcolor for: ", source);
		var admlevel_current = g.module_multiadm.tabcurrent.split('-')[1];
		if (g.module_colorscale.mapunitcurrent == 'Casses') {
			//console.log("lockcolor, in if");
			if(g.medical_datatype == 'surveillance'){
				var admobjects_current = g.viz_definition.multiadm.group[admlevel_current].top(Infinity);
			}else{
				var admobjects_current = g.viz_definition.multiadm.group[admlevel_current].reduceCount(function(rec) { return rec[g.medical_headerlist.admN1]; }).top(Infinity);
			}
			var admvalues_current = Object.keys(admobjects_current).map(function (key,keynum,keylist) {
				return admobjects_current[keynum].value.Values;
			});
		}else if(g.module_colorscale.mapunitcurrent == 'Completeness'){
			//console.log("lockcolor, in else if");
			var admvalues_current = [100,80,60,40,20,0];
		}else{ //} if(g.module_colorscale.mapunitcurrent == 'Incidence'){
			//console.log("lockcolor, in else");
			var admvalues_current = Object.keys(g.viz_currentvalues[admlevel_current]).map(function (key,keynum,keylist) {
				if(keynum == keylist.length - 1){
					var temp = g.viz_currentvalues[admlevel_current][key];
				}else{
					var temp = module_colorscale.nice_limits(g.viz_currentvalues[admlevel_current][key]);
				}
				return temp;
			});
			
			var admvalues_current = admvalues_current.filter(function(element) {
			  return !(isNaN(element)); // Filter div by 0
			});
		}

		var serie = new geostats();
		serie.setSerie(admvalues_current);
		function sortNumber(a,b) {
		    return a - b;
		}
		var unique_values = serie.getClassUniqueValues();
		if(g.module_colorscale.mapunitcurrent !== 'Completeness'){
			unique_values.sort(sortNumber);
		}

		var nbClass = Math.min(5,unique_values.length - 1);

		if(unique_values.length - 1 > 4){
			var serie = new geostats();
			serie.setSerie(admvalues_current);

			switch(g.module_colorscale.scaletypecurrent){
				case 'Jenks':
					var scalesvalues_current = serie.getClassJenks(nbClass);
					break;
				case 'EqInterval':
					var scalesvalues_current = serie.getClassEqInterval(nbClass);
					break;
				case 'StdDeviation':
					var scalesvalues_current = serie.getClassStdDeviation(nbClass);
					break;
				case 'ArithmeticProgression':
					var scalesvalues_current = serie.getClassArithmeticProgression(nbClass);
					break;
				case 'GeometricProgression':
					var scalesvalues_current = serie.getClassGeometricProgression(nbClass);
					break;
				case 'Quantile':
					var scalesvalues_current = serie.getClassQuantile(nbClass);
					break;
			}

			if(scalesvalues_current[0] == scalesvalues_current[1]){
				scalesvalues_current.shift();
			}
		}else if(unique_values.length > 2){
			if(unique_values[0] == unique_values[1]){
				unique_values.shift();
			}
			var scalesvalues_current = unique_values;
		}else if(unique_values.length == 2 && unique_values[0] !== 0){
			var scalesvalues_current = [0,unique_values[0]+1,unique_values[1]+1];
		}else if(unique_values.length == 1 || (unique_values.length == 2 && unique_values[0] == 0)){
			var scalesvalues_current = [0,unique_values[unique_values.length - 1]+1];
		}else{
			var scalesvalues_current = [];
		}
		//console.log("scalesvalues_current = ", scalesvalues_current);

		// Pushes values (without duplicates)
		g.module_colorscale.valuescurrent = ['NA'];
		var temp_check = {};
		scalesvalues_current.forEach(function(val){
			if(!temp_check[val]){
				g.module_colorscale.valuescurrent.push(val);
				temp_check[val] = true;
			}
		})
		//	scalesvalues_current.pop();
		$('.legend').remove();
	    //g.geometry_keylist.forEach(function(adm) {
			g.viz_definition.multiadm.charts[admlevel_current].redraw();
		    g.viz_definition.multiadm.legend[admlevel_current].addTo(g.viz_definition.multiadm.maps[admlevel_current]);
	    //})
	//console.log("g.module_colorscale.valuescurrent: ", g.module_colorscale.valuescurrent);
	//console.log("************ end of lockcolor for: ", source);
	}
}

module_colorscale.nice_limits = function(val) {
	if (val >=1 && val < 10) {
		val = parseInt(val * 10) / 10;
	}else if (val >= 10) {
		val = parseInt(val);
		var corr = Math.pow(10,val.toString().length-2);
		val = parseInt(1 + val/corr)*corr;
	}
	return val;
}
