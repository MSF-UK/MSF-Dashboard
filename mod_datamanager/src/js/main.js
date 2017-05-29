var X = XLSX;
var fs = require('fs');
var path = require('path');

// Default folders
$( "#ds_add" ).attr( "nwworkingdir", folderHISfiles);
$( "#db_old" ).attr( "nwworkingdir", folderDatabases);
$( "#db_new" ).attr( "nwworkingdir", folderDatabases);
$( "#db_new" ).attr( "nwsaveas", "database_name");
$( "#db_export2" ).attr( "nwworkingdir", folderDashboard);
$( "#db_export2" ).attr( "nwsaveas", "201Y-WW_201Y-WW_database_name");
$( "#dashboardIndex" ).attr( "href", path.dirname(process.execPath).split('\\datamanager')[0] + dashboardIndex);

//var data_folder = path.dirname(process.execPath).split('\\datamanager')[0]+'\\data-folders\\';
//console.log(data_folder);
var current_database;
//var temp_database;
var message_num = 0;
/* PROMPT */ prompt_new('Loading: Surveillance Data Manager');
var error_log = [];
var error_id = 0;

function fixdata(data) {            //fixes data conversion from xlsx to json
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
	return o;
}

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

function yrwkToEpiwk(year,week) {
    if (week < 10) {
        return year + '-0' + week;
    }else{
        return year + '-' + week;
    };
}

function epiwkToYrWk(epiweek) {
    return [epiweek.split('-')[0],epiweek.split('-')[1]];
}

function his_to_json(workbook,xlsname) {

    usrYear = parseInt(current_row);
    usrWeek = parseInt(current_col);
    var tempEpiweek;
    var old_recordnum = current_database.recordnum;

    var sheet_name_list = workbook.SheetNames;
    var sheet_name_list_slice = sheet_name_list.slice(sheetListFirst - 1, sheetListFirst + sheetListNum - 1);

    //console.log(sheet_name_list_slice);                                

    if(current_database){

        current_database.lastupdate = new Date();

    	sheet_name_list_slice.forEach(function(sheetName) {
            //console.log("CURRENT WORKSHEET: ", sheetName);
            var firstRow = tableRowFirst;
            var lastRow = tableRowFirst + tableRowNum - 1;
            var firstCol = lettersToNumbers(tableColFirst) + tableColNum * (usrWeek - 1);
            var lastCol = lettersToNumbers(tableColFirst) + tableColNum * (usrWeek) - 1;

            var tempDisease = sheetName;

            for (var r = firstRow; r <= lastRow;r++) {      //loop through each row

                var tempChiefdom = workbook.Sheets[sheetName]['B' + r].v;
                var tempPHU = workbook.Sheets[sheetName]['C' + r].v;
                var tempAn = usrYear;
                var tempPop = workbook.Sheets[sheetName]['E' + r].v;

                tempRef = 0;
                tempWeek = usrWeek;

                for (var c = firstCol; c <= lastCol+1; c++) {       //loop through each column
                    tempRef++;
                    if (tempRef > 8) {                              //only act from after 8th column
                        if (tempWeek < 10) {                        //check epi-week
                            tempEpiweek = tempAn + '-0' + tempWeek;
                        }else{
                            tempEpiweek = tempAn + '-' + tempWeek;
                        };

                        temp = [];

                        for (var i = 8; i >= 1; i--) {              //work through 8 columns backwards from -8 to -1
                             val = (typeof workbook.Sheets[sheetName][numbersToLetters(c-i) + r] !== 'undefined') ? workbook.Sheets[sheetName][numbersToLetters(c-i) + r]["v"] : undefined;
                             temp.push(val);
                        };

                        test_empty = temp[0] == undefined && temp[1] == undefined && temp[2] == undefined && temp[3] == undefined && temp[4] == 0 && temp[5] == 0 && temp[6] == 0 && temp[7] == "";
                        
                        if (!(test_empty)) {
                            var temp_rec = {
                                disease: tempDisease,
                                chiefdom: tempChiefdom,
                                PHU: tempPHU,
                                an: tempAn,
                                pop: tempPop,
                                epiweek: tempEpiweek,
                                lesscas: temp[0],       //col c-8
                                lessdth: temp[1],       //col c-7
                                morecas: temp[2],       //col c-6
                                moredth: temp[3],       //col c-5
                                totalcas: temp[4],      //col c-4
                                totaldth: temp[5],      //col c-3
                                tax: temp[6],           //col c-2
                                let: temp[7]            //col c-1
                            }; 
                            current_database.recordnum++;
                            current_database.data.push(temp_rec); 
                            checkRecord(temp_rec, sheetName, c, r);
                        };
                        tempWeek++;
                        tempRef=1;
                    };

                };
            };
        });

        if (error_id == 0) {
            var rec_errs = error_id + ' errors found';
            var status_check = 'Source checked for errors - no errors found';
        } else if (error_id == 1) {
            var rec_errs = error_id + ' error found';
            var status_check = 'Source checked for errors - 1 error found - data not included in database';
        } else {
            var rec_errs = error_id + ' errors found';
            var status_check = 'Source checked for errors - ' + error_id + ' errors found - data not included in database';
        };

        current_database.recordsum.push({
            epiweek: tempEpiweek,
            recordnum: current_database.recordnum - old_recordnum,
            recorderr: error_id,    //rec_errs,
            createdate: current_database.lastupdate,
            lastupdate: current_database.lastupdate,
            source: xlsname,
            //status: undefined           
            status: status_check
        });

    }else{
        console.log('No database selected');                                
    }
}


