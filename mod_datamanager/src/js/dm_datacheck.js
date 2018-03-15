
testvalue = {		//data test types
	int_test: function(rec,key,none){
		var value = rec[key];
		var cond_1 = value >= 0;
		var cond_2 = parseInt(Number(value),10) == value;
		return cond_1 && cond_2;
	},
	real_test: function(rec,key,none){
		var value = rec[key];
		var cond_1 = !isNaN(Number(value));
		var cond_2 = !(value == '');
		return cond_1 && cond_2;
	},
	pos_real_test: function(rec,key,none){
		var value = rec[key];
		var cond_1 = !isNaN(Number(value));
		var cond_2 = !(value == '');
		var cond_3 = value >= 0;
		return cond_1 && cond_2 && cond_3;
	},
	epiweek_test: function(rec,key,none){
		var value = rec[key];
		var year = value.split('-')[0];
		var week = value.split('-')[1];
		var cond_1 = (year.length == 4) && (week.length == 2);
		var cond_2 = year > 0;
		var cond_3 = week > 0 && week < 54;
		return cond_1 && cond_2 && cond_3;
	},
	/*date: function(rec,key,none){
		var value = rec[g.medical_headerlist[key]];
		var year = value.split('-')[0];
		var month = value.split('-')[1];
		var day = value.split('-')[2];
		var cond_1 = (year.length == 4) && (month.length == 2) && (day.length == 2);
		var cond_2 = year > 0;
		var cond_3 = month > 0 && month < 13;
		var cond_4 = day > 0 && day < 32;
		var now = new Date();
		var cond_5 = year < now.getFullYear() || (year == now.getFullYear() && month < (now.getMonth() + 1 )) || (year == now.getFullYear() && month == (now.getMonth() + 1 ) && day <= now.getDate());
		return cond_1 && cond_2 && cond_3 && cond_4 && cond_5;
	},*/
	/*inlist: function(rec,key,valuelist){
		var value = rec[g.medical_headerlist[key]];
		var cond_1 = !(valuelist.indexOf(value) == -1);
		return cond_1;
	},*/
	/*ingeometry: function(rec,key,option){
		var keylist = g.geometry_keylist;
		var count = g.geometry_levellist[key];
		if(option == 'normalize'){
			var loc_current = toTitleCase(rec[g.medical_headerlist[key]].trim().split('_').join(' '));
		}else{				
			var loc_current = rec[g.medical_headerlist[key]].trim().split('_').join(' ');
		}
		while(count > 0){
			count--;
			if(option == 'normalize'){
				loc_current = toTitleCase(rec[g.medical_headerlist[keylist[count]]].trim().split('_').join(' '))+', '+loc_current;
			}else{
				loc_current = rec[g.medical_headerlist[keylist[count]]].trim().split('_').join(' ')+', '+loc_current;
			}
		}
		var cond_1 = !(g.geometry_loclists[key].indexOf(loc_current) == -1);
		var cond_2 = g.medical_loclists[key].indexOf(loc_current) == -1;

		if(cond_1 && cond_2){
			g.medical_loclists[key].push(loc_current);
			g.medical_loclists.all.push(loc_current);
		}
		return cond_1;
	},*/
	empty: function(rec,key,none){
		if(rec[key] == undefined || rec[key] == '_NA'){
			var cond_1 = true;
		}else{
			var cond_1 = rec[key] == '';
		}
		return cond_1;
	},
	none: function(rec,key,none){
		return true;
	}
};


function checkRecord(rec, sheetName, col, row) {
	//console.log("in dm_datacheck.js checkRecord: ", rec, sheetName, col, row);
	// todo: Check for duplicates, check geometries/adm layers (chiefdom, PHU), DISEASE LIST, YEAR (an)

	var col_fix = -6;		//if only the weekly columns are checked
	var new_col_fix = -2;

	for (var key in rec) {

		if (!(testvalue.empty(rec, key, ''))) {
			//console.log(rec, sheetName, col, row, key);
			var type_req = '';
			var result = testvalue[testType[key]](rec, key, '');

			switch(testType[key]) {
				case 'int_test': type_req = 'positive integer'; break;
				case 'real_test': type_req = 'real'; break;
				case 'pos_real_test': type_req = 'positive real'; break;
				case 'epiweek_test': type_req = 'epiweek'; break;
				default: type_req = 'NA';
			};

			if (result==false) {									
				console.log("***** ERROR HERE: ", key, rec);
				error_id++
				if (data_format=='DHIS2') {
					error_log_temp = [error_id, sheetName, numbersToLetters(col-7+new_col_fix), row, rec[key], type_req];	//col-4 is first column in the record
				} else if (data_format=='IDS') {
					error_log_temp = [error_id, sheetName, rec.epiweek, row, rec[key], type_req];	
				} else {
					error_log_temp = [error_id, sheetName, numbersToLetters(col-8+col_fix), row, rec[key], type_req];	//col-8 is first column in the record
				}
				
				error_log.push('\r\n'+ error_log_temp);
			};

		};

		if (data_format=='DHIS2') {
			new_col_fix++;
		} else {
			col_fix++;  	//NOTE: IF PROGRAM FAILS HERE THEN YOU LOSE THE DATA FOR THIS WEEK
		}		
			
	};
}