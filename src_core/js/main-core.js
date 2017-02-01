/*------------------------------------------------------------------------------------
    MSF Dashboard - main-core.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file is the core of the dashboard. It puts together the instructions set by the use in the dev/dev-defined.js file (variable stored in <code>g</code> ie. {@link module:g} to create the charts and maps following the layout created in index.html. It uses the data loaded with the js/main-loadfiles.js module and can call additional modules such as: module-chartwarper.js, module-module-colorscale.js, module-datatable.js, module-interface.js or module-multiadm.js depending on the specific needs of the user.
 * @since 0.0
 * @module main_core
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 **/
var main_core = {};
/*------------------------------------------------------------------------------------
  Components:
    *) Checks Modules actives
    0) Setup /!\ USER DEFINED ELEMENTS
    1) DC.js Extend Domains definitions (in order to have clickable bar behavior)
    2) DC.js Charts and Maps declarations
    3) Crossfilter.js Filters definition
    4) DC.js Charts definition
    5) DC.js Maps definition
    6) Datatables.js Table definition
------------------------------------------------------------------------------------*/

/**
 * *Procedural component: should be rethought to be modular (OO programming...).*
 <br>
 * Main procedure of the main-core. Generates the charts and maps one by one from the list: {@link module:g.viz_definition} (defined by the developer in dev/devdefined.js).
 <br>
 The process contains the following steps which are performed for each chart/map:
 <ol>
    <li>Creation of *domains definitions* for x/y charts (bar charts, series...), gives the possibility to have clickable bar behavior, to manage exceptions (NAs) ... - {@link module:main_core~domainBuilder}</li>
    <li>Declares the instances of *charts and maps dc.js objects* - {@link module:main_core~chartInstancer} (not properly declared as a method...)</li>
    <li>Declares the instances of *crossfilter.js dimensions*, it correspond to the method to filter the data, to use a spreadsheet analogy, it correspond to the column that will be used to filter the dataset - {@link module:main_core~dimensionBuilder}</li>
    <li>Declares the instances of *crossfilter.js groups*, it correspond to the method to aggregate the data, counting the records for a patient list or summing a specific column for surveillance data that can contain cases, death... - {@link module:main_core~groupBuilder}</li>
    <li>Puts everything together to create the charts and maps (domains, dimensions and groups, colors, text, specific behaviors...). - {@link module:main_core~chartBuilder} (not properly declared as a method...)</li>
 </ol>
 <ul>
    <li>Finally, it synchronizes maps movements and charts, loads a bunch of modules and create quick numeric outputs to be displayed... (hem, yes quite messy).</li>
 </ul>
  <br>
 * Initiates the dashboard generation process.
 <br>
 Is triggered in {@link module:main_loadfiles~generate_display}.
 <br><br>
 * **Requires:**
 <ul>
    <li>{@link module:g.viz_definition}</li>
    <li>{@link module:g.medical_data}</li>
    <li>{@link module:g.medical_headerlist}</li>
    <li>{@link module:g.medical_read}</li>
    <li>{@link module:module_multiadm.display}</li>
    <li>{@link module:g.geometry_keylist}</li>
    <li>{@link module:module_datacheck~toTitleCase}</li>
    <li>{@link module:g.medical_datatype}</li>
    <li>{@link module:g.module_colorscale.colors}</li>
    <li>{@link module:g.module_colorscale.colorscurrent}</li>
    <li>{@link module:g.module_colorscale.mapunitcurrent}</li>
    <li>{@link module:g.module_colorscale.valuescurrent}</li>
    <li>{@link module:g.module_colorscale.modecurrent}</li>
    <li>{@link module:module_colorscale.lockcolor}</li>
    <li>{@link module:module_datatable.setup}</li>
    <li>{@link module:module_datatable.display}</li>
    <li>{@link module:module_datatable.interaction}</li>
    <li>{@link module:module_datatable.refreshTable}</li> 
    <li>{@link module:module_multiadm.interaction}</li>
    <li>{@link module:module_intro.setup}</li>
    <li>{@link module:module_interface.display}</li>
    <li>{@link module:module_chartwarper.display}</li>
    <li>{@link module:module_chartwarper.interaction}</li>
 </ul>
 * **Intermediaries:**
 <ul>
    <li>{@link module:main_core~domainBuilder}</li>
    <li>{@link module:main_core~chartInstancer} (not properly declared as a method...)</li>
    <li>{@link module:main_core~dimensionBuilder}</li>
    <li>{@link module:main_core~groupBuilder}</li>
    <li>{@link module:main_core~chartBuilder} (not properly declared as a method...)</li>
 </ul>
 * **Returns:**
 <ul>
    <li>{@link module:g.viz_keylist}</li>
    <li>{@link module:g.viz_definition} - Most of the global variables are stored there.</li>
    <li>{@link module:g.viz_currentvalues}</li>
 </ul>

 * @type {Function} 
 * @alias module:main_core~generateDashboard
 * @todo Should be broken down in smaller pieces.
 * @todo Each of the steps from 1) to x) can actually be broken down into two smaller functions 'Building' which is about defining an Object (echo to an Object 'constructor') and 'Parsing' which is attributing this object to the correct chart/map... These two steps should clearly appear and the 'Parsing' method should be improved (especially for dimensions).
 * @todo group_type == 'shared' should not exist, but should be taken from 'dimension_type' instead.
 */
