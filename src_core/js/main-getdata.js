/*------------------------------------------------------------------------------------
    MSF Dashboard - main-getdata.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file is the current implementation of the getdata module.
 * @since 0.8
 * @module main_loadfiles
 * @requires index.html
 * @requires user/user-defined.js
 * @todo Polish it all.
 **/
module_getdata = {};
/*------------------------------------------------------------------------------------
    Components:
    0)
------------------------------------------------------------------------------------*/

console.log(g);

// 1) Show loading Screen
//------------------------------------------------------------------------------------
$('#modal').modal({
    backdrop: 'static',
    keyboard: false
});

$('#modal').modal('show');

module_getdata.read_config = function(getdata) {
    getdata.datatypes = Object.keys(getdata);
    getdata.datasources = {};
    getdata.datatypes.forEach(function(datatype) {
        getdata.datasources[datatype] = Object.keys(getdata[datatype]);
    });
};

module_getdata.load_initiate = function(exceptions) {
    g.module_getdata.exceptions = exceptions;
    // [x,y] where x data types, y source list
    g.module_getdata.count = [0,-1];
    module_getdata.load_propagate();
};

module_getdata.load_propagate = function(){
    var getdata = g.module_getdata;
    g.module_getdata.count[1]++;
    var count = g.module_getdata.count;

    if(count[1] >= getdata.datasources[getdata.datatypes[count[0]]].length && (count[0] >= getdata.datatypes.length - 1)){
        console.log('main-getdata.js: Your last source has been read.');
        generate_display();

    }else{

      var current_datatype = getdata.datatypes[count[0]];
      var current_dataname = getdata.datasources[current_datatype][count[1]];

      if(count[1] >= getdata.datasources[current_datatype].length){
          count[0] = count[0] + 1;
          count[1] = 0;
          var current_datatype = getdata.datatypes[count[0]];
          var current_dataname = getdata.datasources[current_datatype][count[1]];
      }


      // Manage exceptions
      if(getdata.exceptions){
          if(getdata.exceptions[0] == 'not'){
              if(getdata.exceptions[1] == current_dataname){
                  count[0]++;
              }
          }else if(getdata.exceptions[0] == 'only'){
              if(getdata.exceptions[1] !== current_dataname){
                  count[0]++;
              }
          }
      }
      console.log('main-getdata.js: Current: ' + current_datatype + ' - ' + current_dataname);
      var current_datasource = getdata[current_datatype][current_dataname];
      //console.log("current_datasource: ", current_datasource);
      switch(current_datasource.method){
            case 'd3':
                $(load_status).html('Getting Local files...');
                var name = '' + current_datatype + '_data';
                if(!g[name]){g[name] = {};}
                module_getdata.load_filed3(current_datasource.options.url,current_datasource.options.type,[name,current_dataname],module_getdata.load_propagate);
                break;
            case 'medicald3server':
                $(load_status).html('Getting Local Medical files...');
                module_getdata.load_medical_d3server(current_datasource.options.url,current_datasource.options.type);
                break;
            case 'medicalfs':
                $(load_status).html('Getting Local Medical files...');
                module_getdata.load_medical_fs(current_datasource.options.url,current_datasource.options.type);
                break;
            case 'medicald3noserver':
                $(load_status).html('Getting Local Medical files...');
                module_getdata.load_medical_d3noserver(current_datasource.options.url,current_datasource.options.type);
                break;
            case 'geometryd3':
                $(load_status).html('Getting Local Geometry files...');
                var name = '' + current_datatype + '_data';
                if(!g[name]){g[name] = {};}
                module_getdata.load_filed3(current_datasource.options.url,current_datasource.options.type,[name,current_dataname],module_getdata.afterload_geometry_d3);
                break;
            case 'populationd3':
                $(load_status).html('Getting Local Population files...');
                var name = '' + current_datatype + '_data';
                if(!g[name]){g[name] = {};}
                module_getdata.load_filed3(current_datasource.options.url,current_datasource.options.type,[name,current_dataname],module_getdata.afterload_population);
                break;
            case 'medicalxlsx':
                 $(load_status).html('Getting Local Medical files...');
                module_getdata.load_medical_xlsfolders(current_datasource.options.url);
                break;
            default:
                console.log('main-getdata.js ~l80: Your method to access  the source is not defined: ' + current_datasource.method);
                module_getdata.load_propagate();
                break;
      }
    }
};

