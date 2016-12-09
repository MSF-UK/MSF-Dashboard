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
var message_num = 0;
/* PROMPT */ prompt_new('Loading: Surveillance Data Manager');

function fixdata(data) {
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

    console.log(sheet_name_list_slice);                                         //CONSOLE

    if(current_database){

        current_database.lastupdate = new Date();

    	sheet_name_list_slice.forEach(function(sheetName) {
            var firstRow = tableRowFirst ;
            var lastRow = tableRowFirst + tableRowNum - 1;
            var firstCol = lettersToNumbers(tableColFirst) + tableColNum * (usrWeek - 1);
            var lastCol = lettersToNumbers(tableColFirst) + tableColNum * (usrWeek) - 1;

            var tempDisease = sheetName;

            for (var r = firstRow; r <= lastRow;r++) {

                var tempChiefdom = workbook.Sheets[sheetName]['B' + r].v;
                var tempPHU = workbook.Sheets[sheetName]['C' + r].v;
                var tempAn = usrYear;
                var tempPop = workbook.Sheets[sheetName]['E' + r].v;

                tempRef = 0;
                tempWeek = usrWeek;

                for (var c = firstCol; c <= lastCol+1; c++) {
                    tempRef++;
                    if (tempRef > 8) {
                        if (tempWeek < 10) {
                            tempEpiweek = tempAn + '-0' + tempWeek;
                        }else{
                            tempEpiweek = tempAn + '-' + tempWeek;
                        };

                        temp = [];

                        for (var i = 8; i >= 1; i--) {
                             val = (typeof workbook.Sheets[sheetName][numbersToLetters(c-i) + r] !== 'undefined') ? workbook.Sheets[sheetName][numbersToLetters(c-i) + r]["v"] : undefined;
                             temp.push(val);
                        };

                        test_empty = temp[0] == undefined && temp[1] == undefined && temp[2] == undefined && temp[3] == undefined && temp[4] == 0 && temp[5] == 0 && temp[6] == 0 && temp[7] == "";
                        if (!(test_empty)) {
                            current_database.recordnum++;
                            current_database.data.push({
                                disease: tempDisease,
                                chiefdom: tempChiefdom,
                                PHU: tempPHU,
                                an: tempAn,
                                pop: tempPop,
                                epiweek: tempEpiweek,
                                lesscas: temp[0],
                                lessdth: temp[1],
                                morecas: temp[2],
                                moredth: temp[3],
                                totalcas: temp[4],
                                totaldth: temp[5],
                                tax: temp[6],
                                let: temp[7],
                            });
                        };
                        tempWeek++;
                        tempRef=1;
                    };

                };
            };
        });

        current_database.recordsum.push({
            epiweek: tempEpiweek,
            recordnum: current_database.recordnum - old_recordnum,
            recorderr: undefined,
            createdate: current_database.lastupdate,
            lastupdate: current_database.lastupdate,
            source: xlsname,
            status: undefined
        });

    }else{
        console.log('No database selected');                                    //CONSOLE
    }
}

function saveCurrentDatabase(name,backup){
    var export_database = current_database;
    if(backup){
        var date = new Date();
        var month = (date.getMonth() + 1 <10) ? '0'+(date.getMonth() + 1): date.getMonth() + 1;
        var day = (date.getDate()<10) ? '0'+date.getDate(): date.getDate();
        var hours = (date.getHours()<10) ? '0'+date.getHours(): date.getHours();
        var minutes = (date.getMinutes()<10) ? '0'+date.getMinutes(): date.getMinutes();
        var seconds = (date.getSeconds()<10) ? '0'+date.getSeconds(): date.getSeconds();
        var outputFilename = '' + folderBackups + date.getFullYear() + month + day + '-' + hours + minutes + seconds + '-' + name;

    }else{
        var outputFilename = '' + folderDatabases_actual + name;
    }

    var exportContent = JSON.stringify(export_database, null, 4);

    fs.writeFile(outputFilename, exportContent, function(err) {
        if(err) {
          console.log(err);                                                     //CONSOLE
		  prompt_new('Error! ' + outputFilename + ' could not be saved, open console for more details or ask fo help');
        } else {
          console.log("onexport", new Date());                                  //CONSOLE
          console.log("JSON saved to " + outputFilename);                       //CONSOLE
        }
    });
}


