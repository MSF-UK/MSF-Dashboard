/*------------------------------------------------------------------------------------
	MSF Dashboard - module-interface.js
    (c) 2015-present, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
/**
 * This file permits the creation of interface elements: a lateral menu and quick access buttons for each chart-map. The module defines the appearance as well as the behavior of each menu.
 * <br>
 * @since 0.3
 * @module module:module_interface
 * @requires index.html
 * @requires dev/dev-defined.js
 * @requires js/main-loadfiles.js
 * @requires js/module-datacheck.js
 * @requires lang/module-lang.js
 * @requires lang/main-core.js
 **/
var module_interface = {};
/*------------------------------------------------------------------------------------
	Components:
	0) Setup
	1) Display + Interactions
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------ 

modules_list.interface = true;

/**
 * Stores all the global variables used by the {@link module:module_interface}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_interface
 */
g.module_interface = {};

// 1) Display + Interactions
//------------------------------------------------------------------------------------    

/**
 * Runs through all the charts/maps to: 
 <ul>
    <li>add titles {@link module:module_interface.titlesscreate},</li>
    <li>defines the associated buttons {@link module:module_interface.buttonscreate} (from {@link module:g.viz_definition} <code>buttons_list</code>) and associated interactions {@link module:module_interface.buttoninteraction},</li>
    <li>defines the lateral menu buttons {@link module:module_interface.menucreate} and associated interactions {@link module:module_interface.menuinteractions}.</li>
</ul>
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:g.viz_keylist}</li>
 *  <li>{@link module:g.viz_definition}</li>
 *  <li>{@link module:g.viz_timeshare}</li>
 *  <li>{@link module:g.viz_timeline}</li>
 *  <li>{@link module:module_interface.menu_pausePlay}</li>
 *  <li>{@link module:module_interface.menu_autoPlay}</li>
 *  <li>{@link module:g.geometry_keylist}</li>
 *  <li>{@link module:zoomToGeom}</li>
 *  <li>{@link module:g.geometry_data}</li>
 *  <li>{@link module:module_intro.definition}</li>
 *  <li>{@link module:module_intro.step}</li>
 *  <li>{@link module:g.medical_datatype}</li>
 *  <li>{@link module:module_colorscale.display}</li>
 *  <li>{@link module:module_colorscale.interaction}</li>
 *  <li>{@link module:module_colorscale.lockcolor}</li>
 *  <li>{@link module:g.module_colorscale.modecurrent}</li>
 * </ul>
 * Intermediaries:
 * <ul>
 *  <li>{@link module:module_interface.titlesscreate}</li>
 *  <li>{@link module:module_interface.buttonscreate}</li>
 *  <li>{@link module:module_interface.buttoninteraction}</li>
 *  <li>{@link module:module_interface.menucreate}</li>
 *  <li>{@link module:module_interface.menuinteractions}</li>
 * </ul>
 * Returns:
 * <ul>
 *  <li>{@link module:g.module_interface.autoplayon}</li>
 *  <li>{@link module:g.module_interface.autoplaytime}</li>
 *  <li>{@link module:g.module_interface.autoplaytimer}</li>
 * </ul>
 * <br> Triggered by the end of {@link module:main_core~generateDashboard}.
 * @type {Function}
 * @method
 * @alias module:module_interface.display
 */
