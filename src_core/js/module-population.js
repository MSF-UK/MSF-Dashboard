/*------------------------------------------------------------------------------------
	MSF Dashboard - module-population.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file implements all processing of population related data.
 * @since X.X
 * @module module:module_population  //HEIDI - check all below
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 * @requires js/main-core.js
 * @requires js/module-colorscale.js
 * @todo Could probably be merged with chart warper somehow.
 * @todo Could we avoid module_colorscale dependency?
 * @todo Behavior when re-selecting feature and when back and forth in adm levels could be improved.
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
 * Stores all the global variables used by the {@link module:module_multiadm}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_multiadm
 */
g.module_population = {};

// 1) Data Processing
//------------------------------------------------------------------------------------


//var definedPopYears = [];
module_population.definedPopYears = function(loc){
	var definedPopYears = [];
	for (var year in g.population_databyloc.pop[loc]) {  //1 - get the years for which pop is defined for this location
	    //console.log(year, g.population_databyloc.pop[d.key], g.population_databyloc.pop[d.key][year]);
	    //definedPopYears.push(parseInt(year.substr(3,6)));
	    if (!(isNaN(g.population_databyloc.pop[loc][year]))) {       //only include year in definedPopYears list if it is a number
	        definedPopYears.push(g.population_headerlist.pop[year]);
	    };
	}
	//console.log(loc, definedPopYears);
	return definedPopYears;
};