function his_to_json_new_format(workbook,xlsname) {   
    var sheetName = workbook.SheetNames[0];
    //console.log(xlsname, sheetName); 
    
    inputYear = parseInt(current_row);      //year from cell selected in table
    inputWeek = parseInt(current_col);      //week from cell selected in table
    var tempEpiweek;
    if (inputWeek < 10) {                             //do a tempEpiweek check here?
        tempEpiweek = inputYear + '-0' + inputWeek;
    } else {
        tempEpiweek = inputYear + '-' + inputWeek;
    };
    //console.log("GETTING NEW ISDR FORMAT for epiweek ", tempEpiweek);
    var old_recordnum = current_database.recordnum;

    if(current_database){

        //console.log("PHU_matches = ", PHU_matches);

        var fileEpiweek = workbook.Sheets[sheetName][newFileEpiweekCell]["v"];
        var fileYear = fileEpiweek.substr(0,4);
        var fileWeek = fileEpiweek.substr(4);
        //console.log("fileYear, fileWeek = ", fileYear, fileWeek);

        current_database.lastupdate = new Date();

        var firstRow = newFirstRow;
        var lastRow = newFirstRow + newNumRows - 1;
        var firstCol = lettersToNumbers(newFirstCol);
        var lastCol = lettersToNumbers(newFirstCol) + (newColsPerDisease * newNumDiseases) - 1;

        //var tempDisease = sheetName;

        for (var r = firstRow; r <= lastRow;r++) {      //loop through each row
            //console.log("loop through each row r = ", r);

            //var tempChiefdom = workbook.Sheets[sheetName]['B' + r].v;
            //var tempPHU = workbook.Sheets[sheetName]['C' + r].v;
            //var tempPHU = ['C' + r].v;
            var tempPHU = workbook.Sheets[sheetName]['A' + r].v;
            //console.log("PHU = ", tempPHU);
            //var tempAn = inputYear;
            //var tempPop = workbook.Sheets[sheetName]['E' + r].v;
            var tempChiefdom = "";
            for (var i=0; i<=PHU_matches.length-1; i++) {
                //console.log(i, tempPHU, PHU_matches[i].PHU);
                if (PHU_matches[i].PHU==tempPHU) {
                    tempChiefdom = PHU_matches[i].chiefdom;
                    break;
                }
            }

            tempRef = 0;
            //tempWeek = usrWeek;
            //tempDisease = "diseaseName";

            //console.log("first col: ", firstCol, "    last col: ", lastCol);
            for (var c = firstCol; c <= lastCol+1; c++) {       //loop through each column
                //console.log("loop through each cell R,C = ", r, c, " = ", workbook.Sheets[sheetName][numbersToLetters(c) + r]["v"]);
                
                tempRef++;
                //console.log("col: ", c, "   tempRef: ", tempRef);
                if (tempRef > 4) {                              //only act from after 1st column

                    temp = [];
                    var tempDisease = workbook.Sheets[sheetName][numbersToLetters(c-1) + (newFirstRow-1)]["v"];
                    tempDisease = tempDisease.replace(/EIDSR case/g, "").replace(/EIDSR death/g, "").replace(/EIDSR/g, "").replace(/Under 5 years/g, "").replace(/5 years and older/g, "").trim();
                    //console.log("disease name: ", tempDisease);

                    for (var i = 4; i >= 1; i--) {              //work through 4 columns backwards from -4 to -1
                         val = (typeof workbook.Sheets[sheetName][numbersToLetters(c-i) + r] !== 'undefined') ? workbook.Sheets[sheetName][numbersToLetters(c-i) + r]["v"] : undefined;
                         temp.push(val);
                    };

                    function checkIfEmpty(cellVal) {
                        var empty = false;
                        if (cellVal==undefined) {
                            empty = true;
                        } else if (cellVal.length==0) {
                            empty = true;
                        }
                        return empty;
                    }

                    //console.log("temp = ", temp);
                    //test_empty = isNaN(parseInt(temp[0])) && isNaN(parseInt(temp[1])) && isNaN(parseInt(temp[2])) && isNaN(parseInt(temp[3]));
                    //test_empty = isNaN(parseInt(temp[0])) && isNaN(parseInt(temp[1])) && isNaN(parseInt(temp[2])) && isNaN(parseInt(temp[3]));

                    //test_empty = temp[0]==undefined && temp[1] == undefined && temp[2] == undefined && temp[3] == undefined && temp[4] == 0 && temp[5] == 0 && temp[6] == 0 && temp[7] == "";
                    test_empty = checkIfEmpty(temp[0]) && checkIfEmpty(temp[1]) && checkIfEmpty(temp[2]) && checkIfEmpty(temp[3]);    
                    
                    /*function validVal(cellVal) {
                        if (isNaN(parseInt(cellVal))) {
                            return "";
                        } else {
                            return cellVal;
                        };
                    }*/

                    if (!(test_empty)) {
                        var temp_rec = {        
                            disease: tempDisease,
                            chiefdom: tempChiefdom,      
                            PHU: tempPHU,                  
                            an: inputYear, 
                            epiweek: tempEpiweek,         
                            lesscas: temp[0],       //col c-4
                            lessdth: temp[1],       //col c-3
                            morecas: temp[2],       //col c-2
                            moredth: temp[3]        //col c-1
                            /*lesscas: validVal(temp[0]),       //col c-4
                            lessdth: validVal(temp[1]),       //col c-3
                            morecas: validVal(temp[2]),        //col c-2
                            moredth: validVal(temp[3])        //col c-1*/
                        }; 
                        current_database.recordnum++;
                        current_database.data.push(temp_rec); 
                        checkRecord(temp_rec, sheetName, c, r);
                        //console.log(current_database.recordnum, "temp_rec: ", temp_rec);
                    } else {
                        /*var temp_rec = {        
                            disease: tempDisease,
                            chiefdom: tempChiefdom,      
                            PHU: tempPHU,                  
                            an: inputYear, 
                            epiweek: tempEpiweek,         
                            lesscas: temp[0],       //col c-4
                            lessdth: temp[1],       //col c-3
                            morecas: temp[2],       //col c-2
                            moredth: temp[3]        //col c-1
                        }; 
                        console.log(current_database.recordnum, "record empty so not recorded: ", temp_rec);*/
                    };
                    tempRef=1;
                };

            };
        };

        if (error_id == 0) {
            var rec_errs = error_id + ' errors found';
            var status_check = 'Source checked for errors - no errors found';
        } else if (error_id == 1) {
            var rec_errs = error_id + ' error found';
            var status_check = 'Source checked for errors - 1 error found - data not included in database';
        } else {
            var rec_errs = error_id + ' errors found';
            var status_check = 'Source checked for errors - ' + error_id + ' errors found - data not included in database';
        };

        

        current_database.recordsum.push({
            epiweek: tempEpiweek,
            recordnum: current_database.recordnum - old_recordnum,
            recorderr: error_id,    //rec_errs,
            createdate: current_database.lastupdate,
            lastupdate: current_database.lastupdate,
            source: xlsname,
            //status: undefined          
            status: status_check
        });

    } else {
        console.log('No database selected');                                
    }

    

}