module_interface.display = function(){

    $('#main_title').html(g.module_lang.text[g.module_lang.current].main_title);
    $('#main_description').html(g.module_lang.text[g.module_lang.current].main_description);

    g.viz_keylist.forEach(function(key){
        titlesscreate(key);
        buttonscreate(key,g.viz_definition[key].buttons_list);
        buttoninteraction(key,g.viz_definition[key].buttons_list);
        if (g.viz_definition[key].hasOwnProperty("buttons_filt_range")) {
            buttons_quickfilt_create(key, g.viz_definition[key].buttons_filt_range);
            buttons_quickfilt_interaction(key, g.viz_definition[key].buttons_filt_range);

        }
    });

    menucreate();
    menuinteractions();

    /**
     * Adds titles and space to display current filters to the charts.
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:module_lang.text}</li>
     *  <li>{@link module:module_lang.current}</li>
     * </ul>
     * <br> Triggered in {@link module:module_interface.display}.
     * @type {Function}
     * @param {String} key Typically from {@link module:g.viz_keylist}
     * @method
     * @alias module:module_interface~titlesscreate
     */
    function titlesscreate(key){
        if (g.viz_definition[key].display_filter) {
            $('#chart_'+key+'_title').html('<b>' + g.module_lang.text[g.module_lang.current]['chart_'+key+'_title'] + '</b><br>' + g.module_lang.text[g.module_lang.current].filtext + ' ' );
        }else{            
            $('#chart_'+key+'_title').html('<b>' + g.module_lang.text[g.module_lang.current]['chart_'+key+'_title'] + '</b><br>');
        }
    }

    /**
     * Creates buttons, from the lists in {@link module:g.viz_definition} <code>buttons_list</code>.
     * <br> Triggered in {@link module:module_interface.display}.
     * @type {Function}
     * @param {String} key Typically from {@link module:g.viz_keylist}
     * @param {Array} buttons Typically from {@link module:g.viz_definition} <code>buttons_list</code>
     * @method
     * @alias module:module_interface~buttonscreate
     */
    function buttonscreate(key,buttons){
        var html = '';
        //console.log('key: ', key);
        //console.log('buttons: ', buttons);
        buttons.forEach(function(button){
            switch(button){
                case 'reset': 
                    var icon = '↻';
                    break;
                case 'help':
                    var icon = '?';  
                    break;
                case 'parameters':
                    var icon = '⚙';
                    break;
                case 'lockcolor':
                    var icon = '⬙';
                    break;
                case 'expand':
                    var icon = '◰';
                    break;
                case 'toimage': // to be implemented
                    var icon = 'I';
                    break;

            };
            html += '<button title="'+ toTitleCase(button) +'" class="btn btn-primary btn-sm button '+button+'" id="'+button+'-'+key+'">'+icon+'</button>';
        });
        $('#buttons-'+key).html(html);
    }


    /**
     * Defines the interactions that comes with the buttons created in {@link module:module_interface~buttonscreate}.
     <br> List of currenly implemented buttons:
     <ul>
        <li><code>reset</code> which resets the the filters applying on the current chart,</li>
        <li><code>help</code> which displays the quick help implemented with {@link module:module_intro} and {@link module:module_lang},</li>
        <li><code>parameters</code> which displays the map parameters implemented with {@link module:module_colorscale},</li>
        <li><code>expand</code> which doubles the height of the map container,</li>
        <li><code>lockcolor</code> which triggers the colorscale auto adjustment with {@link module:module_colorscale.lockcolor}.</li>
     </ul>
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:g.viz_timeline}</li>
     *  <li>{@link module:module_interface.menu_pausePlay}</li>
     *  <li>{@link module:zoomToGeom}</li>
     *  <li>{@link module:g.geometry_data}</li>
     *  <li>{@link module:g.geometry_keylist}</li>
     *  <li>{@link module:g.viz_definition}</li>
     *  <li>{@link module:module_intro.definition}</li>
     *  <li>{@link module:module_intro.step}</li>
     *  <li>{@link module:g.medical_datatype}</li>
     *  <li>{@link module:module_colorscale.display}</li>
     *  <li>{@link module:module_colorscale.interaction}</li>
     *  <li>{@link module:module_colorscale.lockcolor}</li>
     * </ul>
     * <br> Triggered in {@link module:module_interface.display}.
     * @type {Function}
     * @param {String} key1 Typically from {@link module:g.viz_keylist}
     * @param {Array} buttons Typically from {@link module:g.viz_definition} <code>buttons_list</code>
     * @method
     * @alias module:module_interface~buttoninteraction
     */
    function buttoninteraction(key1,buttons){
        buttons.forEach(function(button){
            switch(button){
                case 'reset': 
                    $('#'+button+'-'+key1).click(function(){
                        console.log("in reset button");
                        if(key1 ==  g.viz_timeline){module_interface.menu_pausePlay();}
                        if(key1 == 'multiadm'){
                            if ($('#select-'+g.geometry_keylist[0]).val() == 'NA') {
                                zoomToGeom(g.geometry_data[g.geometry_keylist[0]],g.viz_definition.multiadm.maps[g.geometry_keylist[0]]);
                            }else{
                                $('#select-'+g.geometry_keylist[0]).val('NA').change();
                            }
                            g.geometry_keylist.forEach(function(key2,key2num){
                                g.viz_definition[key1].charts[key2].filterAll();
                            });
                        }else{
                            g.viz_definition[key1].chart.filterAll();
                        }
                        dc.redrawAll(); 
                    });
                    break;
                case 'help':
                    $('#'+button+'-'+key1).click(function(){
                        //console.log("Clicked on ", button, key1, g.module_intro.step[key1]);
                        //g.module_intro.definition.goToStepNumber(g.module_intro.step[key1]).start(); 
                        g.module_intro.definition.goToStep(g.module_intro.step[key1]).start();  
                        //console.log("Finished ", button, key1, g.module_intro.step[key1]);
                    }); 
                    break;
                case 'parameters': // to be implemented
                    $('#'+button+'-'+key1).click(function(){
                        window.scrollTo(0, 0);
                        $('body').addClass('stop-scrolling')
                        
                        $('.modal-dialog').css('height','6%'); 
                        $('.modal-dialog').css('width','90%'); 
                        $('.modal-dialog').css('margin-top','1%'); 
                        $('.modal-dialog').css('margin-left','10%'); 

                        var html = '<div class="row">';

                                      
                        // Load Optional Module: module-colorscale.js
                        //------------------------------------------------------------------------------------
                        html += '<div class="col-md-12">';
                        html += module_colorscale.display();
                        html += '</div>';
                        html += '<div class="btn btn-primary btn-sm button" id="gobacktodashboard"><b>X</b></div>';

                        html += '</div>';
                        $('.modal-content').html(html);
                        module_colorscale.interaction();
                        $('#modal').modal('show');

                        $('#gobacktodashboard').click(function(){
                            $('body').removeClass('stop-scrolling')
                            $('#modal').modal('hide');
                        });
                    });
                    break;
                case 'expand': // to be implemented
                    $('#'+button+'-'+key1).click(function(){
                        g.geometry_keylist.forEach(function(key) {
                            if ($('#map-' + key).height() <= 500) {
                               setTimeout(function() {
                                    $('#map-' + key).css('height','845px');
                                    g.viz_definition.multiadm.maps[key].invalidateSize(true);
                                }, 500);
                               setTimeout(function() {
                                    zoomToGeom(g.geometry_data[key],g.viz_definition.multiadm.maps[key]);
                                }, 1000);
                            }else{
                               setTimeout(function() {
                                    $('#map-' + key).css('height','410px');
                                    g.viz_definition.multiadm.maps[key].invalidateSize(true);
                                }, 500);
                               setTimeout(function() {
                                    zoomToGeom(g.geometry_data[key],g.viz_definition.multiadm.maps[key]);
                                },1000); 
                            }; 
                        });
                    });
                    break;
                case 'lockcolor': // to be implemented
                    g.module_colorscale.lockcolor_id = '#'+button+'-'+key1;
                    $('#'+button+'-'+key1).addClass('buttonlocked'); 

                    $('#'+button+'-'+key1).click(function(){
                        module_colorscale.lockcolor('Manual');
                    });
                    $('#'+button+'-'+key1).dblclick(function(){
                        // Reacts on automation mode change
                        if(g.module_colorscale.modecurrent !== g.module_colorscale.modelist[0]){
                            g.module_colorscale.modecurrent = g.module_colorscale.modelist[0]; 
                            $('#'+button+'-'+key1).addClass('buttonlocked');
                            $(':focus').blur(); 
                        }else{
                            g.module_colorscale.modecurrent = g.module_colorscale.modelist[1];
                            $('#'+button+'-'+key1).removeClass('buttonlocked'); 
                        }
                    });
                    break;
            }
        });
    }

    function buttons_quickfilt_create(key, buttons) {
        //var html = '<b>Quick Filter buttons: </b>';
        var html = '';
        //console.log(key, buttons);
        var last_epiTime = g.module_epitime.epitime_all[g.module_epitime.epitime_all.length-1];

        buttons.forEach(function(btn){
            //console.log(btn);
            
            switch(btn.btn_type){
                /*case 'epiyear': 
                    var button_param = button_cat[1][0];
                    var button_text = button_cat[1][1];
                    break;*/
                case 'lastXepiyears': 
                    if (btn.btn_param ==0) {        //if require current month only
                        var endYr = last_epiTime.epiyear; 
                        var startYr = endYr;
                    } else {
                        var endYr = last_epiTime.epiyear-1;
                        var startYr = endYr - btn.btn_param + 1;
                    };                                        
                    var dateRange = module_epitime.filterDates(btn.btn_type,  startYr, endYr, '', '', '', '', ''); 
                    btn.btn_startDate = dateRange[0];
                    btn.btn_endDate = dateRange[1];
                    break;
                /*case 'epimonth':
                    var button_text = button_cat[1][1];
                    break;*/
                case 'lastXepimonths':
                    var endYr = last_epiTime.epiyear;     
                    if (btn.btn_param ==0) {        //if require current month only
                        var endMonth = last_epiTime.epimonth;
                        var startYr = endYr;
                        var startMonth = endMonth;
                    } else if (btn.btn_param <= endMonth) {     //if number of months required still within current year
                        var endMonth = last_epiTime.epimonth-1;     //HEIDI - what if had been January? or had been in final week of month???
                        var startYr = endYr;
                        var startMonth = endMonth - btn.btn_param;
                    } else {                    //if number of months required overlaps previous years
                        var endMonth = last_epiTime.epimonth-1;     //HEIDI - what if had been January?   or had been in final week of month???
                        //console.log("end date: ", endYr, endMonth);
                        if ((btn.btn_param % 12) > endMonth) {      //if number of months required overlaps additional year despite < 12 months
                            var startYr = endYr - Math.floor(btn.btn_param/12) - 1;
                            var startMonth = endMonth - (((btn.btn_param % 12)-1)-12);
                            //console.log("start date: ", startYr, startMonth);
                        } else {
                            var startYr = endYr - Math.floor(btn.btn_param/12);
                            var startMonth = endMonth - ((btn.btn_param % 12)-1);
                            //console.log("start date: ", startYr, startMonth);
                        };
                        //console.log("start date: ", startYr, startMonth);
                    };
                    var dateRange = module_epitime.filterDates(btn.btn_type,  startYr, endYr, startMonth, endMonth, '', '', '');  //HEIDI - do we need this here? can't we just assign to .epidate?
                    btn.btn_startDate = dateRange[0];
                    btn.btn_endDate = dateRange[1];
                    break;
                /*case 'epiweek': 
                    var button_text = button_cat[1][1];
                    break;*/
                case 'lastXepiweeks':
                    var endYr = last_epiTime.epiyear;
                    var endWeek = last_epiTime.epiweek;
                    if (btn.btn_param <= g.module_epitime.epitime_all.length) {
                        var start_epiTime = g.module_epitime.epitime_all[g.module_epitime.epitime_all.length-btn.btn_param];
                    } else {                        
                        var start_epiTime = g.module_epitime.epitime_all[0];            //if button goes back further than first date, set to first date
                        
                    }
                    var startWeek = start_epiTime.epiweek;
                    var startYr = start_epiTime.epiyear;  
                    var dateRange = module_epitime.filterDates(btn.btn_type,  startYr, endYr,'', '', startWeek, endWeek, '');  //HEIDI - do we need this here? can't we just assign to .epidate?
                    btn.btn_startDate = dateRange[0];
                    btn.btn_endDate = dateRange[1];
                    break;
            };
            //console.log(btn);
            //html = '<button title= quick filter" class="btn btn-primary btn-sm button '+button+'" id="'+button+'-'+key+'">'+icon+'</button>';
            //html = '<button title="Quick filter to 2015" id="btnFiltRange2015" class="button_qf" onclick="btn_filtRange(6, 2015);">2015</button>';
            //html += '<button title="Quick filter button" id="btn_qf-"' + button_cat + '_' + button_text[0] + ' class="button_qf">' + button_text[0] + '</button>';
            html += '<button title="Quick filter button" id="btn_qf-' + btn.btn_type + btn.btn_param + '" class="button_qf">' + btn.btn_text + '</button>';  //HEIDI - need line above not this one
        });
        $('#buttons_qf-'+key).html(html);
    };

    /*module_interface.display().buttons_quickfilt_off = function(key, button_cats) {
        button_cats.forEach(function(button_cat){
            button_cat.forEach(function(button){
                if ($('#btn_qf-'+button).hasClass('on')) {$('#btn_qf-'+button).removeClass('on')};
            });
        });
    };*/


    function buttons_quickfilt_interaction(key1, buttons) {
        //console.log(buttons);
        //var last_epidate = module_epitime.getLastEpiweek();
        var last_epiTime = g.module_epitime.epitime_all[g.module_epitime.epitime_all.length-1];
        //console.log("last epiTime: ", last_epiTime);
        buttons.forEach(function(btn){
            //console.log(btn);
            switch(btn.btn_type){   //"btn_qf-"' + btn.btn_type

                case 'lastXepiweeks': 
                     $('#btn_qf-'+ btn.btn_type + btn.btn_param).click(function(){
                        //console.log("clicked on: ", btn.btn_text, btn);
                        $('.button_qf').removeClass('on');
                        $('#btn_qf-' + btn.btn_type + btn.btn_param).addClass('on');

                        //var dateRange = module_epitime.filterDates(btn.btn_type,  startYr, endYr, startMonth, endMonth, '', '', '');  
                        //console.log("dateRange: ", dateRange[0], dateRange[1]);
                        var prevDateRange =  g.viz_definition[key1].chart.filter();
                        var btnDateRange = [btn.btn_startDate, btn.btn_endDate];
                        //console.log("prev dateRange: ", prevDateRange);
                        //console.log("new dateRange: ", dateRange[0], dateRange[1]);
                        
                        //HEIDI - if new dates different to previous dates!!!!  then dc.redrawAll();
                        //if (prevDateRange!=null) {
                        var noDateChange = false;   //assume new range selected
                        if (prevDateRange!=null) {  //if previously a range was selected, check whether it has now changed
                            noDateChange = ((prevDateRange[0]==btnDateRange[0]) && (prevDateRange[1]==btnDateRange[1]));
                        }
                        //console.log("noDateChange: ", noDateChange);
                        
                        //if ((prevDateRange==null) || (!(noDateChange))) {
                        if (!(noDateChange)) {      //if range selection has changed
                            //console.log("for chart = ", key1);
                            //console.log("now filtering to ", dateRange[0], dateRange[1]);
                            g.viz_definition[key1].chart.filterAll();
                            g.viz_definition[key1].chart.filter(dc.filters.RangedFilter(btnDateRange[0], btnDateRange[1])); 
                            dc.redrawAll();
                            //console.log("filtered to ", g.viz_definition[key1].chart.filter());
                        }
                        //}
                        
                    });
                    break;

                case 'lastXepimonths': 
                     $('#btn_qf-'+ btn.btn_type + btn.btn_param).click(function(){
                        //console.log("clicked on: ", btn.btn_text, btn);
                        $('.button_qf').removeClass('on');
                        $('#btn_qf-' + btn.btn_type + btn.btn_param).addClass('on');
                       
                        //var dateRange = module_epitime.filterDates(btn.btn_type,  startYr, endYr, startMonth, endMonth, '', '', '');  
                        //console.log("dateRange: ", dateRange[0], dateRange[1]);
                        var prevDateRange =  g.viz_definition[key1].chart.filter();
                        var btnDateRange = [btn.btn_startDate, btn.btn_endDate];
                        //console.log("prev dateRange: ", prevDateRange);
                        //console.log("new dateRange: ", dateRange[0], dateRange[1]);
                        
                        //HEIDI - if new dates different to previous dates!!!!  then dc.redrawAll();
                        var noDateChange = false;
                        if (prevDateRange!=null) {
                            noDateChange = ((prevDateRange[0]==btnDateRange[0]) && (prevDateRange[1]==btnDateRange[1]));
                        }
                        //console.log("noDateChange: ", noDateChange);
                        
                        if (!(noDateChange)) {
                            //console.log("now filtering");
                            g.viz_definition[key1].chart.filterAll();
                            g.viz_definition[key1].chart.filter(dc.filters.RangedFilter(btnDateRange[0], btnDateRange[1])); 
                            dc.redrawAll();
                        } 

                    });
                    break;

                case 'lastXepiyears':
                    $('#btn_qf-'+ btn.btn_type + btn.btn_param).click(function(){
                        //console.log("clicked on: ", btn.btn_text, btn);
                        $('.button_qf').removeClass('on');
                        $('#btn_qf-' + btn.btn_type + btn.btn_param).addClass('on');
            
                        /*if (btn.btn_param ==0) {        //if require current year only
                            var endYr = last_epiTime.epiyear; 
                            var startYr = endYr;
                        } else {
                            var endYr = last_epiTime.epiyear-1;
                            var startYr = endYr - btn.btn_param + 1;
                        }*/

                        //var dateRange = module_epitime.filterDates(btn.btn_type,  startYr, endYr, startMonth, endMonth, '', '', '');  
                        //console.log("dateRange: ", dateRange[0], dateRange[1]);
                        var prevDateRange =  g.viz_definition[key1].chart.filter();
                        var btnDateRange = [btn.btn_startDate, btn.btn_endDate];
                        //console.log("prev dateRange: ", prevDateRange);
                        //console.log("new dateRange: ", dateRange[0], dateRange[1]);
                        
                        //HEIDI - if new dates different to previous dates!!!!  then dc.redrawAll();
                        var noDateChange = false;
                        if (prevDateRange!=null) {
                            noDateChange = ((prevDateRange[0]==btnDateRange[0]) && (prevDateRange[1]==btnDateRange[1]));
                        }
                        //console.log("noDateChange: ", noDateChange);
                        
                        if (!(noDateChange)) {
                            //console.log("now filtering");
                            g.viz_definition[key1].chart.filterAll();
                            g.viz_definition[key1].chart.filter(dc.filters.RangedFilter(btnDateRange[0], btnDateRange[1])); 
                            dc.redrawAll();
                        }
                        
                    });
                    break; 
                default: console.log("clicked on default, button = ", btn);
            };            
        });

        for (i = 0; i < buttons.length-1; i++) {
            if (buttons[i].btn_default==true) {
                $('#btn_qf-'+ buttons[i].btn_type + buttons[i].btn_param).click();
                break;
            }
        };
    };


    /**
     * Defines the lateral menu layout.
     <br> Returns the html code as a string.
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:module_lang.text}</li>
     *  <li>{@link module:module_lang.current}</li>
     * </ul>
     * <br> Triggered in {@link module:module_interface.display}.
     * @type {Function}
     * @method
     * @alias module:module_interface~menucreate
     */
    function menucreate(){

        // Menu title
        var html = '<div id="menu_title" style="font-size:1.2em; text-align:center;"><b>'+g.module_lang.text[g.module_lang.current].interface_menutitle+'</b></div>';

        // Reset button
        html += '<a id="menu_reset" class="menu_button btn btn-primary btn-sm" href="javascript:module_interface.menu_reset();">'+g.module_lang.text[g.module_lang.current].interface_menureset+'</a>';
            
        // Reload button
        html += '<a id="menu_reload" class="menu_button btn btn-primary btn-sm" href="javascript:history.go(0)">'+g.module_lang.text[g.module_lang.current].interface_menureload+'</a>';

        // Help button
        html += '<button id="menu_help" class="menu_button btn btn-primary btn-sm">'+g.module_lang.text[g.module_lang.current].interface_menuhelp+'</button>';

        // Quick access to epiweeks button - only if no range_chart  //HEIDI - didn't we make fast access to this in g.?
        var range_chart_displayed = false;
        g.viz_keylist.forEach(function(key1) {
            if (g.viz_definition[key1].range_chart) {range_chart_displayed=true;}
        });
        if (!(range_chart_displayed)) {
            html += '<div id="menu_epiwk"><p>'+g.module_lang.text[g.module_lang.current].interface_menuepiwk+'</p>';
            html +='<button class="menu_button_epiwk btn btn-primary btn-sm" id="menu_epi4">4</button>';
            html +='<button class="menu_button_epiwk btn btn-primary btn-sm" id="menu_epi8">8</button>';
            html +='<button class="menu_button_epiwk btn btn-primary btn-sm" id="menu_epi12">12</button>';
            html +='<div>';
        }

        // Autoplay button
        html += '<button id="menu_autoplay" class="menu_button btn btn-primary btn-sm">'+g.module_lang.text[g.module_lang.current].interface_menuautoplay.play+'</button>'

        // Record count
        if(g.medical_datatype == 'outbreak'){
            html += '<div id="menu_count"><span id="count-info"><b><span class="filter-count headline"></span></b></span><br>'+g.module_lang.text[g.module_lang.current].interface_menucount[0]+'<br><b>'+g.medical_data.length+'</b><br>'+g.module_lang.text[g.module_lang.current].interface_menucount[1]+'</div>';
        }else{
            html += '<div id="menu_count">'+g.module_lang.text[g.module_lang.current].interface_menucount[2]+'<br><span id="case-info">'+g.module_lang.text[g.module_lang.current].interface_menucount[3]+' <b><span class="filter-count headline"></span></span></b><br><span id="death-info">'+g.module_lang.text[g.module_lang.current].interface_menucount[4]+' <b><span class="filter-count headline"></span></span></b><br></div>';
        }

        /*<span style="font-size:2em;">Chiffres clés :
                <span id="casetotal">Cas : <span class="filter-count headline"></span></span>
                <span id="deathtotal"> | Décès : <span class="filter-count headline"></span></span></span>*/

        $('#menu').html(html);
    }

    /**
     * Defines the interactions associated with the lateral menu buttons created in {@link module:module_interface~menucreate}: 'Play', 'Help' and 'N-epiwk Quick access'.
     * <br>
     * Requires:
     * <ul>
     *  <li>{@link module:module_interface.menu_pausePlay}</li>
     *  <li>{@link module:g.viz_definition}</li>
     *  <li>{@link module:g.viz_timeline}</li>
     *  <li>{@link module:g.viz_timeshare}</li>
     *  <li>{@link module:module_colorscale.lockcolor}</li>
     *  <li>{@link module:module_lang.text}</li>
     *  <li>{@link module:module_lang.current}</li>
     *  <li>{@link module:g.module_intro.definition}</li>
     *  <li>{@link module:g.module_colorscale.modecurrent}</li>
     * </ul>
     * Returns:
     * <ul>
     *  <li>{@link module:g.module_interface.autoplayon}</li>
     *  <li>{@link module:g.module_interface.autoplaytime}</li>
     *  <li>{@link module:g.module_interface.autoplaytimer}</li>
     * </ul>
     * <br> Triggered in {@link module:module_interface.display}.
     * @type {Function}
     * @method
     * @alias module:module_interface~menuinteractions
     */
    function menuinteractions(){

        /**
         * Stores the indicator of whether the dashboard is on play mode or not.
         * <br> Defined in {@link module:module_interface.menuinteractions}.
         * @type {Boolean}
         * @constant
         * @alias module:module_interface.autoplayon
         */
        g.module_interface.autoplayon = false;
        /**
         * Sets the time for the dashboard play mode.
         * <br> Defined in {@link module:module_interface.menuinteractions}.
         * @type {Integer}
         * @constant
         * @alias module:module_interface.autoplaytime
         */
        g.module_interface.autoplaytime = 0;
        /**
         * Sets the timer for the dashboard play mode.
         * <br> Defined in {@link module:module_interface.menuinteractions}.
         * @type {Integer}
         * @constant
         * @alias module:module_interface.autoplaytimer
         */
        g.module_interface.autoplaytimer = 0;

        $('#menu_autoplay').on('click',function(){

                if (g.module_interface.autoplayon) {
                    //console.log(" menu_pausePlay called here");
                    module_interface.menu_pausePlay();
                    dc.redrawAll();
                } else {
                    g.viz_definition[g.viz_timeline].chart.filterAll();
                    if(g.viz_timeshare){
                        g.viz_timeshare.forEach(function(key) {
                            g.viz_definition[key].chart.filterAll();  
                        });
                    } 

                    dc.redrawAll();
                    module_colorscale.lockcolor('Auto'); 
                    g.module_interface.autoplayon = true;
                    //console.log("button should say: ", g.module_lang.text[g.module_lang.current].interface_menuautoplay.pause);
                    $('#menu_autoplay').html(g.module_lang.text[g.module_lang.current].interface_menuautoplay.pause);
                    $('#chart-'+ g.viz_timeline).addClass("noclick");
                    if(g.viz_timeshare){
                        g.viz_timeshare.forEach(function(key) {
                            $('#chart-'+ key).addClass("noclick");
                        });
                    }
                    g.module_interface.autoplaytime = 0;
                    //console.log("g.module_interface.autoplaytimer (before)= ",  g.module_interface.autoplaytimer);

                    //var d = new Date();
                    //console.log("calling menu_autoRangePlay(): ", d.getSeconds());
                    if (g.viz_rangechart) {
                        console.log("THERE IS A RANGECHART");
                        module_interface.menu_autoRangePlay();
                    } else {
                        console.log("THERE IS NOOOO RANGECHART");
                        g.module_interface.autoplaytimer = setInterval(function(){module_interface.menu_autoPlay()}, 2000);     //HEIDI - ERROR here
                    }
                    
                    //console.log("g.module_interface.autoplaytimer (after)= ",  g.module_interface.autoplaytimer);
                };

            //console.log("************************* End click command *************************");
        });


        $('#menu_help').click(function(){
            g.module_intro.definition.start();
        });

        // Quick epiweeks access
        var quick_filter_list = [4,8,12];
        quick_filter_list.forEach(function(wknumber){
            $('#menu_epi'+wknumber).on('click',function(){
                var temp_mode = g.module_colorscale.modecurrent;
                g.module_colorscale.modecurrent = 'Manual';
                module_interface.menu_pausePlay();
                var temp_domain = g.viz_definition[g.viz_timeline].domain.slice(Math.max(g.viz_definition[g.viz_timeline].domain.length - wknumber - 1, 0));
                temp_domain.pop();
                temp_domain.forEach(function(wk){
                    g.viz_definition[g.viz_timeline].chart.filter(wk);
                    if(g.viz_timeshare){
                        g.viz_timeshare.forEach(function(key) {
                            g.viz_definition[key].chart.filter(wk);
                        });
                    }
                });
                g.module_colorscale.modecurrent = temp_mode;
                module_colorscale.lockcolor('Auto');
                dc.redrawAll();
            });
        });
    }
};

