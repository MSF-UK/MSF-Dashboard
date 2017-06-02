var current_date = new Date();
var current_yearMin = current_date.getFullYear();
var current_yearMax = current_date.getFullYear();

var current_row;
var current_col;
var current_epiwk;
var current_id;

var clickcount = 0;

function updatingCell(target,status) {
	 //console.log("in updatingCell ", target+'-'+current_epiwk, "   status = ", status);
	 //console.log("    classList = ", document.getElementById(target+'-'+current_epiwk).classList);
	 switch(status) {
	    case "X":   	//table cell already contains data
	    	document.getElementById(target+'-'+current_epiwk).classList.remove("clicked");
    		document.getElementById(target+'-'+current_epiwk).classList.remove("updating");
    		document.getElementById(target+'-'+current_epiwk).innerHTML = "X";
			document.getElementById(target+'-'+current_epiwk).classList.add("validated");
			document.getElementById(target+'-'+current_epiwk).classList.remove("replacing");  
	        break;
	    case ".":   	//table cell empty
		    document.getElementById(target+'-'+current_epiwk).classList.remove("clicked");
	    	document.getElementById(target+'-'+current_epiwk).classList.remove("updating");
    		document.getElementById(target+'-'+current_epiwk).innerHTML = ".";
	        break;
	    case "...":   	//table cell updating
	    	document.getElementById(target+'-'+current_epiwk).classList.remove("clicked");
		    document.getElementById(target+'-'+current_epiwk).classList.remove("validated");
			document.getElementById(target+'-'+current_epiwk).classList.add("updating");
	        break;
	    case "X-X":    	//table cell being replaced (i.e. delete original data)
	    	document.getElementById(target+'-'+current_epiwk).classList.remove("clicked");
	    	document.getElementById(target+'-'+current_epiwk).classList.remove("validated");
    		document.getElementById(target+'-'+current_epiwk).classList.remove("updating");     
			document.getElementById(target+'-'+current_epiwk).classList.add("replacing");
	        break;
	}
}

function updateInteractiveTableContent(database,target){
	database.recordsum.forEach(function(e){
		console.log("current table content: ", target+e.epiweek);
        document.getElementById(target+'-'+e.epiweek).innerHTML = "X";
        document.getElementById(target+'-'+e.epiweek).classList.add("validated");

    });
}

function initialiseyearsInteractiveTable(database) {
	if (database.recordsum.length > 0) {
		current_yearMin = database.recordsum[0].epiweek.split('-')[0];
	    current_yearMax = database.recordsum[0].epiweek.split('-')[0];;

	    database.recordsum.forEach(function(e){
	        current_yearMax = Math.max(e.epiweek.split('-')[0],current_yearMax);
	        current_yearMin = Math.min(e.epiweek.split('-')[0],current_yearMin);

	    });
	}else{
		var current_date = new Date();
		current_yearMin = current_date.getFullYear();
		current_yearMax = current_date.getFullYear();
	}
}

function showInteractiveTable(database,target){
	//console.log('current_yearMin: ' + current_yearMin);
	//console.log('current_yearMax: ' + current_yearMax);
	createInteractiveTable(current_yearMin,current_yearMax,target);
    createInteractionTable(target);
}

function addRow(dif) {
	//console.log(dif);
	switch(dif) {
	    case "min":
	    	current_yearMin--;
	        break;
	    case "max":
	    	current_yearMax++;
	        break;
	}
	//console.log(dif);
	showInteractiveTable(current_database,"table");
	updateInteractiveTableContent(current_database,"table");
}