function getDateTime() {
    var date = new Date();
    var month = (date.getMonth() + 1 <10) ? '0'+(date.getMonth() + 1): date.getMonth() + 1;
    var day = (date.getDate()<10) ? '0'+date.getDate(): date.getDate();
    var hours = (date.getHours()<10) ? '0'+date.getHours(): date.getHours();
    var minutes = (date.getMinutes()<10) ? '0'+date.getMinutes(): date.getMinutes();
    var seconds = (date.getSeconds()<10) ? '0'+date.getSeconds(): date.getSeconds();
    var dateTime = '' + date.getFullYear() + month + day + '-' + hours + minutes + seconds;
    return dateTime;
};

function saveCurrentDatabase(name,backup,export_database){
    if (export_database=='') {
        var export_database = current_database;
    }
        
    if(backup){
        /*var date = new Date();
        var month = (date.getMonth() + 1 <10) ? '0'+(date.getMonth() + 1): date.getMonth() + 1;
        var day = (date.getDate()<10) ? '0'+date.getDate(): date.getDate();
        var hours = (date.getHours()<10) ? '0'+date.getHours(): date.getHours();
        var minutes = (date.getMinutes()<10) ? '0'+date.getMinutes(): date.getMinutes();
        var seconds = (date.getSeconds()<10) ? '0'+date.getSeconds(): date.getSeconds();
        var outputFilename = '' + folderBackups + date.getFullYear() + month + day + '-' + hours + minutes + seconds + '-' + name;*/
        var outputFilename = '' + folderBackups + getDateTime() + '-' + name;
    }else{
        var outputFilename = '' + folderDatabases_actual + name;
    }

    var exportContent = JSON.stringify(export_database, null, 4);

    fs.writeFile(outputFilename, exportContent, function(err) {
        if(err) {
          console.log(err);                                                 
		  /* PROMPT */ prompt_new('Error! ' + outputFilename + ' could not be saved, open console for more details or ask for help');
        } else {
          //console.log("onexport", new Date());                                 
          //console.log("JSON saved to " + outputFilename);                 
        }
    });
}