/**
 * Defines the reset all function.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:g.module_colorscale.modecurrent}</li>
 *  <li>{@link module:g.medical_currentdisease}</li>
 *  <li>{@link module:module_interface.menu_pausePlay}</li>
 *  <li>{@link module:g.geometry_keylist}</li>
 *  <li>{@link module:zoomToGeom}</li>
 *  <li>{@link module:g.geometry_data}</li>
 *  <li>{@link module:g.viz_definition}</li>
 *  <li>{@link module:g.medical_datatype}</li>
 *  <li>{@link module:g.module_colorscale.mapunitcurrent}</li>
 *  <li>{@link module:g.medical_pastdisease}</li>
 *  <li>{@link module:module_colorscale.lockcolor}</li>
 * </ul>
 * Returns:
 * <ul>
 *  <li>{@link module:g.medical_pastdisease} (? To be checked)</li>
 * </ul>
 * <br> Triggered in {@link module:module:module_interface~menucreate}.
 * @type {Function}
 * @method
 * @alias module:module_interface.menu_reset
 */
module_interface.menu_reset = function() {
    var temp_mode = g.module_colorscale.modecurrent;
    var temp_disease = g.medical_currentdisease;
    g.module_colorscale.modecurrent = 'Manual';
    module_interface.menu_pausePlay();
    if ($('#select-'+g.geometry_keylist[0]).val() == 'NA') {
        zoomToGeom(g.geometry_data[g.geometry_keylist[0]],g.viz_definition.multiadm.maps[g.geometry_keylist[0]]);
    }else{
        $('#select-'+g.geometry_keylist[0]).val('NA').change();
    }
    dc.filterAll();
    g.module_colorscale.modecurrent = temp_mode;
    if (g.medical_datatype == 'surveillance' && temp_disease && g.module_colorscale.mapunitcurrent !== 'Completeness') {
        g.viz_definition.disease.chart.filter(temp_disease);
    }else if(g.medical_datatype == 'surveillance' && temp_disease && g.module_colorscale.mapunitcurrent == 'Completeness'){
        g.medical_currentdisease = temp_disease;
        g.medical_pastdisease = temp_disease;
    }
    module_colorscale.lockcolor('Auto');
    dc.redrawAll();
}

