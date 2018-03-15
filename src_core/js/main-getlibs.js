/*------------------------------------------------------------------------------------
    MSF Dashboard - main-getlibs.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file synchronously loads all the libraries required.
 * @module main_getlibs 
 * @since 0.9
 * @requires index.html
 **/

var files = [
    // Third-party opensource libraries
    ['js','jquery/jquery-2.2.0.min.js',lib_folder],
    ['js','jszip/jszip.js',lib_folder],
    ['js','sheetjs/xlsx.js',lib_folder],
    ['css','bootstrap/bootstrap.min.css',lib_folder],
    ['js','bootstrap/bootstrap.min.js',lib_folder],
    ['css','css/index.css',prg_folder], // Exeption (dashboard source)
    ['js','crossfilter/crossfilter.min.js',lib_folder],
    ['js','d3/d3.min.js',lib_folder],
    ['js','d3-queue/d3-queue.min.js',lib_folder],
    ['js','geostats/geostats.min.js',lib_folder],
    ['css','dc/dc.min.css',lib_folder],
    ['js','dc/dc.min.js',lib_folder],
    ['css','leaflet/leaflet.css',lib_folder],
    ['js','leaflet/leaflet.js',lib_folder],
    ['js','leaflet.sync/L.Map.Sync.js',lib_folder],
    ['css','datatables/jquery.dataTables.min.css',lib_folder],
    ['js','datatables/jquery.dataTables.min.js',lib_folder],
    ['css','datatables/buttons.dataTables.min.css',lib_folder],
    ['js','datatables/buttons.html5.min.js',lib_folder],
    ['js','datatables/dataTables.buttons.min.js',lib_folder],
    ['js','terraformer/terraformer.js',lib_folder],
    ['js','terraformer/terraformer-arcgis-parser.js',lib_folder],
    // Dashboard sources
    ['css','intro/introjs.css',lib_folder],
    ['js','intro/intro.js',lib_folder],
    ['js','lang/module-lang.js',ver_folder],
    ['js','dev/dev-defined.js',ver_folder],
    ['css','css/module-lang.css',prg_folder],
    ['js','lib/dc.leaflet/dc.leaflet.js',prg_folder], // Exeption (third-party) DC-Leaflet Here as some text needs to be translated
    ['css','css/module-datacheck.css',prg_folder],
    ['js','js/module-datacheck.js',prg_folder],
    ['css','css/module-colorscale.css',prg_folder],
    ['js','js/module-colorscale.js',prg_folder],
    ['css','css/module-multiadm.css',prg_folder],
    ['js','js/module-multiadm.js',prg_folder],
    ['css','css/module-chartwarper.css',prg_folder],
    ['js','js/module-chartwarper.js',prg_folder],
    ['css','css/module-datatable.css',prg_folder],
    ['js','js/module-datatable.js',prg_folder],   
    ['css','css/main-core.css',prg_folder],
    ['js','js/main-core.js',prg_folder],
    ['js','js/module-epitime.js',prg_folder],      
    ['js','js/module-population.js',prg_folder],     
    ['css','css/module-intro.css',prg_folder],
    ['js','js/module-intro.js',prg_folder],
    ['css','css/module-interface.css',prg_folder],
    ['js','js/module-interface.js',prg_folder],
    ['css','css/main-loadfiles.css',prg_folder],        
    ['js','js/main-loadfiles.js',prg_folder],  
    ['js','js/main-getdata.js',prg_folder]
];

function include_libraries(files) {
    inc_count = -1;
    inc_total = files.length - 1;
    var loadScript = function(files, callback){
        if(inc_count < inc_total){
            inc_count++;
            var file = files[inc_count];
            if(file[0] == 'css'){
                document.getElementsByTagName("head")[0].innerHTML += ("<link href=\"" + file[2] + file[1] + "\" rel=\"stylesheet\" type=\"text/css\">");
                if(file[1] == 'css/index.css'){
                    $('.modal-content').html('<div id="loading" class="modal-body"><h2>Loading...</h2><br><span id="load_status">Loading javascript libraries...</span></div>');
                }
                callback(files, callback);
            }else if(file[0] == 'js'){
                var script = document.createElement("script")
                script.type = "text/javascript";
                if(script.readyState){ //IE
                    script.onreadystatechange = function(){
                        if(script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null;
                            callback(files, callback);
                        }
                    };
                }else{ //Others
                    script.onload = function () {
                        callback(files, callback);
                    };
                }
                script.src = '' + file[2] + file[1];
                document.getElementsByTagName("head")[0].appendChild(script);
            }
        }
    };
    loadScript(files, loadScript);
}

// Global Variables: permanent and modules list  
/**
 * Stores all global variables for the dashboard
 * @global
 * @namespace
 **/
var g = {};

/**
 * Stores a list of module names that have been run
 * @global
 * @namespace
 **/
var modules_list = {};

include_libraries(files); 