//** IMPORT NEW DATASET
var ds_add = document.getElementById('ds_add');
function addDatasetPart1(e) {
    //console.log(['addDatasetPart1',e]);
    $('html').mouseover(function(event){                //when add file cancelled
        var status = document.getElementById(current_id).innerHTML;
        //console.log("   current_id = ", current_id, "   current status = ", status);
        updatingCell("table", status);     
        console.log('No File Selected');
        $('html').off('mouseover');
    });
}

function addDatasetPart2(e) {
    //console.log(['addDatasetPart2-1',e]);
    var files = e.target.files;
    var f = files[0];
	var path = f.path;

    var status = document.getElementById(current_id).innerHTML;
    //console.log("   current_id = ", current_id, "   current status = ", status);
    var prev_database = $.extend(true, {}, current_database);   //jQuery method to clone object (i.e. no reference)

    //console.log(['addDatasetPart2-2',f]);
	if (f ==  undefined){
        var status = document.getElementById(current_id).innerHTML;
        updatingCell("table",status);
    }else{
        //var status = document.getElementById(current_id).innerHTML;

        $('html').off('mouseover');

        var classes = document.getElementById(current_id).classList;
        if (classes.contains("replacing")) {
            updatingCell("table","...");
            deleteDataset(current_epiwk);         
        };

        //** Read XLSX
    	var reader = new FileReader();
        var name = f.name;

        /* PROMPT */ prompt_new('Add Dataset: file opening: ' + name);

        var wb;
    	reader.onload = function(e) {
    		//console.log("onload", new Date());
    		var data = e.target.result;
    		var arr = fixdata(data);
    		wb = X.read(btoa(arr), {type: 'base64'});
    	};
        reader.readAsArrayBuffer(f);

        /* PROMPT */ prompt_new('Add Dataset: checking all data entries in file: ' + name);

        //console.log('in Add Dataset: ' + name);

        reader.onloadend = function(event) {
            console.log('in onloadend: ' + name);
            var err = event.target.error;
            if (err) {
                console.log(err);
            } else {
                //console.log("onloadend", new Date());

                //var prev_database = {};
                //var prev_database = $.extend(true, {}, current_database);   //jQuery method to clone object (i.e. no reference)

                //** Data checks
                ///* PROMPT */ prompt_new('Add Dataset: checking all data entries in file: '+ name);
                //checkData(current_database.data);

                 //console.log("wb: ", wb);
                //console.log("name: ", name);                //name of xlsx spreadsheet

                //** Organise XLSX (to JSON)
                //console.log("just before his_to_json");
                if (newISDRFormat) {

                    inputYear = parseInt(current_row);      //year from cell selected in table
                    inputWeek = parseInt(current_col);      //week from cell selected in table
                    var tempEpiweek;
                    if (inputWeek < 10) {                             //do a tempEpiweek check here?
                        tempEpiweek = inputYear + '-0' + inputWeek;
                    } else {
                        tempEpiweek = inputYear + '-' + inputWeek;
                    };
                    //console.log("from cell selected: ", inputYear, inputWeek);

                    //Check year and date of file against table cell selected
                    //var sheetName = wb.SheetNames[0];
                    //var fileEpiweek = wb.Sheets[sheetName][newFileEpiweekCell]["v"];

                    var cont = true;
                    //console.log("cell A2 = ", wb.Sheets[wb.SheetNames[0]][newFileEpiweekCell]);
                    if (wb.Sheets[wb.SheetNames[0]][newFileEpiweekCell]==undefined) {      //determine whether new ISDR format by whether there is a value in cell A2
                        cont = false;
                        alert("!ERROR:\n\nThis file is not in the new ISDR format. Check and try again.");
                    } else {
                        var fileEpiweek = wb.Sheets[wb.SheetNames[0]][newFileEpiweekCell]["v"];
                        var fileYear = parseInt(fileEpiweek.substr(0,4));
                        var fileWeek = parseInt(fileEpiweek.substr(5));
                    }
                    
                    //console.log("fileYear, fileWeek = ", fileYear, fileWeek);

                    
                    if ((cont==true) && (!((inputYear==fileYear) && (inputWeek==fileWeek)))) {
                        cont = confirm("!WARNING:\n\nThe epiweek of this file does not match the epiweek of the selected cell in the table:\n\nTable cell selected: " + tempEpiweek + '\nFile selected: ' + fileEpiweek + '\n\nDo you wish to continue to upload data as epiweek ' + tempEpiweek + '?');
                    };
                    if (cont==true) {
                        his_to_json_new_format(wb,name);
                    }
                
                } else {
                    his_to_json(wb,name);
                }
                
                //*** if errors in xlsx file then break
                //console.log("just after his_to_json");


                //console.log("Error log length: ", error_log.length);
                if (cont==false) {
                    current_database = $.extend(true, {}, prev_database);  
                    /* PROMPT */ prompt_new('Add Dataset: no changes made to database: ' + current_database.name);
                    console.log("saveCurrentDatabase(prev_database, save db)");
                    saveCurrentDatabase(current_database.name,false,'');        //need to re-save here because previously deleted dataset
                    updatingCell("table",status);
                } else if (error_id >= 1) {            //if any errors exist in file
                    var error_log_name = writeErrorCSV(name, error_log);
                    //console.log("Errors are logged and need to be written to file here", error_log);
                    /* PROMPT */ prompt_new('!Error: Add Dataset: ' + error_id + ' error(s) found in file '+ name + ' - Correct errors in order to Add or Update from file');
                    /* PROMPT */ prompt_new('Writing error log: ' + error_log_name);
                    alert('!Error: ' + error_id + ' error(s) found in file '+ name + '\n\nError summary written to ' + error_log_name + '\n\nCorrect errors in order to Add or Update from file');
                    
                    current_database = $.extend(true, {}, prev_database);  
                    /* PROMPT */ prompt_new('Add Dataset: no changes made to database: ' + current_database.name);
                    console.log("saveCurrentDatabase(prev_database, save db)");
                    saveCurrentDatabase(current_database.name,false,'');        //need to re-save here because previously deleted dataset
                    updatingCell("table",status);
                } else {                        //if no errors exist then proceed
                    //console.log("No errors in spreadsheet", error_log);
                    /* PROMPT */ prompt_new('Add Dataset: all data entries checked, no errors found in file: '+ name);
                                     
                    //** Backup
                    /* PROMPT */ prompt_new('Add Dataset: backing up previous database: '+ current_database.name);
                    //console.log("prev_database: ", prev_database);
                    //console.log("current_database: ", current_database);
                    //console.log("saveCurrentDatabase(prev_database, save backup)");
                    saveCurrentDatabase(prev_database.name,true, prev_database);    //backup previous database 

                    //** Export JSON
                    /* PROMPT */ prompt_new('Add Dataset: updating current database: '+ current_database.name); 
                    console.log("saveCurrentDatabase(current_database, save db)");
                    saveCurrentDatabase(current_database.name,false,'');            //save current database

                    /* PROMPT */ document.getElementById('prompt_db_current').innerHTML = 'Database name: ' + current_database.name + ' | Containing: ' + current_database.recordnum + ' records';
                    /* PROMPT */ document.getElementById('prompt_db_content').innerHTML =  JSON.stringify(current_database.recordsum, null, 4);

                    updatingCell("table","X");
                    updateInteractiveTableContent(current_database,"table");

                }

                console.log("prev_database: ", prev_database);
                console.log("current_database: ", current_database);
                
                error_log = [];     //reset error log
                error_id = 0;
                /* PROMPT */ prompt_new('*** Break ***');
            }
        };

        reset($('#ds_add'));
    }
}
ds_add.addEventListener('click', addDatasetPart1);
ds_add.addEventListener('change', addDatasetPart2);