/*--------------------------------------------------------------------
    Data load options: General
--------------------------------------------------------------------*/

// Load a files with d3: 'json', 'tsv', 'csv'
module_getdata.load_filed3 = function(file,filetype,save,exit_fun) {

    if(filetype == 'txt' || filetype == 'TXT'){filetype = 'tsv';}

    d3.queue()
        .defer(d3[filetype], file)
        .await(readfile);

    function readfile(error,data) {
        if(error){console.log(error);}

        if(typeof save == 'string'){
            g[save] = data;
        }else if(save[0] && save[1]){
            g[save[0]][save[1]] = data;
        }
        exit_fun();
    }
};

module_getdata.load_filefs = function(file,filetype,save,exit_fun) {

    var fs = nw.require('fs');

    fs.readFile(file, 'utf-8', function (error, data) {
        if(error){console.log('here',error);}

        data = d3[filetype].parse(data);

        if(typeof save == 'string'){
            g[save] = data;
        }else if(save[0] && save[1]){
            g[save[0]][save[1]] = data;
        }
        exit_fun();
    });
};



/*--------------------------------------------------------------------
    Data load options: Geometry
--------------------------------------------------------------------*/
module_getdata.afterload_geometry_d3 = function() {
    // Check if last geometry
    var getdata = g.module_getdata;
    var count = g.module_getdata.count;
    var current_datatype = getdata.datatypes[count[0]];
    var current_dataname = getdata.datasources[current_datatype][count[1]];
    var last_check = current_dataname == getdata.datasources.geometry[getdata.datasources.geometry.length - 1];

    if(last_check){
        module_getdata.process_geometry();
    }

    module_getdata.load_propagate();
};

// Common
/**
 * Reads the content of {@link module:g.geometry_data} that has just been parsed by the {@link module:main_loadfiles~queue_geometry} function and of {@link module:g.population_data} that has just been parsed by the {@link module:main_loadfiles~queue_population} if available.<br>
 The function returns various files:
 <ul>
    <li> **Related to geometry data**
         <ul>
            <li>{@link module:g.geometry_loclists}</li>
            <li>{@link module:g.geometry_keylist}</li>
            <li>{@link module:g.geometry_levellist}</li>
            <li>{@link module:g.geometry_subnum}</li>
         </ul>
    </li>
    <li> **Related to population data** (if any)
         <ul>
            <li>{@link module:g.population_loclists}</li>
            <li>{@link module:g.population_databyloc}</li>
            <li>{@link module:g.population_keylist}</li>
         </ul>
    </li>
 </ul>
 * @function
 * @alias module:main_loadfiles~read_commons
 **/
