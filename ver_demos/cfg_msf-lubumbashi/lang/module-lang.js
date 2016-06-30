/*------------------------------------------------------------------------------------
    MSF Dashboard - module-lang.js
    (c) 2015-2016, MSF-Dashboard contributors for MSF
    List of contributors: https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors
    Please refer to the LICENSE.md and LICENSES-DEP.md for complete licenses.
------------------------------------------------------------------------------------*/
 /**
 * This file implements the lang module. It stores all the texts that are visible to the end user in all the available languages (by default French, English and Castilian). 
 <br>
 This requires developer adaptation for each new dashboard.
 * @since 1.0
 * @module module:module_lang
 * @requires index.html
 **/
var module_lang = {}
/*------------------------------------------------------------------------------------
	Components:
	0) Setup
	1) French
	2) English
	3) Spanish - to be implemented
------------------------------------------------------------------------------------*/

// 0) Setup
//------------------------------------------------------------------------------------

modules_list.lang = true;

/**
 * Stores all the global variables used by the {@link module:module_lang}. To simplify, variables in the 'sub-module' domain will only appear there.
 * @type {Object} 
 * @alias module:g.module_lang
 */
g.module_lang = {};

/**
 * Stores the current language selected for the dashboard, <code>fra</code> by default.
 	 <br>
 * {@link module:g.module-lang~module_lang_display} enables the dashboard user to switch between availanle languages stored in {@link module:module-lang.list}.
 * @type {String} 
 * @alias module:module_lang.current
 */
g.module_lang.current = 'fra';

/**
 * Stores the list of available languages in the dashboard: both key and complete name.
 * @type {Object} 
 * @alias module:module_lang.list
 */
g.module_lang.list = {
	'fra':'French',
	'eng':'English',
	//'cas':'Castilian'
	};

/**
 * Stores the list of keys related to the available languages taken from {@link module:module-lang.list}.
 * @type {Object} 
 * @alias module:module_lang.keylist
 */
g.module_lang.keylist = Object.keys(g.module_lang.list);

/**
 * Stores all the texts that are visible to the end user in all the available languages. Texts corresponding to a each specific language are stored in specific objects which access key is the same as in {@link module:module-lang.list}.
 * @type {Object.<Object>} 
 * @alias module:module_lang.text
 */
g.module_lang.text = {};

/**
 * Generates the language switch buttons in all available languages using:
 <br>
 <ul>
 	<li>{@link module:module_lang.list} for the texts,</li>
 	<li>{@link module:module_lang.current} to treat differently the currently selected language,</li>
 	<li>{@link module:module_lang.keylist} to loop over the language list.</li>
 </ul>
 <br>
 Triggered by {@link module:main_loadfiles~generate_display} and triggers {@link module:main_loadfiles~generate_display} if current language is changed by the user.
 * @type {Function} 
 * @alias module:module_lang.display
 */
module_lang.display = function() {
	
	var html = '<span>'+ g.module_lang.list[g.module_lang.current]+'</a> ';

	g.module_lang.keylist.forEach(function(lang){
		if(!(lang == g.module_lang.current)){
			html += '| <a id="lang_'+lang+'" class="link">'+g.module_lang.list[lang]+'</a> ';
		}
	});
	$('#langselect').html(html);

	g.module_lang.keylist.forEach(function(lang){
		if(!(lang == g.module_lang.current)){
			$('#lang_'+lang).on('click',function(){
			 	g.module_lang.current = lang;
				generate_display();
			});
		}
	});
}

//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
// Outbreak
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------


