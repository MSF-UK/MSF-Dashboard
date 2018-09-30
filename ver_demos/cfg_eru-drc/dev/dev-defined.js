/*------------------------------------------------------------------------------------
    MSF Dashboard - dev-defined.js
    (c) 2015-2017, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This module contains the parameters of the dashboard that have to be defined by the developer in order to tailor the tool to the specific needs of the future users. In the following we will look at the parameters needed to:
 * <ul>
 *   <li> design aspects of the dashboard layout</li>
 *   <li> get the medical and geometry data</li>
 *   <li> check the medical and geometry data</li> 
 *   <li> define the charts and maps, feed them with the correct data and define specific interaction</li> 
 * </ul>
 * All these parameters are defined in <code>dev/dev-defined.js</code> and are stored in the global variable <code>g</code>. 
 * <br><br>
 * <code>g</code> stores other Objects as well that are not defined by the developer but that are the results of the processing and interactions. <code>g</code> can be accessed through your developer browser interface.  
 * <br><br>
 * Along with <code>dev/dev-defined.js</code>, there are two other files that the developer must configure to create a new instance of the Dashboard. These are:
 * <ul>
 *   <li> 'index.html' - this defines the divs and the positions of the charts and maps </li>
 *   <li> {@link module:module-lang} ('lang/module-lang.js') - this contains all the text displayed in the dashboard, including translations</li>
 * </ul>
 * @module g
 * @since v0.9.0
 * @requires lang/lang.js
 * @todo Limit list of parameters in g.
 * @todo Implement 'module_list' check to run or not the modules.
 */

/**
 * @module dev_defined
 */
g.dev_defined = {};

/*------------------------------------------------------------------------------------
    Components:
    0) Design/layout parameters
    1) Data parameters
    2) Data check parameters
    3) Charts parameters
------------------------------------------------------------------------------------*/

// 0) Design/layout parameters
//------------------------------------------------------------------------------------

/**
 Defines whether or not the new layout structure is applied in the dashboard. This affects... <br>
 <br>
 * @constant
 * @type {Boolean} 
 * @alias module:g.new_layout
 */
g.new_layout = true;
g.new_layout_params = {filterWindowAlwaysOn: true};

/**
 * Stores the id of the div (as specified in index.html) that contains the buttons to toggle between charts (e.g. between Age Group and Year charts).
 * <br> Used for {g.new_layout}.
 * @type {String}
 * @constant
 * @alias module:module_chartwarper.container_btns_id
 */
if(!g.module_chartwarper){
    g.module_chartwarper = {}; 
}
g.module_chartwarper.container_btns_id = 'container_ser_lin_btns'; 

/**
 * Stores the id of the div (as specified in index.html) that contains all the charts to be toggled between (e.g. including Age Group and Year charts).
 * <br> Used for {g.new_layout}.
 * @type {String}
 * @constant
 * @alias module:module_chartwarper.container_allcharts_id
 */
g.module_chartwarper.container_allcharts_id = 'container_ser_lin';

/**
 * Lists the divs (as specified in index.html) of the individual charts to be toggled between (e.g. Age Group and Year charts), and their corresponding heights.
 * <br> Defined in {@link module:module_chartwarper}, used for {g.new_layout}.
 * @type {Array<String>}
 * @constant
 * @alias module:module_chartwarper.container_chartlist
 */
g.module_chartwarper.container_chartlist = [{
                                        container: 'container_ser_outer',
                                        height: '600px'
                                      },
                                      {
                                        container: 'container_lin_outer',
                                        height: '400px'
                                      }];  

/**
 * Defines the order of all intro (Help) windows. These can either be defined as the name of a chart or the name of a div (defined in index.html).
 * For intro windows defined by a div, then its position must be defined in g.module_intro.intro_position.
 * <br> Defined in {@link module:module_intro}, used for {g.new_layout}.
 * @type {Array<String>}
 * @constant
 * @alias module:module_intro.intro_order
 */
if(!g.module_intro){
    g.module_intro = {}; 
}
g.module_intro.intro_order = ['intro', 'menu', 'multiadm', 'disease', 'container_ser_lin', 'case_ser', 'case_lin', 'ser_range', 'fyo', 'year', 'table'];

/**
 * Defines a list of div names used as intro (Help) windows, along with their position relative to the chart.
 * <br> Defined in {@link module:module_intro}, used for {g.new_layout}.
 * @type {Array<Object>}
 * @constant
 * @alias module:module_intro.intro_position
 */
g.module_intro.intro_position = [{container: 'container_ser_lin',
                                 position: 'top'
                                }];

/**
 * Defines a list of chart or div names used as intro (Help) windows, that require turning 'on' before its Help is opened to force it into view in case it was previously 'hidden'. Turning 'on' a chart of div requires a pre-specified button to be 'clicked', as defined by the click attribute.
 * <br> Defined in {@link module:module_intro}, used for {g.new_layout}.
 * <br> The buttons are defined in {@link module:module_chartwarper}.
 * @type {Array<Object>}
 * @constant
 * @alias module:module_intro.intro_beforechange
 */                               