module_population.getPopNumYr = function(yr, loc){
//console.log("in getPopNumYr: ", yr, definedPopYears, loc);

var definedPopYears	= module_population.definedPopYears(loc);

//function getPopNumYr(yr, definedPopYears, loc) {
    //
    if (definedPopYears.length==0) {
        var pop_temp = 0;

    } else if (definedPopYears.indexOf(yr)!=-1) {     //2 - if year 'yr' is in this then take that value
        //var pop_temp = g.population_databyloc.pop[select_locs[i]]['yr_'+yr]; 

        for (var key in g.population_headerlist.pop) {
            //console.log(key, g.population_headerlist.pop);
            if (g.population_headerlist.pop[key]==yr) {
                //console.log(g.population_headerlist.pop[key], prevYr);
                var currKey = key;
            };
        }
        //console.log("key ref: ", currKey);

        //get pop
        var pop_temp = g.population_databyloc.pop[loc][currKey]; 
        //console.log(yr, " is in ", definedPopYears, "  pop_temp = ", pop_temp);
    } else {
        //console.log(yr, " is NOT in ", definedPopYears);
        var minDefinedPopYear = Math.min(...definedPopYears);
        var maxDefinedPopYear = Math.max(...definedPopYears);
        //console.log("minYear: ", minDefinedPopYear, "   maxYear: ", maxDefinedPopYear);

        if ((yr > minDefinedPopYear) && (yr < maxDefinedPopYear)) {   //3 - if year 'yr' is between two values then do linear interpolation
            
            function getNearestYrs() {
                var prev = definedPopYears[0];
                var next = definedPopYears[0];
                for (var i=0; i<=definedPopYears.length-1; i++) {
                    //if (Math.abs(yr-definedPopYears[i]) < Math.abs(yr-curr)) {
                    //console.log(i, yr, definedPopYears[i], prev, next);
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
            //console.log("prev & next years: ", prevYr, nextYr);

            for (var key in g.population_headerlist.pop) {
                //console.log(key, g.population_headerlist.pop);
                if (g.population_headerlist.pop[key]==prevYr) {
                    //console.log(g.population_headerlist.pop[key], prevYr);
                    var prevKey = key;
                } else if (g.population_headerlist.pop[key]==nextYr) {
                    var nextKey = key;
                };
            }
            //console.log("prev & next refs: ", prevKey, nextKey);

            //get both pops
            //console.log(g.population_databyloc.pop[select_locs[i]]);
            var prevPop = g.population_databyloc.pop[loc][prevKey]; 
            var nextPop = g.population_databyloc.pop[loc][nextKey];
            //console.log("prev & next pops: ", prevPop, nextPop);

            //interpolate
            var pop_temp = ((yr-prevYr)*((nextPop-prevPop)/(nextYr-prevYr))) + prevPop;
            //console.log(yr, " interpolated pop: ", pop_temp);


        } else if (yr < minDefinedPopYear) {  //4 - if year 'yr' is less than lowest year then do 3% increment
            var yearDiff = minDefinedPopYear - yr;      //get difference in years

            for (var key in g.population_headerlist.pop) {
                //console.log(key, g.population_headerlist.pop);
                if (g.population_headerlist.pop[key]==minDefinedPopYear) {
                    //console.log(g.population_headerlist.pop[key], minDefinedPopYear);
                    var minKey = key;
                };
            }
            //console.log("min ref: ", minKey);

            var minPop = g.population_databyloc.pop[loc][minKey]; 
            //console.log("min pop: ", minPop);

            //calculate pop
            var pop_temp = minPop/Math.pow((1+(g.pop_annual_growth/100)),yearDiff);
            //console.log("min pop: ", minPop, " in yr ", minDefinedPopYear);
            //console.log("in year ", yr, " pop = ", pop_temp);

        } else if (yr > maxDefinedPopYear) {  //5 - if year 'yr' is more than highest year then do 3% increment
            var yearDiff = yr - maxDefinedPopYear;      //get difference in years

            for (var key in g.population_headerlist.pop) {
                //console.log(key, g.population_headerlist.pop);
                if (g.population_headerlist.pop[key]==maxDefinedPopYear) {
                    //console.log(g.population_headerlist.pop[key], maxDefinedPopYear);
                    var maxKey = key;
                };
            }
            //console.log("max ref: ", maxKey);

            var maxPop = g.population_databyloc.pop[loc][maxKey]; 
            //console.log("max pop: ", maxPop);

            //calculate pop
            var pop_temp = maxPop*Math.pow((1+(g.pop_annual_growth/100)),yearDiff);
            //console.log("max pop: ", maxPop, " in yr ", maxDefinedPopYear);
            //console.log("in year ", yr, " pop = ", pop_temp);
        } else {
            console.log("ERROR - cannot find population data for year ", yr);
            var pop_temp = 0;
        }
    } 
    return pop_temp;
}




module_population.getPopNum = function(yr){
//function getPopNum(yr) {       //return population for all currently selected regions for given year
    //console.log("in getPopNum for yr (composite chart): ", yr);
    var pop = 0;
    //if selected adm level in map is one of those defined - i.e. an integer between 0 and g.geometry_keylist.length-1
    //console.log("tabcurrentnum is an integer ", Number.isInteger(g.module_multiadm.tabcurrentnum));
    if ((Number.isInteger(g.module_multiadm.tabcurrentnum) && (g.module_multiadm.tabcurrentnum >=0) && (g.module_multiadm.tabcurrentnum <= g.geometry_keylist.length-1))) {
        //console.log("tabcurrentnum = ", g.module_multiadm.tabcurrentnum);
        //console.log("geom_keylist = ", g.geometry_keylist[g.module_multiadm.tabcurrentnum]);
        var select_locs = g.viz_definition[g.viz_locations].charts[g.geometry_keylist[g.module_multiadm.tabcurrentnum]].filters();        //currently filtered locations
        if (select_locs.length == 0){
            select_locs = g.geometry_loclists[g.geometry_keylist[g.module_multiadm.tabcurrentnum]];
        };
    } else {        //otherwise assume level 0
        //console.log("tabcurrentnum = assume ", 0);
        //console.log("geom_keylist = ", g.geometry_keylist[0]);
        var select_locs = g.viz_definition[g.viz_locations].charts[g.geometry_keylist[0]].filters(); 
        if (select_locs.length == 0){
            select_locs = g.geometry_loclists[g.geometry_keylist[0]];
        };
    }
    //console.log("CURRENT LOCATIONS: ", select_locs);

    //loop through locations adding them up
    for (i=0; i<=select_locs.length-1; i++) {
        //console.log("i = ", i, "   add in ", select_locs[i], g.population_databyloc.pop[select_locs[i]]);

        //pop += g.population_databyloc.pop[select_locs[i]];

        if (g.pop_new_format) {

            var definedPopYears = [];
            for (var year in g.population_databyloc.pop[select_locs[i]]) {  //1 - get the years for which pop is defined for this location
                //console.log(year, g.population_databyloc.pop[select_locs[i]], g.population_databyloc.pop[select_locs[i]][year]);
                //definedPopYears.push(parseInt(year.substr(3,6)));
                if (!(isNaN(g.population_databyloc.pop[select_locs[i]][year]))) {       //only include year in definedPopYears list if it is a number
                    definedPopYears.push(g.population_headerlist.pop[year]);
                };
            }
            //console.log(select_locs[i], definedPopYears);
            /*if (select_locs[i]=="Yoni, Matawa MCHP") {
                console.log(select_locs[i], "   definedPopYears: ", definedPopYears);
            }*/

            /*var minYear = Math.min(...definedPopYears);
            var maxYear = Math.max(...definedPopYears);
            console.log("minYear: ", minYear, "   maxYear: ", maxYear);*/

            

            yr = parseInt(yr);
            if (definedPopYears.length==0) {
                var pop_temp = 0;
            } else if (definedPopYears.indexOf(yr)!=-1) {     //2 - if year 'yr' is in this then take that value
                //var pop_temp = g.population_databyloc.pop[select_locs[i]]['yr_'+yr]; 

                for (var key in g.population_headerlist.pop) {
                    //console.log(key, g.population_headerlist.pop);
                    if (g.population_headerlist.pop[key]==yr) {
                        //console.log(g.population_headerlist.pop[key], prevYr);
                        var currKey = key;
                    };
                }
                //console.log("key ref: ", currKey);

                //get pop
                var pop_temp = g.population_databyloc.pop[select_locs[i]][currKey]; 
                //console.log(yr, " is in ", definedPopYears, "  pop_temp = ", pop_temp);
            } else {
                //console.log(yr, " is NOT in ", definedPopYears);
                var minDefinedPopYear = Math.min(...definedPopYears);
                var maxDefinedPopYear = Math.max(...definedPopYears);
                /*if (select_locs[i]=="Yoni, Matawa MCHP") {
                    console.log("yr: ", yr, "   minYear: ", minDefinedPopYear, "   maxYear: ", maxDefinedPopYear);
                }*/
                //console.log("minYear: ", minDefinedPopYear, "   maxYear: ", maxDefinedPopYear);

                if ((yr > minDefinedPopYear) && (yr < maxDefinedPopYear)) {   //3 - if year 'yr' is between two values then do linear interpolation
                    
                    function getNearestYrs() {
                        var prev = definedPopYears[0];
                        var next = definedPopYears[0];
                        for (var i=0; i<=definedPopYears.length-1; i++) {
                            //if (Math.abs(yr-definedPopYears[i]) < Math.abs(yr-curr)) {
                            //console.log(i, yr, definedPopYears[i], prev, next);
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
                    //console.log("prev & next years: ", prevYr, nextYr);

                    for (var key in g.population_headerlist.pop) {
                        //console.log(key, g.population_headerlist.pop);
                        if (g.population_headerlist.pop[key]==prevYr) {
                            //console.log(g.population_headerlist.pop[key], prevYr);
                            var prevKey = key;
                        } else if (g.population_headerlist.pop[key]==nextYr) {
                            var nextKey = key;
                        };
                    }
                    //console.log("prev & next refs: ", prevKey, nextKey);

                    //get both pops
                    //console.log(g.population_databyloc.pop[select_locs[i]]);
                    var prevPop = g.population_databyloc.pop[select_locs[i]][prevKey]; 
                    var nextPop = g.population_databyloc.pop[select_locs[i]][nextKey];
                    //console.log("prev & next pops: ", prevPop, nextPop);

                    //interpolate
                    var pop_temp = ((yr-prevYr)*((nextPop-prevPop)/(nextYr-prevYr))) + prevPop;
                    //console.log(yr, " interpolated pop: ", pop_temp);


                } else if (yr < minDefinedPopYear) {  //4 - if year 'yr' is less than lowest year then do 3% increment

                    var yearDiff = minDefinedPopYear - yr;      //get difference in years
                    /*if (select_locs[i]=="Yoni, Matawa MCHP") {
                        console.log("yr: ", yr, "   minDefinedYear: ", minDefinedPopYear, "   yearDiff: ", yearDiff);
                    }*/

                    for (var key in g.population_headerlist.pop) {
                        //console.log(key, g.population_headerlist.pop);
                        if (g.population_headerlist.pop[key]==minDefinedPopYear) {
                            //console.log(g.population_headerlist.pop[key], minDefinedPopYear);
                            var minKey = key;
                        };
                    }
                    //console.log("min ref: ", minKey);

                    var minPop = g.population_databyloc.pop[select_locs[i]][minKey]; 
                    //console.log("min pop: ", minPop);

                    //calculate pop
                    var pop_temp = minPop/Math.pow((1+(g.pop_annual_growth/100)),yearDiff);
                    //console.log("min pop: ", minPop, " in yr ", minDefinedPopYear);
                    //console.log("in year ", yr, " pop = ", pop_temp);
                    /*if (select_locs[i]=="Yoni, Matawa MCHP") {
                        console.log("in year ", yr, " pop = ", pop_temp, "    minPop = ", minPop);
                    }*/

                } else if (yr > maxDefinedPopYear) {  //5 - if year 'yr' is more than highest year then do 3% increment
                    var yearDiff = yr - maxDefinedPopYear;      //get difference in years

                    for (var key in g.population_headerlist.pop) {
                        //console.log(key, g.population_headerlist.pop);
                        if (g.population_headerlist.pop[key]==maxDefinedPopYear) {
                            //console.log(g.population_headerlist.pop[key], maxDefinedPopYear);
                            var maxKey = key;
                        };
                    }
                    //console.log("max ref: ", maxKey);

                    var maxPop = g.population_databyloc.pop[select_locs[i]][maxKey]; 
                    //console.log("max pop: ", maxPop);

                    //calculate pop
                    var pop_temp = maxPop*Math.pow((1+(g.pop_annual_growth/100)),yearDiff);
                    //console.log("max pop: ", maxPop, " in yr ", maxDefinedPopYear);
                    //console.log("in year ", yr, " pop = ", pop_temp);
                } else {
                    console.log("ERROR - cannot find population data for year ", yr);
                }
            } 

        } else {        //not g.new_pop_format
            pop_temp = g.population_databyloc.pop[select_locs[i]];
        }

        //console.log("pop_temp = ", pop_temp);
        if (!(isNaN(pop_temp))) {
            /*if (select_locs[i]=="Yoni, Matawa MCHP") {
                console.log("in year ", yr, " pop = ", pop_temp, "    pop = ", pop);
            }*/
            pop += pop_temp;
        } /*else {
            console.log("Note: no population data available for ", select_locs[i]);
        }*/
        
    }
    
    return pop;
};