window.reset = function(e){
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}

//** UPDATE A DATASET
// Delete + Import

//** DELETE A DATASET

function deleteDataset(epiweek){
    var classes = document.getElementById(current_id).classList;
    //console.log("in deleteDataset, epiweek = ", epiweek);
    updatingCell("table","...");

    if (!(classes.contains("replacing"))) {
        //** Backup
        /* PROMPT */ prompt_new('Delete Dataset: backing up current database: ' + current_database.name);
        console.log("saveCurrentDatabase(current_database, save backup)");
        saveCurrentDatabase(current_database.name,true,''); 
        /* PROMPT */ prompt_new('Delete Dataset: deleting selected dataset: ' + epiweek);
    }
   

    ///* PROMPT */ prompt_new('Delete Dataset: deleting selected dataset: ' + epiweek);
    //var recordsum = current_database.recordsum;
    var temp_data =[];
    var temp_recordsum =[];

    current_database.data.forEach(function(e){
        if(e.epiweek !== epiweek){
            temp_data.push(e);
        }else{
            current_database.recordnum--;
        }
    });

    current_database.data = temp_data;

    current_database.recordsum.forEach(function(e){
        if(e.epiweek !== epiweek){
            temp_recordsum.push(e);
        }
    });

    current_database.recordsum = temp_recordsum;
    //console.log(current_database);

   
    //var classes = document.getElementById(current_id).classList;
    if (!(classes.contains("replacing"))) {
        updatingCell("table",".");
        updateInteractiveTableContent(current_database,"table"); 

        //** Export JSON
        /* PROMPT */ prompt_new('Delete Dataset: saving new database: ' + current_database.name);
        console.log("saveCurrentDatabase(current_database, save db");
        saveCurrentDatabase(current_database.name,false,'');

        /* PROMPT */ document.getElementById('prompt_db_current').innerHTML = 'Database name: ' + current_database.name + ' | Containing: ' + current_database.recordnum + ' records';
        /* PROMPT */ document.getElementById('prompt_db_content').innerHTML =  JSON.stringify(current_database.recordsum, null, 4);
        
        /* PROMPT */ prompt_new('*** Break ***');
    };
    

}