g.module_intro.intro_beforechange = [{           
                                     element: 'container_ser',  
                                     click: '#container_ser_outer-btn'
                                    }, {
                                     element: 'container_rangechart',
                                     click: '#container_ser_outer-btn'
                                    },{
                                     element: 'container_ser_lin',
                                     click: '#container_ser_outer-btn'
                                    },{
                                     element: 'chart-fyo',
                                     click: '#container_ser_outer-btn'
                                    },{
                                     element: 'container_lin',
                                     click: '#container_lin_outer-btn'
                                    }]


/**
 Defines the time (milliseconds) between each time increment when in 'Play' mode. Only required when a range_chart is implemented.
 * @constant
 * @type {Number} 
 * @alias module:g.dev_defined.autoplay_delay
 */
g.dev_defined.autoplay_delay = 2000;  

/**
 Defines whether at the end of the timeline, 'Play' mode continues to play from the beginning automatically. Only required when a range_chart is implemented.
 * @constant
 * @type {Boolean} 
 * @alias module:g.dev_defined.autoplay_rewind
 */
g.dev_defined.autoplay_rewind = false; 
                                   


// 1) Data parameters
//------------------------------------------------------------------------------------

/**
 Defines the type of medical data parsed in the dashboard. <br>
 <br>
 Currently accepted values are:
 <ul>
     <li><code>surveillance</code> (aggregated)</li>
     <li><code>outbreak</code> (linelist)</li>
 </ul>
 * @constant
 * @type {String} 
 * @alias module:g.medical_datatype
 */
g.medical_datatype = 'surveillance'; 

/**
 Defines your incidence (and mortality) computation. 
 * @constant
 * @type {Function} 
 * @param periode Number of epiweeks
 * @alias module:dev_defined.definition_incidence
 */
g.dev_defined.definition_incidence = function(value,pop,periode) {
        return value * 100000 / (pop * periode);             //Note: periode = number of epiweeks
};   

/**
 Defines your completeness computation.
 * @constant
 * @type {Boolean} 
 * @alias module:dev_defined.ignore_empty
 */
g.dev_defined.ignore_empty = true;

/**
 * Contains the list of implemented map units.
 * <br> Defined in {@link module:module_colorscale}.
  Currently accepted values are:
 <ul>
     <li><code>Cases</code></li>
     <li><code>Deaths</code></li>
     <li><code>IncidenceProp</code></li>
     <li><code>MortalityProp</code></li>
     <li><code>Completeness</code></li>
 </ul>
 * @type {Array.<String>}
 * @constant
 * @alias module:module_colorscale.mapunitlist
 */
if(!g.module_colorscale){
    g.module_colorscale = {}; 
}
g.module_colorscale.mapunitlist = ['Cases', 'Deaths','IncidenceProp','MortalityProp','Completeness'];

/**
 Defines a list of qualitative colors to be optionally used in charts.
 * @constant
 * @type {Array.<String>}
 * @alias module:module_colorscale.userdefined_colors
 */
g.module_colorscale.userdefined_colors = ['#333333', '#17becf', '#bcbd22', '#428bca', '#f69318','#9467bd', '#1b9e77', '#bd1d02', '#66a61e'];
//grey, turquoise, lime green, blue, orange, purple, green, red, green


/**
 Defines combinations of geometry buttons (defined by @link g.geometry_keylist) and map unit buttons (defined by @link module:module_colorscale.mapunitlist) that are not compatible.
 For example, hospitals normally do not have incidence or mortality rates because they do not have an associated population number.
 * @constant
 * @type {Array.<Object>}
 * @alias module:dev_defined.incompatible_buttons
 */
/*g.dev_defined.incompatible_buttons = [{unit: 'IncidenceProp',
                                       geo: 'hosp'},
                                      {unit: 'MortalityProp',
                                       geo: 'hosp'
                                      }]*/
//g.dev_defined.incompatible_buttons = [];                                      


/**
Defines whether or not the new population format is used. The new format allows for the definition of multiple years of population numbers. 
 * @constant
 * @type {Boolean} 
 * @alias module:module_population.pop_new_format
 */
if(!g.module_population){
    g.module_population = {}; 
}
g.module_population.pop_new_format = true;    

/**
 Lists the keys used to refer to specific {@link module:g.population_data} fields. It makes the link between headers in the data files and unambiguous keys used in the code.<br>
 * @constant
 * @type {Object} 
 * @alias module:module_population.pop_headerlist
 * @property {String} <code>admNx</code>    - The administrative or medical division name, format: <code>Adm1_name, Adm2_name...</code>
 * @property {Object} <code>pop</code>      - The population numbers for each given year
 * @property {Number} pop.header_in_datafile - The column header for a specified year in the data file, defining the associated year number
 */ 
g.module_population.pop_headerlist = {
    admNx: 'name',
    pop: {yr_2016: 2016,  
          yr_2017: 2017} 
};

/**
Defines the percentage of the population that is assumed to be under 5yrs old. 
 * @constant
 * @type {Number} 
 * @alias module:module_population.pop_new_format
 */
g.module_population.pop_perc_u5 = 18.9; 

/**
Defines the percentage annual growth of the population for years for which no population data is available.
 * @constant
 * @type {Number} 
 * @alias module:module_population.pop_annual_growth
 */
