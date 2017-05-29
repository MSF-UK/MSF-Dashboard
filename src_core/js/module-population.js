/*------------------------------------------------------------------------------------
	MSF Dashboard - module-population.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file implements all processing of population related data.
 * @since 1.1
 * @module module:module_population 
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires js/main-core.js
 **/
var module_population = {};
/*------------------------------------------------------------------------------------	
	Components:
	0) Setup
	1) Data Processing

------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.population = true;

/**
 * Stores all the global variables used by the {@link module:module_population}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_population
 */
if(!g.module_population){
    g.module_population = {}; 
}

// 1) Data Processing
//------------------------------------------------------------------------------------

get_definedPopYears = function(loc) {
	var definedPopYears = [];
	for (var year in g.module_population.population_databyloc.pop[loc]) {          //1 - get the years for which pop is defined for this location
	    if (!(isNaN(g.module_population.population_databyloc.pop[loc][year]))) {   //only include year in definedPopYears list if it is a number
	        definedPopYears.push(g.module_population.pop_headerlist.pop[year]);
	    };
	}
	return definedPopYears;
};



module_population.getPopNumYr = function(yr, loc){

    var definedPopYears = get_definedPopYears(loc);

    if (definedPopYears.length==0) {
        var pop_temp = 0;

    } else if (definedPopYears.indexOf(yr)!=-1) {     //2 - if year 'yr' is in this then take that value

        for (var key in g.module_population.pop_headerlist.pop) {
            if (g.module_population.pop_headerlist.pop[key]==yr) {
                var currKey = key;
            };
        }    
        var pop_temp = g.module_population.population_databyloc.pop[loc][currKey];      //get pop

    } else {
        var minDefinedPopYear = Math.min(...definedPopYears);
        var maxDefinedPopYear = Math.max(...definedPopYears);

        if ((yr > minDefinedPopYear) && (yr < maxDefinedPopYear)) {   //3 - if year 'yr' is between two values then do linear interpolation
            
            function getNearestYrs() {
                var prev = definedPopYears[0];
                var next = definedPopYears[0];
                for (var i=0; i<=definedPopYears.length-1; i++) {
                    if (((yr-definedPopYears[i])<(yr-prev)) && ((yr-definedPopYears[i])>0)) {
                        prev = definedPopYears[i];
                    };
                    if (((yr-definedPopYears[i])<(yr-next)) && ((yr-definedPopYears[i])<0)) {
                        next = definedPopYears[i];
                    };
                }
                return [prev, next];
            };
            var prevYr, nextYr = 0;
            [prevYr, nextYr] = getNearestYrs();

            for (var key in g.module_population.pop_headerlist.pop) {
                if (g.module_population.pop_headerlist.pop[key]==prevYr) {
                    var prevKey = key;
                } else if (g.module_population.pop_headerlist.pop[key]==nextYr) {
                    var nextKey = key;
                };
            };

            //get both pops
            var prevPop = g.module_population.population_databyloc.pop[loc][prevKey]; 
            var nextPop = g.module_population.population_databyloc.pop[loc][nextKey];

            //interpolate
            var pop_temp = ((yr-prevYr)*((nextPop-prevPop)/(nextYr-prevYr))) + prevPop;

        } else if (yr < minDefinedPopYear) {  //4 - if year 'yr' is less than lowest year then do 3% increment
            var yearDiff = minDefinedPopYear - yr;      //get difference in years

            for (var key in g.module_population.pop_headerlist.pop) {
                if (g.module_population.pop_headerlist.pop[key]==minDefinedPopYear) {
                    var minKey = key;
                };
            }

            var minPop = g.module_population.population_databyloc.pop[loc][minKey]; 

            //calculate pop
            var pop_temp = minPop/Math.pow((1+(g.module_population.pop_annual_growth/100)),yearDiff);

        } else if (yr > maxDefinedPopYear) {  //5 - if year 'yr' is more than highest year then do 3% increment
            var yearDiff = yr - maxDefinedPopYear;      //get difference in years

            for (var key in g.module_population.pop_headerlist.pop) {
                if (g.module_population.pop_headerlist.pop[key]==maxDefinedPopYear) {
                    var maxKey = key;
                };
            };

            var maxPop = g.module_population.population_databyloc.pop[loc][maxKey]; 

            //calculate pop
            var pop_temp = maxPop*Math.pow((1+(g.module_population.pop_annual_growth/100)),yearDiff);

        } else {
            console.log("ERROR - cannot find population data for year ", yr);
            var pop_temp = 0;
        }
    } 
    return pop_temp;
}