function generateDashboard(){

    // *) Checks Modules actives
    //------------------------------------------------------------------------------------

	/* Not Implemented */

    // 0) Setup /!\ USER DEFINED ELEMENTS
    //------------------------------------------------------------------------------------
    
    /**
     * Lists <code>id_chart</code> from {@link module:g.viz_definition} (defined in de/dev-defined.js).
     * @type {Array} 
     * @alias module:g.viz_keylist
     */
    g.viz_keylist = Object.keys(g.viz_definition);


    // 1) DC.js Extend Domains definitions (in order to have clickable bar behavior)
    //------------------------------------------------------------------------------------

    // Main: Crossfilter main setup
    var cf = crossfilter(g.medical_data);

    g.viz_keylist.forEach(function(key1) {

        console.log('main-core.js ~l120: Chart being generated: '+key1);

        //------------------------------------------------------------------------------------
        // Domains definitions
        //------------------------------------------------------------------------------------

        /**
         * Builds domains for x/y charts when stated so in {@link module:g.viz_definition}: <code>domain_type =/= 'none'</code>. 
         <br>
         **Definitions are accessed by <code>chart_id</code>** in {@link module:g.viz_definition}. 
         <br>
         Definitions can be either 'custom_linear': [min,max] (filtering is then performed by range) or 'custom_ordinal': [lists, all, the, values, ...] (categories can be then filtered one by one).
         <br>
         * All definitions uses {@link module:g.medical_data} except if indicated otherwise. {@link module:g.medical_headerlist} is required too. 
         <br>
         List of current domain definitions is as follows:
         <ul>
            <li><code>epiwk</code> [ordinal] aliases: <code>case_bar</code> and <code>death_bar</code>, lists all the epiweeks between the first and the last epiweeks of the dataset (from <code>epiwk</code> key),</li>
            <li><code>dur</code> [ordinal] lists all stay durations from zero to the maximum in the dataset (from <code>dur</code> key),</li>
            <li><code>out</code> [ordinal] lists all categories of output, not from medical_data but from {@link module:g.medical_read}  (from <code>out</code> key),</li>
            <li><code>age</code> [linear] zero and maximum age of patients in the dataset +2 (to facilitate visualization) (from <code>age</code> key)</li>
            <li><code>wk</code> [linear] aliases: <code>case_lin</code> and <code>death_lin</code>, minimum and maximum week numbers in the dataset (from <code>epiwk</code> key).</li>
         </ul>
         <br>
         On top of the domain a <code>NA</code> category is added as well in order to visualize data with missing or mismatched values.
         * @type {Object.<Function>} 
         * @method
         * @returns {Array}
         * @alias module:main_core~domainBuilder
         */
        var domainBuilder = {
            epiweek : function(){
                var min = d3.min(g.medical_data,function(rec){return rec[g.medical_headerlist['epiwk']];});
                var max = d3.max(g.medical_data,function(rec){return rec[g.medical_headerlist['epiwk']];});
                var domain = [];
                var minyear = Number(min.substr(0,4));
                var minweek = Number(min.substr(5,2));
                var maxyear = Number(max.substr(0,4));
                var maxweek = Number(max.substr(5,2));
                var currentyear = minyear;
                var currentweek = minweek;
                
                while(currentyear < maxyear || currentweek <= maxweek){
                    epiweek = currentweek
                    if(String(epiweek).length==1){
                        epiweek = '0'+epiweek;
                    }
                    domain.push(currentyear+'-'+epiweek);            
                    currentweek++
                    if(currentweek>53){
                        currentweek=1;
                        currentyear++
                    }
                }
                domain.push('NA');
                return domain;
            },
            date: function() {
                var dateArray = [];
                g.medical_data.forEach(function(rec) {
                    var date = rec[g.medical_headerlist['date']];
                    dateArray.push(new Date(date.split('-')[0], date.split('-')[1], date.split('-')[2]));
                });
                //var min = Math.min.apply(null,dateArray);
                var min = d3.min(g.medical_data,function(rec){return rec[g.medical_headerlist['date']];});
                var max = d3.max(g.medical_data,function(rec){return rec[g.medical_headerlist['date']];});
                var now = new Date();
                now = '' + now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
                if(max > now){max = now;}

                var minDate = new Date(min.split('-')[0], min.split('-')[1] - 1, min.split('-')[2]);
                var maxDate = new Date(max.split('-')[0], max.split('-')[1] - 1, max.split('-')[2]);
                return [minDate, maxDate];
            },
            readcat : function(){
                var domain = [];
                Object.keys(g.medical_read[key1]).forEach(function(key2){
                    domain.push(g.medical_read[key1][key2]);
                });
                domain.push('NA');
                return domain;
            },
            integer_ordinal : function(){
                var min = 0;
                var max = d3.max(g.medical_data,function(rec){return parseFloat(rec[g.medical_headerlist['dur']]);});
                var domain = [];
                var current = min;
                while(current<=max){
                    domain.push(current);            
                    current++
                }
                domain.push('NA');
                return domain;
            },
            integer_linear : function(){
                var max = d3.max(g.medical_data,function(rec){return 2 + parseInt(rec[g.medical_headerlist['age']]);});
                return [0,max];
            },
            week : function(){
                var min = d3.min(g.medical_data,function(rec){return rec[g.medical_headerlist['epiwk']].split('-')[1];});
                var max = d3.max(g.medical_data,function(rec){return rec[g.medical_headerlist['epiwk']].split('-')[1];});
                return [min,max];
            },
            year : function(){
                var min = d3.min(g.medical_data,function(rec){return rec[g.medical_headerlist['epiwk']].split('-')[0];});
                var max = d3.max(g.medical_data,function(rec){return rec[g.medical_headerlist['epiwk']].split('-')[0];});
                var domain = [];
                var current = min;
                while(current<=max){
                    domain.push(current);            
                    current++
                }
                return domain;
            }
        };

        main_core.get_domain = function(builder, parameter) {
            if(!(builder == 'none')){
                if (builder in domainBuilder) { 
                    g.viz_definition[key1].domain = domainBuilder[builder]();
                }else{
                    console.log('main-core.js ~l240: Your custom Domain Builder is not defined for viz: '+key1);
                }
            }
        }

        main_core.get_domain(g.viz_definition[key1].domain_builder, g.viz_definition[key1].domain_parameter);

        //------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------
        // 2) DC.js Charts and Maps declarations
        //------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------
        
        /**
         * Builds chart instances with *dc.js* or *dc.leaflet.js* (tables definitions with *datables.js* come later). 
         <br>
         * **Definitions are accessed by <code>chart_type</code>** in {@link module:g.viz_definition}. The instances also uses <code>chart_id</code> in {@link module:g.viz_definition} to connect with the div ids of the layout defined in 'index.html' which are by convention of the form: <code>id= "chart" + chartid</code>. 
         <br>
         List of current chart definitions is as follows:
         <ul>
            <li><code>bar</code> creates a simple bar chart (see: example_barchart),</li>
            <li><code>pie</code> creates a simple pie chart (see: example_piechart),</li>
            <li><code>multiadm</code> creates a multiadm choropleth map (one administrative structure or more that are 'nested' one into the others), requires {@link module:g.geometry_keylist} and {@link module:module_multiadm.display} (see: example_multiadmmap),</li>
            <li><code>row</code> creates a simple row chart (see: example_rowchart),</li>
            <li><code>stackedbar</code> creates a bar chart  with stacked series (see: example_stackedbarchart),</li>
            <li><code>series</code> creates a multi series chart (see: example_serieschart).</li>
            <li><code>table</code> data table instances are actually created later as they require a crossfilter dimension to be setup first (see: example_datatable).</li>
         </ul>
         <br>
         * @type {Function} 
         * @method
         * @alias module:main_core~chartInstancer
         * @todo Define properly.
         */
        var instanceBuilder = {
            bar : function(key){
                g.viz_definition[key].chart = dc.barChart('#chart-'+key);
            },
            pie : function(key){
                g.viz_definition[key].chart = dc.pieChart('#chart-'+key);
            },
            multiadm : function(key){
                // Load Optional Module: module-multiadm.js
                //------------------------------------------------------------------------------------
                module_multiadm.display();
                // Maps definition
                g.viz_definition[key].charts = {};
                g.geometry_keylist.forEach(function(key2){
                    var div_id = '#map-' + key2;
                    g.viz_definition[key].charts[key2] = dc.leafletChoroplethChart(div_id);
                });
            },
            row : function(key){
                g.viz_definition[key].chart = dc.rowChart('#chart-'+key);
            },    
            stackedbar : function(key){
                g.viz_definition[key].chart = dc.barChart('#chart-'+key);
            },
            series : function(key){
                g.viz_definition[key].chart = dc.seriesChart('#chart-'+key);
            },
            composite : function(key){
                g.viz_definition[key].chart = dc.compositeChart('#chart-'+key);
            },
            table : function(key){
                // Loaded later on (dimension needs to be defined first)
            }
        }

        main_core.get_instance = function(builder, parameter) {
            if(!(builder == 'none')){
                if (builder in instanceBuilder) { 
                    instanceBuilder[builder](key1);
                }else{
                    console.log('main-core.js ~l310: Your chart type is not defined for viz: '+key1);
                }
            }
        }
        main_core.get_instance(g.viz_definition[key1].instance_builder, g.viz_definition[key1].instance_parameter);

        //------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------
        // 3) Crossfilter.js Filters definition: Dimensions & Groups
        //------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------
        // Dimension: Charts dimensions setup
        //------------------------------------------------------------------------------------

        /**
         * Builds dimensions with *crossfilter.js*, it correspond to the method to filter the data, to use a spreadsheet analogy, it correspond to the column that will be used to filter the dataset.
         <br>
         * Required objects are in {@link module:g.viz_definition}: <code>chart_id</code>, <code>dimension_type</code> and, depending on the previous value, <code>dimension_setup</code> might be necessary. **See {@link module:g.viz_definition} from more details on how definitions are accessed**, this should be simplified in the coming versions.
         <br>
          List of current dimension definitions is as follows:
         <ul>
            <li><code>sexpreg</code>, combines 'sex' and 'pregnancy' to create 3 categories (from <code>sex</code> and <code>preg</code> keys) and uses {@link module:g.medical_read},</li>
            <li><code>fyo</code>, create 'five years old' categories (from <code>fyo</code> key) and uses {@link module:g.medical_read},</li>
            <li><code>year</code>, creates 'year' categories (from <code>epiwk</code> key),</li>
            <li><code>sev</code>, creates 'severity' categories (from <code>sev</code> key) and uses {@link module:g.medical_read},</li>
            <li><code>out</code>, creates 'output' categories (from <code>out</code> key) and uses {@link module:g.medical_read},</li>
            <li><code>case</code> alias <code>table</code>, creates 'epiweek' categories (from <code>epiwk</code> key),</li>
            <li><code>multiadm</code>, creates 'location' categories for each administrative level combining field from current administrative level and superiors (from <code>admNX</code> keys), requires {@link module:g.geometry_keylist} and uses {@link module:module_datacheck.toTitleCase},</li>
            <li><code>age</code>, creates 'age' categories (from <code>age</code> key),</li>
            <li><code>dur</code>, creates 'stay duration' categories (from <code>dur</code> key),</li>
            <li><code>disease</code>, creates 'disease' categories (from <code>disease</code> key) and uses {@link module:module_datacheck~toTitleCase},</li>
            <li><code>epiwk_lin</code>, creates categories of ('year','week') pairs (from <code>epiwk</code> key),</li>
            <li><code>auto</code>, creates simple categories from a given 'key' (from <code>'key'</code> key).</li>
         </ul>
         <br>
         * @type {Object.<Function>} 
         * @method
         * @returns {dc.dimension}
         * @alias module:main_core~dimensionBuilder
         * @todo Parsing tests to avoid construction duplication to be revised.
         */
        var dimensionBuilder = {
            multiadm: function(none){
                var mapDimension = {};
                g.geometry_keylist.forEach(function(key2,key2num,key2list) {
                    mapDimension[key2] = cf.dimension(function(rec){ 
                        var count = key2num;
                        if(g.module_datacheck.definition_value[key2].setup == 'normalize'){      
                            var loc_current = toTitleCase(rec[g.medical_headerlist[key2list[count]]].trim().split('_').join(' '));
                        }else{
                            var loc_current = rec[g.medical_headerlist[key2list[count]]].trim().split('_').join(' ');
                        }
                        while(count > 0){
                            count--;
                            if(g.module_datacheck.definition_value[key2].setup == 'normalize'){      
                                loc_current = toTitleCase(rec[g.medical_headerlist[key2list[count]]].trim().split('_').join(' '))+', '+loc_current;
                            }else{
                                loc_current = rec[g.medical_headerlist[key2list[count]]].trim().split('_').join(' ')+', '+loc_current;
                            }
                        }
                        return loc_current;
                    });
                })
                return mapDimension;
            },
            integer: function(key){ 
                var dimension = cf.dimension(function(rec) {
                    if(rec[g.medical_headerlist[key]]){
                        return parseInt(rec[g.medical_headerlist[key]]);
                    }else{
                        return 'NA';
                    }
                });
                return dimension;
            },
            normalize: function(key){
                var dimension = cf.dimension(function(rec) {
                    if(rec[g.medical_headerlist[key]]){
                        return toTitleCase(rec[g.medical_headerlist[key]].trim().split('_').join(' '));
                    }else{
                        return 'NA';
                    }
                });
                return dimension;
            },
            year: function(key){
                var dimension = cf.dimension(function(rec) {
                    if(rec[g.medical_headerlist[key]]){
                        return rec[g.medical_headerlist[key]].split('-')[0];
                    }else{
                        return 'NA';
                    }
                });
                return dimension;
            },
            week: function(key){
                var dimension = cf.dimension(function(rec) {
                    if(rec[g.medical_headerlist[key]]){
                        return [rec[g.medical_headerlist[key]].split('-')[0],rec[g.medical_headerlist[key]].split('-')[1]];
                    }else{
                        return ['NA','NA'];
                    }
                });
                return dimension;
            },
            week_num: function(key){
                var dimension = cf.dimension(function(rec) {
                    if(rec[g.medical_headerlist[key]]){
                        return parseInt(rec[g.medical_headerlist[key]].split('-')[1]);
                        //console.log("week_num dimension: ", parseInt(rec[g.medical_headerlist[key]].substr(-2)), " = ", parseInt(rec[g.medical_headerlist[key]].split('-')[1]));
                        //return parseInt(rec[g.medical_headerlist[key]].substr(-2));
                    }else{
                        return 'NA';
                    }
                });
                //console.log("week_num Dimension = ", dimension.bottom(Infinity).map(function(d) {return (d.epiweek).substr(-2)}));
                return dimension;
            },
            date: function(key){
                var key = 'date';
                var dimension = cf.dimension(function(rec) {
                    if(rec[g.medical_headerlist[key]]){
                        var val = rec[g.medical_headerlist[key]];
                        return new Date(val.split('-')[0], val.split('-')[1] - 1, val.split('-')[2]);
                    }else{
                        return 'NA';
                    }
                });
                return dimension;
            },
            auto: function(key){
                var dimension = cf.dimension(function(rec) {
                    if(rec[g.medical_headerlist[key]]){
                        return rec[g.medical_headerlist[key]];
                    }else{
                        return 'NA';
                    }
                });
                //console.log("building auto dimension for ", key, " = ", dimension);
                return dimension;
            },
            readcat: function(key){
                var dimension = cf.dimension(function(rec) {
                    var val = rec[g.medical_headerlist[key]];     
                    var read = g.medical_read[key][val];
                    if(!read){read = 'NA';}
                    return read;
                    });
                return dimension;
            },
            readncombcat: function(key){
                var dimension = cf.dimension(function(rec) {
                    var val = rec[g.medical_headerlist[key[0]]].toString() + rec[g.medical_headerlist[key[1]]].toString();
                    var read = g.medical_read[''+key[0]+key[1]][val];
                    if(!read){read = 'NA';}
                    return read; 
                });
                return dimension;
            },
        };

        main_core.get_dimension = function(builder, parameter) {
            if(!(builder == 'none')){
                if (builder in dimensionBuilder) {

                    // Shared dimension
                    if(parameter.shared){
                        var dim_namespace = parameter.namespace;
                        // Check if the namespace exists
                        if(!(g.viz_definition[dim_namespace])){
                            g.viz_definition[dim_namespace] = {};
                            g.viz_definition[dim_namespace].dimension = dimensionBuilder[builder](parameter.column);
                        }
                    }else{
                        var dim_namespace = key1;
                        g.viz_definition[dim_namespace].dimension = dimensionBuilder[builder](parameter.column);
                    }
                }else{
                    console.log('main-core.js ~l530: Your custom Dimension Builder is not defined for viz: '+key1);
                }
            }
        }
        main_core.get_dimension(g.viz_definition[key1].dimension_builder, g.viz_definition[key1].dimension_parameter);


        //------------------------------------------------------------------------------------
        // Group: Charts groups setup
        //------------------------------------------------------------------------------------

        /**
         * Builds groups with *crossfilter.js*, it correspond to the method to aggregate the data, counting the records for a patient list or summing a specific column for surveillance data that can contain cases, death...
         <br>
         * Groups are built on top of dimensions (see: {@link module:main_core~dimensionBuilder} and {@link module:g.viz_definition}). 
         <br>
         Required objects are {@link module:g.medical_datatype} and in {@link module:g.viz_definition}: depending on the previous value, <code>group_setup</code> might be necessary, <code>chart_id</code>, <code>group_type</code>, <code>dimension_type</code> and, depending on the previous value, <code>dimension_setup</code> might be necessary. **See {@link module:g.viz_definition} from more details on how definitions are accessed**, this should be simplified in the coming versions.
         <br>
          List of current group definitions is as follows:
         <ul>
         *    <li><code>**outbreak**</code> (simply counts patients in patient list)
            <ul>
                <li><code>multiadm</code>, creates a group for each administrative level, requires {@link module:g.geometry_keylist},</li>
                <li><code>auto</code>, creates a simple group,</li>
            </ul>
            </li>
         *    <li><code>**surveillance**</code> (sums or counts already aggregated data)
            <ul>
                <li><code>multiadm</code>, creates a group for each administrative level by both summing and counting (currently from <code>group_setup[0]</code> key), requires {@link module:g.geometry_keylist},</li>
                <li><code>stacked</code>, creates a group summing independently 'under' and 'over' five years old record (currently from <code>group_setup[0]</code> and <code>group_setup[1]</code> keys),</li>
                <li><code>row</code>, creates a group counting 1/2 per record (currently from <code>group_setup[0]</code> key),</li>
                <li><code>auto</code>, creates a simple group summing data (currently from <code>group_setup[0]</code> key),</li>
            </ul>
            </li>
         </ul>
         <br>
         * @type {Object.<Object.<Function>>} 
         * @method
         * @returns {dc.group}
         * @alias module:main_core~groupBuilder
         */
        var groupBuilder = {};
        groupBuilder.outbreak = {
            multiadm: function(dimkey, keylistgroup){
                mapGroup = {};
                g.geometry_keylist.forEach(function(key2) {
                    mapGroup[key2] = g.viz_definition[dimkey].dimension[key2].group().reduce(
                        function(p,v) {
                            p['Records']++;
                            p['Values_c'] += +1;
                            p['Values_d'] += +((v[g.medical_headerlist[keylistgroup[0].key]] == keylistgroup[0].value) ? 1 : 0);
                            return p;
                        },
                        function(p,v) {
                            p['Records']--;
                            p['Values_c'] -= +1;
                            p['Values_d'] -= +((v[g.medical_headerlist[keylistgroup[0].key]] == keylistgroup[0].value) ? 1 : 0);
                            return p;
                        },
                        function() {
                            var temp = {};
                            temp['Records'] = 0;
                            temp['Values_c'] = 0;
                            temp['Values_d'] = 0;
                            return temp;
                        }
                    );
                });
                return mapGroup;
            },
            auto: function(dimkey, none){
                var group = g.viz_definition[dimkey].dimension.group();
                return group;
            }
        };
        groupBuilder.surveillance = {
            multiadm: function(dimkey,keylistgroup){
                var mapGroup = {};
                g.geometry_keylist.forEach(function(key2) {
                    mapGroup[key2] = g.viz_definition[dimkey].dimension[key2].group().reduce(
                    function(p,v) {
                        p['Records']++;
                        p['Values_c'] += +v[g.medical_headerlist[keylistgroup[0]]];
                        p['Values_d'] += +v[g.medical_headerlist[keylistgroup[1]]];
                        return p;
                    },
                    function(p,v) {
                        p['Records']--;
                        p['Values_c'] -= +v[g.medical_headerlist[keylistgroup[0]]];
                        p['Values_d'] -= +v[g.medical_headerlist[keylistgroup[1]]];
                        return p;
                    },
                    function() {
                        var temp = {};
                        temp['Records'] = 0;
                        temp['Values_c'] = 0;
                        temp['Values_d'] = 0;
                        return temp;
                    }
                    );                
                });
                return mapGroup;
            },
            // /!\ "u" & "o" are hardcoded!
            stackedbar: function(dimkey,keylistgroup){
                var group = {};
                group.u = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="u"?d[g.medical_headerlist[keylistgroup[0]]]:0;});
                group.o = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="o"?d[g.medical_headerlist[keylistgroup[0]]]:0;});
                return group;
            },
            count: function(dimkey,none){
                var group = g.viz_definition[dimkey].dimension.group()
                    .reduceSum(function(d) {return 1;})
                    .order(function(d) {return -d;});
                return group;
            },
            auto: function(dimkey,keylistgroup){
                var group = g.viz_definition[dimkey].dimension.group().reduceSum(function(d) {return d[g.medical_headerlist[keylistgroup[0]]];});
                return group;
            },
            series_age: function(dimkey,keylistgroup){
                //console.log("groupBuilder series_age, dimkey = ", dimkey);
                //console.log("groupBuilder series_age, keylistgroup = ", keylistgroup);
                var group = {};
                /*group.u = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){
                    if ((g.module_colorscale.mapunitcurrent == 'Cases') || (g.module_colorscale.mapunitcurrent == 'Deaths')) {
                        var therewego = d[keylistgroup[1]]=="u"?d[g.medical_headerlist[keylistgroup[0]]]*10000:0;
                        //return d[keylistgroup[1]]=="u"?d[g.medical_headerlist[keylistgroup[0]]]*10000:0;
                    } else if ((g.module_colorscale.mapunitcurrent == 'IncidenceProp') || (g.module_colorscale.mapunitcurrent == 'MortalityProp')) {
                        var therewego = d[keylistgroup[1]]=="u"?d[g.medical_headerlist[keylistgroup[0]]]*1000:0;
                        //return d[keylistgroup[1]]=="u"?d[g.medical_headerlist[keylistgroup[0]]]*1000:0;
                    };    
                    //console.log("therewego: ", therewego); 
                    return therewego;             
                });*/
                group.u = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="u"?d[g.medical_headerlist[keylistgroup[0]]]:0;});
                group.o = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="o"?d[g.medical_headerlist[keylistgroup[0]]]:0;});
                group.a = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[g.medical_headerlist[keylistgroup[0]]]});

                //group.u_ir = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="u"?1000*d[g.medical_headerlist[keylistgroup[0]]]:0;});
                //group.o_ir = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="o"?1000*d[g.medical_headerlist[keylistgroup[0]]]:0;});
                //group.a_ir = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return 1000*d[g.medical_headerlist[keylistgroup[0]]]});
                //console.log("in groupBuilder.surveillance - series option, group.u = ", group.u);
                //console.log("in groupBuilder.surveillance - series option, group.o = ", group.o);
                //console.log("RETURNING GROUP series_age");
                return group;
            },
            /*series_age_ir: function(dimkey,keylistgroup){
                var group = {};
                group.u = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="u"?1000*d[g.medical_headerlist[keylistgroup[0]]]:0;});
                group.o = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[keylistgroup[1]]=="o"?1000*d[g.medical_headerlist[keylistgroup[0]]]:0;});
                group.a = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return 1000*d[g.medical_headerlist[keylistgroup[0]]]});
                //console.log("in groupBuilder.surveillance - series option, group.u = ", group.u);
                //console.log("in groupBuilder.surveillance - series option, group.o = ", group.o);
                console.log("RETURNING GROUP series_age");
                return group;
            },*/
            series_yr: function(dimkey,keylistgroup){
                //console.log("groupBuilder series_yr, dimkey = ", dimkey);
                //console.log("groupBuilder series_yr, keylistgroup = ", keylistgroup);
                var group = {};
                group.yr2015 = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[g.medical_headerlist[keylistgroup[1]]].substring(0,4)=="2015"?d[g.medical_headerlist[keylistgroup[0]]]:"";});
                group.yr2016 = g.viz_definition[dimkey].dimension.group().reduceSum(function(d){return d[g.medical_headerlist[keylistgroup[1]]].substring(0,4)=="2016"?d[g.medical_headerlist[keylistgroup[0]]]:"";});
                
                //console.log("in groupBuilder.surveillance - series_yr option, group.yr2015 = ", group.yr2015);
                //console.log("in groupBuilder.surveillance - series_yr option, group.yr2016 = ", group.yr2016);
                return group;
            },
        };

        main_core.get_group = function(builder, parameter, dim_parameter) {
            if(!(builder == 'none')){
                if (builder in groupBuilder.surveillance || builder in groupBuilder.outbreak) {

                    // Shared dimension
                    if(dim_parameter.shared){
                        var dim_namespace = dim_parameter.namespace;
                    }else{
                        var dim_namespace = key1;
                    }

                    g.viz_definition[key1].group = groupBuilder[g.medical_datatype][builder](dim_namespace,parameter.column);

                }else{
                    console.log('main-core.js ~l730: Your custom Group Builder is not defined for viz: '+key1);
                }
            }
        }
        main_core.get_group(g.viz_definition[key1].group_builder, g.viz_definition[key1].group_parameter, g.viz_definition[key1].dimension_parameter);

        
        //------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------
        // 4) DC.js Charts definition
        //------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------

        var color_list = [];
        if (g.viz_definition[key1].display_colors) {
            if (g.viz_definition[key1].display_colors[0]==999) {     //HEIDI - temporary fix, need to formalize this
                var temp_color_list = ['#17becf', '#bcbd22', '#9467bd'];
                g.viz_definition[key1].display_colors.forEach(function(num) {
                    if (num!=999) {
                        color_list.push(temp_color_list[num]);
                    }
                    
                });
                //var color_domain = [0,color_list.length - 1];
            } else {
                /**
                 * Stores color values converted from <code>display_colors</code> ({@link module:g.viz_definition}) to actual colors picked up in the current colorscale {@link module:g.module_colorscale.colors} > {@link module:g.module_colorscale.colorscurrent}.
                 * @type {Array} 
                 * @alias module:main_core~color_list
                 */
                //var color_list = [];
                g.viz_definition[key1].display_colors.forEach(function(num) {
                    color_list.push(g.module_colorscale.colors[g.module_colorscale.colorscurrent][num]);
                });
            }          
             /**
             * Stores the number of values in {@link module:main_core~color_list}.
             * @type {Array} 
             * @alias module:main_core~color_domain
             */
            //var color_domain = [0,color_list.length - 1];
        } else {
            var color_list = d3.scale.category10().range();
            //var color_domain = [0,color_list.length - 1]; 
        }
        /**
             * Stores the number of values in {@link module:main_core~color_list}.
             * @type {Array} 
             * @alias module:main_core~color_domain
             */
        var color_domain = [0,color_list.length - 1];
        console.log("COLORS for ", key1, " = ", color_list, color_domain);

        
        /**
        * Builds charts based on instances created by {@link module:main_core~chartInstancer}. 
         <br>
         * **{@link module:g.viz_definition} is used extensively in this method**: <code>chart_type</code> is used to access the definitions, the elements <code>display_axis</code> will set the axis text and <code>display_colors</code> picks up the colors from lists ({@link module:main_core~color_list}). All the elements created before and stored in this same object: domains, chart instances, dimensions and groups... are also used here. 
        <br>
         The height of charts is hard coded directly here.
        <br>
         List of current charts definitions is as follows:
         * <ul>
          *  <li><code>bar</code> creates a bar chart (see: example_barchart),
            <br>
            Added from basic dc.js charts:
            <ul>
                <li><code>domain_type</code> == 'custom_ordinal' ({@link module:main_core~domainBuilder}), click bars to filter and custom units,</li>
                <li><code>domain_type</code> == 'custom_linear' ({@link module:main_core~domainBuilder}), with range filters taking only integers,</li>
                <li>Labels for small bars (difficult or sometimes impossible to click).</li>
            </ul>
            </li>
         *   <li><code>pie</code> creates a pie chart (see: example_piechart),
            <br>
            Added from basic dc.js charts:
            <ul>
                <li>Percentages added to tooltips.</li>
            </ul>
            </li>
         *   <li><code>multiadm</code> creates a multiadm choropleth map, requires {@link module:g.geometry_keylist} and {@link module:module_multiadm.display} (see: example_multiadmmap),
            <br>Added from basic dc.js charts:
            <ul>
                <li>Administrative levels,</li>
                <li>'Goto' via dropdown list,</li>
                <li>Different map units ('completeness', 'incidence rates', 'cases'...),</li>
                <li>Different colorscales,</li>
                <li>Automated colorscale,</li>
                <li>Add extra layers.</li>
            </ul>
            </li>
         *   <li><code>row</code> creates a row chart (see: example_rowchart),
            <br>
            Added from basic dc.js charts:
            <ul>
                <li><code>domain_type</code> == 'custom_log', logarithmic scale,</li>
                <li>Filters the diseases only one by one.</li>
                <li>Stores currently selected disease in: {@link module: g.medical_currentdisease},</li>
                <li>Randomly select one disease at start,</li>
                <li>xAxis label.</li>
            </ul>
            </li>
         *   <li><code>stackedbar</code> creates a bar chart  with stacked series (see: example_stackedbarchart),
            <br>
            Added from basic dc.js charts:
            <ul>
                <li><code>domain_type</code> == 'custom_ordinal' ({@link module:main_core~domainBuilder}), click bars to filter and custom units,</li>
                <li><code>domain_type</code> == 'custom_linear' ({@link module:main_core~domainBuilder}), with range filters taking only integers,</li>
                <li>Labels for small bars (difficult or sometimes impossible to click).</li>
                <li><code>dimension_type</code> == 'shared' ({@link module:main_core~dimensionBuilder}), synchronizes with an other chart,</li>
            </ul>
            </li>
         *   <li><code>series</code> creates a multi series chart (see: example_serieschart),
            <br>
            Added from basic dc.js charts:
            <ul>
                <li><code>domain_type</code> == 'custom_ordinal' ({@link module:main_core~domainBuilder}), click bars to filter and custom units *NB: Not Tested*,</li>
                <li><code>domain_type</code> == 'custom_linear' ({@link module:main_core~domainBuilder}), with range filters taking only integers,</li>
                <li><code>dimension_type</code> == 'shared' ({@link module:main_core~dimensionBuilder}), synchronizes with an other chart,</li>
            </ul>
         *   <li><code>table</code> uses datatables.js to display tables: {@link module:module_datatable} (see: example_datatable).</li>
         *</ul>
         <br>
         * @type {Function} 
         * @method
         * @alias module:main_core~chartBuilder
         * @todo Define properly.
         * @todo <code>bar</code>: revise labels.
         * @todo Improve special xlabel margin...
         * @todo Add height to {@link module:g.viz_definition}.
         * @todo <code>multiadm</code>: add incidence definition or custom value definition to dev-defined.
         * @todo <code>multiadm</code>: exploitation of mask_data is hardcoded.
         * @todo <code>stackedbar</code>: u5 and o5 labels are hardcoded.
         */
        var chartBuilder = function(){};
        
        switch(g.viz_definition[key1].instance_builder){
            
            //------------------------------------------------------------------------------------
            case 'bar':
            //------------------------------------------------------------------------------------
                var div_id = '#chart-'+key1;
                var width = $(div_id).parent().width();
                
                // Shared dimension
                if(g.viz_definition[key1].dimension_parameter.shared){
                    var dim_namespace = g.viz_definition[key1].dimension_parameter.namespace;
                }else{
                    var dim_namespace = key1;
                }
                g.viz_definition[key1].chart
                    .width(width)
                    .height(180)
                    .dimension(g.viz_definition[dim_namespace].dimension)
                    .group(g.viz_definition[key1].group);

                // Domain parameters
                if (g.viz_definition[key1].domain_parameter == 'custom_ordinal') {
                    var xScaleRange = d3.scale.ordinal().domain(g.viz_definition[key1].domain); 
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .xUnits(dc.units.ordinal)
                        .title(function(d) { return d.key + ": " + d.value; });
                }else if (g.viz_definition[key1].domain_parameter == 'custom_linear'){
                    // Range filtering only takes integers
                    function filterPrinterCustom(filter){
                        var s = "";
                        if(filter){
                            if(filter instanceof Array){
                                if(filter[0].length >= 2){
                                    s = "[" + dc.utils.printSingleValue(Math.ceil(filter[0][0])) + " -> " + dc.utils.printSingleValue(Math.floor(filter[0][1])) + "]";
                                }else if(filter[0].length >= 1){
                                    s = dc.utils.printSingleValue(filter[0]);
                                }
                            }else{
                                s = dc.utils.printSingleValue(filter);
                            }
                        }
                        return s;
                    }
                    var xScaleRange = d3.scale.linear()
                        .domain(g.viz_definition[key1].domain);
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .filterPrinter(filterPrinterCustom);
                }else if (g.viz_definition[key1].domain_parameter == 'custom_date'){
                    // Range filtering displays dates
                    function filterPrinterCustom(filter){
                        var s = "";
                        if(filter){
                            if(filter instanceof Array){
                                if(filter[0].length >= 2){
                                    s = "[" + date1.toLocaleDateString() + " -> " + date2.toLocaleDateString() + "]";
                                }else if(filter[0].length >= 1){
                                    s = dc.utils.printSingleValue(filter[0]);
                                }
                            }else{
                                s = dc.utils.printSingleValue(filter);
                            }
                        }
                        return s;
                    }
                    var xScaleRange = d3.time.scale().domain(g.viz_definition[key1].domain); 
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .filterPrinter(filterPrinterCustom);
                }

                g.viz_definition[key1].chart
                    .margins({top: 10, right: 50, bottom: 60, left: 40})
                    .elasticY(true)
                    .colors(color_list)
                    .xAxisLabel(g.viz_definition[key1].display_axis.x)
                    .yAxisLabel(g.viz_definition[key1].display_axis.y);

                g.viz_definition[key1].chart
                    .yAxis().ticks(5);

                // HEIDI - ADDED THIS - for bar charts where domainBuilder = epiweek, and domain length >=53:
                if ((g.viz_definition[key1].domain_builder == 'epiweek') && (g.viz_definition[key1].domain.length >= 53)) {  //ideally make this dependent on chart width, not domain length
                    console.log("should adapt x axis here = ", g.viz_definition[key1].domain_builder, g.viz_definition[key1].domain.length);
                    g.viz_definition[key1].chart
                        .xAxis().tickFormat(function(d, i) {
                            j = parseInt(d.substring(5));
                            //console.log(d, typeof(d), "  ", j, typeof(j), j%4, typeof(j%4));                       
                            if (!(isNaN(j)) && (!(j%4==0))) {       
                                return "";
                            } else {
                                return d;
                            };
                        })
                    g.viz_definition[key1].chart   
                        .on ('renderlet', function (chart) {
                            chart.selectAll("g.x text")
                                .attr('dx', '-5')
                                .attr('dy', '5')
                        });                        
                };

                g.viz_definition[key1].chart.render();
            
                // Add labels for small bars (difficult or sometimes impossible to click)
                g.viz_definition[key1].chart
                    .on('renderlet.bar',function(chart){
                        if (!(g.interface_autoplayon)) {
                            var barsData = [];
                            var bars = chart.selectAll('.bar').each(function(d) { barsData.push(d); });
                            d3.select(bars[0][0].parentNode).select('#inline-labels').remove();
                            var gLabels = d3.select(bars[0][0].parentNode).append('g').attr('id','inline-labels');
                            for (var i = bars[0].length - 1; i >= 0; i--) {
                                var b = bars[0][i];
                                if(b.getAttribute('height') < 5 && barsData[i].data.value > 0){
                                    gLabels
                                        .append("text")
                                        .text(barsData[i].data.value)
                                        .attr('x', +b.getAttribute('x') + (b.getAttribute('width')/2) )
                                        .attr('y', +b.getAttribute('y') - 5)
                                        .attr('text-anchor', 'middle')
                                        .attr('font-size', '0.7em')
                                        .attr('fill', 'grey')
                                        .attr('id', 'bar-'+key1+'-'+i)
                                        .attr('class', 'bar-label')
                                    $('#bar-'+key1+'-'+i).click(function(target_id){
                                        var barnum = parseInt(target_id.currentTarget.id.split('-')[2]);
                                        g.viz_definition[key1].chart.filter(barsData[barnum].data.key);
                                        if(g.viz_definition[key1].sync_to){
                                            g.viz_definition[key1].sync_to.forEach(function(key2) {
                                                g.viz_definition[key2].chart.filter(barsData[barnum].data.key);
                                            });
                                        }
                                        dc.redrawAll();
                                    });
                                }
                            }
                            chart.selectAll('#inline-labels').each(function()
                            {
                                this.parentNode.parentNode.appendChild(this.parentNode)
                            });
                        }
                    })
                    .on("preRedraw", function(chart){
                        chart.select('#inline-labels').remove();
                    });

                // When epiweek 
                if(!(g.viz_definition[key1].domain_builder == 'epiweek')){
                    $('#chart-'+key1+' .x-axis-label').attr('dy','-20px');
                    console.log('main-core.js ~l1020: Special label margin: #chart-'+key1);
                } 
                break;

            //------------------------------------------------------------------------------------
            case 'pie':
            //------------------------------------------------------------------------------------
                var div_id = '#chart-'+key1;
                var width = $(div_id).parent().width();

                console.log("COLOR LIST = ", color_list);
                console.log("COLOR DOMAIN = ", color_domain);

                g.viz_definition[key1].chart
                    .width(width)
                    .height(160)
                    .dimension(g.viz_definition[key1].dimension)
                    .group(g.viz_definition[key1].group)
                    .innerRadius(25);

                g.viz_definition[key1].chart
                    //.colors(function(d) {console.log("color_list in pie function: ", color_list); return color_list;})
                    .colors(color_list)
                    .colorDomain(color_domain)
                    .colorAccessor(function(d,i){
                        console.log("accessing color for pie chart = ", i, d);
                        return i;
                    });
                
                g.viz_definition[key1].chart
                    .minAngleForLabel(0.05)
                    .legend(dc.legend().x(0).y(0))
                    .label (function (d) {return d3.round((d.value / d3.sum(g.viz_definition[key1].group.all(), function(d){ return d.value;}))*100,0) +"%";});
                g.viz_definition[key1].chart.render();
                break;

            //------------------------------------------------------------------------------------
            case 'multiadm':
            //------------------------------------------------------------------------------------
                
                // 5) DC.js Maps definition
                //------------------------------------------------------------------------------------
                
                 /**
                 * Stores values currently displayed on the map. One object per administrative division.
                 <br>Defined in {@link module:main_core~chartBuilder} > <code>multiadm</code> and populated by {@link module:main_core~valueAccessor}. 
                 * @type {Object} 
                 * @alias module:g.viz_currentvalues
                 */
                g.viz_currentvalues = {};
                g.geometry_keylist.forEach(function(key) {
                    g.viz_currentvalues[key] = {};
                });

                 /**
                 * Populates {@link module:g.viz_currentvalues} with values currently displayed on the map and parses values to the <code>multiadm</code> chart.
                 * <br>Defined in {@link module:main_core~chartBuilder}  > <code>multiadm</code>.
                 * <br>Currently accepts 'Cases', 'Incidence' and 'Completeness' map units (from {@link module:main_core~valueAccessor}).
                 <br>
                 Requires:
                 <ul>
                    <li>{@link module:g.geometry_keylist}</li>
                    <li>{@link module:g.module_colorscale.mapunitcurrent}</li>
                    <li>{@link module:g.viz_definition}</li>
                    <li>{@link module:g.viz_timeline} (for 'Incidence' and 'Completeness')</li>
                    <li>{@link module:g.population_popdata} (for 'Incidence')</li>
                    <li>{@link module:g.medical_completeness} (for 'Completeness')</li>
                    <li>{@link module:g.viz_currentvalues}</li>
                 </ul>
                 * @type {Function} 
                 * @alias module:main_core~valueAccessor
                 * @todo Implement completeness without year chart...
                 */
                function valueAccessor(d){
                    temp_adm = g.geometry_keylist[d.key.split(', ').length - 1];
                    if (g.module_colorscale.mapunitcurrent == 'IncidenceProp') {

                        var select_weeks = g.viz_definition[g.viz_timeline].chart.filters();        //currently filtered epiweeks
                        //console.log("CURRENTLY FILTERED EPIWEEKS: ", select_weeks);
                        var filterswklength = select_weeks.length;                                  //number of filtered epiweeks
                        //console.log("NUMBER OF FILTERED EPIWEEKS: ", filterswklength);

                        if(filterswklength == 0){                                                   //if no filter applied then...
                            select_weeks = $.extend(true, [], g.viz_definition[g.viz_timeline].domain);
                            //console.log("CURRENTLY FILTERED EPIWEEKS (was 0): ", select_weeks);
                            select_weeks.pop();                                                     //remove last element of array (i.e. 'NA')
                            //console.log("CURRENTLY FILTERED EPIWEEKS (was 0): ", select_weeks);
                            filterswklength = select_weeks.length;
                            //console.log("NUMBER OF FILTERED EPIWEEKS (was 0): ", filterswklength);
                        }  

                        // Deals with filtering by years
                        if(g.viz_definition.year){
                            var select_years = g.viz_definition.year.chart.filters();
                            var filtersyrlength = select_years.length;
                            if(!(filtersyrlength == 0)){                                            //if a year has been filtered - remove any epiweeks that don't match year
                                select_weeks.forEach(function(wk) {
                                    select_years.forEach(function(yr) {
                                       if(wk.substr(0,4) !== yr){
                                            filterswklength--;
                                        }
                                    });
                                });
                            }
                        }
                       // console.log("NUMBER OF FILTERED EPIWEEKS (accounted for filtered years): ", filterswklength);

                        // Incidence definition                                                     //calculate incidence using (value, pop, periode)
                        var accessed_value = g.dev_defined.definition_incidence(d.value.Values_c,g.population_databyloc.pop[d.key],filterswklength);
                        //console.log("INCDIENCE RATE (Inc Prop):  (", d.value.Values_c,"*10,000) / (",g.population_databyloc.pop[d.key],"*",filterswklength,") = ", accessed_value);
                        
                    }else if (g.module_colorscale.mapunitcurrent == 'MortalityProp') {

                        var select_weeks = g.viz_definition[g.viz_timeline].chart.filters();
                        var filterswklength = select_weeks.length;

                        if(filterswklength == 0){
                            select_weeks = $.extend(true, [], g.viz_definition[g.viz_timeline].domain);
                            select_weeks.pop();
                            filterswklength = select_weeks.length;
                        }
                        // Deals with filtering by years
                        if(g.viz_definition.year){
                            var select_years = g.viz_definition.year.chart.filters();
                            var filtersyrlength = select_years.length;
                            if(!(filtersyrlength == 0)){
                                select_weeks.forEach(function(wk) {
                                    select_years.forEach(function(yr) {
                                       if(wk.substr(0,4) !== yr){
                                            filterswklength--;
                                        }
                                    });
                                });
                            }
                        }

                        // Mortality == Incidence definition
                        var accessed_value = g.dev_defined.definition_incidence(d.value.Values_d,g.population_databyloc.pop[d.key],filterswklength);
                        console.log("INCDIENCE RATE (Mort Prop):  (", d.value.Values_d,"*10,000) / (",g.population_databyloc.pop[d.key],"*",filterswklength,") = ", accessed_value);
                        

                    }else if (g.module_colorscale.mapunitcurrent == 'Completeness') {

                        var select_weeks = g.viz_definition[g.viz_timeline].chart.filters();
                        var filterswklength = select_weeks.length;

                        if(filterswklength == 0){
                            select_weeks = $.extend(true, [], g.viz_definition[g.viz_timeline].domain);
                            select_weeks.pop();
                            filterswklength = select_weeks.length;
                        }

                        // Deals with filtering by years
                        if(g.viz_definition.year){
                            var select_years = g.viz_definition.year.chart.filters();
                            var filtersyrlength = select_years.length;
                            var temp_count = 0;

                            select_weeks.forEach(function(wk) {
                                var temp_check = true;
                                if (!(filtersyrlength == 0 || filtersyrlength == g.viz_definition.year.domain.length)) {
                                    select_years.forEach(function(yr) {
                                        if(wk.substr(0,4) !== yr){
                                            filterswklength--;
                                            temp_check = false;
                                        }
                                    });    
                                }
                                var temp_key = wk +', '+d.key;
                                if(g.medical_completeness[temp_key] && temp_check){
                                    temp_count += g.medical_completeness[temp_key].value ;
                                }
                            });
                        }
                        temp_count = temp_count / filterswklength;
                        var accessed_value = temp_count * 100;

                    }else if(g.module_colorscale.mapunitcurrent == 'Cases'){ // Cases
                        var accessed_value = d.value.Values_c;
                    }else if(g.module_colorscale.mapunitcurrent == 'Deaths'){ // Deaths
                        var accessed_value = d.value.Values_d;
                    };

                    g.viz_currentvalues[temp_adm][d.key] = accessed_value;
                    return accessed_value; 
                }

                 /**
                 * Returns color number to get map color in {@link module:main_core~color_list}.
                 <br>
                 Depends on {@link module:g.module_colorscale.valuescurrent} and {@link module:g.module_colorscale.mapunitcurrent}.
                 * <br>Defined in {@link module:main_core~chartBuilder}  > <code>multiadm</code>.
                 * @type {Function} 
                 * @alias module:main_core~colorAccessor
                 */
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

                g.viz_definition[key1].maps = {};
                g.viz_definition[key1].legend ={};					

                g.geometry_keylist.forEach(function(key2){
                    var div_id = '#map-' + key2;					
                    var filter_id = div_id + '-filter';
                    g.viz_definition[key1].charts[key2]
                        .width($(div_id).width())
                        .height(300)
                        .dimension(g.viz_definition[key1].dimension[key2])
                        .group(g.viz_definition[key1].group[key2])
                        .geojson(g.geometry_data[key2]) 
                        .colors(color_list)
                        .valueAccessor(valueAccessor)
                        .colorDomain(color_domain)
                        .colorAccessor(colorAccessor)                          
                        .featureKeyAccessor(function(feature){
                            return feature.properties['name'];
                        })
						.popup(function(feature){
                            return feature.properties['name'];
                        })
                        .renderPopup(true)
                        .featureOptions({
                            'fillColor': 'transparent',
                            'color': 'gray',
                            'opacity':0.5,
                            'fillOpacity': 0,
                            'weight': 1
                        })
                        .on("renderlet.key",function(e){
                            var html = "";
                            e.filters().forEach(function(l){
                                html += l.split(',')[l.split(',').length-1]+", ";		//text for filter list
                            });
                            $(filter_id).html(html);
                        });
                    g.viz_definition[key1].charts[key2].render();
                    g.viz_definition[key1].maps[key2] = g.viz_definition[key1].charts[key2].map();
                    g.viz_definition[key1].maps[key2].scrollWheelZoom.disable();
                    zoomToGeom(g.geometry_data[key2],g.viz_definition[key1].maps[key2]);

                    // Map legend
                    g.viz_definition[key1].legend[key2] = L.control({position: 'bottomright'});

                    g.viz_definition[key1].legend[key2].onAdd = function (adm) {

                        if (g.module_colorscale.mapunitcurrent == 'IncidenceProp' || g.module_colorscale.mapunitcurrent == 'MortalityProp') {
                            var precision = 2;
                        }else{
                            var precision = 0;
                        }
                        var div = L.DomUtil.create('div', 'info legend');
                        var html = '<table style="font-size:1em;">';
                        for(var i = g.module_colorscale.valuescurrent.length - 1;i > 1;i--){
							
                            var minVal = numberWithCommas(g.module_colorscale.valuescurrent[i - 1].toFixed(precision));
                            var maxVal = numberWithCommas(g.module_colorscale.valuescurrent[i].toFixed(precision));
							//console.log("make legend i = ", i, minVal, '-', maxVal);
                            /* html += '<tr><td><i style="background:' + g.module_colorscale.colors[g.module_colorscale.colorscurrent][i - 1] + '"></i></td>';
                            if (g.module_colorscale.mapunitcurrent == 'Completeness' && i == 2) {
                                html += '<td>≥</td>';              
                            }else{
                                html += '<td>></td>';
                            }
							html += '<td align="right">' + minVal + '</td></tr>';  */
							
							html += '<tr><td><i style="background:' + g.module_colorscale.colors[g.module_colorscale.colorscurrent][i - 1] + '"></i></td>';
							html += '<td>≤ </td><td align="right">' + maxVal + '</td></tr>';
						
                        }
                        if(!(g.module_colorscale.mapunitcurrent == 'Completeness')){
                            html += '<tr><td><i style="background:' + g.module_colorscale.colors[g.module_colorscale.colorscurrent][0] + '"></i></td>';
                            html += '<td></td><td align="right">'+ g.module_lang.text[g.module_lang.current].map_legendNA + '</td></tr>';
                        }
                        html += '</table>';
                        div.innerHTML = html;

                        return div;
                    };

					
					var ptLayer = L.geoJson.layer;
					
					function onPointsFeature(feature, layer) {
						//console.log("in onPointsFeature");
						if (feature.properties.name) {
							var popupContent = feature.properties.name;
							layer.bindPopup(popupContent);
							//console.log(popupContent);    
						};
						layer.on('mouseover', function (e) {
							//console.log("in mouseover: ", e.target.feature.properties.name);
							this.setStyle({
								"color": '#ffff00',
								"weight": 2,
							}); 
							//this.setOptions(L.circleMarker, {riseOnHover: true});
						});
						layer.on('mouseout', function (e) {
							//console.log("in mouseout: ", e.target.feature.properties.name);
							this.setStyle({
								"color": '#284576',
								"weight": 1,
							}); 
						});
					} 
					
                    var extralay_keys = Object.keys(g.module_getdata.extralay);
                    extralay_keys.forEach(function(key_ex) {
                        if(key_ex == 'mask'){
                            var myStyle = {
                                "color": "#663d00",
                                "weight": 2,
                                "opacity": 1,
                                "fillColor": "#000000",
                                "fillOpacity": 0.1,
                            };
                            var maskLayer = L.geoJson(g.extralay_data.mask, {
                                    style: myStyle
                                });

                            maskLayer.addTo(g.viz_definition[key1].maps[key2]);
                            maskLayer.bringToBack();
                        }else if(key_ex.replace(/[0-9]/g,'') == 'admN'){
                            var myStyle = {
                                "color": "#663d00",
                                "weight": 1,
                                "opacity": 1,
                                "fillColor": "#ffffff",
                                "fillOpacity": 0,
                            };
                            var admLayer = L.geoJson(g.extralay_data[key_ex], {
                                    style: myStyle
                                });
                            admLayer.addTo(g.viz_definition[key1].maps[key2]);
                            //admLayer.bringToBack();
                        }else if(key_ex == 'points'){
                            var myStyle = {
								"radius": 8,
                                "color": "#284576",
                                "weight": 1,
                                "opacity": 1,
                                "fillColor": "#558ae5",
                                "fillOpacity": 0.6,
                            };							
                            var pointsLayer = L.geoJson(g.extralay_data.points, {
                                    onEachFeature: onPointsFeature,
									pointToLayer: function (feature, latlng) {
										return L.circleMarker(latlng, myStyle);
									}
                                });							
                            pointsLayer.addTo(g.viz_definition[key1].maps[key2]);
                            pointsLayer.bringToFront(); 
							ptLayer = pointsLayer;
                        }
                    });

                    g.viz_definition[key1].legend[key2].addTo(g.viz_definition[key1].maps[key2]);
									
					g.viz_definition[key1].maps[key2].on('focus', function () {
						if (ptLayer) {
							ptLayer.bringToFront();
						}
					});
					g.viz_definition[key1].maps[key2].on('click', function () {
						if (ptLayer) {
							ptLayer.bringToFront();
						}
					});

                });

                break;

            //------------------------------------------------------------------------------------
            case 'row':
            //------------------------------------------------------------------------------------        
                var div_id = '#chart-'+key1;
                var width = $(div_id).parent().width();
                
                g.viz_definition[key1].chart
                    .width(width)
                    .height(345)
                    .dimension(g.viz_definition[key1].dimension)
                    .group(g.viz_definition[key1].group)
                    .colors(color_list[0]);

                // Logarithmic scale
                if (g.viz_definition[key1].domain_parameter == 'custom_log') {
                    var disobjects = g.viz_definition[key1].group.top(Infinity);
                    var disvalues = Object.keys(disobjects).map(function (key,keynum) {return disobjects[keynum].value});
                    var max = d3.max(disvalues);
                    g.viz_definition[key1].domain = [1,max];

                    var xScaleRange = d3.scale.log().clamp(true).domain(g.viz_definition[key1].domain).range([0,$('#chart-'+key1).width() - 50]).nice();
                    g.viz_definition[key1].chart
                        .x(xScaleRange);
                }else{
                    g.viz_definition[key1].chart
                        .elasticX(true)
                        .xAxis().ticks(3);;
                }

                g.viz_definition[key1].chart
                    .margins({top: 10, right: 3, bottom: 50, left: 3})
                    .data(function(group) {
                        return group.top(Infinity).filter(function(d) {
                            return d.value != 0;
                        });
                    });
                
                // Filter one by one
                g.viz_definition[key1].chart
                    .filterHandler(function (dimension, filters) {
                        if (filters.length === 0) {
                            dimension.filter(null);
                            var out = filters;
                        } else {
                            dimension.filterFunction(function (d) {
                                filters = [filters[filters.length-1]];
                                for (var i = 0; i < filters.length; i++) {
                                    var filter = filters[i];
                                    if (filter.isFiltered && filter.isFiltered(d)) {
                                        return true;
                                    } else if (filter <= d && filter >= d) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            var out = [filters[filters.length-1]];
                        }

                         /**
                         * 
                         * @type {String} 
                         * @alias module:g.medical_currentdisease
                         */
                        g.medical_currentdisease = out[0];
                        dc.redrawAll();
                        return out;
                    });
                
                // Randomly select one disease at start
                var rand = g.medical_diseaseslist[Math.floor(Math.random() * g.medical_diseaseslist.length)];
                
                g.viz_definition[key1].chart.render();
                g.viz_definition[key1].chart.filter(rand);

                function AddXAxis(chartToUpdate, displayText){
                    chartToUpdate.svg()
                        .append("text")
                        .attr("class", "x-axis-label")
                        .attr("text-anchor", "middle")
                        .attr("x", chartToUpdate.width()/2)
                        .attr("y", chartToUpdate.height()-3.5)
                        .text(displayText);
                }

                // xAxis label
                AddXAxis(g.viz_definition[key1].chart,g.viz_definition[key1].display_axis.x);

                break;

            //------------------------------------------------------------------------------------
            case 'stackedbar':
            //------------------------------------------------------------------------------------
                var div_id = '#chart-'+key1;
                var width = $(div_id).parent().width();
                
                 // Shared dimension
                if(g.viz_definition[key1].dimension_parameter.shared){
                    var dim_namespace = g.viz_definition[key1].dimension_parameter.namespace;
                }else{
                    var dim_namespace = key1;
                }

                g.viz_definition[key1].chart
                    .width(width)
                    .height(180)
                    .dimension(g.viz_definition[dim_namespace].dimension)
                    .group(g.viz_definition[key1].group.u, "Under 5")
                    .stack(g.viz_definition[key1].group.o, "Over 5");

                // Deals with domain types
                if (g.viz_definition[key1].domain_parameter == 'custom_ordinal') {
                    var xScaleRange = d3.scale.ordinal().domain(g.viz_definition[key1].domain); 
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .xUnits(dc.units.ordinal)
                        .title(function(d) { return d.key + ": " + d.value; });
                }else if (g.viz_definition[key1].domain_parameter == 'custom_linear'){
                    // Range filtering only takes integers
                    function filterPrinterCustom(filter) {
                        var s = "";
                        if (filter) {
                            if (filter instanceof Array) {
                                if (filter[0].length >= 2) {
                                    s = "[" + dc.utils.printSingleValue(Math.ceil(filter[0][0])) + " -> " + dc.utils.printSingleValue(Math.floor(filter[0][1])) + "]";
                                } else if (filter[0].length >= 1) {
                                    s = dc.utils.printSingleValue(filter[0]);
                                }
                            } else {
                                s = dc.utils.printSingleValue(filter);
                            }
                        }
                        return s;
                    }
                    var xScaleRange = d3.scale.linear().domain(g.viz_definition[key1].domain); 
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .filterPrinter(filterPrinterCustom);
                }

                g.viz_definition[key1].chart
                    .margins({top: 10, right: 50, bottom: 60, left: 40})
                    .elasticY(true)
                    .ordinalColors(color_list)
                    .xAxisLabel(g.viz_definition[key1].display_axis.x)
                    .yAxisLabel(g.viz_definition[key1].display_axis.y);

                g.viz_definition[key1].chart
                    .yAxis().ticks(5);

                // HEIDI - ADDED THIS - for stackedbar charts where domainBuilder = epiweek, and domain length >=53:
                if ((g.viz_definition[key1].domain_builder == 'epiweek') && (g.viz_definition[key1].domain.length >= 53)) {  //ideally make this dependent on chart width, not domain length
                    console.log("should adapt x axis here = ", g.viz_definition[key1].domain_builder, g.viz_definition[key1].domain.length);
                    g.viz_definition[key1].chart
                        .xAxis().tickFormat(function(d, i) {
                            j = parseInt(d.substring(5));
                            //console.log(d, typeof(d), "  ", j, typeof(j), j%4, typeof(j%4));                       
                            if (!(isNaN(j)) && (!(j%4==0))) {       
                                return "";
                            } else {
                                return d;
                            };
                        })
                    g.viz_definition[key1].chart   
                        .on ('renderlet', function (chart) {
                            chart.selectAll("g.x text")
                                .attr('dx', '-5')
                                .attr('dy', '5')
                        });                        
                };


                g.viz_definition[key1].chart.render();         

                // Add labels for small bars (difficult or sometimes impossible to click)
                g.viz_definition[key1].chart
                    .on('renderlet.bar',function(chart){
                        if (!(g.interface_autoplayon)) {
                            var barsData = [];
                            var bars = chart.selectAll('.bar').each(function(d) { barsData.push(d); });
                            d3.select(bars[0][0].parentNode).select('#inline-labels').remove();
                            var gLabels = d3.select(bars[0][0].parentNode).append('g').attr('id','inline-labels');
                            for (var i = bars[0].length - 1; i >= 0; i--) {
                                var b = bars[0][i];
                                if(b.getAttribute('height') < 5 && barsData[i].y > 0){
                                    if(barsData[i].layer == 'Under 5'){
                                        var offset = -(b.getAttribute('width')/4);
                                        var cpt = 'U';
                                    }else{
                                        var offset = +(b.getAttribute('width')/4); 
                                        var cpt = 'O';
                                    }
                                    gLabels
                                        .append("text")
                                        .text(cpt + barsData[i].y)
                                        .attr('x', +b.getAttribute('x') + (b.getAttribute('width')/2) + offset)
                                        .attr('y', +b.getAttribute('y') - 5)
                                        .attr('text-anchor', 'middle')
                                        .attr('font-size', '0.7em')
                                        .attr('fill', 'grey')
                                        .attr('id', 'bar-'+key1+'-'+i)
                                        .attr('class', 'bar-label')
                                    $('#bar-'+key1+'-'+i).click(function(target_id){
                                        var barnum = parseInt(target_id.currentTarget.id.split('-')[2]);
                                        g.viz_definition[key1].chart.filter(barsData[barnum].data.key);
                                        if(g.viz_definition[key1].sync_to){
                                            g.viz_definition[key1].sync_to.forEach(function(key2) {
                                                g.viz_definition[key2].chart.filter(barsData[barnum].data.key);
                                            });
                                        }
                                        dc.redrawAll();
                                    });
                                }
                            }
                            chart.selectAll('#inline-labels').each(function()
                            {
                                this.parentNode.parentNode.appendChild(this.parentNode)
                            });
                        }
                    })
                    .on("preRedraw", function(chart){
                        chart.select('#inline-labels').remove();
                    });

                // When epiweek 
                if(!(g.viz_definition[key1].domain_builder == 'epiweek')){
                    $('#chart-'+key1+' .x-axis-label').attr('dy','-20px');
                    console.log('main-core.js ~l1020: Special label margin: #chart-'+key1);
                }
                break;

            //------------------------------------------------------------------------------------
            case 'series':
            //------------------------------------------------------------------------------------
                var div_id = '#chart-'+key1;
                var width = $(div_id).parent().width();

                // Shared dimension
                if(g.viz_definition[key1].dimension_parameter.shared){
                    var dim_namespace = g.viz_definition[key1].dimension_parameter.namespace;
                }else{
                    var dim_namespace = key1;
                }

                g.viz_definition[key1].chart
                    .width(width)
                    .height(180)
                    .chart(function(c) { 
                        return dc.lineChart(c).interpolate('step');
                        })
                    .dimension(g.viz_definition[dim_namespace].dimension)
                    .group(g.viz_definition[key1].group);

                if(g.viz_definition[key1].domain_parameter == 'custom_ordinal'){
                    var xScaleRange = d3.scale.ordinal().domain(g.viz_definition[key1].domain); 
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .xUnits(dc.units.ordinal)
                        .title(function(d) { return d.key + ": " + d.value; });
                }else if(g.viz_definition[key1].domain_parameter == 'custom_linear'){
                    var xScaleRange = d3.scale.linear().domain(g.viz_definition[key1].domain); 
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .xUnits(dc.units.integers) 
                        .brushOn(false)
                        .seriesAccessor(function(d) {
                             return d.key[0]; })
                        .keyAccessor(function(d) {return +d.key[1];})
                        .valueAccessor(function(d) {return +d.value;});
                }

                g.viz_definition[key1].chart
                    .margins({top: 10, right: 50, bottom: 60, left: 40})
                    .elasticY(true)
                    .title(function(d) { return d.key+ ": " + d.value; })
                    .xAxisLabel(g.viz_definition[key1].display_axis.x)
                    .yAxisLabel(g.viz_definition[key1].display_axis.y);

                g.viz_definition[key1].chart
                    .yAxis().ticks(5);

                g.viz_definition[key1].chart.render();         

                // When epiweek 
                if(!(g.viz_definition[key1].domain_builder == 'epiweek')){
                    $('#chart-'+key1+' .x-axis-label').attr('dy','-20px');
                    console.log('main-core.js ~l1020: Special label margin: #chart-'+key1);
                }
                break;

            //------------------------------------------------------------------------------------
            case 'composite':    //HEIDI added this section
            //------------------------------------------------------------------------------------
                var div_id = '#chart-'+key1;
                //console.log("COMPOSITE CHART: ", key1);
                //console.log("   g.viz_definition[", key1, "] = ", g.viz_definition[key1]);
                var width = $(div_id).parent().width();

                // Shared dimension
                if(g.viz_definition[key1].dimension_parameter.shared){
                    var dim_namespace = g.viz_definition[key1].dimension_parameter.namespace;
                }else{
                    var dim_namespace = key1;
                }

                //console.log("MAP UNIT IS: ", g.module_colorscale.mapunitcurrent);

                if (g.viz_definition[key1].domain_parameter == 'custom_ordinal'){
                    var xScaleRange = d3.scale.ordinal().domain(g.viz_definition[key1].domain);  
                    var group0 =  g.viz_definition[key1].group.a;
                } else if (g.viz_definition[key1].domain_parameter == 'custom_linear'){
                    var xScaleRange = d3.scale.linear().domain(g.viz_definition[key1].domain); 
                    var group0 = g.viz_definition[key1].group.yr2015;   //HEIDI - need to replace these groups with references - define keygroup?
                };

                function getPopNum() {          //return population for all currently selected regions
                    var pop = 0;
                    //if selected adm level in map is one of those defined - i.e. an integer between 0 and g.geometry_keylist.length-1
                    //console.log("tabcurrentnum is an integer ", Number.isInteger(g.module_multiadm.tabcurrentnum));
                    if ((Number.isInteger(g.module_multiadm.tabcurrentnum) && (g.module_multiadm.tabcurrentnum >=0) && (g.module_multiadm.tabcurrentnum <= g.geometry_keylist.length-1))) {
                        //console.log("tabcurrentnum = ", g.module_multiadm.tabcurrentnum);
                        //console.log("geom_keylist = ", g.geometry_keylist[g.module_multiadm.tabcurrentnum]);
                        var select_locs = g.viz_definition[g.viz_locations].charts[g.geometry_keylist[g.module_multiadm.tabcurrentnum]].filters();        //currently filtered locations
                        if (select_locs.length == 0){
                            select_locs = g.geometry_loclists[g.geometry_keylist[g.module_multiadm.tabcurrentnum]];
                        };
                    } else {        //otherwise assume level 0
                        //console.log("tabcurrentnum = assume ", 0);
                        //console.log("geom_keylist = ", g.geometry_keylist[0]);
                        var select_locs = g.viz_definition[g.viz_locations].charts[g.geometry_keylist[0]].filters(); 
                        if (select_locs.length == 0){
                            select_locs = g.geometry_loclists[g.geometry_keylist[0]];
                        };
                    }
                    //console.log("CURRENT LOCATIONS: ", select_locs);

                    //loop through locations adding them up
                    for (i=0; i<=select_locs.length-1; i++) {
                        //console.log("i = ", i, "   add in ", select_locs[i], g.population_databyloc.pop[select_locs[i]]);
                        pop += g.population_databyloc.pop[select_locs[i]];
                    }

                    //console.log("FINAL POP = ", pop);
                    return pop;
                };

                function valueAccessor1(d) {        //value for overall summary group (e.g. All Ages)
                    if ((g.module_colorscale.mapunitcurrent=='IncidenceProp') || (g.module_colorscale.mapunitcurrent=='MortalityProp')) {        
                        var accessed = g.dev_defined.definition_incidence(+d.value, getPopNum(), 1);   //HEIDI - need to change function to return correct age group
                        //console.log("INCDIENCE RATE:  (", d.value,"*10,000) / (", pop_num,"*",1,") = ", accessed);
                    } else {
                        var accessed = +d.value;
                    }
                    return accessed;
                };

                function getYLabel() {    
                    if ((g.module_colorscale.mapunitcurrent=='IncidenceProp') || (g.module_colorscale.mapunitcurrent=='MortalityProp')) {
                        var yLabel = g.viz_definition[key1].display_axis.y_imr;                                
                    } else {
                        var yLabel = g.viz_definition[key1].display_axis.y;
                    }
                    return yLabel;
                }; 


                g.viz_definition[key1].chart
                    .margins({top: 10, right: 50, bottom: 60, left: 40})
                    .width(width)
                    .height(180)
                    .dimension(g.viz_definition[dim_namespace].dimension)
                    .group(group0)
                    .elasticY(true)   
                    .brushOn(false);                     

                if (g.viz_definition[key1].domain_parameter == 'custom_ordinal'){
                    //console.log("COLOR LIST = ", color_list);
                    //console.log("COLOR DOMAIN = ", color_domain);

                    function valueAccessor2(d) {        //value for subgroups (e.g. Under 5, Over 5)
                        if ((g.module_colorscale.mapunitcurrent=='IncidenceProp') || (g.module_colorscale.mapunitcurrent=='MortalityProp')) {
                            if (g.population_byAgeGroup) {      //if age group population data is available      
                                var accessed = g.dev_defined.definition_incidence(+d.value, pop_num, 1);  //HEIDI - need to change function to return correct age group
                                //console.log("INCDIENCE RATE:  (", d.value,"*10,000) / (", pop_num,"*",1,") = ", accessed);
                            } else {                            //if age group population data is not available
                                var accessed = null;   
                            }
                        } else {
                            var accessed = +d.value;
                        }
                        return accessed;
                    };

                    function titleAccessor1(d) {    //hover info for overall summary group (e.g. All Ages)
                        if ((g.module_colorscale.mapunitcurrent=='IncidenceProp') || (g.module_colorscale.mapunitcurrent=='MortalityProp')) {
                            var accessed = d.key+ ": " + d3.format(",.2f")(valueAccessor1(d));                                
                        } else {
                            var accessed = d.key+ ": " +d.value;
                        }
                        return accessed;
                    };

                    function titleAccessor2(d) {    //hover info for subgroups (e.g. Under 5, Over 5)
                        if ((g.module_colorscale.mapunitcurrent=='IncidenceProp') || (g.module_colorscale.mapunitcurrent=='MortalityProp')) {
                            if (g.population_byAgeGroup) {      //if age group population data is available
                                var accessed = d.key+ ": " + d3.format(",.2f")(valueAccessor2(d));   
                            } else {                            //if age group population data is not available
                                var accessed = "Data not available";   
                            }                              
                        } else {
                            var accessed = d.key+ ": " + d.value;
                        }
                        return accessed;
                    };               

                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .xUnits(dc.units.ordinal)
                        //.yAxisLabel(g.viz_definition[key1].display_axis.y) 
                        .yAxisLabel(getYLabel)
                        .xAxisLabel(g.viz_definition[key1].display_axis.x)      //could change padding parameter to 6 here but must do for all charts (default=12)
                        .shareTitle(false)
                        //.clipPadding(10)  
                        ._rangeBandPadding(1)
                        .compose([
                            dc.lineChart(g.viz_definition[key1].chart).interpolate('linear').renderDataPoints(true).defined(function(d) {if (d.y !== null) {return d.y;}}).group(g.viz_definition[key1].group.a,g.module_lang.text[g.module_lang.current].chart_fyo_labela).valueAccessor(valueAccessor1).title(titleAccessor1).colors("#333"),
                            dc.lineChart(g.viz_definition[key1].chart).interpolate('linear').renderDataPoints(true).defined(function(d) {if (d.y !== null) {return d.y;}}).group(g.viz_definition[key1].group.u,g.module_lang.text[g.module_lang.current].chart_fyo_labelu).valueAccessor(valueAccessor2).title(titleAccessor2).colors(color_list[0]),
                            dc.lineChart(g.viz_definition[key1].chart).interpolate('linear').renderDataPoints(true).defined(function(d) {if (d.y !== null) {return d.y;}}).group(g.viz_definition[key1].group.o,g.module_lang.text[g.module_lang.current].chart_fyo_labelo).valueAccessor(valueAccessor2).title(titleAccessor2).colors(color_list[1])
                        ])
                        .legend(dc.legend().x(100).y(20).itemHeight(8).gap(4));
                        /*.yAxis().ticks(5)
                        .tickFormat(function(d) {
                            if ((g.module_colorscale.mapunitcurrent=='Cases') || (g.module_colorscale.mapunitcurrent=='Deaths')) {
                                return d3.format("d");
                            } 
                         })
                        .tickSubdivide(function(d) {
                            if ((g.module_colorscale.mapunitcurrent=='Cases') || (g.module_colorscale.mapunitcurrent=='Deaths')) {
                                return 0;
                            } 
                         });
*/



                } else if (g.viz_definition[key1].domain_parameter == 'custom_linear'){
                    console.log("COLOR LIST = ", color_list);
                    console.log("COLOR DOMAIN = ", color_domain);
                    g.viz_definition[key1].chart
                        .x(xScaleRange)
                        .xUnits(dc.units.integers)   
                        .yAxisLabel(getYLabel)   
                        .xAxisLabel(g.viz_definition[key1].display_axis.x) 
                        //.shareTitle(false)
                        //.clipPadding(10)  
                        ._rangeBandPadding(1)
                        .title(function(d) {
                            if ((g.module_colorscale.mapunitcurrent=='IncidenceProp') || (g.module_colorscale.mapunitcurrent=='MortalityProp')) {
                                return "Week " + d.key+ ": " + d3.format(",.2f")(valueAccessor1(d));                                
                            } else {
                                return "Week " + d.key+ ": " +d.value;
                            }
                        })
                        .compose([
                            //Note that /*.defined(function(d) {if (d.y !== null) {return d.y;}})*/ removes data entry of null but not of 0
                            dc.lineChart(g.viz_definition[key1].chart).interpolate('linear').renderDataPoints(true).defined(function(d) {if (d.y !== null) {return d.y;}}).group(g.viz_definition[key1].group.yr2015,g.medical_yearlist[1]).valueAccessor(valueAccessor1).colors(color_list[0]),
                            dc.lineChart(g.viz_definition[key1].chart).interpolate('linear').renderDataPoints(true).defined(function(d) {if (d.y !== null) {return d.y;}}).group(g.viz_definition[key1].group.yr2016,g.medical_yearlist[0]).valueAccessor(valueAccessor1).colors(color_list[1])
                        ])
                        .legend(dc.legend().x(100).y(20).itemHeight(8).gap(4));
                };

                g.viz_definition[key1].chart
                    .yAxis().ticks(5)
                    .tickFormat(function(d) {
                        if ((g.module_colorscale.mapunitcurrent=='Cases') || (g.module_colorscale.mapunitcurrent=='Deaths')) {
                            return d3.format("d")(d);
                        } else {
                            return d3.format("")(d);
                        } 
                     });


                // HEIDI - ADDED THIS - for composite charts where domainBuilder = epiweek, and domain length >=53:
                if ((g.viz_definition[key1].domain_builder == 'epiweek') && (g.viz_definition[key1].domain.length >= 53)) {  //ideally make this dependent on chart width, not domain length
                    console.log("should adapt x axis here = ", g.viz_definition[key1].domain_builder, g.viz_definition[key1].domain.length);
                    g.viz_definition[key1].chart
                        .xAxis().tickFormat(function(d, i) {
                            j = parseInt(d.substring(5));
                            //console.log(d, typeof(d), "  ", j, typeof(j), j%4, typeof(j%4));                       
                            if (!(isNaN(j)) && (!(j%4==0))) {       
                                return "";
                            } else {
                                return d;
                            };
                        })
                    g.viz_definition[key1].chart   
                        .on ('renderlet', function (chart) {
                            chart.selectAll("g.x text")
                                .attr('dx', '-5')
                                .attr('dy', '5')
                        })              
                };

                g.viz_definition[key1].chart.render();         

                // When epiweek 
                if(!(g.viz_definition[key1].domain_builder == 'epiweek')){
                    $('#chart-'+key1+' .x-axis-label').attr('dy','-20px');
                    console.log('main-core.js ~l1020: Special label margin: #chart-'+key1);
                }
                break;
            
            //------------------------------------------------------------------------------------
            case 'table':
            //------------------------------------------------------------------------------------

		// Load Optional Module: module-datatable.js
 		//------------------------------------------------------------------------------------
                module_datatable.setup();
                module_datatable.display();
                module_datatable.interaction();
                break;
            
            //------------------------------------------------------------------------------------
            default:
            //------------------------------------------------------------------------------------
            
                console.log('main-core.js ~l290: Your chart type is not defined for viz: '+key1);
                break;
        }
    });  

    // Sync maps movements
     /**
     * Sync maps movements.
     <br>Triggered by the end of {@link module:main_core:generateDashboard}.
     * @type {Function} 
     * @alias module:main_core~sync_maps
     * @todo Define properly.
     * @todo Check if works properly.
     */
    var sync_maps = function() {};
    g.geometry_keylist.forEach(function(key1){
        g.geometry_keylist.forEach(function(key2){
            if(!(key1 == key2)){
                g.viz_definition.multiadm.maps[key1].sync(g.viz_definition.multiadm.maps[key2]);
            }
        }); 
    });

    // Sync charts filters
    /**
     * Sync charts filters based on the <code>sync_to</code> parameter in {@link module:g.viz_definition}. 
     <br>Triggered by the end of {@link module:main_core:generateDashboard}.
     * @type {Function} 
     * @alias module:main_core~sync_charts
     * @todo Define properly.
     */
    var sync_charts = function() {};
    g.viz_keylist.forEach(function(key1) {
        if(g.viz_definition[key1].sync_to){
            g.viz_definition[key1].chart.on('renderlet.sync',function(chart) {
                g.viz_definition[key1].chart.selectAll('rect').on("click", function(d) {
                    g.viz_definition[key1].chart.filter(d.x);
                    g.viz_definition[key1].sync_to.forEach(function(key2) {
                        g.viz_definition[key2].chart.filter(d.x);
                    });
                    dc.redrawAll();
                });
            });
        }
    });
              

    // Load Optional Modules: module-multiadm.js | module-intro.js | module-interface.js | module-chartwarper.js
    //------------------------------------------------------------------------------------
    module_multiadm.interaction();
    module_intro.setup();
    module_interface.display();
    module_chartwarper.display(g.module_chartwarper.tabcontainer_id,g.module_chartwarper.chartcontainers_list);
    module_chartwarper.interaction(g.module_chartwarper.chartcontainers_list);

    // Key figures
    //... duplicate
    function isinteger(value){
        var cond_0 = !(value == '');
        var cond_1 = value >= 0;
        var cond_2 = parseInt(Number(value),10) == value;
        return cond_0 && cond_1 && cond_2;
    }

    /**
     * Creates three numeric outputs:
     * <ul>
     <li>For 'surveillance': number of cases and deaths in current subset. Container ids: <code>case-info</code> and <code>death-info</code>.</li>
     <li>For 'outbreak': number of patients in current subset. Container ids: <code>count-info</code>.</li>
     * @type {Function} 
     * @alias module:main_core~numericOutputs
     * @todo Define properly.
     */
    var numericOutputs = function() {};
     /********************************************************/
    var caseGroupAll = cf.groupAll().reduceSum(function(d) {
        if(isinteger(d[g.medical_headerlist.case])){
            return parseInt(d[g.medical_headerlist.case]);
        }else{
            return 0;
        }
    });
    var deathGroupAll = cf.groupAll().reduceSum(function(d) {
        if(isinteger(d[g.medical_headerlist.death])){
            return parseInt(d[g.medical_headerlist.death]);
        }else{
            return 0;
        }
    });
    var all = cf.groupAll();

    dc.dataCount('#case-info')
        .dimension(cf)
        .group(caseGroupAll);

    dc.dataCount('#death-info')
        .dimension(cf)
        .group(deathGroupAll);

    dc.dataCount('#count-info')
        .dimension(cf)
        .group(all);    

    dc.redrawAll();
     /********************************************************/

    /**
     * Enable 'Auto' mode for the function {@link module:module_colorscale.lockcolor}.
     <br> Includes a small delay for 'Incidence' unit as {@link module:main_core~valueAccessor} requires more time to parse the data.
     <br> Also enables the datatable to refresh {@link module:module_datatable.refreshTable}. 
     * @type {Function} 
     * @alias module:main_core~onFiltered
     * @todo Define properly.
     */
    var onFiltered = function() {};
    for (var i = 0; i < dc.chartRegistry.list().length; i++) {
        var chart = dc.chartRegistry.list()[i];

        if(chart.anchorName().substring(0,3) == 'map'){
            chart.on("filtered",function() {
                module_datatable.refreshTable();
            });
        }else if(chart.anchorName().substring(chart.anchorName().length - 4,chart.anchorName().length) == 'info'){
            //console.log(chart.anchorName());
        }else{
            chart.on("filtered",function() {
                if(g.module_colorscale.mapunitcurrent == 'MortalityProp' || g.module_colorscale.mapunitcurrent == 'IncidenceProp' || g.module_colorscale.mapunitcurrent == 'Cases' || g.module_colorscale.mapunitcurrent == 'Deaths'){
                setTimeout(function() {
                    module_colorscale.lockcolor('Auto');
                }, 0);
                }else{
                    module_colorscale.lockcolor('Auto');
                }
                module_datatable.refreshTable();
            });
        }
    }
    // Initiate
    module_colorscale.lockcolor(g.module_colorscale.modecurrent);

    $('#modal').modal('hide');
}

/**
 * Zoom a given map to a given geometry.
 * @type {Function}
 * @param {dc.geometry} geom Geometry
 * @param {dc.map} adm dc.map
 * @alias module:main_core~zoomToGeom
 */
function zoomToGeom(geom,adm){
    var bounds = d3.geo.bounds(geom);
    adm.fitBounds([[bounds[0][1],bounds[0][0]],[bounds[1][1],bounds[1][0]]]);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