g.module_population.pop_annual_growth = 3.0;


//**************************************************************************************


/**
 * Defines the data parsed in the dashboard (urls and sources type). Order matters.<br>
 * <br>
 * Currently accepted methods are:
 * <ul>
 *    <li><code>arcgis_api</code> (not published yet)</li>
 *    <li><code>kobo_api</code> (not published yet)</li>
 *    <li><code>d3</code></li>
 *    <li><code>medicald3server</code></li>
 *    <li><code>medicald3noserver</code></li>
 *    <li><code>geometryd3</code></li>
 *    <li><code>populationd3</code></li>
 *    <li><code>medicalxlsx</code></li>
 * </ul>
 * @constant
 * @type {Object} 
 * @alias module:g.module_getdata
 */
g.module_getdata = {
    geometry: {         //these layers are displayed explicitly in the map
        admN1: {
            method:  'geometryd3',
            options: {  url: './data/geo_cod_adm1.geojson',
                        type: 'json'}
            },
        admN2: {
            method:  'geometryd3',
            options: {  url: './data/geo_cod_adm2.geojson',
                        type: 'json'}
            }
    },
    extralay:{      //these layer don't contain data so are only implicitly used for other purposes, e.g. masks, backgrounds, drawing
        mask:{
            method: 'd3',
            options: {  url: './data/geo_cod_adm1.geojson',
                        type: 'json'}
        },
        admN1:{
            method: 'd3',
            options: {  url: './data/geo_cod_adm1.geojson',
                        type: 'json'}
        },
    },
    geometry_altnames:{
        alt: {
            method: 'geonamescsv',
            options: {  url: './data/geo_altnames.csv',
                        type: 'csv'}   
        }
    },
    medical:{
      /*medical: {
            method: 'medicalxlsx',
            options: { url: './input/', 
                       type: 'xlsx'
                      }
      }*/
      medical: {
            method: 'medicald3noserver',
            options: { url: 'input/kere_demo_data.csv', 
                       type: 'csv'
                      }
      }
    },
    population:{
        pop: {
            method: 'populationd3',
            options: {  url: './data/kere_pop.csv',
                        type: 'csv'}   
        }
    }
};


/**
 Lists the keys used to refer to specific {@link module:g.medical_data} fields. It makes the link between headers in the data files and unambiguous keys used in the code.
 Note that where two keys refer to the same header in the datafile, they are considered to 'share' the attribute between two different geometry layers. Both geometries must be defined and there <i>must</i> be an array defined in {@link module:g} that specifies the individual feature names to be used in one of them.
 The extraction of some feature names from a shared attribute is defined in {@link module:module_datacheck.dataprocessing}
 <br>
 Each element in the object is coded in the following way:
 <pre>*key_in_dashboard*: '*header_in_datafile*',</pre>
 * @constant
 * @type {Object}
 * @alias module:g.medical_headerlist 
 **/

g.medical_headerlist = {
    epiwk: 'epiweek',     // Epidemiological week: format YYYY-WW
    admN1: 'province',      // Name of administrative/health division level N1 
    admN2: 'zone',
    disease: 'disease',
    fyo: 'fyo',
    case: 'cas',
    death: 'dec', 
};

//If data comes from spreadsheet, not from data manager, then give column letter and optional parameter for each field
g.medical_headers_xlsx = {
    epiwk: ['D', 'req'],        
    admN1: ['B', 'req'], 
    admN2: ['C', 'req'], 
    disease: ['F', 'req'], 
    case_u5:  ['G', 'not_req'], 
    case_o5:  ['I', 'not_req'], 
    death_u5:  ['H', 'not_req'], 
    death_o5:  ['J', 'not_req'], 
}

/**
 Defines individual feature names from a single geometry file (e.g. admN2) that should be applied to a different geometry (e.g. hosp). The array should be named 'g.data_spec.name' where 'name' is the name of the new layer as defined in g.medical_headerlist (e.g. hosp).
 * @constant
 * @type {Array.<{String}>} 
 * @alias module:g.data_spec.combine_data
 */
g.data_spec = {};
//g.data_spec.hosp = ["Masanga Leprosy Hospital", "Lion Heart Medical Hospital", "Magburaka Government Hospital"];  

/**
 Defines individual data records that should be added into a geometry with a different name. The admin level, or 'geo-level' must also be specified.
 This allows for multiple named records to be summed into a single geometry.
 * @constant
 * @type {Array.<{geo_level: String, geo_name: String, add_into: String}>} 
 * @alias module:g.data_spec.combine_data
 */
/*g.data_spec.combine_data = [{
                                geo_level: 'admN2',
                                geo_name: 'Magburaka Under Five Clinic',
                                add_into: 'Magburaka MCHP'
                            },{
                                geo_level: 'admN2',
                                geo_name: 'Magboki Road Mile 91 CHP',
                                add_into: 'Esthers/Magboki Road Mile 91 CHP'
                            }];*/

