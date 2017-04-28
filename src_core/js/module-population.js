/*------------------------------------------------------------------------------------
	MSF Dashboard - module-population.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file enables the management of multiple 'nested' administrative maps. Switching from one level to an other is made through tabs. Simple principles are fixed to facilitate browsing and avoid mis-interpretation of the maps.
 * @since X.X
 * @module module:module_population  //HEIDI - check all below
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
var module_population = {};
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

modules_list.population = true;

/**
 * Stores all the global variables used by the {@link module:module_multiadm}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_multiadm
 */
g.module_population = {};

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