//** IMPORT NEW DATASET
var ds_add = document.getElementById('ds_add');
function addDatasetPart1(e) {
    $('html').mouseover(function(event){
        var status = document.getElementById(current_id).innerHTML;
        updatingCell("table",status);
        console.log('No File Selected');
        $('html').off('mouseover');
    });
}

function addDatasetPart2(e) {
    console.log(['addDatasetPart2-1',e]);
    var files = e.target.files;
    var f = files[0];
	var path = f.path;

    console.log(['addDatasetPart2-2',f]);
	if (f ==  undefined){
        var status = document.getElementById(current_id).innerHTML;
        updatingCell("table",status);
    }else{
        $('html').off('mouseover');
        //** Read XLSX
    	var reader = new FileReader();
        var name = f.name;

        /* PROMPT */ prompt_new('Add Dataset: file opening: ' + name);

        var wb;
    	reader.onload = function(e) {
    		console.log("onload", new Date());
    		var data = e.target.result;
    		var arr = fixdata(data);

    		wb = X.read(btoa(arr), {type: 'base64'});
    	};
        reader.readAsArrayBuffer(f);

        reader.onloadend = function(event) {
            var err = event.target.error;
            if (err) {
                console.log(err);
            } else {
                console.log("onloadend", new Date());

                //** Backup
                /* PROMPT */ prompt_new('Add Dataset: backing up current database: '+ current_database.name);
                saveCurrentDatabase(current_database.name,true);

                //** Organise XLSX (to JSON)
                /* PROMPT */ prompt_new('Add Dataset: updating current database: '+ current_database.name);
                his_to_json(wb,name);

                //** Export JSON
                saveCurrentDatabase(current_database.name,false);

                /* PROMPT */ document.getElementById('prompt_db_current').innerHTML = 'Database name: ' + current_database.name + ' | Containing: ' + current_database.recordnum + ' records';
                /* PROMPT */ document.getElementById('prompt_db_content').innerHTML =  JSON.stringify(current_database.recordsum, null, 4);

                updatingCell("table","X");
                updateInteractiveTableContent(current_database,"table");
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
    updatingCell("table","...");
    //** Backup
    /* PROMPT */ prompt_new('Delete Dataset: backing up current database: ' + current_database.name);
    saveCurrentDatabase(current_database.name,true);

    /* PROMPT */ prompt_new('Delete Dataset: deleting selected dataset: ' + epiweek);
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
    console.log(current_database);

    //** Export JSON
    saveCurrentDatabase(current_database.name,false);

    /* PROMPT */ document.getElementById('prompt_db_current').innerHTML = 'Database name: ' + current_database.name + ' | Containing: ' + current_database.recordnum + ' records';
    /* PROMPT */ document.getElementById('prompt_db_content').innerHTML =  JSON.stringify(current_database.recordsum, null, 4);

    updatingCell("table",".");
    updateInteractiveTableContent(current_database,"table");
    /* PROMPT */ prompt_new('*** Break ***');

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
        } else {
          console.log("onexport", new Date());
          console.log("JSON saved to " + path);
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
    console.log('current_database:');
    console.log(current_database);

    /* PROMPT */ prompt_new('Open Database: displaying content: ' + current_database.name);

    initialiseyearsInteractiveTable(current_database);
    showInteractiveTable(current_database,"table");
    updateInteractiveTableContent(current_database,"table");

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

//** EXPORT DATABASE TO CSV
var db_export = document.getElementById('db_export');
function handleDbExport(e) {
    var files = e.target.files;
    var f = files[0];
    var name = f.name;
    var path = f.path;

    /* PROMPT */ prompt_new('Export Database: converting from .json to .csv database: ' + current_database.name);
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

    /* PROMPT */ prompt_new('Export Database: saving .csv file: ' + name);

    fs.writeFile(path, csv, function(err) {
        if(err) {
          console.log(err);
        }

    /* PROMPT */ prompt_new('*** Break ***');

    });
    if ($('#end_row').is(':hidden') == true) {
        $('#end_row').slideToggle();
    }
}
if(db_export.addEventListener) db_export.addEventListener('change', handleDbExport);

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

    console.log(json);
    console.log(fields);

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
        }

    /* PROMPT */ prompt_new('*** Break ***');

    });
    if ($('#end_row').is(':hidden') == true) {
        $('#end_row').slideToggle();
    }
}
if(db_export2.addEventListener) db_export2.addEventListener('change', handleDbExport2);

/* PROMPT */ prompt_new('*** Break ***');