/**
 Defines the relationship between each map layer using a tree-structured numbering system. Top layers are defined as integers, while child layers are defined by their parental 'branch' followed by their own unique integer. Distinction between levels are made by '.'. If multiple layers have the same parent, then they are siblings.
 * @constant
 * @type {Object} 
 * @alias module:g.viz_layer_pos
 */
g.viz_layer_pos = {admN1: '0',     // 0 = top layer
                   admN2: '0.1',   // 0.1 = child of 0, sibling to 0.2
                   //hosp: '0.2'   // 0.2 = child of 0, sibling to 0.1
                  };

function main_loadfiles_readvar(){  //re-loads variables that require g.module_lang.current - in case user changes language from default
    /**
     Lists the keys from {@link module:g.medical_headerlist} that require custom parsing (eg. translate numbers into words).<br>
     Each element in the object is coded in the following way:
     <pre>*key_in_dashboard*: {*category1_in_medicaldata*: '*user-readable_output1*', *category2_in_medicaldata*: '*user-readable_output2*', ...},</pre>
     * @constant
     * @type {Object.<String, Object>} 
     * @alias module:g.medical_read
     * @todo Why is it in a function?
     */
    g.medical_read = {
        fyo:        {
                     u:g.module_lang.text[g.module_lang.current].chart_fyo_labelu,
                     o:g.module_lang.text[g.module_lang.current].chart_fyo_labelo,
                     a:g.module_lang.text[g.module_lang.current].chart_fyo_labela}     
    };
}



// 2) Data check parameters
//------------------------------------------------------------------------------------
/**
 Associates keys from {@link module:g.medical_headerlist} with datacheck tests performed in {@link module:module_datacheck~dataprocessing} and defined in {@link module:module_datacheck~testvalue}.<br>
 The elements are coded in the following way:
 <pre>*key*: {test_type: '*test_name*', setup:'*additional_elements*'},</pre>
 <br>
     Currently implemented test_types are:
     <ul>
        <li><code>none</code> which does not check anything,</li>
        <li><code>epiwk</code> which checks format is 'YYYY-WW',</li>
        <li><code>ingeometry</code> which checks whether the location name in the {@link g.medical_data} matches any location name in the {@link g.geometry_data} of the same divisional level,</li>
        <li><code>integer</code> which checks if the value is an integer,</li>
        <li><code>inlist</code> which checks if the value is in a list (parsed in <code>setup</code>),</li>
        <li><code>integer</code> which checks if the value is an integer.</li>
    </ul>
 * @constant
 * @type {Object.<String, Object>} 
 * @alias module:module_datacheck.definition_value
 * @todo Should maybe merged with merged with {@link module:g.medical_read}.
 */
if(!g.module_datacheck){
    g.module_datacheck = {}; 
}
g.module_datacheck.definition_value = {
    epiwk:  {test_type: 'epiwk',        setup: 'none'}, // Epidemiological week: format YYYY-WW
    admN1:  {test_type: 'ingeometry',   setup: 'normalize'}, // Name of division level N1 
    admN2:  {test_type: 'ingeometry',   setup: 'normalize'}, // Name of division level 
    fyo:{test_type: 'inlist',       setup: ["u","o"]},  // Depends on data source
    /*case_u5: {test_type: 'integer',      setup: 'none'}, 
    case_o5: {test_type: 'integer',      setup: 'none'}, 
    death_u5: {test_type: 'integer',      setup: 'none'}, 
    death_o5: {test_type: 'integer',      setup: 'none'}, */
    case: {test_type: 'integer',      setup: 'none'}, 
    death:{test_type: 'integer',      setup: 'none'}, 
};

/**
 * Defines an array of Disease to be used as an <code>inlist</code> check in {@link module:module_datacheck~dataprocessing}. In case the list of disease to follow is not predefined, an empty array must be parsed and the list of diseases will be created in {@link module:module_datacheck~dataprocessing}.
 * @constant
 * @type {Array.<String>} 
 * @alias module:g.medical_diseaseslist
 */
g.medical_diseaseslist = []; // Complete list of disease surveilled or left empty to build the list from data
/* g.medical_diseaselist_trans = {"Morsure de Serpent": 'Snake Bite', "Piqure de Scorpion": 'Scorpion Bite', "Suspicion de Paludisme": 'Suspected Malaria', "Paludisme Testes": 'Tested Malaria', "Paludisme Confirmé":'Confirmed Malaria', "PFA": 'Acute Flaccid Paralysis',
"Meningite": 'Meningitis', "TNN": 'Neonatal Tetanus', "Décès Maternels": 'Maternal Death', "Rougeole": 'Measles', "Fièvre Jaune": 'Yellow Fever',
"Malnutrition Sévère": 'Severe Malnutrition', "Malnutrition Modérée": 'Moderate Malnutrition', "Suspicions Hepatite E": 'Suspected Hepatitis E',
"Ver de Guinée": 'Guinea Worm', "Choléra": 'Cholera'};*/



// Define here the list of fields that are expected to constitute a unique identifier of a record
/**
 Defines the list of fields that are expected to constitute a unique identifier of a record to be used in the errors log in {@link module:module_datacheck}.
 The elements are coded in the following way:
 <pre>{key:  '*header_in_datafile*', isnumber: *boolean*},</pre>
 * @constant
 * @type {Array.<{key: String, isnumber: Boolean}>} 
 * @alias module:module_datacheck.definition_record
 */