//** CREATE NEW DATABASE
var db_new = document.getElementById('db_new');
function handleDbNewFile(e) {
    var files = e.target.files;
    var f = files[0];

    var name = f.name;
    var path = f.path;
	folderDatabases_actual = path.split(name)[0];

    /* PROMPT */ prompt_new('Create Database: creating empty database: ' + name);

    var output = {
        name: name,
        createdate: new Date(),
        lastupdate: new Date(),
        recordnum: 0,
        recorderr: undefined,          
        recordsum: [],
        data: []
    }

    var exportContent = JSON.stringify(output, null, 4);

    fs.writeFile(path, exportContent, function(err) {
        if(err) {
          console.log(err);
          /* PROMPT */ prompt_new('Error! ' + name + ' could not be saved, open console for more details or ask fo help');
        } else {
          //console.log("onexport", new Date());
          //console.log("JSON saved to " + path);
          handleDbOldFile(e);
        }
    });
}
if(db_new.addEventListener) db_new.addEventListener('change', handleDbNewFile);


//** OPEN EXISTING DATABASE
var db_old = document.getElementById('db_old');
function handleDbOldFile(e) {
    var files = e.target.files;
    var f = files[0];

    var name = f.name;
    var path = f.path;
	folderDatabases_actual = path.split(name)[0];


    //** Read JSON

    /* PROMPT */ prompt_new('Open Database: reading file: ' + name);

    current_database = jsonfile.readFileSync(path);
    console.log('current_database:', current_database);

    /* PROMPT */ prompt_new('Open Database: displaying content: ' + current_database.name);

    initialiseyearsInteractiveTable(current_database);
    showInteractiveTable(current_database,"table");
    updateInteractiveTableContent(current_database,"table");

    /*if ($('#check_data').is(':hidden') == true) {
        $('#check_data').slideToggle();
    }*/
    if ($('#export_row').is(':hidden') == true) {
        $('#export_row').slideToggle();
    }
    if ($('#export2_row').is(':hidden') == true) {
        $('#export2_row').slideToggle();
    }

    /* PROMPT */ document.getElementById('prompt_db_current').innerHTML = 'Database name: ' + current_database.name + ' | Containing: ' + current_database.recordnum + ' records';
    /* PROMPT */ document.getElementById('prompt_db_content').innerHTML =  JSON.stringify(current_database.recordsum, null, 4);
    /* PROMPT */ prompt_new('*** Break ***');
}
if(db_old.addEventListener) db_old.addEventListener('change', handleDbOldFile);