// Autoplay
/**
 * Defines the dashboard auto play mode.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_interface.autoplaytime}</li>
 *  <li>{@link module:g.viz_definition}</li>
 *  <li>{@link module:g.viz_timeline}</li>
 *  <li>{@link module:g.viz_timeshare}</li>
 *  <li>{@link module:module_interface.menu_pausePlay}</li>
 * </ul>
 * <br> Triggered in {@link module:module_interface~menuinteractions}.
 * @type {Function}
 * @method
 * @alias module:module_interface.menu_autoPlay
 */
 //HEIDI - ORIGINAL FUNCTION BY BRUNO BELOW:
/*module_interface.menu_autoPlay = function(){
    //console.log("menu_autoPlay g.module_interface.autoplaytime = ", g.module_interface.autoplaytime);  //starts at 0
    //console.log("menu_autoPlay g.viz_definition[g.viz_timeline].domain.length - 1 = ", g.viz_definition[g.viz_timeline].domain.length - 1);

    if(g.module_interface.autoplaytime == g.viz_definition[g.viz_timeline].domain.length - 1){
        //console.log("in if 1");
        g.module_interface.autoplaytime += 1;
        module_interface.menu_pausePlay();
        dc.redrawAll();
    }    

    if(g.module_interface.autoplaytime < g.viz_definition[g.viz_timeline].domain.length - 1 && g.module_interface.autoplaytime>0){
        //console.log("in if 2a");
        g.viz_definition[g.viz_timeline].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime-1]]);
        g.viz_definition[g.viz_timeline].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime]]);

        if(g.viz_timeshare){
            //console.log("in if 2b");
            g.viz_timeshare.forEach(function(key) {
                g.viz_definition[key].chart.filter([g.viz_definition[key].domain[g.module_interface.autoplaytime-1]]);
                g.viz_definition[key].chart.filter([g.viz_definition[key].domain[g.module_interface.autoplaytime]]);
            });
        }
        dc.redrawAll();
        g.module_interface.autoplaytime += 1;
    }

    if(g.module_interface.autoplaytime == 0){
        //console.log("in if 3a");
        g.viz_definition[g.viz_timeline].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime]]);

        if(g.viz_timeshare){
            //console.log("in if 3b");
            g.viz_timeshare.forEach(function(key) {
                g.viz_definition[key].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime]]);
            });
        }
        dc.redrawAll();                                
        g.module_interface.autoplaytime += 1;
    }    
} */