module_getdata.process_geometry = function(){
    /**
     * Stores the name of the administrative elements extracted from {@link module:g.geometry_data} by {@link module:main_loadfiles~queue_geometry}. Names are formatted in the following way: <code>'AdmN0', 'AdmN1',...</code> in order to manage efficiently pyramids and possible duplicates at lowest administrative levels.<br>
     Each administrative level is stored in a different Object.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.geometry_loclists
     */
    g.geometry_loclists = {};
    g.geometry_loclists.all = [];
    /**
     * Stores keys of each administrative level extracted from the {@link module:g.module_getdata}.
     <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.geometry_keylist
     */
    g.geometry_keylist = Object.keys(g.module_getdata.geometry);
    /**
     * Stores a number associate with administrative level (0 is the wider, and the bigger is the lowest/smaller).
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {{admNX: number}}
     * @alias module:g.geometry_levellist
     */
    g.geometry_levellist = {};
    /**
     * Stores the number of lowest administrative level within a given administrative level (eg. number of AdmN3 in AdmN2, AdmN1 and AdmN0). This is used to compute completeness {@link module:g.medical_completeness} in {@link module:module_datacheck~dataprocessing} > {@link module:module_datacheck~completenessCheck}.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {{admNX: number}}
     * @alias module:g.geometry_subnum
     */
    g.geometry_subnum = {};
    g.geometry_keylist.forEach(function(key,keynum){ 
        g.geometry_levellist[key] = keynum;     
        g.geometry_loclists[key] = [];
        g.geometry_data[key].features.forEach(function(f){  
            g.geometry_loclists[key].push(f.properties.name.trim());    //add it into the geometry_loclists
            g.geometry_loclists.all.push(f.properties.name.trim());
          
            // Compute number of Sub-Areas in Area
            if (g.new_layout) {
                
                if (!(module_multiadm.hasChildren(key))) {       //if it is lowest geometry - i.e. if it has no children
                    g.geometry_subnum[f.properties.name.trim()] = 1 ;   //has 1 subarea/itself
                    var temp_key = module_multiadm.getParent(key);
                    var temp_loc = '';
                    while (temp_key != '') {
                        temp_loc += ', ' + f.properties.name.trim().split(', ')[g.geometry_levellist[temp_key]].split('_').join(' ');  //add parent name to beginning
                        g.geometry_subnum[temp_loc.substring(2, temp_loc.length)]++;    //add to g.geometry_subnum
                        temp_key = module_multiadm.getParent(temp_key);                 //get next parent up
                    }

                } else {      //if it is not lowest geometry
                    if (!(g.geometry_subnum[f.properties.name.trim()])) {       
                        g.geometry_subnum[f.properties.name.trim()] = 0 ;
                    }
                }

            } else {    

                if (keynum == g.geometry_keylist.length - 1) {        //if it is lowest geometry
                    g.geometry_subnum[f.properties.name.trim()] = 1 ;       //full geometry name = 1 subarea/itself (e.g. temp_loc=admN1,admN2,admN3)
                    var temp_loc = '';
                    for (var i=0; i<=g.geometry_keylist.length-2; i++) {       //for each higher adm level
                       for (var j=0; j<=i; j++) {
                            temp_loc += ', ' + f.properties.name.trim().split(', ')[j].split('_').join(' ');   //recreate geometry name(e.g. for admN2 name is admN1, admN2)
                        }
                        temp_loc = temp_loc.substring(2, temp_loc.length);
                        g.geometry_subnum[temp_loc]++;
                    }

                } else {      //if it is not lowest geometry
                    g.geometry_subnum[f.properties.name.trim()] = 0 ;
                }

            }
        });
    });
};

/*--------------------------------------------------------------------
    Data load options: Population
--------------------------------------------------------------------*/

module_getdata.afterload_population = function(data) {
    module_getdata.process_population();
    module_getdata.load_propagate();
};

module_getdata.process_population = function(){
    /**
     * Stores the name of the administrative elements extracted from {@link module:g.population_data}. Names should already be formatted in the following way: <code>'AdmN0', 'AdmN1',...</code> in the source file in order to manage efficiently pyramids and possible duplicates at lowest administrative levels.<br>
     Each administrative level is stored in a different Object.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.population_loclists
     */
    g.module_population.population_loclists = {};
    /**
     * Restores population figures from {@link module:g.population_data} in order that each administrative level is stored in a different Object.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.population_databyloc
     */
    g.module_population.population_databyloc = {};      //Object to account for new population data format of multiple years of pop defined

    /**
     * Stores keys of each administrative level extracted from the {@link module:g.module_getdata.population}.
         <br>
     * Processing triggered in {@link module:main_loadfiles~read_commons}.
     * @constant
     * @type {Object.<Array.<String>>}
     * @alias module:g.population_keylist
     */
    g.module_population.population_keylist = Object.keys(g.module_getdata.population);
    if (g.module_population.pop_new_format) {                               //Note: hardcoding of admNx here
        //Accounting for new population data format 
        g.module_population.population_keylist.forEach(function(key){
            g.module_population.population_loclists[key] = [];
            g.module_population.population_databyloc[key] = {};
            g.population_data[key].forEach(function(f){
                //console.log(f, f[g.module_population.pop_headerlist.admNx.trim()]);
                g.module_population.population_loclists[key].push(f[g.module_population.pop_headerlist.admNx.trim()]);
                temp={};
                for (pop_yr in g.module_population.pop_headerlist.pop) {
                    temp[pop_yr] = parseInt(f[pop_yr]);
                };
                //console.log(temp);
                g.module_population.population_databyloc[key][f[g.module_population.pop_headerlist.admNx.trim()]] = temp;
            });            
        });
    } else {        
        g.module_population.population_keylist.forEach(function(key){
            g.module_population.population_loclists[key] = [];
            g.module_population.population_databyloc[key] = {};
            g.population_data[key].forEach(function(f){
                g.module_population.population_loclists[key].push(f[g.population_headerlist.admNx.trim()]);
                g.module_population.population_databyloc[key][f[g.population_headerlist.admNx.trim()]] = parseInt(f[g.population_headerlist.pop]);
            
            });
        });
    }
    
};

