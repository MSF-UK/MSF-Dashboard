// *2016/12/11 - MSF-Dashboard v1.0.0 - This example is adapted from the Bentiu Dashboard for Cholera Outbreak.*  
//  
// This module contains the parameters of the dashboard that have to be defined by the developer in order to tailor the tool to the specific needs of the future users. In the following we will look at the parameters needed to:
// - get the medical and geometry data,
// - check the medical and geometry data,
// - define the charts and maps, feed them with the correct data and define specific interaction.
//
// All these parameters are defined in <code>dev/dev-defined.js</code> and are stored in the global variable <code>g</code>.  
// <code>g</code> stores other Objects as well that are not defined by the developer but that are the results of the processing and interactions. <code>g</code> can be accessed through your developer browser interface.  
// As a reminder, two other files are crucial when setting up a new version of the Dashboard which are:
// - the 'index.html' file which defines the divs and the positions of the charts and maps, and
// - the 'lang/module-lang.js' which contains all the text that have to be displayed and its various translations.
/*------------------------------------------------------------------------------------
    MSF Dashboard - dev-defined.js
    (c) 2015-2016, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/

// <code>g.dev_defined</code> is the namespace for this module.
g.dev_defined = {};

// Activates autoload dashboard (for development).
g.module_datacheck.autoload = false;
// Components of the configuration file:
// 1. Data parameters
// 2. Data check parameters
// 3. Charts parameters

// 1) Data parameters
//------------------------------------------------------------------------------------

// Defines the type of medical data parsed in the dashboard.  
// Currently accepted values are:
// - <code>surveillance</code> (aggregated) or
// - <code>outbreak</code> (linelist).
g.medical_datatype = 'outbreak';

// Defines your incidence (and mortality) computation.
g.dev_defined.definition_incidence = function(value,pop,periode) {
    return value * 10000 / (pop * periode);
};

// Defines your completeness computation.
g.dev_defined.ignore_empty = true;

// Contains the list of implemented map units in 'module_colorscale'.  
// Currently accepted values are:
// - <code>Cases</code>
// - <code>Deaths</code>
// - <code>IncidenceProp</code>
// - <code>MortalityProp</code>
// - <code>Completeness</code>
if(!g.module_colorscale){
    g.module_colorscale = {};
}
g.module_colorscale.mapunitlist = ['Cases','Deaths','IncidenceProp','MortalityProp'];

// Defines the data parsed in the dashboard (urls and sources type). Order matters.  
// Currently accepted methods are:
// - <code>arcgis_api</code> (not published yet)
// - <code>kobo_api</code> (not published yet)
// - <code>d3</code>
// - <code>medicald3server</code>
// - <code>medicald3noserver</code>
// - <code>geometryd3</code>
// - <code>populationd3</code>
// - <code>medicalxlsx</code>
g.module_getdata = {
    geometry: {
        admN1: {
            method:  'geometryd3',
            options: {  url: './data/geo_adm10.geojson',
                        type: 'json'}
            },
        admN2: {
            method:  'geometryd3',
            options: {  url: './data/geo_adm11.geojson',
                        type: 'json'}
            }
    },
    extralay:{
        points:{
            method: 'd3',
            options: {  url: './data/geo_orps.geojson',
                        type: 'json',
						front: true}
        }
    },
    medical:{
        medical: {
            method: 'medicalfs',
            options: {  url: './input/',
                        type: 'csv'}
        }
    },
    population:{
        pop: {
            method: 'populationd3',
            options: {  url: './data/pop.csv',
                        type: 'csv'}
        }
    }
};

// Lists the keys used to refer to specific <code>g.medical_data</code> fields. It makes the link between headers in the data files and unambiguous keys used in the code.  
// Each element in the object is coded in the following way:  
// <pre>*key_in_dashboard*: '*header_in_datafile*',</pre>
g.medical_headerlist = {
    epiwk: 'EpiWk',     // Epidemiological week: format YYYY-WW
    admN1: 'Geo_L1',    // Name of administrative/health division level N1
    admN2: 'Geo_L2',    // Name of administrative/health division level N2
    age: 'Age_y',       // Age of patient in years
    sex: 'Sex',         // Sex: 1 = Male, 2 = Female
    preg: 'Pregnant',   // Pregnancy: 1 = Pregnant, 2 = Not Pregnant or N/A
    sev: 'Dehydr_Adm',  // Dehydratiation severity: A = Light, B = Moderate, C = Severe
    dur: 'StayDays',    // Stay duration in days
    out: 'Outcome',     // Outcome: 1 = Cured, 2 = Dead, 3 = Interrupted F/U, 4 = Transfered
};

// Lists the keys used to refer to specific <code>g.population_data</code> fields. It makes the link between headers in the data files and unambiguous keys used in the code.  
// Each element in the object is coded in the following way:  
// <pre>\*key_in_dashboard\*: '\*header_in_datafile\*',</pre>
// Currently implemented keys are:
// - <code>admNx</code> for administrative or medical division name, format: <code>Adm1_name, Adm2_name...</code>,
// - <code>pop</code> for population.
g.population_headerlist = {
    admNx: 'name',
    pop: 'pop'
};

// Lists the keys from <code>g.medical_headerlist</code> that require custom parsing (eg. translate numbers into words).  
// Requires <code>g.module_lang</code>.  
// Each element in the object is coded in the following way:  
// <pre>*key_in_dashboard*: {  
//   *category1_in_medicaldata*: '*user-readable_output1*',  
//   *category2_in_medicaldata*: '*user-readable_output2*',  
//   ...  
// },</pre>
function main_loadfiles_readvar(){
    g.medical_read = {
        out:        {'1':g.module_lang.text[g.module_lang.current].chart_out_label1,
                     '2':g.module_lang.text[g.module_lang.current].chart_out_label2,
                     '3':g.module_lang.text[g.module_lang.current].chart_out_label3,
                     '4':g.module_lang.text[g.module_lang.current].chart_out_label4},
        sev:        {A:g.module_lang.text[g.module_lang.current].chart_sev_labelA,
                     B:g.module_lang.text[g.module_lang.current].chart_sev_labelB,
                     C:g.module_lang.text[g.module_lang.current].chart_sev_labelC},
        sexpreg:    {'12':g.module_lang.text[g.module_lang.current].chart_sexpreg_label12,
                     '22':g.module_lang.text[g.module_lang.current].chart_sexpreg_label22,
                     '21':g.module_lang.text[g.module_lang.current].chart_sexpreg_label21},
    };
}

// 2) Data check parameters
//------------------------------------------------------------------------------------

// Associates keys from <code>g.medical_headerlist</code> with datacheck tests performed in <code>module_datacheck~dataprocessing</code> and defined in <code>module_datacheck~testvalue</code>.  
// The elements are coded in the following way:
// <pre>*key*: {test_type: '*test_name*', setup:'*additional_elements*'},</pre>
// Currently implemented test_types are:
// - <code>none</code> which does not check anything,
// - <code>epiwk</code> which checks format is 'YYYY-WW',
// - <code>ingeometry</code> which checks whether the location name in the <code>g.medical_data</code> matches any location name in the <code>g.geometry_data</code> of the same divisional level,
// - <code>integer</code> which checks if the value is an integer,
// - <code>inlist</code> which checks if the value is in a list (parsed in <code>setup</code>),
// - <code>integer</code> which checks if the value is an integer.
if(!g.module_datacheck){
    g.module_datacheck = {};
}
g.module_datacheck.definition_value = {
    epiwk:  {test_type: 'epiwk',        setup: 'none'},           // Epidemiological week: format YYYY-WW
    admN1:  {test_type: 'ingeometry',   setup: 'none'},           // Name of division level N1
    admN2:  {test_type: 'ingeometry',   setup: 'none'},           // Name of division level N2
    age:    {test_type: 'integer',      setup: 'none'},           // Age of patient in years
    sex:    {test_type: 'inlist',       setup: ["1","2"]},        // Sex: 1 = Male, 2 = Female
    preg:   {test_type: 'inlist',       setup: ["1","2"]},        // Pregnancy: 1 = Pregnant, 2 = Not Pregnant
    sev:    {test_type: 'inlist',       setup: ["A","B","C"]},    // Dehydratiation severity: A = Light, B = Moderate, C = Severe
    dur:    {test_type: 'integer',      setup: 'none'},           // Stay duration in days
    out:    {test_type: 'inlist',       setup: ["1","2","3","4"]} // Outcome: 1 = Cured, 2 = Dead, 3 = Interrupted F/U, 4 = Transfered
};

// Defines an array of Disease to be used as an <code>inlist</code> check in <code>module_datacheck~dataprocessing</code>. In case the list of disease to follow is not predefined, an empty array must be parsed and the list of diseases will be created in <code>module_datacheck~dataprocessing</code>.
g.medical_diseaseslist = ['Cholera']; 

// Defines the list of fields that are expected to constitute a unique identifier of a record to be used in the errors log in <code>module_datacheck</code>.  
// The elements are coded in the following way:
// <pre>{key:  '*header_in_datafile*', isnumber: *boolean*},</pre>
g.module_datacheck.definition_record = [
    {key: 'PatientID', isnumber: false},                    // 'true' key as in data file
    {key: g.medical_headerlist.epiwk, isnumber: false},     // 'true' key as in data file
    {key: g.medical_headerlist.disease, isnumber: false},   // 'true' key as in data file
    {key: g.medical_headerlist.admN1, isnumber: false},     // 'true' key as in data file
    {key: g.medical_headerlist.admN2, isnumber: false}      // 'true' key as in data file
];

// 3) Chart parameters
//------------------------------------------------------------------------------------

// Lists the charts and maps to be produced by <code>main-core</code> as well as defines their main characteristics.  
// Each element in the object contains the following sub-elements:
// <pre>chart_id:  {
//  
//  domain_builder: {String},
//  domain_parameter: *currently_not_used*,
//  
//  instance_builder: {String},
//  
//  dimension_builder: {String},
//  dimension_parameter: {  column: {Array.String},
//                          shared: {Boolean},
//                          namespace: {String}  },
//  
//  group_builder: {Array},
//  group_parameter: {  column: ['none']},
//  
//  sync_to: {Array.String},
//  
//  display_axis: {Object},
//  display_colors: {Array.Integer},
//  display_intro: {String},
//  display_filter: {Boolean},
//  display_idcontainer: {String},
//  buttons_list: {Array.String}
//  
// }</pre>
//  
// Each element is detailed in the following.  
// <code>**chart_id**</code>  
// =========================  
// 'chart-'<code>chart_id</code> must match a <code>div id</code> in the *index.html* file (the dashboard layout).
// <code>**domain_builder**</code> 
// =========================  
// <code>main_core~domainBuilder</code> builds domains from this parameter for charts when : <code>domain_type =/= 'none'</code>.  
// Definitions can be either 'linear': [min,max] (filtering is then performed by range) or 'ordinal': [lists, all, the, values, ...] (categories can be then filtered one by one).  
// All definitions uses <code>g.medical_data</code> except if indicated otherwise. <code>g.medical_headerlist</code> is required too.  
// List of current domain definitions is as follows:  
//    - <code>epiweek</code> [ordinal], lists all the epiweeks between the first and the last epiweeks of the dataset (from <code>epiwk</code> key),
//    - <code>year</code> [ordinal], lists all the years between the first and the last epiweeks of the dataset (from <code>epiwk</code> key),
//    - <code>week</code> [ordinal], lists all the weeks between the first week of the year and the last week of the year in the dataset (from <code>epiwk</code> key),
//    - <code>date</code> [linear], first and the last dates of the dataset (from <code>date</code> key),
//    - <code>readcat</code> [ordinal] lists all the categories used (from <code>g.medical_read['chart_id']</code> key),
//    - <code>integer_ordinal</code> [ordinal] lists all stay durations from zero to the maximum in the dataset (from <code>dur</code> key),
//    - <code>integer_linear</code> [linear] zero and maximum age of patients in the dataset +2 (to facilitate visualization) (from <code>age</code> key)
// On top of the domain a <code>NA</code> category is added as well in order to visualize data with missing or mismatched values.
//  
// <code>**instance_builder**</code> 
// =========================  
// <code>main_core~chartInstancer</code> and <code>main_core~chartBuilder</code> build chart instances from this parameter with *dc.js* or *dc.leaflet.js* or *datables.js*  
// List of current chart definitions is as follows:
// - <code>bar</code> creates a simple bar chart,
// - <code>pie</code> creates a simple pie chart,
// - <code>multiadm</code> creates a multiadm choropleth map (one administrative structure or more that are 'nested' one into the others), requires <code>g.geometry_keylist</code> and <code>module_multiadm.display</code>,
// - <code>row</code> creates a simple row chart,
// - <code>stackedbar</code> creates a bar chart  with stacked series,
// - <code>series</code> creates a multi series chart,
// - <code>table</code> creates a table to display data frome source.
//  
// <code>**dimension_builder** && **dimension_parameter**</code>
// =========================  
// <code>main_core~dimentsionBuilder</code> builds dimensions from this parameter with *crossfilter.js*, it correspond to the method to filter the data, to use a spreadsheet analogy, it correspond to the column that will be used to filter the dataset.  
// List of current dimension definitions is as follows:
// - <code>multiadm</code>, creates 'location' categories for each administrative level combining field from current administrative level and superiors (from <code>admNX</code> keys), requires <code>g.geometry_keylist</code>} and uses <code>module_datacheck.toTitleCase</code>},
// - <code>integer</code>, parses values from a given 'column' as integers,
// - <code>normalize</code>, creates simple categories from a given 'column' after normalizing the values,
// - <code>year</code>, parses years from a given 'column' that contains epiweeks (format YYYY-WW),
// - <code>week</code>, parses weeks from a given 'column' that contains epiweeks (format YYYY-WW),
// - <code>readcat</code>, creates categories from a given 'column' using <code>g.medical_read</code>},
// - <code>readncombcat</code>, creates categories from various 'columns' using <code>g.medical_read</code>},
// - <code>auto</code>, creates simple categories from a given 'column'.
//  
//  In the <code>dimension_parameter</code> the column (or the colums to combine) are selected, it is mentioned if the dimension is shared (multiple charts filter the same dimension) and if the namespace used to store the dimentsion is different from the <code>chart_id</code>.
//  
// <code>**group_builder** && **group_parameter**</code>
// =========================  
// <code>main_core~groupBuilder</code> builds groups from this parameter with *crossfilter.js*, it correspond to the method to aggregate the data, counting the records for a patient list or summing a specific column for surveillance data that can contain cases, death... Therefore Required objects are <code>g.medical_datatype</code> is required.  
// Groups are built on top of dimensions.  
// List of current group definitions is as follows:
// - <code>**outbreak**</code> (simply counts patients in patient list)
//   + <code>multiadm</code>, creates a group for each administrative level, requires <code>g.geometry_keylist</code>,
//   + <code>auto</code>, creates a simple group,
// - <code>**surveillance**</code> (sums or counts already aggregated data)
//   + <code>multiadm</code>, creates a group for each administrative level, requires <code>g.geometry_keylist</code>,
//   + <code>stackedbar</code>, creates a group summing independently 'under' and 'over' five years old record,
//   + <code>count</code>, creates a group counting record,
//   + <code>auto</code>, creates a simple group summing data.
//  In the <code>group_parameter</code> the column or the colums to aggregate are selected (eg. stackedbar chart or map with multiple units - NB: special treatment for outbreak maps).
//
// <code>**sync_to**</code>
// ========================
// <pre>['chart_id's]</pre>
// Syncronises filtering with other charts.
// <code>**display_axis**</code>
// ========================
// <pre>{x:'labelx',y:'labely'}</pre>
// Defines axis lables for x/y-type charts.
// <code>**display_colors**</code>
// ========================
// Refers to colors in <code>g.module_colorscale.colors</code>
// <code>**display_intro**</code>
// ========================
// Defines the position of the help window: 'top' or 'bottom' or 'right' or 'left' or 'none',
// <code>**display_filter**</code>
// ========================
// Defines whether filters are displayed or not (true or false).
// <code>**display_idcontainer**</code>
// ========================
// <pre>'div_id'</pre>
// To display buttons on a div different from: chart-'chart_id'
// <code>**buttons_list**</code>
// ========================
// <pre>['reset','help']</pre>
// Defines the list of buttons to be associated on each chart: any, all or none of the two for most of charts plus 'expand','lockcolor' and 'parameters' for 'multiadm' charts,
g.viz_definition = {
    multiadm: { domain_builder: 'none',
                domain_parameter: 'none',

                instance_builder: 'multiadm',

                dimension_builder: 'multiadm',
                dimension_parameter: {  column: 'none',
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'multiadm',
                group_parameter: {  column: [{key:'out',value:'2'}]},

                display_colors: [0,1,2,3,4,5],
                display_intro: 'bottom',
                display_filter: true,
                buttons_list: ['reset','help','expand','lockcolor','parameters'],

            },

    epiwk: {    domain_builder: 'epiweek',
                domain_parameter: 'none',

                instance_builder: 'bar',

                dimension_builder: 'auto',
                dimension_parameter: {  column: 'epiwk',
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'auto',
                group_parameter: {  column: ['none']},

                display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_epiwk_labelx,
                                 y:g.module_lang.text[g.module_lang.current].chart_epiwk_labely},
                display_colors: [4],
                display_intro: 'top',
                display_filter: true,
                buttons_list: ['reset','help'],

            },
    age: {      domain_builder: 'integer_linear',
                domain_parameter: 'none',

                instance_builder: 'bar',

                dimension_builder: 'integer',
                dimension_parameter: {  column: 'age',
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'auto',
                group_parameter: {  column: ['none']},

                display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_age_labelx,
                                 y:g.module_lang.text[g.module_lang.current].chart_age_labely},
                display_colors: [4],
                display_intro: 'top',
                display_filter: true,
                buttons_list: ['reset','help'],

            },

    sexpreg:{   domain_builder: 'none',
                domain_parameter: 'none',

                instance_builder: 'pie',

                dimension_builder: 'readncombcat',
                dimension_parameter: {  column: ['sex','preg'],
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'auto',
                group_parameter: {  column: ['none']},

                display_colors: [4,2,1],
                display_intro: 'left',
                display_filter: true,
                buttons_list: ['reset','help'],
            },

    sev:    {   domain_builder: 'none',
                domain_parameter: 'none',

                instance_builder: 'pie',

                dimension_builder: 'readcat',
                dimension_parameter: {  column: ['sev'],
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'auto',
                group_parameter: {  column: ['none']},

                display_colors: [1,2,4],
                display_intro: 'left',
                display_filter: true,
                buttons_list: ['reset','help'],
            },

    dur:    {   domain_builder: 'integer_ordinal',
                domain_parameter: 'none',

                instance_builder: 'bar',

                dimension_builder: 'integer',
                dimension_parameter: {  column: ['dur'],
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'auto',
                group_parameter: {  column: ['none']},

                display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_dur_labelx,
                                 y:g.module_lang.text[g.module_lang.current].chart_dur_labely},
                display_colors: [4],
                display_intro: 'left',
                display_filter: true,
                buttons_list: ['reset','help'],
            },

    out:    {   domain_builder: 'readcat',
                domain_parameter: 'none',

                instance_builder: 'bar',

                dimension_builder: 'readcat',
                dimension_parameter: {  column: ['out'],
                                        shared: false,
                                        namespace: 'none'},

                group_builder: 'auto',
                group_parameter: {  column: ['none']},

                display_axis:   {x:g.module_lang.text[g.module_lang.current].chart_out_labelx,
                                 y:g.module_lang.text[g.module_lang.current].chart_out_labely},
                display_colors: [4],
                display_intro: 'left',
                display_filter: true,
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

                display_intro: 'top',
                buttons_list: ['help'],
            },
};

// Defines the chart used as a reference for time-related interactions.
g.viz_timeline = 'epiwk';

// Defines the charts that are using time dimensions and that should be synchronized with the reference defined with <code>g.viz_timeline</code>.
g.viz_timeshare = [];
