/*------------------------------------------------------------------------------------
    MSF Dashboard - module-intro.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file gives the necessary instructions to setup the interactive help, using intro.js.
 * @since 0.5
 * @module module:module_intro
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 * @requires lang/main-core.js
 * @requires lang/module-interface.js
 **/
var module_epitime = {};
/*------------------------------------------------------------------------------------
	Components:
	0) Setup
------------------------------------------------------------------------------------*/

modules_list.epitime = true;

/**
 * Stores all the global variables used by the {@link module:module_intro}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_intro
 */
g.module_epitime = {};

/**
 * Defines and populates the intro.js instance.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:g.viz_keylist}</li>
 *  <li>{@link module:g.viz_definition} - <code>display_intro</code> and <code>display_idcontainer</code></li>
 * </ul>
 * Returns:
 * <ul>
 *  <li>{@link module:module_intro.definition}</li>
 *  <li>{@link module:module_intro.step}</li>
 * </ul>
 * <br> Triggered by the end of {@link module:main_core~generateDashboard}.
 * @type {Function}
 * @method
 * @alias module:module_intro.setup
 */
//module_intro.setup = function() {

    /**
    interface_menuinteractions defs
    interface_buttoninteraction x2

     * Contains the intro.js instance, which will be populated by steps from: {@link module:module_intro.step}.
     * <br> Defined in {@link module:module_intro.setup}.
     * @type {Object}
     * @constant
     * @alias module:module_intro.definition
     */
	//g.module_intro.definition = introJs();

    /**
     * Contains the steps details for the intro.js instance.
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:module_lang.text}</li>
     *  <li>{@link module:module_lang.current}</li>
     *  <li>{@link module:g.viz_keylist}</li>
     *  <li>{@link module:g.viz_definition} - <code>display_intro</code> and <code>display_idcontainer</code></li>
     * </ul>
     * <br> Defined in {@link module:module_intro.setup}.
     * @type {Object}
     * @constant
     * @alias module:module_intro.step
     */

	/*g.module_intro.step = {};
	var steps = [{
			  	element: '#title',
				intro: g.module_lang.text[g.module_lang.current].intro_intro,
				position: 'bottom'
			  }];
	var keynum = 0;
	g.viz_keylist.forEach(function(key){
		if(!(g.viz_definition[key].display_intro == 'none')){
			if(g.viz_definition[key].display_idcontainer){
                var element = '#' + g.viz_definition[key].display_idcontainer;
            }else{
                var element = '#chart-'+key;
            }
            keynum++;
			g.module_intro.step[key] = keynum;
			steps.push({
				  	element: element,
					intro: g.module_lang.text[g.module_lang.current]['intro_'+key],
					position: g.viz_definition[key].display_intro
			});
		}
	});

	g.module_intro.definition.setOptions({
			steps: steps
		}); */


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
    //function epiweeksInData() {      //returns array of all epiweeks in dashboard
        //console.log("g.medical_data = ", g.medical_data);     //data = g.medical_data   /  epiweek = g.medical_headerlist[g.medical_keylist[0]]
        all_epiweeks = [];  
        for (i=0; i<=g.medical_data.length-1; i++) {
            if (!(all_epiweeks.includes(g.medical_data[i][g.medical_headerlist[g.medical_keylist[0]]]))) {
                all_epiweeks.push(g.medical_data[i][g.medical_headerlist[g.medical_keylist[0]]]);
            }
        }
        //console.log("all epiweeks in data (", all_epiweeks.length, ") = ", all_epiweeks);
        return all_epiweeks;
    };

    module_epitime.createEpiTime = function(){
    //function createEpiTime() {      //returns array of epiTime objects in dashboard
        var epi_first = new epiTime("2007-52",52,12,2007,d3.time.format("%d-%m-%Y").parse("24-12-2007"));
        var epi_prev = epi_first;   
        var epiweeksInData = module_epitime.getEpiweeksInData();
        
        var all_years = [];
        for (i=0; i<= epiweeksInData.length-1; i++) {
            if (!(all_years.includes(parseInt((epiweeksInData[i]).substr(0,4))))) {  //if year not included in all_years list
                all_years.push(parseInt((epiweeksInData[i]).substr(0,4)));
            }
        }
        //console.log("all_years: ", all_years);
        var epi_max_yr = Math.max.apply(null, all_years);       
        //console.log("all_years max: ", epi_max_yr);
        
        while (epi_prev.epiyear <= epi_max_yr) {
            var new_date = d3.time.day.offset(epi_prev.epiDate, 7); //add 7 days to previous date       
            //console.log("new: date = ", new_date);    
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
                    
            if (epiweeksInData.includes(new_epi_id)) {      //if week is included in dataset then
                g.module_epitime.epitime_all.push(epi_temp);
            };
                
            epi_prev = epi_temp;    
        }
    }; 
    //createEpiTime();
    //console.log("module-epitime: epitime_all", epitime_all);
    

    //function get_epiDate (epiwk) {
    module_epitime.get_epiDate = function(epiwk){   //function accepts epiweek, returns date (date format)
        var num_epiwks = g.module_epitime.epitime_all.length;
        
        for (i=0; i<num_epiwks; i++) {
            if (g.module_epitime.epitime_all[i].epi_id == epiwk) {
                var epiDate = new Date(g.module_epitime.epitime_all[i].epiDate);
                break;
            }
        }
        return epiDate;
    }


    //function get_epi_id (epidt) {       //function accepts date (date format), returns epi_id (YYYY-WK)
    module_epitime.get_epi_id = function(epidt){
        var epi_id = "ERROR"; //HEIDI - default value; or is it better to use ""?
        var num_epiwks = g.module_epitime.epitime_all.length;

        //console.log("************** in module_epitime.get_epi_id to get ", epidt, " = ", epidt.getTime());
        
        for (i=0; i<=num_epiwks-1; i++) {   //for each entry in epitime object   
            //HEIDI - occasional PROBLEM here in 'else if' with trying to call epitime_all[i+1]?
            /*if (!(g.module_epitime.epitime_all[i+1])) {
                console.log("ERROR HERE TRYING TO ACCESS:");
                console.log(g.module_epitime.epitime_all[i+1]);
            }*/
            if ((i==num_epiwks-1) && (g.module_epitime.epitime_all[i].epiDate.getTime() <= epidt.getTime()) && (epidt.getTime() < (d3.time.day.offset(g.module_epitime.epitime_all[i].epiDate, 7)).getTime())) {          //for last epiTime entry and date between last epiTime date and last epiTime date + 6days
                //console.log("in module_epitime.get_epi_id if: ", epidt.getTime(), (d3.time.day.offset(g.module_epitime.epitime_all[i].epiDate, 7)).getTime());
                epi_id = g.module_epitime.epitime_all[i].epi_id;  //for last epiTime entry, if date is between last date entry & last date entry + 7 days
                break;
            } else if ((g.module_epitime.epitime_all[i].epiDate.getTime() <= epidt.getTime()) && (epidt.getTime() < g.module_epitime.epitime_all[i+1].epiDate.getTime())) {
                //console.log("in module_epitime.get_epi_id else if: ", epidt.getTime(), g.module_epitime.epitime_all[i+1].epiDate.getTime());
                epi_id = g.module_epitime.epitime_all[i].epi_id;
                break;
            }
        }
        //console.log("get_epi_id ", epidt, epi_id);
        return epi_id;
    }