module_interface.menu_autoPlay = function(){

    //if autoplay is on final value of x-axis
    if(g.module_interface.autoplaytime == g.viz_definition[g.viz_timeline].domain.length - 1){  
        g.module_interface.autoplaytime += 1;
        module_interface.menu_pausePlay();
        dc.redrawAll();
    }    

    //if autoplay is on but not on final value of x-axis
    if(g.module_interface.autoplaytime < g.viz_definition[g.viz_timeline].domain.length - 1 && g.module_interface.autoplaytime>0){
        g.viz_definition[g.viz_timeline].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime-1]]);
        g.viz_definition[g.viz_timeline].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime]]);
        if(g.viz_timeshare){
            g.viz_timeshare.forEach(function(key) {
                g.viz_definition[key].chart.filter([g.viz_definition[key].domain[g.module_interface.autoplaytime-1]]);
                g.viz_definition[key].chart.filter([g.viz_definition[key].domain[g.module_interface.autoplaytime]]);
            });
        }
        dc.redrawAll();
        g.module_interface.autoplaytime += 1;
    }

    //if autoplay is on first round
    if(g.module_interface.autoplaytime == 0){   
        g.viz_definition[g.viz_timeline].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime]]);
        if(g.viz_timeshare){
            g.viz_timeshare.forEach(function(key) {
                g.viz_definition[key].chart.filter([g.viz_definition[g.viz_timeline].domain[g.module_interface.autoplaytime]]);
            });
        }
        dc.redrawAll();
        g.module_interface.autoplaytime += 1;
    }    
} 