$('#more').on('click',function(e) {
    if ($('#prompt_db_content').is(':hidden') == true) {
        $('#prompt_db_content').slideToggle();
        $('#more').html('Show less...');
    }else{
        $('#prompt_db_content').slideToggle();
        $('#more').html('Show more...');
    }
   });

function prompt_new(message) {
    var message_date = new Date();
    message_date = message_date.toISOString();
    var html = $('#prompt_progress').html();
    html = html.substring(7);
    message_num++;
    $('#prompt_progress').html('<table><tr><td>'+ message_num +' - </td><td>'+message_date+'</td><td> - </td><td>'+message+'</td></tr>' + html);
}




//** CHECK DATA IN DATABASE
//var db_checkdata = document.getElementById('db_checkdata');
/*function dataChecks() {

    /* PROMPT  prompt_new('Check Dataset: checking all data entries in current database: '+ current_database.name);


/*    if ($('#export2_row').is(':hidden') == true) {
        $('#export2_row').slideToggle();
    }
};*/


//** EXPORT DATABASE TO CSV
/*var db_export = document.getElementById('db_export');
function handleDbExport(e) {
    var files = e.target.files;
    var f = files[0];
    var name = f.name;
    var path = f.path;

    /* PROMPT  prompt_new('Export Database: converting from .json to .csv database: ' + current_database.name);
    var json = current_database.data;
    var fields = Object.keys(json[0]);
    var csv = '';
    var csv_temp = json.map(function(row){
        var temp = fields.map(function(fieldName){
            return '"' + (row[fieldName] || '') + '"';
        }) + '\r\n';
        csv += temp;
        return temp;
    });
    var header = JSON.stringify(fields);
    header = header.substring(1,header.length - 1);
    csv = header + '\r\n' + csv;

    /* PROMPT  prompt_new('Export Database: saving .csv file: ' + name);

    fs.writeFile(path, csv, function(err) {
        console.log("*********** IN handleDbExport fs.writeFile");
        if(err) {
          console.log(err);
        }

    /* PROMPT  prompt_new('*** Break ***');

    });
    if ($('#end_row').is(':hidden') == true) {
        $('#end_row').slideToggle();
    }
}
if(db_export.addEventListener) db_export.addEventListener('change', handleDbExport);*/