module_epitime.getEpiweeksInRange = function(date_start, date_end) {
    //console.log("Dates in range: ", date_start, " - ", date_end);
    //var epi_id = "";
    var epiweeksInRange = [];
    var num_epiwks = g.module_epitime.epitime_all.length;
        for (i=0; i<=num_epiwks-1; i++) {   //for each entry in epitime object   
            if ((date_start.getTime() <= g.module_epitime.epitime_all[i].epiDate.getTime()) && (date_end.getTime() > g.module_epitime.epitime_all[i].epiDate.getTime())) { 
                epiweeksInRange.push(g.module_epitime.epitime_all[i].epi_id);  
            } 
        }
    //console.log("Epiweeks in range: ", epiweeksInRange);
    //g.module_epitime.current_epiweeks = epiweeksInRange;
    return epiweeksInRange;
}
 
var date_sort_asc = function (date1, date2) {   //sort dates in ascending order
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

module_epitime.get_epiRange = function(filtType, startYr, endYr, startMonth, endMonth, startWeek, endWeek, numPrevWeeks)  {    //enter filter type & date parameters, returns date range
    //console.log("in module_epitime.get_epiRange (", filtType, startYr, endYr, startMonth, endMonth, startWeek, endWeek, numPrevWeeks, ")");
    var num_epiwks = g.module_epitime.epitime_all.length;
    //console.log("num_epiwks = ", num_epiwks); 
    var allDates = [];

    /*filtType.forEach(function(filt){          //HEIDI - CHANGE TO SWITCH STATEMENT
        switch(filt){   //"btn_qf-"' + button_cat
            case 'epiyear':  */
    
    if ((filtType=="epiyear") || (filtType=="lastXepiyears")) {
        for (i=0; i<num_epiwks; i++) {          //get all start and end dates - for each epiweek
            //console.log("i = ", i, epitime_all[i].epi_id);        
            if ((g.module_epitime.epitime_all[i].epiyear >= startYr) && (g.module_epitime.epitime_all[i].epiyear <= endYr)) {
                //console.log("found epimonth");
                //startDate.push(epitime_all[i].epiDate); 
                //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6.999));   //offset by 6 days
                //endDate.push(epitime_all[i].epiDate);
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } 
        }
    } else if ((filtType=="epimonth") || (filtType=="lastXepimonths")) {
        for (i=0; i<num_epiwks; i++) {      
            //console.log("i = ", i, epitime_all[i].epi_id);
            if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epiyear == endYr)) {
                if ((g.module_epitime.epitime_all[i].epimonth >= startMonth) && (g.module_epitime.epitime_all[i].epimonth <= endMonth)) {
                    //console.log("found epimonth 1");
                    //startDate.push(epitime_all[i].epiDate);
                    //endDate.push(epitime_all[i].epiDate);
                    //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                    allDates.push(g.module_epitime.epitime_all[i].epiDate);
                }
            } else if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epimonth >= startMonth)) {
                //console.log("found epimonth 2");
                //startDate.push(epitime_all[i].epiDate);
                //endDate.push(epitime_all[i].epiDate);
                //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear == endYr) && (g.module_epitime.epitime_all[i].epimonth <= endMonth)) {
                //console.log("found epimonth 3");
                //startDate.push(epitime_all[i].epiDate);
                //endDate.push(epitime_all[i].epiDate);
                //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear > startYr) && (g.module_epitime.epitime_all[i].epiyear < endYr)) {
                //console.log("found epimonth 4");
                //startDate.push(epitime_all[i].epiDate);
                //endDate.push(epitime_all[i].epiDate);
                //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            }
        }
    } else if ((filtType=="epiweek") || (filtType=="lastXepiweeks")) {
        for (i=0; i<num_epiwks; i++) {      
            //console.log("i = ", i, epitime_all[i].epi_id);
            if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epiyear == endYr)) {
                /*if ((epitime_all[i].epiweek == startWeek) && (epitime_all[i].epiweek == endWeek)) {
                    startDate.push(epitime_all[i].epiDate);
                    endDate.push(epitime_all[i].epiDate);       
                } else */
                if ((g.module_epitime.epitime_all[i].epiweek >= startWeek) && (g.module_epitime.epitime_all[i].epiweek <= endWeek)) {
                    //console.log("found epiweek 1");
                    //startDate.push(epitime_all[i].epiDate);
                    //endDate.push(epitime_all[i].epiDate);
                    //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                    allDates.push(g.module_epitime.epitime_all[i].epiDate);
                }
            } else if ((g.module_epitime.epitime_all[i].epiyear == startYr) && (g.module_epitime.epitime_all[i].epiweek >= startWeek)) {
                //console.log("found epiweek 2");
                //startDate.push(epitime_all[i].epiDate);
                //endDate.push(epitime_all[i].epiDate);
                //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear == endYr) && (g.module_epitime.epitime_all[i].epiweek <= endWeek)) {
                //console.log("found epiweek 3");
                //startDate.push(epitime_all[i].epiDate);
                //endDate.push(epitime_all[i].epiDate);
                //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            } else if ((g.module_epitime.epitime_all[i].epiyear > startYr) && (g.module_epitime.epitime_all[i].epiyear < endYr)) {
                //console.log("found epiweek 4");
                //startDate.push(epitime_all[i].epiDate);
                //endDate.push(epitime_all[i].epiDate);
                //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days
                allDates.push(g.module_epitime.epitime_all[i].epiDate);
            }
        }   
    } /*else if (filtType=="lastXepiweeks") {
        var allWeeks = [];
        for (i=0; i<num_epiwks; i++) {      
            //console.log("i = ", i, epitime_all[i].epi_id);
            allWeeks.push(g.module_epitime.epitime_all[i].epiDate);  
        };
        //console.log("allWeeks = ", allWeeks);
        allWeeks.sort(date_sort_asc);
        //console.log("allWeeks sorted = ", allWeeks);
        
        for (i=num_epiwks-numPrevWeeks; i<=num_epiwks-1; i++) {     
            //console.log("found prevXWeeks 1");
            //startDate.push(epitime_all[i].epiDate);
            //endDate.push(epitime_all[i].epiDate);
            //endDate.push(d3.time.day.offset(epitime_all[i].epiDate, 6));   //offset by 6 days 
            allDates.push(g.module_epitime.epitime_all[i].epiDate);
        };

    };*/
    //console.log("startDate, endDate = ", startDate, endDate);
    //console.log("lengths of startDate, endDate = ", startDate.length, endDate.length);
    
    var first, last = new Date();
    //startDate.sort(date_sort_asc);
    //endDate.sort(date_sort_asc);
    allDates.sort(date_sort_asc);
    first = allDates[0];            
    last = allDates.pop();
    //console.log("first, last = ", first, last);
    
    //if (first==last) {
        first = d3.time.day.offset(first, 0);
        last = d3.time.day.offset(last, 6);
    //}
    
    var dateRange = [first,last];
    //console.log("dateRange: ", dateRange);
    return dateRange;
}

 