g.module_datacheck.definition_record = [
    {key: g.medical_headerlist.epiwk, isnumber: false}, // 'true' key as in data file
    {key: g.medical_headerlist.disease, isnumber: false}, // 'true' key as in data file
    {key: g.medical_headerlist.admN1, isnumber: false}, // 'true' key as in data file
    {key: g.medical_headerlist.admN2, isnumber: false}, // 'true' key as in data file
    {key: g.medical_headerlist.fyo, isnumber: false}, // 'true' key as in data file
];


//Define here list of adm name differences to be displayed on dashboard (e.g. if a district name has changed can keep a ref to old name)
/*g.geometry_altnames = [
  {
    data_name: 'Ennedi Ouest, Mourtcha',
    display_name: 'Ennedi Ouest, Mourtcha (Kalaït)'

  }, {
    data_name: 'Logone Oriental, Baibokoum',
    display_name: 'Logone Oriental, Baibokoum (Béssao)'
  }
];*/



// 3) Chart parameters
//------------------------------------------------------------------------------------
/**
 Lists the charts and maps to be produced by {@link module:main-core} as well as defines their main characteristics.<br>
 Each element in the object contains the following sub-elements:
 
 * ```
 chart_id:  {
    
    // Defined by the developer:
    domain_builder: {String},             // builds the domain for the chart - options include:'epiweek', 'date', 'date_extent', 'readcat', 'integer_ordinal', 'integer_linear', 'week', 'year', 'none', 
    domain_parameter: {String},           // domain parameter used to customize x axis scale types - options include: 'custom_ordinal' or 'custom_epitime_all' or 'custom_epitime_range' or 'custom_epitime_annual' or 'custom_log' or 'custom_date' or 'none'
    instance_builder: {String},           // defines the dc chart type - 'bar' or 'multiadm' or 'row' or 'stackedbar' or 'pie' or 'composite' or 'series' or 'table',
    dimension_builder: {String},          // builds the dimension for the chart - 'multiadm' or 'integer' or 'normalize' or 'year' or 'week' or 'week_num' or 'date' or 'epidate' or 'readcat' or 'auto' or 'readcat' or 'readncombcat'
    dimension_parameter: {Object},        // defines the column to be used for building the dimension - if it is shared with other charts then a common 'namespace' is assigned
                                          // @property {String} chart_id.dimension_parameter.column - Defines the column heading that is used for the dimension
                                          // @property {Boolean} chart_id.dimension_parameter.shared - Defines whether or not there is a namespace shared with other charts
                                          // @property {String} chart_id.dimension_parameter.namespace - If dimension_parameter.shared==true, a unique namespace for all charts that share this dimension must be given.
    group_builder: {String},              // builds the group for the chart - 'multiadm' or 'stackedbar' or count' or 'auto' or 'series_age' or 'series_all' or 'series_yr' or 'none',
    group_parameter: {Array},             // defines the columns to be used for building the group
    range_chart: {Boolean},               // determines the chart used to filter by time using range handles; there should be no more than one range chart per dashboard
    buttons_filt_range: {Array.<Object>}, // lists and defines the buttons to be used as quick filters for the epiweek range
                                          // @property {String} buttons_filt_range[].btn_type - options include: 'lastXepiweeks', 'lastXepimonths', 'lastXepiyears'
                                          // @property {Number} buttons_filt_range[].btn_param - defines the number of 'X' in the btn_type
                                          // @property {String} buttons_filt_range[].btn_text - the text to be displayed on the butons
                                          // @property {Boolean} buttons_filt_range[].btn_default - defines which button will be the default on loading
    display_title: {Boolean},             // Defines whether or not to display individual chart titles (only for g.new_layout)
    display_filter: {Boolean},            // Defines whether or not to display individual chart filters (not for g.new_layout)
    display_axis: {Object},               // Defines the text to be used for x and y labels on x/y-type charts; y_imr is the y-label when looking at Incidence & Mortality rates; y_comp is the y-label when looking at Completeness 
    userdefined_colors: {Boolean},        // Defines whether to use the pre-specifieduser-defined colors for the chart (define by g.module_colorscale.userdefined_colors in module:dev_defined)
    display_colors: {Array.<Integer>},    // Refers to colors in g.color_domain, or g.module_colorscale.userdefined_colors if userdefined_colors is 'true',            
    display_intro_position: {String},     // Determines the position of the Help window with respect to the chart or div it is describing - 'top' or 'bottom' or 'right' or 'left' or 'none',
    display_intro_container: {String},    // Only required for referencing Help window to a div other than its own (e.g. an outer div to encompass buttons) 
    buttons_list: {Array.<String>},       // List of optional buttons to be included for each chart - ['reset','help']; 'multiadm' maps can additionally include 'expand','lockcolor' and 'parameters'
    sync_to: {Array.<String>},            // ['chart_id's] - sync filtering with other charts; this is only used for stackedbar charts
    
    // Processed by the dashboard:
    chart: {Object},                   // {@link module:main_core~instancBuilder} & {@link module:main_core~chartBuilder}
    dimension: {Object},               // {@link module:main_core~dimensionBuilder}
    domain: {Array},                   // {@link module:main_core~domainBuilder}
    group: {Object},                   // {@link module:main_core~groupBuilder}

 }
  *```
 <br>
 Each element is detailed in the following.
 * <ul>
    <li><code>chart_id</code>, 'chart-'<code>chart_id</code> must match a <code>div id</code> in the *index.html* file (the dashboard layout).</li>
    <li><code>domain_builder</code> Definitions in: {@link module:main_core~domainBuilder}.
    <br>This selects the domain building method. Custom domains are built for all cases where code>domain_builder =/= 'none'</code>.</li>
    <br>
    <li><code>domain_parameter</code> 
    <br>This parameter is used to customize x axis scale types.</li>
    <br>
    <li><code>instance_builder</code> Definitions in: {@link module:main_core~instanceBuilder} and  {@link module:main_core~chartBuilder}.</li>
    <br>
    <li><code>dimension_builder</code> Definitions in {@link module:main_core~dimensionBuilder}.</li>
    <br>
    <li><code>dimension_parameter</code> 
    <br>This parameter defines the column to be used for building the dimension.
    <ul> 
      @property {String} dimension_parameter.column - Defines the column heading that is used for the dimension
      @property {Boolean} dimension_parameter.shared - Defines whether or not there is a namespace shared with other charts
      @property {String} dimension_parameter.namespace - If dimension_parameter.shared==true, a unique namespace for all charts that share this dimension must be given.
 




        <li>If == <code>'auto'</code> - the dimension is assumed not to be shared - that means that <code>'auto'</code> is the dimension building method and <code>chart_id</code> is used to select the field to filter in {@link module:g.medical_data}.</li>

        <li>If == <code>'custom'</code>  - the dimension is assumed not to be shared - that means that <code>'chart_id'</code> is the dimension building method and it is used as well to select the field to filter in {@link module:g.medical_data} (when not overridden by the dimension builder definition).</li>

        <li>If == <code>'shared'</code> - <code>dimension_setup</code> parameter is compulsory.
            <ul>
                <li><code>dimension_setup[0]</code> is the <code>chart_id</code> of the chart with which the dimension is shared or the common identifier for the dimension</li>
                <li><code>dimension_setup[1]</code> can be <code>'auto'</code> or <code>'custom'</code> (just like a non-'shared' dimension...)
                    <ul> 
                        <li>If == <code>'auto'</code> that means that <code>'auto'</code> is the dimension building method and <code>dimension_setup[0]</code> is used to select the field to filter in {@link module:g.medical_data}.</li>

                        <li>If == <code>'custom'</code> that means that <code>dimension_setup[0]</code> is the dimension building method and it is used as well to select the field to filter in {@link module:g.medical_data} (when not overridden by the dimension builder definition).</li>
                </li>
            </ul>
        </li>
    </ul>
    Classical dimensions are stored under <code>[chart_id].dimension</code> in the {@link module:g.viz_definition} object. Whereas shared dimensions are stored under <code>[dimension_setup[0]].dimension</code>.
    </li>
    <br>
    <li><code>group_type</code> Can be: 'auto' or 'custom' or 'shared' (or 'none' for the data table) - Definitions in {@link module:main_core~groupBuilder}.
    <br>
    <ul> 
        <li>If == <code>'auto'</code>, that means that <code>'auto'</code> is the group building method.</li>

        <li>If == <code>'custom'</code>, that means that <code>'chart_type'</code> is the group building method.</li>
    </ul>
    Groups building instruction are specific to each {@link module:g.medical_datatype}.
    If {@link module:g.medical_datatype} == <code>'surveillance'</code> - <code>group_setup</code> parameter is compulsory. It is an Array where:
    <ul>
        <li><code>group_setup[0]</code> is used to select the field to count or sum in {@link module:g.medical_data}. NB: In a <code>'outbreak'</code> setting, records are counted from the patient list without a reference to a field.</li>
        <li><code>group_setup[1]</code> is used to select the field to create categories for stacked charts (<code>chart_type == stackedbar</code>. NB: Stacked chart have not been used yet in a <code>'outbreak'</code> setting.</li>
    </ul>
    </li>    
 * </ul>
 * @constant
 * @type {Object.<Object>}
 * @alias module:g.viz_definition 
 **/