/*--------------------------------------------------------------------
    Data load options: Medical
--------------------------------------------------------------------*/

module_getdata.load_medical_xlsfolders = function(path) {

    var fs = nw.require('fs');

    /**
     * Gets the medical data folder path.
     * @constant
     * @type {String}
     * @alias module:g.medical_folder
     */
    g.medical_folder = path;

    /**
     * Lists the medical data files in the {@link module:g.medical_folder} folder path (uses Node server-side capability).
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist_raw
     */
    g.medical_filelist_raw = fs.readdirSync('.'+g.medical_folder);

    /**
     * Stores the name of the file currently being read. Starts with the first file in the {@link module:g.medical_filelist} and then {@link module:main_loadfiles~generate_display} gives the user the option to choose between all the available files.
     * @constant
     * @type {String}
     * @alias module:g.medical_filecurrent
     */
    g.medical_filecurrent = undefined;

    /**
     * Lists files in the datafolder that matches the extension criteria (currently *.txt | *.TXT | *.csv | *.CSV) in the {@link module:g.medical_filelist_raw}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist
     **/
    g.medical_filelist = [];

    // Check file format (currently only .text / tabulation separated values - tsv)
    g.medical_filelist_raw.forEach(function(f){
        var cond = f.substr(f.length - 5)=='.xlsx' || f.substr(f.length - 5)=='.XLSX';
        if(cond){
            g.medical_filelist.push(f);
        }
    });

    // Initialise with first medical file in the list
    g.medical_filecurrent = g.medical_filelist[0];

    /**
     * Stores the type of the file about to be read from {@link module:g.medical_filecurrent} in order to use the correct parsing method in {@link module:main_loadfiles~queue_medical}.
     * @constant
     * @type {String}
     * @alias module:g.medical_filetypecurrent
     **/
    g.medical_filetypecurrent = g.medical_filecurrent.substr(g.medical_filecurrent.length - 3);

    module_getdata.load_medical_xls();

}

module_getdata.load_medical_xls = function() {
    var X = XLSX;
    var name = '.' + g.medical_folder + g.medical_filecurrent;

    var fs = nw.require('fs');

    var medical_data = [];

    var data = fs.readFileSync(name, 'binary');

    /* Call XLSX */
    var workbook = XLSX.read(data, {type:"binary"});
    var input = workbook.Sheets['input'];
    var firstRow = 2 ;
    var lastRow = input['!ref'].split(':')[1].replace( /^\D+/g, '');

    var firstCol = lettersToNumbers('A');
    var lastCol = lettersToNumbers('J');

    for (var r = firstRow; r <= lastRow;r++) {

        var test_empty = true;
        var temp_array = [];



        for (var c = firstCol; c <= lastCol+1; c++) {

            val = (typeof input[numbersToLetters(c) + r] !== 'undefined') ? input[numbersToLetters(c) + r].v : undefined;

            if(val !== undefined){
                test_empty = false;
            }

            temp_array.push(val);
        }

        if(!test_empty){       //TODO: Order of xlsx headings is significant here; need to get correctly named column heading instead of it being sequential
            temp_data = {};
            temp_data['Region'] = temp_array[0];
            temp_data[g.medical_headerlist['admN1']] = temp_array[1];
            temp_data[g.medical_headerlist['admN2']] = temp_array[2];
            temp_data[g.medical_headerlist['epiwk']] = temp_array[3];
            temp_data[g.medical_headerlist['disease']] = temp_array[4];
            temp_data[g.medical_headerlist['case']] = temp_array[5];
            temp_data[g.medical_headerlist['death']] = temp_array[6];
            temp_data[g.medical_headerlist['date']] = temp_array[7];
            temp_data[g.medical_headerlist['source']] = temp_array[8];
            temp_data[g.medical_headerlist['comment']] = temp_array[9];

            medical_data.push(     
                temp_data
            );
        }

    };

    function numbersToLetters(num) {
      for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
        ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
      }
      return ret;
    }

    function lettersToNumbers(string) {
        string = string.toUpperCase();
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sum = 0, i;
        for (i = 0; i < string.length; i++) {
            sum += Math.pow(letters.length, i) * (letters.indexOf(string.substr(((i + 1) * -1), 1)) + 1);
        }
        return sum;
    }
    g.medical_data = medical_data;
    //console.log("g.medical_data = ", g.medical_data); 
    module_getdata.afterload_medical_d3(medical_data);

};

