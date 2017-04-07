/*------------------------------------------------------------------------------------
    MSF Dashboard - module-intro.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file gives the necessary instructions to setup the interactive help, using intro.js.
 * @since 0.5
 * @module module:module_intro
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 * @requires lang/main-core.js
 * @requires lang/module-interface.js
 **/
var module_intro = {};
/*------------------------------------------------------------------------------------
	Components:
	0) Setup
------------------------------------------------------------------------------------*/

modules_list.intro = true;

/**
 * Stores all the global variables used by the {@link module:module_intro}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_intro
 */
g.module_intro = {};

/**
 * Defines and populates the intro.js instance.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:g.viz_keylist}</li>
 *  <li>{@link module:g.viz_definition} - <code>display_intro</code> and <code>display_idcontainer</code></li>
 * </ul>
 * Returns:
 * <ul>
 *  <li>{@link module:module_intro.definition}</li>
 *  <li>{@link module:module_intro.step}</li>
 * </ul>
 * <br> Triggered by the end of {@link module:main_core~generateDashboard}.
 * @type {Function}
 * @method
 * @alias module:module_intro.setup
 */
module_intro.setup = function() {

    /**
    interface_menuinteractions defs
    interface_buttoninteraction x2

     * Contains the intro.js instance, which will be populated by steps from: {@link module:module_intro.step}.
     * <br> Defined in {@link module:module_intro.setup}.
     * @type {Object}
     * @constant
     * @alias module:module_intro.definition
     */
	g.module_intro.definition = introJs();


    /**
     * Contains the steps details for the intro.js instance.
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:module_lang.text}</li>
     *  <li>{@link module:module_lang.current}</li>
     *  <li>{@link module:g.viz_keylist}</li>
     *  <li>{@link module:g.viz_definition} - <code>display_intro</code> and <code>display_idcontainer</code></li>
     * </ul>
     * <br> Defined in {@link module:module_intro.setup}.
     * @type {Object}
     * @constant
     * @alias module:module_intro.step
     */
	g.module_intro.step = {};
    //console.log("Setting up g.module_intro.step");
	/*var steps = [{
			  	//element: '#title',
                intro: g.module_lang.text[g.module_lang.current].intro_intro,
				//intro: '<div style="width: 500px; font: 14px sans-serif;">' + g.module_lang.text[g.module_lang.current].intro_intro + '</div>',
                //position: 'bottom'
			  }];*/

    

    if (g.new_layout) {
        var keynum = 0;
        for (i=0; i<= g.dev_defined.intro_order.length-1; i++) {

            //console.log(i, g.dev_defined.intro_order[i]);

            if (i==0) {
                var steps = [{
                    element: g.dev_defined.intro_order[0],
                    intro: g.module_lang.text[g.module_lang.current].intro_intro,
                    //position: 'bottom'
                  }];
                  //keynum++;
                  //g.module_intro.step['lateral'] = keynum;
                  //console.log(i, "=0", g.dev_defined.intro_order[i]);
            } else if (g.dev_defined.intro_order[i]=='menu') {
                steps.push({
                    element: g.dev_defined.intro_order[i],
                    intro: g.module_lang.text[g.module_lang.current]['intro_'+g.dev_defined.intro_order[i]],
                    //position: 'right'
                });
                keynum++;
                //g.module_intro.step['lateral'] = keynum;
                //console.log(i, "=1", g.dev_defined.intro_order[i]);
            } else {
                // now 2 techniques for declaring intro elements:
                //  1. defined within g.viz_definition in dev-defined.js as .display_intro_container, display_intro_position, text defined in module-lang.js
                //  2. defined by g.dev_defined.intro_order where element not found as a chart, so is assumed to be a container; position defined by g.dev_defined.intro_position; text defined in module-lang.js

                var def = false;
                //1. if there is chart with this name
                for (var chart_name in g.viz_definition) {
                //for (j=0; j<= g.viz_definition.length; j++) {
                    //console.log(chart_name, g.viz_definition[chart_name]);
                    if (chart_name==g.dev_defined.intro_order[i]) {
                        //console.log("intro for chart: ", chart_name, g.viz_definition[chart_name], " = ", g.dev_defined.intro_order[i]);
                        if (g.viz_definition[chart_name].display_intro_container) {
                            var element = '#' + g.viz_definition[chart_name].display_intro_container;
                        } else {
                            var element = '#chart-'+ chart_name;
                        }
                        //console.log("element = ", element);
                        var intro = g.module_lang.text[g.module_lang.current]['intro_'+chart_name];
                        var position = g.viz_definition[chart_name].display_intro_position;
                        def = true;
                        break;
                    }
                };

                //2. if there is a container with this name then select that
                if (def==false) {
                    //console.log("intro for container: ", g.dev_defined.intro_order[i]);
                    //console.log(g.dev_defined.intro_position[g.dev_defined.intro_order[i]]);
                    var element = '#'+ g.dev_defined.intro_order[i];
                    var intro = g.module_lang.text[g.module_lang.current]['intro_'+g.dev_defined.intro_order[i]];
                    for (j=0; j<=g.dev_defined.intro_position.length-1; j++) {
                        if (g.dev_defined.intro_position[j].container==g.dev_defined.intro_order[i]) {
                            var position = g.dev_defined.intro_position[j].position;
                            def = true;
                            break;
                        }
                    }      
                };    

                if (def==false) {
                    console.log("ERROR: Cannot find this div for intro.js Help");
                }     
                
                keynum++;
                //console.log(g.dev_defined.intro_order[i], keynum);
                g.module_intro.step[g.dev_defined.intro_order[i]] = keynum;
                //console.log(key, keynum);
                steps.push({
                        element: element,
                        intro: intro,
                        position: position,
                });
                //console.log("in g.module_intro.step: ", element, steps);
                //console.log("in g.module_intro.step: ", element, keynum, position);
                //console.log(i, g.dev_defined.intro_order[i]);
    
            }  

        } 
            
    }

    if (!(g.new_layout)) {
        var steps = [{
                //element: '#title',
                intro: g.module_lang.text[g.module_lang.current].intro_intro,
                //intro: '<div style="width: 500px; font: 14px sans-serif;">' + g.module_lang.text[g.module_lang.current].intro_intro + '</div>',
                //position: 'bottom'
              }];
        var keynum = 0;
    	g.viz_keylist.forEach(function(key){
            //console.log(keynum, key, g.viz_definition[key].display_intro_position);
            if(!(g.viz_definition[key].display_intro == 'none')){
                //console.log(keynum, key, g.viz_definition[key].display_intro, " != none");
                if(g.viz_definition[key].display_idcontainer){
                    var element = '#' + g.viz_definition[key].display_idcontainer;
                }else{
                    var element = '#chart-'+key;
                }
                keynum++;
                g.module_intro.step[key] = keynum;
                //console.log(key, keynum);
                steps.push({
                        element: element,
                        intro: g.module_lang.text[g.module_lang.current]['intro_'+key],
                        position: g.viz_definition[key].display_intro
                });
                //console.log("in g.module_intro.step: ", element, steps);
                //console.log("in g.module_intro.step: ", element, g.viz_definition[key].display_intro);
            }
    	});
    };
    
    //console.log("steps: ", steps);
    
	g.module_intro.definition.setOptions({
			steps: steps 
		});

    if (g.new_layout) {        
        g.module_intro.definition.onbeforechange(function(element){
            /*console.log("help element = ", element.id);
            if ((element.id=='containter_casedeath_ser') || (element.id=='container_rangechart') || (element.id=='containter_bar_lin')) {
                //alert("CLICK BY AGE GROUP");
                $('#containter_ser-tab').click();
            };
            if (element.id=='container_casedeath_lin') {
                //alert("CLICK BY YEAR");
                $('#containter_lin-tab').click();
            };
            if (element.id=='chart-fyo') {
                $('#containter_ser-tab').click();
            };*/

            for (i=0; i<=g.dev_defined.intro_beforechange.length-1; i++) {
                //console.log(i, g.dev_defined.intro_beforechange[i]);
                if (element.id==g.dev_defined.intro_beforechange[i].element) {
                    $(g.dev_defined.intro_beforechange[i].click).click();
                    //console.log(g.dev_defined.intro_beforechange[i].element, g.dev_defined.intro_beforechange[i].click);
                }
            }
        });

    }

}