function rangePlayUpdate() {  //uses setTimeout() instead of setInterval() 
 
    var allEpiweeks = g.module_epitime.all_epiweeks;
    //d = new Date();
    currentEpiweekPos++;
    g.module_interface.autoplaytimer = currentEpiweekPos;

    //$('#filters_qf-'+g.viz_rangechart).html("Currently playing epiweek: " + g.module_epitime.all_epiweeks[currentEpiweekPos]); 

    if (currentEpiweekPos > allEpiweeks.length-1) {    //if we reach the final year
        //console.log("in final year, current play = ", currentEpiweekPos, " > ", allEpiweeks.length-1);
        if (autoRewind) {               //if we loop (autoRewind) then go back to beginning
            currentEpiweekPos = 0;
        }
        else {                          //if we don't loop (autoRewind) then stop and clear 
            clearTimeout(g.module_interface.autoplaytimer);
            g.module_interface.autoplaytimer = undefined;
            currentEpiweekPos = -1;
            //console.log("IN menu_autoRangePlay, current play = ", currentEpiweekPos, " = ", g.module_interface.autoplaytimer);
            module_interface.menu_pausePlay();
            dc.redrawAll();
            $('#menu_autoplay').html(g.module_lang.text[g.module_lang.current].interface_menuautoplay.play);

            return;
        }
    }    

    var startWeek = parseInt(allEpiweeks[currentEpiweekPos].substr(5,2));
    var startYr = parseInt(allEpiweeks[currentEpiweekPos].substr(0,4));
    var dateRange = module_epitime.filterDates("lastXepiweeks",  startYr, startYr,'', '', startWeek, startWeek, '');  //HEIDI - do we need this here? can't we just assign to .epidate?
    //console.log("IN menu_autoRangePlay, now filtering to ", dateRange[0], dateRange[1]);

    if(currentEpiweekPos == allEpiweeks.length) {   //if autoplay has completed
        //console.log("autoPlay completed run through here");
        module_interface.menu_pausePlay();
        dc.redrawAll(); //should this be before incrementing autoplaytime?
    }  else if (currentEpiweekPos < allEpiweeks.length && currentEpiweekPos>=0){  //if autoplay is on but not on final value of x-axis
        $('#filters_qf-'+g.viz_rangechart).html("Currently playing epiweek: " + g.module_epitime.all_epiweeks[currentEpiweekPos]); 
        g.viz_timeshare.forEach(function(key) {
            g.viz_definition[key].chart.filterAll();
            g.viz_definition[key].chart.filter(dc.filters.RangedFilter(dateRange[0], dateRange[1])); 
        })
        dc.redrawAll();
    }

    /*if(currentEpiweekPos == 0){   //if autoplay is on first round
        g.viz_timeshare.forEach(function(key) {
            g.viz_definition[key].chart.filterAll();
            g.viz_definition[key].chart.filter(dc.filters.RangedFilter(dateRange[0], dateRange[1])); 
        });
        dc.redrawAll();                
    } */                        

   g.module_interface.autoplaytimer = setTimeout(rangePlayUpdate, delay);
}