// d3.js (local file)

module_getdata.reload_medical = function() {
    if (g.module_getdata.medical.medical.method == 'medicalxlsx') {
        module_getdata.load_medical_xls();
    }else if(g.module_getdata.medical.medical.method == 'medicald3server'){
        module_getdata.load_filed3(g.medical_folder + g.medical_filecurrent, g.medical_filetypecurrent,'medical_data',module_getdata.afterload_medical_d3);
    }else if(g.module_getdata.medical.medical.method == 'medicalfs'){
        //Windows:
        module_getdata.load_filefs('.' + g.medical_folder + g.medical_filecurrent, g.medical_filetypecurrent,'medical_data',module_getdata.afterload_medical_d3);
        //MacOS:
        //module_getdata.load_filefs('input/' + g.medical_filecurrent, g.medical_filetypecurrent,'medical_data',module_getdata.afterload_medical_d3);
    }else{
        console.log('main-getdata.js ~l475: The medical data parsing method does not currently allow selecting from folder.');;
    }
};

module_getdata.load_medical_d3noserver = function(files, ftype) {
    if(typeof files == 'string'){
      var filepath = files.split('/');
      var filename = filepath.pop();
      filepath = filepath.join('/')+'/';
      console.log(filename);
      console.log(filepath);
      g.medical_folder = filepath;
      g.medical_filelist_raw = [filename];
    }
    module_getdata.load_medical_d3(ftype);
};

module_getdata.load_medical_fs = function(path, ftype) {
    var fs = nw.require('fs');

    /**
     * Gets the medical data folder path.
     * @constant
     * @type {String}
     * @alias module:g.medical_folder
     */
    g.medical_folder = path;
    //var path = nw.require("path");
    //console.log("./ = %s", path.resolve("./"));

    /**
     * Lists the medical data files in the {@link module:g.medical_folder} folder path (uses Node server-side capability).
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist_raw
     */
    //Windows ('../input/'):
    g.medical_filelist_raw = fs.readdirSync('.'+g.medical_folder);   
    //MAC OS ('input/'):
    //g.medical_filelist_raw = fs.readdirSync('input/');  
    /**
     * Stores the name of the file currently being read. Starts with the first file in the {@link module:g.medical_filelist} and then {@link module:main_loadfiles~generate_display} gives the user the option to choose between all the available files.
     * @constant
     * @type {String}
     * @alias module:g.medical_filecurrent
     */
    g.medical_filecurrent = undefined;

    /**
     * Lists files in the datafolder that matches the extension criteria (currently *.txt | *.TXT | *.csv | *.CSV) in the {@link module:g.medical_filelist_raw}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist
     **/
    g.medical_filelist = [];

    // Check file format (currently only .text / tabulation separated values - tsv)
    g.medical_filelist_raw.forEach(function(f){
        if(ftype == 'csv'){
            var cond = f.substr(f.length - 4)=='.csv' || f.substr(f.length - 4)=='.CSV';
        }else if(ftype == 'tsv'){
            var cond = f.substr(f.length - 4)=='.txt' || f.substr(f.length - 4)=='.TXT' || f.substr(f.length - 4)=='.tsv' || f.substr(f.length - 4)=='.TSV' ;
        }else{
            console.log('main-getdata.js ~l410: Your the type of your source files is not recognized: ' + type)
        }
        if(cond){
            g.medical_filelist.push(f);
        }
    });

    // Initialise with first medical file in the list
    g.medical_filecurrent = g.medical_filelist[0];

    /**
     * Stores the type of the file about to be read from {@link module:g.medical_filecurrent} in order to use the correct parsing method in {@link module:main_loadfiles~queue_medical}.
     * @constant
     * @type {String}
     * @alias module:g.medical_filetypecurrent
     **/
    g.medical_filetypecurrent = g.medical_filecurrent.substr(g.medical_filecurrent.length - 3);
    //Windows:
    module_getdata.load_filefs('.' + g.medical_folder + g.medical_filecurrent, ftype,'medical_data',module_getdata.afterload_medical_d3);
    //MacOS:
    //module_getdata.load_filefs('input/' + g.medical_filecurrent, g.medical_filetypecurrent,'medical_data',module_getdata.afterload_medical_d3);
}

