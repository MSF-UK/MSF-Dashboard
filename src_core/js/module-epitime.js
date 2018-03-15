/*------------------------------------------------------------------------------------
    MSF Dashboard - module-epitime.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file gives the necessary instructions to establish the time scales used by various features on the dashboard based on the epidemiological week, beginning on a Monday.
 * @since 1.1
 * @module module:module_epitime    
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/module-getdata.js
 * @requires js/module-datacheck.js
 * @requires lang/main-core.js
 **/
var module_epitime = {};
/*------------------------------------------------------------------------------------
	Components:
	0) Setup
------------------------------------------------------------------------------------*/

modules_list.epitime = true;

/**
 * Stores all the global variables used by the {@link module:module_epitime}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_epitime
 */
g.module_epitime = {};


g.module_epitime.epitime_all = [];
g.module_epitime.date_extent = [];

function epiTime(epi_id, epiweek, epimonth, epiyear, epiDate) {     //epiTime object
    this.epi_id = epi_id;
    this.epiweek = epiweek;
    this.epimonth = epimonth;
    this.epiyear = epiyear;
    this.epiDate = epiDate;
}   

module_epitime.getEpiweeksInData = function(){
   all_epiweeks = [];  
    for (i=0; i<=g.medical_data.length-1; i++) {
        if (!(all_epiweeks.includes(g.medical_data[i][g.medical_headerlist[g.medical_keylist[0]]]))) {
            all_epiweeks.push(g.medical_data[i][g.medical_headerlist[g.medical_keylist[0]]]);            
        }
    }
    return all_epiweeks;
};

module_epitime.getYearsInData = function() {
    all_years = [];
    all_epiweeks = module_epitime.getEpiweeksInData();
    for (i=0; i<=all_epiweeks.length-1; i++) {
        if (all_years.indexOf(all_epiweeks[i].substr(0,4)) == -1) {   //if year is not already in array
            all_years.push(all_epiweeks[i].substr(0,4));
        }    
    } 
    return all_years;
};

module_epitime.createEpiTime = function(){      //returns array of epiTime objects in dashboard
    var epi_first = new epiTime("2007-52",52,12,2007,d3.time.format("%d-%m-%Y").parse("24-12-2007"));
    var epi_prev = epi_first;   
    var epiweeksInData = module_epitime.getEpiweeksInData();
    var datesInData = [];
    var all_epitimes = [];
    
    var all_years = [];
    for (i=0; i<= epiweeksInData.length-1; i++) {
        if (!(all_years.includes(parseInt((epiweeksInData[i]).substr(0,4))))) {  //if year not included in all_years list
            all_years.push(parseInt((epiweeksInData[i]).substr(0,4)));
        }
    }
    var epi_max_yr = Math.max.apply(null, all_years);       
    
    while (epi_prev.epiyear <= epi_max_yr) {
        var new_date = d3.time.day.offset(epi_prev.epiDate, 7); //add 7 days to previous date       
        var new_month = parseInt(d3.time.format("%m")(d3.time.day.offset(new_date, 3))); //add 3 days to date & get month number as integer
        var new_year = parseInt(d3.time.format("%Y")(d3.time.day.offset(new_date, 3)));
        var get_new_week = function(prev_week) {
            if (prev_week < 52) {
                return prev_week+1;
            } else if (new_month==1) {
                return 1;
            } else if (new_month==12) {
                return 53; 
            } else {
                console.log("!ERROR: problem calculating epiweek");
                return 0;
            };
        } 
        var new_week = get_new_week(epi_prev.epiweek);
        var new_epi_id = (new_week < 10)? new_year + "-0" + new_week : new_year + "-" + new_week;
        var epi_temp = new epiTime(new_epi_id, new_week, new_month, new_year, new_date);
                
        if (epiweeksInData.includes(new_epi_id)) {      //if week is included in dataset 
            datesInData.push(new_date);
        };
        all_epitimes.push(epi_temp);
                      
        epi_prev = epi_temp;    
    }

    datesInData.sort(date_sort_asc);
    var minDateInData = datesInData[0];
    var maxDateInData = datesInData[datesInData.length-1];

    for (var i=0; i<=all_epitimes.length-1; i++) {          
        if ((minDateInData <= all_epitimes[i].epiDate) && (all_epitimes[i].epiDate <= maxDateInData)) {
            g.module_epitime.epitime_all.push(all_epitimes[i]);
        }
    }

}; 


module_epitime.get_epiDate = function(epiwk){   //function accepts epiweek, returns associated date (in date format)
    var num_epiwks = g.module_epitime.epitime_all.length;
    
    for (i=0; i<num_epiwks; i++) {
        if (g.module_epitime.epitime_all[i].epi_id == epiwk) {
            var epiDate = new Date(g.module_epitime.epitime_all[i].epiDate);
            break;
        }
    }
    return epiDate;
}