//** EXPORT2 DATABASE TO CSV
var db_export2 = document.getElementById('db_export2');
function handleDbExport2(e) {
    var files = e.target.files;
    var f = files[0];

    var name = f.name;
    var path = f.path;
    
    /* PROMPT */ prompt_new('Export2 Database: converting from .json to .csv database: ' + current_database.name);
    var json = current_database.data;
    var fields = Object.keys(json[0]);

    console.log("json = ", json);
    console.log("fields = ", fields);

    var temp = []; 
    json.forEach(function(rec,recnum) {
        var recO = {
            disease: rec.disease,
            chiefdom: rec.chiefdom,
            PHU: rec.PHU,
            pop: rec.pop,
            epiweek: rec.epiweek,
            fyo: 'o',
            cas: rec.morecas,
            dth: rec.moredth,
        };
        var recU = {
            disease: rec.disease,
            chiefdom: rec.chiefdom,
            PHU: rec.PHU,
            pop: rec.pop,
            epiweek: rec.epiweek,
            fyo: 'u',
            cas: rec.lesscas,
            dth: rec.lessdth,
        };
        temp.push(recO);
        temp.push(recU);
    });

    var json = temp;
    var fields = Object.keys(json[0]);

    var csv = '';
    var csv_temp = json.map(function(row){
        var temp = fields.map(function(fieldName){
            return '"' + (row[fieldName] || '') + '"';
        }) + '\r\n';
        csv += temp;
        return temp;
    });
    var header = JSON.stringify(fields);
    header = header.substring(1,header.length - 1);
    csv = header + '\r\n' + csv;

    /* PROMPT */ prompt_new('Export2 Database: saving .csv file: ' + name);

    fs.writeFile(path, csv, function(err) {
        if(err) {
          console.log(err);
          /* PROMPT */ prompt_new('Error! ' + name + ' could not be saved, open console for more details or ask for help');
        }

    /* PROMPT */ prompt_new('*** Break ***');

    });
    if ($('#end_row').is(':hidden') == true) {
        $('#end_row').slideToggle();
    }

    reset($('#db_export2'));    //resets filelist input to allow input of same file to be overwritten
    //$('#db_export2').val('');     

}


function writeErrorCSV(xls_name, errors_log) {
    if (xls_name.split(".").pop() == 'xlsx') {xls_name = xls_name.split(".")[0];};
    var name = "Error log " + xls_name + " " + getDateTime() + ".csv";
    var path = folderErrorLog + name;
    var header = ['error_id', 'worksheet_name', 'column', 'row', 'error_value', 'type_required'];
    csv = header + errors_log;

    fs.writeFile(path, csv, 'utf8', function (err) {
      if (err) {
        /* PROMPT */ prompt_new('Writing error log: Error occured - file either not saved or corrupted file saved.: ' + name);
        console.log('Some error occured - file either not saved or corrupted file saved.'); 
      } else{
        ///* PROMPT */ prompt_new('Writing error log: saving .csv file: ' + name);
      }
    });

    return name;
}


if(db_export2.addEventListener) db_export2.addEventListener('change', handleDbExport2);

/* PROMPT */ prompt_new('*** Break ***');
