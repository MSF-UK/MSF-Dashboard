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
	var steps = [{
			  	element: '#title',
				intro: g.module_lang.text[g.module_lang.current].intro_intro,
				position: 'bottom'
			  }];
	var keynum = 0;
	g.viz_keylist.forEach(function(key){
        //console.log(keynum, key, g.viz_definition[key].display_intro);
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
    //console.log("steps: ", steps);

	g.module_intro.definition.setOptions({
			steps: steps
		});

}