var delay = (g.dev_defined.autoplay_delay)? g.dev_defined.autoplay_delay : 2000;
var autoRewind = (g.dev_defined.autoplay_rewind)? g.dev_defined.autoplay_rewind : false;
var currentEpiweekPos = -1;
module_interface.menu_autoRangePlay = function(){

    g.viz_timeshare.forEach(function(key) {
        g.viz_definition[key].chart.on('renderlet.autoplay', function(chart) {      //draw vertical line for autoplay with rangeChart
  
        if ((g.module_interface.autoplayon==true) && (currentEpiweekPos >= 0)) {
            if ((currentEpiweekPos >= 0) && (currentEpiweekPos < g.module_epitime.epitime_all.length)) {
                temp_pos = currentEpiweekPos;
            } else {
                temp_pos = g.module_epitime.epitime_all.length-1
            };
            var x_vertical = new Date(g.module_epitime.epitime_all[temp_pos].epiDate);
            var extra_data = [{x: chart.x()(x_vertical), y: chart.y()(0)}, {x: chart.x()(x_vertical), y: chart.y().range()[1]}];

            var line = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate('linear');
            var chartBody = chart.select('g.chart-body');
            var path = chartBody.selectAll('path.extra').data([extra_data]);
            path.enter().append('path').attr({
                class: 'extra',
                stroke: '#161e2c',  //dark grey
                id: key+'-extra-line'
            });
            path.attr('d', line);

        } else {
        //if (g.viz_rangechart) {
            g.viz_timeshare.forEach(function(key) {
                $('#'+key+'-extra-line').remove();
            });
        //}
        }

        });
    })

    rangePlayUpdate();
};