// 1) French
//------------------------------------------------------------------------------------
g.module_lang.text.fra = {
	main_title: 'MSF Dashboard v1.0.0 | Outbreak Lubumbashi',
	main_description: 'VERSION DE DEMONSTRATION. Cette version du Dashboard MSF prend en entrée des données de surveillance. Si vous rencontrez des problèmes lors de l\'utilisation de cet outil, que vous souhaitez poser des questions ou faire des retours, n\'hésitez pas à contacter : Manson Unit, MSF UK via <a href="mailto:gis.mansonunit@london.msf.org">gis.mansonunit@london.msf.org</a>.',

	loadfiles_choose: 'CHOISISSEZ UN FICHIER A CHARGER',
	loadfiles_selected: ['Le fichier actuellement sélectionné contient','enregistrements.'],
	loadfiles_load: 'Charger le Dashboard',

	chart_epiwk_title: 'Semaine Epidémiologique',
	chart_epiwk_labelx: 'Semaine Epi',
	chart_epiwk_labely: 'Cas',
	chart_sexpreg_title: 'Sexe - Grossesses',
	chart_sexpreg_label12: 'Homme',
	chart_sexpreg_label22: 'Femme, non Enc.',
	chart_sexpreg_label21: 'Femme, Enc.',
	chart_sev_title: 'Déshydratation',
	chart_sev_labelA: 'Faible',
	chart_sev_labelB: 'Modérée',
	chart_sev_labelC: 'Sévère',
	chart_dur_title: 'Durée du séjour',
	chart_dur_labelx: 'Durée du séjour',
	chart_dur_labely: 'Cas',
	chart_age_title: 'Age',
	chart_age_labelx: 'Age',
	chart_age_labely: 'Cas',
	chart_out_title: 'Issue',
	chart_out_labelx: 'Issue',
	chart_out_labely: 'Cas',
	chart_out_label1: 'Soigné',
	chart_out_label2: 'Décès',
	chart_out_label3: 'Suivi Int.',
	chart_out_label4: 'Transféré',

	chart_disease_title: 'Pathologies',
	chart_disease_labelx: 'Nombre de Signalements',
	chart_disease_labely: 'Pathologies',
	chart_case_title: 'Cas & Décès',
	chart_case_labelx: 'Semaine Epi',
	chart_case_labely: 'Cas',
	chart_death_labelx: 'Semaine Epi',
	chart_death_labely: 'Décès',
	chart_fyo_title: 'Classes d\'Ages',
	chart_fyo_labelu: 'Under 5',
	chart_fyo_labelo: 'Over 5',

	filtext: 'Filtre actuel :',
	
	map_title: 'Carte',
	map_legendNA: '0',
	map_legendEmpty: 'Absence de données',
	map_hover: 'Survolez pour afficher',
	map_unit: {
		Cases: 'Nombre de cas',
		IncidenceProp: 'Taux d\'incidence (/10 000 personnes)',
		Deaths: 'Number de décès',
		MortalityProp: 'Taux de mortalité (/10 000 personnes)',
		Completeness: 'Fréquence de transmission des données, en %'
	},
	jumpto: 'Aller...',
	map_admN1: {
		title: 'Commune'
	},
	map_admN2: {
		title: 'Quartier'
	},
	map_admN3: {
		title: 'Cellule'
	},
	
	colorscale_title: 'PARAMETRES DE LA CARTE',
	colorscale_unitintro: 'Unité de la carte : ',
	colorscale_modeintro: 'Choix des seuils : ',
	colorscale_modeauto: 'Automatique',
	colorscale_modepresets: 'Prédéfinis',
	colorscale_modemanual: 'Manuel',
	colorscale_howto: '',
	colorscale_choosetype: 'Mode de calcul : ',
	colorscale_choosecolor: 'Type d\'échelle : ',

	datacheck_title: 'RAPIDE VERIFICATION DES DONNEES',
	datacheck_intro: 'Veuillez trouver ci-dessous un bref <b>résumé des données manquantes ou erronées</b>.<br>Ceci peut donner une indication sur la nécéssité de reviser la qualité du jeu de données. Consultez le log des erreurs pour plus de détails.',
	datacheck_header: 'Entête',
	datacheck_error: 'Erreur',
	datacheck_empty: 'Vide',

	datacheck_more: 'Montrer le log des erreurs...',
	datacheck_less: 'Cacher le log des erreurs...',

	datacheck_emptmore: 'Montrer enrg. vides',
	datacheck_emptless: 'Cacher enrg. vides',

	datacheck_copy: 'Copier vers presse-papier',

	datatable_more: 'Montrer la table de données...',
	datatable_less: 'Cacher la table données...',
	datatable_text: {
        button: 'Copier vers presse-papier',
        language: {
            "sProcessing":     "Traitement en cours...",
            "sSearch":         "Rechercher&nbsp;:",
            "sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
            "sInfo":           "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
            "sInfoEmpty":      "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
            "sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
            "sInfoPostFix":    "",
            "sLoadingRecords": "Chargement en cours...",
            "sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
            "sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau",
            "oPaginate": {
                "sFirst":      "Premier",
                "sPrevious":   "Pr&eacute;c&eacute;dent",
                "sNext":       "Suivant",
                "sLast":       "Dernier"
            },
            "oAria": {
                "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
                "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
            }
        },
    },
	datatable_legend: 'Sexe : 1 = Homme, 2 = Femme | Grossesse : 1 = Enceinte, 2 = Non Enceinte | Déshydratation : A = Légère, B = Modérée, C = Sévère | Issue : 1 = Soigné, 2 = Décès, 3 = Suivi Interrompu, 4 = Transferé',

	interface_menutitle: 'MENU',
	interface_menuepiwk: 'Filtrer rapidement les \'n\' dernières semaines',
	interface_menureset: 'Réinitialiser',
	interface_menureload: 'Recharger',
	interface_menuhelp: 'Aide',
	interface_menuautoplay: {
    		play: 'Jouer',
    		pause: 'Pause'
	},
	interface_menucount: ['enregistrements sélectionés sur','','Chiffres clés :', 'Cas :','Décès :'],
	interface_colorscale: 'Retourner au Dashboard',

	intro_intro: '<p>Il est possible d\'interagir avec les différents \'éléments\' du tableau de bord en les sélectionnant et désélectionnant.</p><p>Ici sont présentés les principales interactions avec le tableau de bord :</p><p><b>1) Filtrer par <i>\'élément\'</i>.</b><br>Chaque interaction affecte l\'ensemble des graphiques, cartes et le tableau.</p><p><b>2) Sélection d\'\'éléments\' multiples.</b><br>Cela vous permet de combiner les filtres, par exemple : un quartier sur la carte et un genre.</p><p><b>3) Désélectionner des \'éléments\', retirer des filtres.</b><br>Les \'éléments\' peuvent être désélectionnés un par un (réinitialisant les filtres associés) ou en cliquant sur le bouton "R", c\'est l\'ensemble des filtres affectant un graphique ou les cartes qui seront réinitialisés. Il est également possible de réinitialiser l\'ensemble des filtres affectant le tableau de bord en cliquant le bouton "Réinitialiser" du menu à gauche.</p><p><b>4) Survoler des \'éléments\' pour afficher les valeurs associées.</b></p><p>Survolez des \'éléments\' avec la souris pour afficher les valeurs associées.</p><p>Cliquez sur "Next" ou appuyez sur la flèche droite de votre clavier pour parcourir les différents graphiques, cartes et le tableau.</p>',

	intro_multiadm: 'Cette carte de type choroplèthe présente le nombre de cas ou le taux d\'incidence (selon l\'option sélectionnée au moment du chargement des données) par unité administrative (Commune - Adm7, Quartier - Adm8 ou Cellule - Adm9).<br><i>Cliquez sur la carte pour filtrer les données par division administrative. Il est possible de sélectionner plusieurs zones. Pour réinitialiser les filtres, cliquez sur les divisions administratives une par une ou cliquez sur le bouton "R".<br>Cliquez sur les onglets pour naviguer entre les différents niveaux administratifs. Si vous passez à un niveau administratif supérieur (par exemple de Cellules à Communes), les filtres appliqués aux niveaux administratifs inférieurs seront réinitialisés (dans notre cas de figure, les filtres appliqués aux Cellules et Communes seront tous deux réinitialisés).<br>Vous pouvez zoomer directement sur une unité administrative spécifique en utilisant les listes de sélection "Goto...". Les unités administratives doivent impérativement être sélectionnées du niveau administratif le plus élevé au niveau administratif le plus bas (Commune > Quartier > Cellule).<br>Vous pouvez également parcourir la carte en utilisant les boutons de zoom ainsi que la souris.</i>',

	intro_epiwk: 'Cet histogramme présente le nombre de cas par semaine épidémiologique (epi-week).<br><i>Cliquez sur les barres pour filtrer les données d\'une période spécifique. Vous pouvez sélectionner plusieurs epi-weeks. Pour réinitialiser les filtres, cliquez sur les epi-weeks une par une ou cliquez sur le bouton "R".</i>',

	intro_age: 'Cet histogramme présente le nombre de cas par âge.<br><i>Cliquez et glissez pour filtrer les données d\'une classe d’âge spécifique. Pour réinitialiser le filtre, cliquez hors de la classe d’âge sélectionnée ou cliquez sur le bouton "R".</i>',

	intro_sexpreg: 'Ce camembert présente le nombre de cas par sexe et pour les femmes, si elles sont enceintes ou non.<br><i>Cliquez sur les parts du camembert pour filtrer par sexe / grossesse pour les femmes. Vous pouvez filtrer plusieurs valeurs. Pour réinitialiser les filtres, cliquez à nouveau sur les parts du camembert ou cliquez sur le bouton "R".</i>',

	intro_sev: 'Ce camembert présente le nombre de cas par état de déshydratation.<br><i>Cliquez sur les parts du camembert pour filtrer par état de déshydratation. Vous pouvez filtrer plusieurs états de déshydratation. Pour réinitialiser les filtres, cliquez à nouveau sur les parts du camembert ou cliquez sur le bouton "R".</i>',

	intro_dur: 'Cet histogramme présente le nombre de cas par durée de séjour.<br><i>Cliquez sur les barres pour filtrer les données d\'une durée spécifique. Vous pouvez sélectionner plusieurs durées. Pour réinitialiser les filtres, cliquez sur les catégories une par une ou cliquez sur le bouton "R".</i>',

	intro_out: 'Cet histogramme présente le nombre de cas par issue du traitement.<br><i>Cliquez sur les barres pour filtrer les données d\'une catégorie d\'issue spécifique. Vous pouvez sélectionner plusieurs catégories. Pour réinitialiser les filtres, cliquez sur les catégories une par une ou cliquez sur le bouton "R".</i>',

	intro_table: 'Ce tableau présente les entrées sélectionnées.<br><i>Cliquez sur le bouton "Copier vers le presse-papier" pour copier tout le contenu du tableau (afin d\'en exporter le contenu vers Excel par exemple).</i>',

};