function createInteractiveTable(rowMin,rowMax,target){

	//** CELL CREATION
	var html;
	var colMin =1;
	var colMax =53;


	// Initialisation
	html = '<div class="col-md-12">';
	html += '<p><table style="width:100%; font-size:1em;">';

	// Headers
	html += '<tr><th><input type="button" style="width: 100%; font-size:0.8em;" value="+" onclick="addRow(&quot;min&quot;);"/></th>';
	for (var c = colMin; c <= colMax; c++) {
		if (c < 10) {
            tempc = '0' + c;
        }else{
            tempc = c.toString();
        };
		html += '<th class="colh">'+ tempc+'</th>';
	};
	html += '</tr>';

	// Table
	for (var r = rowMin; r <= rowMax; r++) {
		html += '<tr><td class="rowh">'+r +'</td>';
		for (var c = colMin; c <= colMax; c++) {
			if (c < 10) {
	            tempc = '0' + c;
	        }else{
	            tempc = c.toString();
	        };
			var address = '"'+target+'-' + r+'-'+tempc +'"';
			var address_bis = target+'-' + r+'-'+tempc;
			html += '<td class="menu" id='+ address +'>.</td>'; //<i style="background: #90C3D4" id="'+r+':'+c'">Row:'+r +' Col:'+ c+'</i>
		};
		html += '</tr>';
	};

	// End
	html += '<tr><td><input type="button" style="width: 100%; font-size:0.8em;" value="+" onclick="addRow(&quot;max&quot;);"/></td></tr></table><div>';

	document.getElementById(target).innerHTML = html;
}

function createInteractionTable(target){
	//** CELL INTERACTION
	var definition = {
        selector: ".menu", 
        events: {
        	show: function(opt){			//show menu options when user clicks on individual table cell
        		var idtemp = opt.$trigger.context.id;     //table cell id, e.g. table-2016-48
        		console.log("show ", idtemp);
	            if(document.getElementById(idtemp).innerHTML == "X"){
					document.getElementById(idtemp).classList.remove("validated");
				}	
	            document.getElementById(idtemp).classList.add("clicked");
	            //console.log("    classList = ", document.getElementById(idtemp).classList); 
        	},
        	hide: function(opt){			//hide menu options when user clicks away from individual table cell
        		var idtemp = opt.$trigger.context.id;		//table cell id, e.g. table-2016-48
        		console.log("hide ", idtemp);
	            document.getElementById(idtemp).classList.remove("clicked");
	            /*if(document.getElementById(idtemp).innerHTML == "X"){
					document.getElementById(idtemp).classList.add("validated");
				}*/
				if((document.getElementById(idtemp).innerHTML == "X") && !(document.getElementById(idtemp).classList.contains("replacing"))){
					document.getElementById(idtemp).classList.add("validated");
				}
				//console.log("    classList = ", document.getElementById(idtemp).classList); 
        	}
        },
        trigger: 'left',
        callback: function(key, opt) {
      		//console.log(" callback key = ", key);
            var m = "clicked: " + key;
            var idtemp = opt.$trigger.context.id;
            current_id = idtemp;

            var status = document.getElementById(idtemp).innerHTML;
            current_row = idtemp.split('-')[1];
            current_col = idtemp.split('-')[2];
            current_epiwk = yrwkToEpiwk(parseInt(current_row),parseInt(current_col));
            //console.log(status);
            //console.log(current_epiwk);

            //document.getElementById(target+'-'+current_epiwk).classList.add("clicked");

            switch(key) {
			    case "add":
			    	if (status == ".") {  	
			    		updatingCell("table","...");
			    		document.getElementById('ds_add').click();
			    	};
			        break;
			    case "update":
			    	if (status == "X") {
			    		updatingCell("table","X-X");
			    		document.getElementById('ds_add').click();		  		
			    	};
			        break;
			    case "delete":
			    	if (status == "X") {
			    		updatingCell("table","...");
			    		deleteDataset(current_epiwk);
			    	};
			        break;
			    /*case "replace":
			    	if (status == "X") {
			    		console.log('not implemented yet');
			    	};
			        break;*/
			    default:
			    	//document.getElementById(target+'-'+current_epiwk).classList.remove("clicked");
			    	break;
			}

        },
        items: {
            "add": {name: "Add DHIS2 data", icon: "add"},
            "update": {name: "Update DHIS2 data", icon: "edit"},
            "delete": {name: "Delete DHIS2 data", icon: "delete"},
            //sep1: "---------",
            //"replace": {name: "Add external pop. data", icon: "paste"}
            /*<input type="radio">
            radio1: {
                name: "Validated", 
                type: 'radio', 
                radio: 'radio', 
                value: '1'
            },
            radio2: {
                name: "Not Validated", 
                type: 'radio', 
                radio: 'radio', 
                value: '2', 
                selected: true
            }*/
        }
    };

	$(function(){
	    $.contextMenu(definition);
	});
}