function main_loadfiles_readcharts(){     //re-loads variables that may require g.module_lang.current - in case user changes language from default
    g.viz_definition = {
       multiadm:  { domain_builder: 'none',            
                    domain_parameter: 'none',

                    instance_builder: 'multiadm',

                    dimension_builder: 'multiadm',
                    dimension_parameter: {  column: 'none',
                                            shared: false,
                                            namespace: 'none'},

                    group_builder: 'multiadm',
                    group_parameter: {  column: ['case','death']},
                    
                    display_title: true,
                    display_colors: [0,1,2,3,4,5],  
                    display_intro_position: 'bottom',

                    buttons_list: ['reset','help','expand','lockcolor','parameters'], 
                    }, 

        disease:  { domain_builder: 'none', 
                    domain_parameter: 'none',

                    instance_builder: 'row',

                    dimension_builder: 'normalize',
                    dimension_parameter: {  column: 'disease',
                                            shared: false,
                                            namespace: 'none'},

                    group_builder: 'count',
                    group_parameter: {  column: 'none'},

                    display_title: true,
                    display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_disease_labelx,
                                     y:g.module_lang.text[g.module_lang.current].chart_disease_labely},
                    display_colors: [2],     

                    display_focusrows: ['Cholera', 'Fievre Jaune', 'Fievre Hemmorragique Ebola',  'Meningite', 'Paludisme', 'Rougeole'],  //these appear at top of row chart
                    display_intro_position: 'left',
                    
                    buttons_list: ['help'],
                    
                },
      
        case_ser: { domain_builder: 'date_extent',              
                    domain_parameter: 'custom_epitime_range',     

                    instance_builder: 'composite',

                    dimension_builder: 'epidate',
                    dimension_parameter: {  column: 'epiwk',
                                            shared: true,
                                            namespace: 'epirange'},

                    group_builder: 'series_age',
                    group_parameter: { column: ['case','fyo']},  
                    /*group_builder: 'series_all',
                    group_parameter: {column: ['case']},*/

                    display_title: false,
                    display_axis:   {x:'',
                                     y: g.module_lang.text[g.module_lang.current].chart_case_labely,
                                     y_imr: g.module_lang.text[g.module_lang.current].chart_ir_labely,
                                     y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely},    

                    userdefined_colors: true,   
                    display_colors: [0,1,2],   

                    display_intro_position: 'top',           
                    display_intro_container: 'container_ser',  
                    
                    buttons_list: ['help'],               
                },

        death_ser: {domain_builder: 'date_extent',                 
                    domain_parameter: 'custom_epitime_range',         

                    instance_builder: 'composite',

                    dimension_builder: 'epidate',
                    dimension_parameter: {  column: 'epiwk',
                                            shared: true,     
                                            namespace: 'epirange'},

                    group_builder: 'series_age',
                    group_parameter: {  column: ['death','fyo']},   
                    /*group_builder: 'series_all',
                    group_parameter: {column: ['death']},*/

                    display_title: false, 
                    display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_death_labelx,
                                     y:g.module_lang.text[g.module_lang.current].chart_death_labely,
                                     y_imr: g.module_lang.text[g.module_lang.current].chart_mr_labely,
                                     y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely},
                    
                    userdefined_colors: true,
                    display_colors: [0,1,2],   

                    display_intro_position: 'none',  
                            
                    buttons_list: ['help'],               
                },   

        ser_range: {domain_builder: 'date_extent',          
                    domain_parameter: 'custom_epitime_all',      

                    instance_builder: 'bar',

                    dimension_builder: 'epidate',
                    dimension_parameter: {  column: 'epiwk',        
                                            shared: true,
                                            namespace: 'epirange'},

                    group_builder: 'auto',                    
                    group_parameter: {column: ['case']},    

                    range_chart: true,                           
                    buttons_filt_range: [{btn_type:'lastXepiweeks', btn_param: 1, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last1epiweeks},  //note all buttons are 'relative' time
                                        {btn_type: 'lastXepiweeks', btn_param: 4, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last4epiweeks},
                                        {btn_type: 'lastXepiweeks', btn_param: 52, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last52epiweeks, btn_default: true},
                                        {btn_type: 'lastXepimonths', btn_param: 0, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last0epimonths},     //0 for current (possibly incomplete) epimonth
                                        {btn_type: 'lastXepimonths', btn_param: 1, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last1epimonths},  
                                        {btn_type: 'lastXepimonths', btn_param: 3, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last3epimonths}, 
                                        {btn_type: 'lastXepiyears', btn_param: 0, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last0epiyears},       //0 for current (possibly incomplete) epiyear
                                        {btn_type: 'lastXepiyears', btn_param: 1, btn_text: g.module_lang.text[g.module_lang.current].qf_btns_last1epiyears}],
                    
                    display_title: true,
                    display_axis:   {x:'',
                                     y:'',
                                     y_imr: '',
                                     y_comp: ''},     
                    
                    display_colors: [1], 

                    display_intro_position: 'bottom',           
                    display_intro_container: 'container_rangechart',
                    
                    buttons_list: ['help'],               
                },
        
        case_lin: {domain_builder: 'week',
                    domain_parameter: 'custom_epitime_annual',

                    instance_builder: 'composite',

                    dimension_builder: 'week_num',
                    dimension_parameter: {  column: 'epiwk',
                                            shared: true,
                                            namespace: 'week'},

                    group_builder: 'series_yr',
                    group_parameter: {  column: ['case','epiwk']},

                    display_title: false,
                    display_axis:   {x:'',
                                     y: g.module_lang.text[g.module_lang.current].chart_case_labely,
                                     y_imr: g.module_lang.text[g.module_lang.current].chart_ir_labely,
                                     y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely},       
                    
                    userdefined_colors: true,
                    display_colors: [3,4,5,6,7],          
                    display_intro_position: 'top',                  
                    display_intro_container: 'container_lin',
                    buttons_list: ['help'],
                },

        death_lin: {domain_builder: 'week',
                    domain_parameter: 'custom_epitime_annual',  

                    instance_builder: 'composite',

                    dimension_builder: 'week_num',
                    dimension_parameter: {  column: 'epiwk',
                                            shared: true,
                                            namespace: 'week'},

                    group_builder: 'series_yr',
                    group_parameter: {  column: ['death', 'epiwk']},

                    display_title: false,
                    display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_death_labelx,
                                     y:g.module_lang.text[g.module_lang.current].chart_death_labely,
                                     y_imr: g.module_lang.text[g.module_lang.current].chart_mr_labely,
                                     y_comp: g.module_lang.text[g.module_lang.current].chart_comp_labely},        
              
                    userdefined_colors: true,
                    display_colors: [3,4,5,6,7],

                    display_intro_position: 'none',
                    buttons_list: ['help'],
                },    

        fyo: {  domain_builder: 'none',
                    domain_parameter: 'none',  

                    instance_builder: 'pie',

                    dimension_builder: 'readcat',
                    dimension_parameter: {  column: 'fyo',
                                            shared: false,
                                            namespace: 'none'},
                    group_builder: 'auto',
                    group_parameter: {  column: ['case']},
                    
                    display_title: true,
                    userdefined_colors: true,
                    display_colors: [1,2],

                    display_intro_position: 'left',
                    buttons_list: ['reset','help'],
                    
                },

        year: {     domain_builder: 'year',
                    domain_parameter: 'none',

                    instance_builder: 'pie',

                    dimension_builder: 'year',
                    dimension_parameter: {  column: 'epiwk',
                                            shared: false,
                                            namespace: 'none'},

                    group_builder: 'auto',
                    group_parameter: {  column: ['case']},

                    display_title: true,
                    userdefined_colors: true,
                    display_colors: [3,4,5,6,7],

                    display_intro_position: 'left',     
                    
                    buttons_list: ['reset','help'],
                },

        table:  {   domain_builder: 'none',
                    domain_parameter: 'none',            
                    
                    instance_builder: 'table',

                    dimension_builder: 'auto',
                    dimension_parameter: {  column: 'epiwk',
                                            shared: false,
                                            namespace: 'none'},

                    group_builder: 'none',
                    group_parameter: {  column: 'none'},

                    sums_in_footer: ['case','death'], //column names from g.medical_headerlist

                    display_intro_position: 'top',
                    display_intro_container: 'container_table',
                    buttons_list: ['help'],
                }, 
    };
};