// 2) English
//------------------------------------------------------------------------------------
g.module_lang.text.eng = {
	main_title: 'MSF Dashboard v1.0.0 | Outbreak Lubumbashi',
	main_description: 'DEMO VERSION. This version of Dashboard MSF uses surveillance data. If you have any issues with the tool or would like to provide feedback or ask questions, please contact the MSF UK Manson Unit at <a href="mailto:gis.mansonunit@london.msf.org">gis.mansonunit@london.msf.org</a>.',

	loadfiles_choose: 'CHOOSE A FILE TO LOAD',
	loadfiles_selected: ['The file currently selected counts','records.'],
	loadfiles_load: 'Load the Dashboard',

	chart_epiwk_title: 'Epidemiological Week',
	chart_epiwk_labelx: 'Epi Week',
	chart_epiwk_labely: 'Cases',
	chart_sexpreg_title: 'Sex - Pregnancy',
	chart_sexpreg_label12: 'Male',
	chart_sexpreg_label22: 'Female, non Preg.',
	chart_sexpreg_label21: 'Female, Preg.',
	chart_sev_title: 'Dehydration',
	chart_sev_labelA: 'Light',
	chart_sev_labelB: 'Moderate',
	chart_sev_labelC: 'Severe', 
	chart_dur_title: 'Stay Duration',
	chart_dur_labelx: 'Stay Duration',
	chart_dur_labely: 'Cases',
	chart_age_title: 'Age',
	chart_age_labelx: 'Age',
	chart_age_labely: 'Cases',
	chart_out_title: 'Outcome',
	chart_out_labelx: 'Outcome',
	chart_out_label1: 'Cured', 
	chart_out_label2: 'Death',
	chart_out_label3: 'Int. F/U',
	chart_out_label4: 'Transf.',
	chart_out_labely: 'Cases',

	chart_disease_title: 'Diseases',
	chart_disease_labelx: 'Times Reported',
	chart_disease_labely: 'Diseases',
	chart_case_bar_title: 'Cases & Deaths',
	chart_case_lin_title: 'Cases & Deaths',
	chart_case_labelx: 'Epi-Week',
	chart_case_labely: 'Cases',
	chart_death_labelx: 'Epi-Week',
	chart_death_labely: 'Deaths',
	chart_year_title: 'Years',
	chart_fyo_title: 'Age Classes',
	chart_fyo_labelu: 'Under 5',
	chart_fyo_labelo: 'Over 5',

	filtext: 'Current filter:',
	
	map_title: 'Map',
	map_legendNA: '0',
	map_legendEmpty: 'No records',
	map_hover: 'Hover to display',
	map_unit: {
		Cases: 'Number of Cases',
		IncidenceProp: 'Incidence Rate (/10,000 people)',
		Deaths: 'Number of Deaths',
		MortalityProp: 'Mortality Rate (/10,000 people)',
		Completeness: 'Frequency structures report, in %'
	},
	jumpto: 'Goto...',
	map_admN1: {
		title: 'Commune'
	},
	map_admN2: {
		title: 'Quartier'
	},
	map_admN3: {
		title: 'Cellule'
	},
	
	colorscale_title: 'MAP PARAMETERS',
	colorscale_unitintro: 'Choose map unit: ',
	colorscale_modeintro: 'Colorscale values: ',
	colorscale_modeauto: 'Automated',
	colorscale_modepresets: 'Presets',
	colorscale_modemanual: 'Manual',
	colorscale_howto: '',
	colorscale_choosetype: 'Calcul mode: ',
	colorscale_choosecolor: 'Scale type: ',

	datacheck_title: 'QUICK DATA CHECK',
	datacheck_intro: 'Here is a short <b>summary of missing or erroneous data</b>.<br>This might give an indication on whether further efforts should be put in data cleaning or not. Consult the errors log for more details.',
	datacheck_header: 'Header',
	datacheck_error: 'Error',
	datacheck_empty: 'Empty',

	datacheck_more: 'Show error log...',
	datacheck_less: 'Hide error log...',

	datacheck_emptmore: 'Show \'isempty\' errors',
	datacheck_emptless: 'Hide \'isempty\' errors',

	datacheck_copy: 'Copy to clipboard',

	datatable_more: 'Show records table...',
	datatable_less: 'Hide records table...',
	datatable_text: {
        button: 'Copy to clipboard',
        language: {
		    "sProcessing":     "Processing...",
		    "sSearch":         "Search:",
		    "sLengthMenu":     "Show _MENU_ entries",
		    "sInfo":           "Showing _START_ to _END_ of _TOTAL_ entries",
		    "sInfoEmpty":      "Showing 0 to 0 of 0 entries",
		    "sInfoFiltered":   "(filtered from _MAX_ total entries)",
		    "sInfoPostFix":    "",
		    "sInfoThousands":  ",",
		    "sLoadingRecords": "Loading...",
		    "sZeroRecords":    "No matching records found",
		    "sEmptyTable":     "No data available in table",
		    "oPaginate": {
		        "sFirst":    "First",
		        "sLast":     "Last",
		        "sNext":     "Next",
		        "sPrevious": "Previous"
		    },
		    "oAria": {
		        "sSortAscending":  ": activate to sort column ascending",
		        "sSortDescending": ": activate to sort column descending"
		    }
		},
    },
	datatable_legend: 'Sex : 1 = Male, 2 = Female | Pregnancy : 1 = Yes, 2 = No | Dehydration : A = Light, B = Moderate, C = Severe | Outcome : 1 = Cured, 2 = Death, 3 = Interrupted follow-up, 4 = Transfered',
	interface_menutitle: 'MENU',
	interface_menuepiwk: 'Quickly filter the \'n\' last weeks',
	interface_menureset: 'Reset All',
	interface_menureload: 'Reload',
	interface_menuhelp: 'Help',
	interface_menuautoplay: {
    		play: 'Play',
    		pause: 'Pause'
	},
	interface_menucount: ['out of','records selected','Key figures:', 'Cases:','Deaths:'],
	
	interface_colorscale: 'Go back to the Dashboard',

	intro_intro: '<p>Elements are the features of the dashboard you can click. You will notice you can interact with different elements by selecting and deselecting.The following are the typical ways in which you can interact with the dashboard elements:</p><p><b>1) Filtering by elements.</b><br>This affects all the other graphs, maps and table.</p><p><b>2) Selecting multiple elements.</b><br>This allows you to combine filters eg. by area on the map and gender.</p><p><b>3) Deselecting elements and remove filters.</b><br>Elements can be unfiltered one by one or by using the "R" button to clear filters applying to one chart. Alternatively, click "Reset All" on the left handside to remove all filters.</p><p><b>4) Hovering over elements to display values.</b></p><p>Hover the mouse over individual elements to view specific values.</p><p>Click "Next" or press the right arrow to view the details of each graph.</p>',

	intro_multiadm: 'This choropleth map displays number of cases or incidence rates (according to the option you selected on the dataload screen) at the chosen administrative level (Commune - Adm7, Quartier - Adm8 or Cellule - Adm9).<br><i>Click the map to filter data by area. You can select multiple areas. To unfilter areas, click selected areas one by one, or click the "R" button to reset.<br>Click the tabs to navigate between administrative levels. If you swich to a higher administrative level (eg. Cellules to Communes), your filters applying to the lower administrative levels will be reset (in this case, both filters applying to Cellules and Quartiers will be reset).<br>You can zoom directly to specific areas using the "Goto.." drop-down menus. First, select the Commune, then the Quartier and, finally, the Cellule.<br>You can also navigate the map using the zoom buttons and your mouse.</i>',
	
	intro_epiwk: 'This bar chart displays case numbers by epi-week.<br><i>Click on the bars to filter by a specific epi-week. You can select multiple epi-weeks. To reset, click again on the selected epi-weeks (one by one) or click the "R" button.</i>',

	intro_age: 'This bar chart displays case numbers by age.<br><i>Click and drag to filter by an age range. To reset, click on the bar chart outside of the selected range or click the "R" button.</i>',

	intro_sexpreg: 'This pie chart displays case numbers by sex and for women, by pregnancy.<br><i>Click on the pie slices to filter by a specific sex / pregnancy "status". To reset, click the selected pie slices or click the "R" button.</i>',

	intro_sev: 'This pie chart displays case numbers by dehydration state.<br><i>Click on the pie slices to filter by a specific dehydration state. You can select multiple dehydration states. To reset, click the selected pie slices one by one or click the "R" button.</i>',

	intro_dur: 'This bar chart displays case numbers by duration of stay.<br><i>Click on the bars to filter by a specific stay duration. You can select multiple stay durations. To reset, click the selected durations one by one or click the "R" button.</i>',

	intro_out: 'This bar chart displays case numbers by outcome.<br><i>Click on the bars to filter by a specific outcome. You can select multiple outcomes. To reset, click the selected outcomes one by one or click the "R" button.</i>',

	intro_table: 'This table displays the selected records.<br><i>Click on the "Copy to clipboard" button to copy the content of the whole table (in order to export to Excel for instance).</i>',
};