/**
 * Defines the function to quit the dashboard auto play mode.
 * <br>
 * Requires:
 * <ul>
 *  <li>{@link module:module_interface.autoplayon}</li>
 *  <li>{@link module:module_interface.autoplaytimer}</li>
 *  <li>{@link module:module_lang.text}</li>
 *  <li>{@link module:module_lang.current}</li>
 *  <li>{@link module:g.viz_timeline}</li>
 *  <li>{@link module:g.viz_timeshare}</li>
 *  <li>{@link module:g.viz_definition}</li>
 * </ul>
 * <br> Triggered in various functions of {@link module:module_interface}.
 * @type {Function}
 * @method
 * @alias module:module_interface.menu_pausePlay
 * @todo Rename 'Stop'?
 */
module_interface.menu_pausePlay = function(){
    //console.log("now in menu_pausePlay");
    g.module_interface.autoplayon = false;
    $('#menu_autoplay').html(g.module_lang.text[g.module_lang.current].interface_menuautoplay.play);

    $('#chart-'+ g.viz_timeline).removeClass("noclick");
    g.viz_definition[g.viz_timeline].chart.filterAll();

    if(g.viz_timeshare){
        g.viz_timeshare.forEach(function(key) {
            $('#chart-'+ key).removeClass("noclick");    
            g.viz_definition[key].chart.filterAll();
            //console.log("filtered all for ", key);  
        });
    } 

    //clearInterval(g.module_interface.autoplaytimer);
    clearTimeout(g.module_interface.autoplaytimer);

    if (g.viz_rangechart) {
        g.viz_timeshare.forEach(function(key) {
            $('#'+key+'-extra-line').remove();
            //console.log("REMOVING " + '#'+key+'-extra-line NOW');
        });
    }
}