/**
 Defines the chart used as a reference for time-related interactions.
 * @constant
 * @type {String} 
 * @alias module:g.viz_timeline
 */
g.viz_timeline = 'ser_range'; 

/**
 Defines the time (milliseconds) between each time increment when in 'Play' mode. Only required when a range_chart is implemented.
 * @constant
 * @type {Number} 
 * @alias module:g.dev_defined.autoplay_delay
 */
//g.dev_defined.autoplay_delay = 2000;  

/**
 Defines whether at the end of the timeline, 'Play' mode continues to play from the beginning automatically. Only required when a range_chart is implemented.
 * @constant
 * @type {Boolean} 
 * @alias module:g.dev_defined.autoplay_rewind
 */
//g.dev_defined.autoplay_rewind = false; 


/**
 Defines the charts that are using time dimensions and that should be synchronized with the reference defined with {@link module:g.viz_timeline}.
 * @constant
 * @type {Array.<String>} 
 * @alias module:g.viz_timeshare
 * @todo Automate
 */
g.viz_timeshare = ['case_ser', 'death_ser'];

/**
 Defines the chart used as a reference for location-related interactions (e.g. incidence rates).
 * @constant
 * @type {String} 
 * @alias module:g.viz_locations
 */
g.viz_locations = 'multiadm';