module_epitime.filterDates = function(filtType, startYr, endYr, startMonth, endMonth, startWeek, endWeek, prevXWeeks) {  //HEIDI - THIS FN DOES NOTHING
    //console.log("in filterDates(", filtType,startYr,endYr,startMonth,endMonth, startWeek, endWeek, prevXWeeks,")");
    
    if ((filtType == "epiyear") || (filtType == "lastXepiyears")) {                //filter by year range
        arr = module_epitime.get_epiRange(filtType, startYr, endYr, '', '', '', '', ''); 
    } else if ((filtType == "epimonth") || (filtType == "lastXepimonths"))  {      //filter by month range
        arr = module_epitime.get_epiRange(filtType, startYr, endYr, startMonth, endMonth, '', '', ''); 
    } else if ((filtType =="epiweek") || (filtType == "lastXepiweeks"))  {        //filter by week range
        arr = module_epitime.get_epiRange(filtType, startYr, endYr,'', '', startWeek, endWeek, '');
    } /*else if (filtType =="lastXepiweeks") {       //filter by last X weeks
        arr = module_epitime.get_epiRange(filtType, '', '', '', '', '', '', prevXWeeks);
    };*/
        
    //zoomStartDate = arr[0];
    //zoomEndDate = arr[1];
    //zoomStartDate = d3.time.day.offset(arr[0], -1); 
    //zoomEndDate = d3.time.day.offset(arr[1], 1);  
    zoomStartDate = d3.time.day.offset(arr[0], 0); 
    zoomEndDate = d3.time.day.offset(arr[1], 0);  
    //console.log(zoomStartDate, zoomEndDate);
    
    return [zoomStartDate, zoomEndDate];

    //dc.filterAll();
    //epiOverviewChart.filter(dc.filters.RangedFilter(zoomStartDate, zoomEndDate));
    //console.log("epiOverviewChart filters: ", epiOverviewChart.filter());
    //dc.redrawAll();  //doesn't seem to be needed
};