module_population.getPopNum = function(yr){     //return population for all currently selected regions for given year

    var pop = 0;
    //if selected adm level in map is one of those defined - i.e. an integer between 0 and g.geometry_keylist.length-1
    if ((Number.isInteger(g.module_multiadm.tabcurrentnum) && (g.module_multiadm.tabcurrentnum >=0) && (g.module_multiadm.tabcurrentnum <= g.geometry_keylist.length-1))) {
        var select_locs = g.viz_definition[g.viz_locations].charts[g.geometry_keylist[g.module_multiadm.tabcurrentnum]].filters();        //currently filtered locations
        if (select_locs.length == 0){
            select_locs = g.geometry_loclists[g.geometry_keylist[g.module_multiadm.tabcurrentnum]];
        };
    } else {        //otherwise assume level 0
        var select_locs = g.viz_definition[g.viz_locations].charts[g.geometry_keylist[0]].filters(); 
        if (select_locs.length == 0){
            select_locs = g.geometry_loclists[g.geometry_keylist[0]];
        };
    };

    //loop through locations adding them up
    for (i=0; i<=select_locs.length-1; i++) {

        if (g.module_population.pop_new_format) {

            var definedPopYears = [];
            for (var year in g.module_population.population_databyloc.pop[select_locs[i]]) {  //1 - get the years for which pop is defined for this location
                if (!(isNaN(g.module_population.population_databyloc.pop[select_locs[i]][year]))) {   //only include year in definedPopYears list if it is a number
                    definedPopYears.push(g.module_population.pop_headerlist.pop[year]);
                };
            }

            yr = parseInt(yr);
            if (definedPopYears.length==0) {
                var pop_temp = 0;
            } else if (definedPopYears.indexOf(yr)!=-1) {     //2 - if year 'yr' is in this then take that value

                for (var key in g.module_population.pop_headerlist.pop) {
                    if (g.module_population.pop_headerlist.pop[key]==yr) {
                        var currKey = key;
                    };
                };

                //get pop
                var pop_temp = g.module_population.population_databyloc.pop[select_locs[i]][currKey]; 

            } else {
                var minDefinedPopYear = Math.min(...definedPopYears);
                var maxDefinedPopYear = Math.max(...definedPopYears);

                if ((yr > minDefinedPopYear) && (yr < maxDefinedPopYear)) {   //3 - if year 'yr' is between two values then do linear interpolation
                    
                    function getNearestYrs() {
                        var prev = definedPopYears[0];
                        var next = definedPopYears[0];
                        for (var i=0; i<=definedPopYears.length-1; i++) {
                            if (((yr-definedPopYears[i])<(yr-prev)) && ((yr-definedPopYears[i])>0)) {
                                prev = definedPopYears[i];
                            };
                            if (((yr-definedPopYears[i])<(yr-next)) && ((yr-definedPopYears[i])<0)) {
                                next = definedPopYears[i];
                            };
                        }
                        return [prev, next];
                    };
                    var prevYr, nextYr = 0;
                    [prevYr, nextYr] = getNearestYrs();

                    for (var key in g.module_population.pop_headerlist.pop) {
                        if (g.module_population.pop_headerlist.pop[key]==prevYr) {
                            var prevKey = key;
                        } else if (g.module_population.pop_headerlist.pop[key]==nextYr) {
                            var nextKey = key;
                        };
                    };

                    //get both pops
                    var prevPop = g.module_population.population_databyloc.pop[select_locs[i]][prevKey]; 
                    var nextPop = g.module_population.population_databyloc.pop[select_locs[i]][nextKey];

                    //interpolate
                    var pop_temp = ((yr-prevYr)*((nextPop-prevPop)/(nextYr-prevYr))) + prevPop;

                } else if (yr < minDefinedPopYear) {  //4 - if year 'yr' is less than lowest year then do 3% increment

                    var yearDiff = minDefinedPopYear - yr;      //get difference in years

                    for (var key in g.module_population.pop_headerlist.pop) {
                        if (g.module_population.pop_headerlist.pop[key]==minDefinedPopYear) {
                            var minKey = key;
                        };
                    };

                    var minPop = g.module_population.population_databyloc.pop[select_locs[i]][minKey]; 

                    //calculate pop
                    var pop_temp = minPop/Math.pow((1+(g.module_population.pop_annual_growth/100)),yearDiff);

                } else if (yr > maxDefinedPopYear) {            //5 - if year 'yr' is more than highest year then do 3% increment
                    var yearDiff = yr - maxDefinedPopYear;      //get difference in years

                    for (var key in g.module_population.pop_headerlist.pop) {
                        if (g.module_population.pop_headerlist.pop[key]==maxDefinedPopYear) {
                            var maxKey = key;
                        };
                    };

                    var maxPop = g.module_population.population_databyloc.pop[select_locs[i]][maxKey]; 

                    //calculate pop
                    var pop_temp = maxPop*Math.pow((1+(g.module_population.pop_annual_growth/100)),yearDiff);
                } else {
                    console.log("ERROR - cannot find population data for year ", yr);
                }
            } 

        } else {      
            pop_temp = g.module_population.population_databyloc.pop[select_locs[i]];
        }

        if (!(isNaN(pop_temp))) {
            pop += pop_temp;
        };
        
    };
    return pop;
};


module_population.getPopAgeGroups = function(){

    var age_groups = [];
    for (var key in g.medical_read.fyo) {
      if ((key=='a') || (key=='all')) {
        age_groups.unshift({group: key, label: g.medical_read.fyo[key]});  //add to beginning of array
      } else {
        age_groups.push({group: key, label: g.medical_read.fyo[key]});
      }
    };

    if (age_groups.length==0) {
        age_groups.push({group: 'a', label: 'All Ages'});
    }
    return age_groups;
};