/*if(!g.module_intro){
    g.module_intro = {}; 
}
//g.dev_defined.intro_order = [];
//Define order of all intro topics, can either be charts (defined by name given above) or divs (defined in index.html)
//For and div intros, need to also define intro_position
g.module_intro.intro_order = ['intro', 'menu', 'multiadm', 'disease', 'container_ser_lin', 'case_ser', 'case_lin', 'ser_range', 'fyo', 'year', 'table'];
g.module_intro.intro_position = [{container: 'container_ser_lin',
                                 position: 'top'
                                }];
//Here define which buttons (defined by div id) to click on before an intro element is called (to ensure appropriate chart/div is 'open' or not 'hidden' at the time it is called)
//Buttons defined in module_chartwarper.js
g.module_intro.intro_beforechange = [{           
                                     element: 'container_ser',  
                                     click: '#container_ser_outer-btn'
                                    }, {
                                     element: 'container_rangechart',
                                     click: '#container_ser_outer-btn'
                                    },{
                                     element: 'container_ser_lin',
                                     click: '#container_ser_outer-btn'
                                    },{
                                     element: 'chart-fyo',
                                     click: '#container_ser_outer-btn'
                                    },{
                                     element: 'container_lin',
                                     click: '#container_lin_outer-btn'
                                    }]
*/                                    