module_epitime.get_epi_id = function(epidt){        //function accepts date (date format), returns epi_id (YYYY-WK)
    var epi_id = "err";     //default value
    var num_epiwks = g.module_epitime.epitime_all.length;
  
    for (i=0; i<=num_epiwks-1; i++) {   
        if ((i==0) && (epidt.getTime() <= g.module_epitime.epitime_all[i].epiDate.getTime())) {  //if date is before first epiweek defined, return first epiweek
            epi_id = g.module_epitime.epitime_all[i].epi_id; 
            break;
        } else if ((i==num_epiwks-1) && (g.module_epitime.epitime_all[i].epiDate.getTime() <= epidt.getTime()) ) {          //for last epiTime entry and date >= last epiTime date
            epi_id = g.module_epitime.epitime_all[i].epi_id;  //for last epiTime entry, if date is between last date entry & last date entry + 7 days
            break;
        } else if ((g.module_epitime.epitime_all[i].epiDate.getTime() <= epidt.getTime()) && (epidt.getTime() < g.module_epitime.epitime_all[i+1].epiDate.getTime())) {
            epi_id = g.module_epitime.epitime_all[i].epi_id;
            break;
        } 
    }
    if (epi_id=="err") {console.log("Error - epi id not found for ", epidt);};
    return epi_id;
}

module_epitime.getEpiweeksInRange = function(date_start, date_end) {
    var epiweeksInRange = [];
    var num_epiwks = g.module_epitime.epitime_all.length;
        for (i=0; i<=num_epiwks-1; i++) {   //for each entry in epitime object   
            if ((date_start.getTime() <= g.module_epitime.epitime_all[i].epiDate.getTime()) && (date_end.getTime() > g.module_epitime.epitime_all[i].epiDate.getTime())) { 
                epiweeksInRange.push(g.module_epitime.epitime_all[i].epi_id);  
            } 
        }
    g.module_epitime.current_epiweeks = epiweeksInRange;   
    return epiweeksInRange;
}

 
var date_sort_asc = function (date1, date2) {   //sort dates in ascending order
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

module_epitime.get_epiRange = function(filtType, startYr, endYr, startMonth, endMonth, startWeek, endWeek, numPrevWeeks)  {    //enter filter type & date parameters, returns date extent with a few days buffer
    var num_epiwks = g.module_epitime.epitime_all.length;
    var allDates = [];

    if ((filtType=="epiyear") || (filtType=="lastXepiyears")) {
        for (i=0; i<num_epiwks; i++) {          //get all start and end dates - for each epiweek       
            if ((g.module_epitime.epitime_all[i].epiyear >= startYr) && (g.module_epitime.epitime_all[i].epiyear <= endYr)) {
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } 
        }
    } else if ((filtType=="epimonth") || (filtType=="lastXepimonths")) {
        for (i=0; i<num_epiwks; i++) {      
            if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epiyear == endYr)) {
                if ((g.module_epitime.epitime_all[i].epimonth >= startMonth) && (g.module_epitime.epitime_all[i].epimonth <= endMonth)) {
                    allDates.push(g.module_epitime.epitime_all[i].epiDate);
                }
            } else if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epimonth >= startMonth)) {
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear == endYr) && (g.module_epitime.epitime_all[i].epimonth <= endMonth)) {
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear > startYr) && (g.module_epitime.epitime_all[i].epiyear < endYr)) {
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            }
        }
    } else if ((filtType=="epiweek") || (filtType=="lastXepiweeks")) {
        for (i=0; i<num_epiwks; i++) {      
            if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epiyear == endYr)) {
                if ((g.module_epitime.epitime_all[i].epiweek >= startWeek) && (g.module_epitime.epitime_all[i].epiweek <= endWeek)) {
                    allDates.push(g.module_epitime.epitime_all[i].epiDate);
                }
            } else if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epiweek >= startWeek)) {
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear == endYr) && (g.module_epitime.epitime_all[i].epiweek <= endWeek)) {
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear > startYr) && (g.module_epitime.epitime_all[i].epiyear < endYr)) {
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            }
        }   
    } 

    var first, last = new Date();
    allDates.sort(date_sort_asc);
    first = allDates[0];            
    last = allDates.pop();
    first = d3.time.day.offset(first, -1);      //Note: buffer days -1 day
    last = d3.time.day.offset(last, 6);         //Note: buffer days +6 days
    
    var dateRange = [first,last];

    return dateRange;
}