module_getdata.load_medical_d3 = function(ftype) {

    /**
     * Lists files in the datafolder that matches the extension criteria (currently *.txt | *.TXT | *.csv | *.CSV) in the {@link module:g.medical_filelist_raw}.
     * @constant
     * @type {Array.<String>}
     * @alias module:g.medical_filelist
     **/
    g.medical_filelist = [];

    // Check file format (currently only .text / tabulation separated values - tsv)
    g.medical_filelist_raw.forEach(function(f){
        if(ftype == 'csv'){
            var cond = f.substr(f.length - 4)=='.csv' || f.substr(f.length - 4)=='.CSV';
        }else if(ftype == 'tsv'){
            var cond = f.substr(f.length - 4)=='.txt' || f.substr(f.length - 4)=='.TXT' || f.substr(f.length - 4)=='.tsv' || f.substr(f.length - 4)=='.TSV' ;
        }else{
            console.log('main-getdata.js ~l410: Your the type of your source files is not recognized: ' + type)
        }
        if(cond){
            g.medical_filelist.push(f);
        }
    });

    // Initialise with first medical file in the list
    g.medical_filecurrent = g.medical_filelist[0];

    /**
     * Stores the type of the file about to be read from {@link module:g.medical_filecurrent} in order to use the correct parsing method in {@link module:main_loadfiles~queue_medical}.
     * @constant
     * @type {String}
     * @alias module:g.medical_filetypecurrent
     **/
    g.medical_filetypecurrent = g.medical_filecurrent.substr(g.medical_filecurrent.length - 3);

    module_getdata.load_filed3(g.medical_folder + g.medical_filecurrent, g.medical_filetypecurrent,'medical_data',module_getdata.afterload_medical_d3);
};

module_getdata.afterload_medical_d3 = function(data) {

  /**
   * Lists from {@link module:g.medical_headerlist} the keys used to refer to specific {@link module:g.medical_data} fields. Defined in the Dashboard (might be different from the headers in the data files) in {@link user-defined} {@link module:g.medical_headerlist}.
   * @constant
   * @type {Array.<String>}
   * @alias module:g.medical_keylist
   */
  g.medical_keylist = Object.keys(g.medical_headerlist);

  console.log('main-getdata.js ~l630: Medical file selected: ' + g.medical_filecurrent);


  // Load Optional Module: module-datacheck.js
  module_datacheck.dataprocessing();
  module_getdata.load_propagate();
};

// KoBo

module_getdata.generate_loginscreen = function(what,exit_fun) {
    var html = '<section class="container">';
    html+= '<div>';
    html+= '  <h2>Login to '+ what +'</h2>';
    html+= '    <p><input type="text" id="login" value="" placeholder="Username"></p>';
    html+= '    <p><input type="password" id="password" value="" placeholder="Password"></p>';
    html+= '    <p class="submit"><input type="submit" name="commit" value="Login"></p>';
    html+= '</div>';

    html+= '<div class="login-help">';
    html+= '  <p> <small>Forgot your password?<br><a href="">Contact the Administrator</a></small></p>';
    html+= '</div>';
    html+= '</section>';
    $('.modal-content').html(html);

    $('.submit').on('click',function(){
        var login = $('#login').val();
        var password = $('#password').val();
        exit_fun(login,password);
        modal_loading();
    });
};

module_getdata.read_config(g.module_getdata);
module_getdata.load_initiate();
//module_getdata.load_initiate(g.module_getdata,['only','medical']);


/**
 * Takes a string and returns the same string with title case (first letter of each word is capitalized). Used to normalize strings such as administrative division names or disease names.
 * @type {Function}
 * @param {String} str
 * @returns {String}
 * @alias module:module_datacheck~toTitleCase
 */
function toTitleCase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
