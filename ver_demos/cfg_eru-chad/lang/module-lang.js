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
	'eng':'English'
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
// Surveillance
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------


// 1) French
//------------------------------------------------------------------------------------
g.module_lang.text.fra = {
	main_title: 'MSF Dashboard v1.1 | Surveillance Chad ERU',
	main_description: '<br>VERSION PILOTE prend en entrée des données de surveillance<br>Dévelopé par la Manson Unit, MSF UK - <a href="mailto:gis.mansonunit@london.msf.org">gis.mansonunit@london.msf.org</a>',
	
	loadfiles_choose: 'CHOISISSEZ UN FICHIER A CHARGER',
	loadfiles_selected: ['Le fichier actuellement sélectionné contient','enregistrements.'],
	loadfiles_load: 'Charger le Dashboard',

	chart_disease_title: 'Pathologies',
	chart_disease_labelx: 'Nombre de Signalements',
	chart_disease_labely: 'Pathologies',
	chart_case_ser_title: 'Cas & Décès',
	chart_case_lin_title: 'Cas & Décès',
	chart_case_ser_imr_title: 'Taux d\'incidence & mortalité',   
	chart_case_lin_imr_title: 'Taux d\'incidence & mortalité',   
	chart_case_ser_comp_title: 'Cas & Décès - Fréquence de transmission',
	chart_case_lin_comp_title: 'Cas & Décès - Fréquence de transmission',

	chart_case_labelx: 'Semaine Epi',
	chart_case_labely: 'Cas',
	chart_death_labelx: 'Semaine Epi',
	chart_death_labely: 'Décès',
	chart_ir_labely: 'Taux d\'incidence',				
	chart_mr_labely: 'Taux de mortalité',					
	chart_comp_labely: 'Fréquence',						
	chart_year_title: 'Années',					
	chart_fyo_labela: 'Tous Ages',   						
	chart_multiadm_title: 'Emplacements', 					
	chart_ser_range_title: 'Semaine Epi',			

	epiweek_all: 'Toutes',								
	epiweek_none: 'Aucune',									
	epiweek_playing: 'En cours de lecture: ',				
	epiweek_selected: 'Semaines-epi sélectionnées: ',			

	filtext: 'Filtre actuel:',
	
	map_title: '',
	map_legendNA: '0',
	map_legendEmpty: 'Absence de données',
	map_hover: 'Survolez pour afficher',
	map_unit_title: {
		Cases: 'Nombre de cas',
		IncidenceProp: 'Taux d\'incidence (/100 000 personnes)',
		Deaths: 'Nombre de décès',
		MortalityProp: 'Taux de mortalité (/100 000 personnes)',
		Completeness: 'Fréquence de transmission (%)'
	},
	map_unit: {						
		Cases: 'Cas',
		IncidenceProp: 'Taux d\'incidence',
		Deaths: 'Décès',
		MortalityProp: 'Taux de mortalité',
		Completeness: 'Fréquence de transmission'
	},
	map_viewby_text: 'Voir par: ',		
	map_quickzoom_text: 'Zoom rapide: ',	
	jumpto: 'Pas de Zoom',				
	
	map_admN1: {
		title: 'Région'
	},
	map_admN2: {
		title: 'District'
	},

	chartwarper_btn_container_ser_outer:'continu',				
	chartwarper_btn_container_lin_outer:'par année',	

	qf_btns_last1epiweeks: 'Dernière semaine-epi complète',
	qf_btns_last4epiweeks: '4 dernières semaines-epi',
	qf_btns_last52epiweeks: '52 dernières semaines-epi',
	qf_btns_last0epimonths: 'Mois-epi en cours',
	qf_btns_last1epimonths: 'Dernier mois-epi complet',
	qf_btns_last3epimonths: '3 derniers mois-epi',
	qf_btns_last0epiyears: 'L\'année-epi en cours',
	qf_btns_last1epiyears: 'Dernière année-epi complète',			
	
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
	datatable_legend: '',

	interface_menutitle: 'MENU',
	interface_menuepiwk: 'Filtrer rapidement les \'n\' dernières semaines',
	interface_menureset: 'Réinitialiser',
	interface_menureload: 'Recharger',
	interface_menuhelp: 'Aide',
	interface_menuautoplay: {
    		play: 'Jouer',
    		pause: 'Pause'
	},
	interface_menucount: ['enregistrements sélectionés sur','','Chiffres clés:', 'Cas :','Décès :'],
	interface_menuviewfilt: 'Voir Filtres Activés',					
	interface_menufiltsum: 'Résumé des filtres activés',					
	interface_menunofilt: 'Aucun filtre activé',				

	interface_colorscale: 'Retourner au Dashboard',

	intro_intro: "<div style='font: 14px sans-serif;'><h4><b>MSF Dashboard v1.1 - Surveillance Tchad ERU</b></h4><p>Ce dashboard représente des données médicales collectées par le <a href='https://www.sante-tchad.org/'>Ministère de la Santé Publique</a> en République du Tchad. Il est possible d’explorer, de visualiser et d’interagir avec les données de plusieurs façons. Les interactions principales consistent en:</p><ol><li style='margin-bottom: 10px;'><b><i> Filtrer les données </b></i><br/> Interagir avec les données en sélectionnant/cliquant sur une catégorie spécifique sur les graphiques ou la carte aura pour résultat de <i>filtrer</i> toutes les données par rapport á la catégorie choisie. Les graphiques du dashboard représenteront alors uniquement le choix de la catégorie sélectionnée. Sélectionner/cliquer une seconde fois sur la même catégorie aura pour conséquence <i>d’annuler</i> la sélection et les graphiques et la carte reviendra à sa représentation initiale.</li><li style='margin-bottom: 10px;'><b><i>Combiner plusieurs filtres</i></b><br/> Si une exploration/visualisation plus précise de certains paramètres est nécessaire, il est possible de combiner les filtres en sélectionnant/cliquant sur plus d’une catégorie à la fois. Par exemple, il est possible de filtrer tous les cas de <i>Fièvre Jaune</i> apparus lors du dernier <i>mois épidémiologique</i> dans la région de <i>Batha</i>.</li><li style='margin-bottom: 10px;'><b><i>Retirer un ou plusieurs filtres </i></b><br/>Les filtres peuvent être retirés:<ul style='padding-left: 22px;'><li> un à la fois en sélectionnant/cliquant une seconde fois sur la catégorie que l’on veut retirer</li><li>retirer toutes les sélections d’un graphique en cliquant sur le bouton '↻' si celui-ci est présent</li><li>retirer toutes les sélections du dashboard et revenir à la représentation initiale en cliquant sur le bouton <i>Réinitialiser</i>.</li></ul></li><li style='margin-bottom: 10px;'><b><i>Survoler les éléments des graphiques pour afficher les valeurs associées </b></i><br/>Par exemple, survolez avec le curseur une région spécifique sur la carte et les valeurs associées s’afficheront en haut, à droite de la carte. Survolez avec le curseur un point  spécifique sur un graphique et les valeurs associées apparaitront au niveau du point sélectionné.</li></ol><p>Cette aide est destinée à une meilleure compréhension sur comment utiliser le dashboard, parcourir les différents graphiques et comprendre leurs spécificités. Pour continuer, cliquez sur le bouton <i>Next</i> ou appuyez sur la flèche droite de votre clavier. Alternativement, revenez plus tard si nécessaire: soit en cliquant le bouton <i>Aide</i> du menu latéral, soit le bouton ‘?’ pour consulter l'aide spécifique à chaque graphique.</p></div>",

	intro_menu: "<div style='font: 14px sans-serif;'><h4><b>Options générales du dashboard</b></h4><p>Certaines options s’appliquent directement à l’ensemble du dashboard. Ces options sont situées sur la gauche du dashboard et comprennent:</p><ul><li style='margin-bottom: 10px;'><b>Aide</b><br/>Lance la visite guidée du dashboard.</li><li style='margin-bottom: 10px;'><b>Recharger</b><br/>Recharge l’ensemble du dashboard.</li><li style='margin-bottom: 10px;'><b>Lecture/Pause</b><br/>Lecture chronologique de toutes les semaines épi des données représentées. Lors de la lecture, le nom de la semaine épi représentée s’affiche sous le bouton. <i>Pause</i> peut être activé/désactivé à tout moment.</li><li style='margin-bottom: 10px;'><b>Chiffres clés </b><br/>Ces statistiques indiquent le nombre de cas total de décès représentés sur la carte</li><li style='margin-bottom: 10px;'><b>Réinitialiser</b><br/>Ce bouton retire tous les filtres appliqués aux données à l’exception des <i>Pathologies</i>. Il est entendu que l’utilisateur désire généralement visualiser une maladie à la fois.</li><li style='margin-bottom: 10px;'><b>Voir Filtres Actuel</b><br/>Permet de faire apparaître un résumé de tous les filtres appliqués au dashboard. Il est possible de l’activer ou désactiver a tout moment.</li></div>",

	intro_multiadm: '<div style="font: 14px sans-serif;"><h4><b>La Carte</b></h4><p><b> Statistiques</b><br/>La carte représente les statistiques suivantes : nombre de cas, nombre de décès, taux d\’incidence, taux de mortalité et  fréquence de transmission (i.e. la fréquence à laquelle les rapports sont faits). L\’élément statistique à visualiser peut être choisi en cliquant sur le bouton correspondant au-dessus de la carte.</p><p><b>Niveaux divisionels</b><br/>Les données peuvent être visualisées selon 2 niveaux divisionels: la <i>Région</i> ou le <i>District</i>. Choisissez en cliquant sur le bouton correspondant au-dessus de la carte.</p><p><b>Filtrer par aire géographique</b><br/>Sélectionner une aire géographique spécifique sur la carte permet d\’afficher les données correspondantes à cette aire. Plusieurs aires géographiques peuvent être sélectionnées simultanément. Pour désélectionner une aire, cliquez une deuxième fois sur l\’aire concernée ou sur le bouton « ↻ » pour tout réinitialiser simultanément.</p><p><b>Zoomer sur une aire géographique</b><br/>Vous pouvez vous rendre directement sur une aire spécifique en utilisant les listes de sélection <i>Zoom rapide</i> (au-dessus à droite de la carte, la sélection se fait progressivement de l\’aire géographique la plus large à la plus petite). Vous pouvez également parcourir la carte en utilisant les boutons de zoom (+/-) ainsi que la souris (clic maintenu pour bouger la carte).</p><p><b>Autres boutons:</b><ul style="padding-left: 22px; "><li style="margin-bottom: 5px; ">cliquer "<span class="ft">⬙</span>" permet d\'ajuster l\'échelle de couleurs au jeu de données actuel (si le mode <i>auto</i> n\'est pas déjà activé)</li><li style="margin-bottom: 5px; ">cliquer "<span class="ft">⚙</span>" permet d\'accéder à plus d\'options pour paramétrer la carte</li><li style="margin-bottom: 5px; ">cliquer "<span class="ft">◰</span>" permet d\'agrandir/réduire la carte</li></p></div>',

	intro_disease: "<div style='font: 14px sans-serif;'><h4><b>Graphique des pathologies</b></h4><p>Ce graphique indique toutes les pathologies représentées. Il indique combien de fois chaque pathologies a été rapportée (i.e. +1 par région et par semaine là où il y a eu au moins un nouveau cas rapporté).</p><p>Pour sélectionner les données par rapport à une pathologie spécifique, cliquez sur la barre de la pathologie désirée. Désélectionnez en cliquant sur la même pathologie une deuxième fois ou en sélectionnant une nouvelle pathologie.</p></div>",

	intro_container_ser_lin: "<div style='font: 14px sans-serif;'><h4><b>Graphiques des semaines épi</b></h4><p>Selon le bouton sélectionné au-dessus de la carte, les graphiques de cette section représenteront soit le <i>nombre de cas et de décès</i>, soit le <i>taux d’incidence et de mortalité</i>, pour une semaine épi donnée. Ils peuvent être visualisés par temps <i>continu</i> ou par <i>année</i> selon le bouton sélectionné au-dessus de la carte. Survolez avec la souris un point spécifique sur le graphique et les valeurs associées apparaitront au niveau du point sélectionné. </p><p>Le graphique de sélection de semaines épi (voir ci-dessous) permet de sélectionner plusieurs semaines épi selon ces besoins.</p><p>L’aide suivante permet une description plus précise de ces graphiques.</p></div>",

	intro_case_ser: "<div style='font: 14px sans-serif;'><h4><b>Graphique de semaine épidémiologique - continu</b></h4><p>Ces graphiques représentent les nombres ou les taux par semaine épi comme une série chronologique continue pour <i>tous les âges</i> combinés. Ces graphiques ne permettent pas de filtrer les données. Toutefois vous pouvez visualiser les données d'une période spécifique en cliquant sur la barre de la semaine épi souhaitée.</p></div>",

	intro_case_lin: "<div style='font: 14px sans-serif;'><h4><b>Graphique de semaine épidémiologique - par année</b></h4><p>Ces graphiques représentent les nombres ou les taux par semaine épi et par année. Ces graphiques ne permettent pas de filtrer les données. Toutefois vous pouvez visualiser les données d'une période spécifique en cliquant sur la barre de la semaine épi souhaitée.</p><p>Pour visualiser les données du dashboard uniquement pour certaines années, il est possible de filtrer les années directement sur le graphique des <i>Années</i> (diagramme circulaire).</p></div>",

	intro_ser_range: "<div style='font: 14px sans-serif;'><h4><b>Graphique de sélection de semaines épi</b></h4><p>Ce graphique permet de sélectionner une ou un groupe spécifique de semaines épi. Toutes les données du dashboard seront alors filtrées en fonction de la ou des semaines épi sélectionnées.</p><p>Sélectionner une ou un groupe de semaine épi peut se faire de deux manières :</p><ol><li style='margin-bottom: 5px;'>Faire un clic maintenu et bouger la souris d’un côté ou de l’autre de la période (groupe de semaines épi) que l’on veut sélectionner</li><li style='margin-bottom: 5px;'>En cliquant sur l’un des boutons situés en-dessous du graphique avec une période de semaines épi présélectionnée (e.g. <i>Mois-epi en cours</i>)</li></ol><p>Note: une semaine-épi commence le lundi.</p></div>",

	intro_year: "<div style='font: 14px sans-serif;'><h4><b>Graphique par année</b></h4><p>Ce diagramme circulaire représente le nombre de cas par année.</p><p> Cliquez sur les sections du diagramme pour filtrer par année toutes les données du dashboard. Il est possible de sélectionner plusieurs années simultanément pour les comparer dans le graphique de <i>Semaine épidémiologique par année.</i></p></div>",

	intro_table: "<div style='font: 14px sans-serif;'><h4><b>Tableau</b></h4><p>Ce tableau présente les entrées sélectionnées (en tenant compte de tous les filtres appliqués au dashboard).</p><p>Cliquez sur le bouton <i>Copier vers le presse-papier</i> pour copier tout le contenu du tableau (afin d'en exporter le contenu vers Excel par exemple).</p></div>",

};

// 2) English
//------------------------------------------------------------------------------------
g.module_lang.text.eng = {
	main_title: 'MSF Dashboard v1.1 | Surveillance Chad ERU',
	main_description: '<br>PILOT VERSION for surveillance data<br>Developed by MSF UK, Manson Unit: <a href="mailto:gis.mansonunit@london.msf.org">gis.mansonunit@london.msf.org</a>',

	loadfiles_choose: 'CHOOSE A FILE TO LOAD',
	loadfiles_selected: ['The file currently selected counts','records.'],
	loadfiles_load: 'Load the Dashboard',

	chart_disease_title: 'Diseases',
	chart_disease_labelx: 'Times Reported',
	chart_disease_labely: 'Diseases',
	chart_case_ser_title: 'Cases & Deaths',   					
	chart_case_lin_title: 'Cases & Deaths',
	chart_case_ser_imr_title: 'Incidence & Mortality Rates',   
	chart_case_lin_imr_title: 'Incidence & Mortality Rates',   
	chart_case_ser_comp_title: 'Cases & Deaths - Completeness',
	chart_case_lin_comp_title: 'Cases & Deaths - Completeness',

	chart_case_labelx: 'Epi-Week',
	chart_case_labely: 'Cases',
	chart_death_labelx: 'Epi-Week',
	chart_death_labely: 'Deaths',
	chart_ir_labely: 'Incidence Rate',					
	chart_mr_labely: 'Mortality Rate',									
	chart_comp_labely: 'Cases Reported',				
	chart_year_title: 'Years',
	chart_fyo_labela: 'All Ages',   				
	chart_multiadm_title: 'Locations',				
	chart_ser_range_title: 'Epi-weeks',	
	
	epiweek_all: 'All',
	epiweek_none: 'None',
	epiweek_playing: 'Currently playing epi-week: ',
	epiweek_selected: 'Epi-weeks selected: ',
	
	filtext: 'Current filter:',
	
	map_title: '',		
	map_legendNA: '0',
	map_legendEmpty: 'No records',
	map_hover: 'Hover to display',
	map_unit_title: {
		Cases: 'Number of Cases',
		IncidenceProp: 'Incidence Rate (/100,000)',
		Deaths: 'Number of Deaths',
		MortalityProp: 'Mortality Rate (/100,000)',
		Completeness: 'Frequency report (%)'
	},
	map_unit: {						
		Cases: 'Cases',
		IncidenceProp: 'Incidence Rate',
		Deaths: 'Deaths',
		MortalityProp: 'Mortality Rate',
		Completeness: 'Completeness'
	},
	map_viewby_text: 'View by: ',			
	map_quickzoom_text: 'Quick zoom: ',		
	jumpto: 'No Zoom',

	map_admN1: {
		title: 'Region'
	},
	map_admN2: {
		title: 'District'
	},

	chartwarper_btn_container_ser_outer:'continuous',				
	chartwarper_btn_container_lin_outer:'by year',

	qf_btns_last1epiweeks: 'Last full epi-week',
	qf_btns_last4epiweeks: 'Last 4 epi-weeks',
	qf_btns_last52epiweeks: 'Last 52 epi-weeks',
	qf_btns_last0epimonths: 'Current epi-month',
	qf_btns_last1epimonths: 'Last full epi-month',
	qf_btns_last3epimonths: 'Last 3 epi-months',
	qf_btns_last0epiyears: 'Current epi-year',
	qf_btns_last1epiyears: 'Last full epi-year',
	
	colorscale_title: 'MAP PARAMETERS',
	colorscale_unitintro: 'Choose map unit: ',
	colorscale_modeintro: 'Colorscale values: ',
	colorscale_modeauto: 'Automated',
	colorscale_modepresets: 'Presets',
	colorscale_modemanual: 'Manual',
	colorscale_howto: '',
	colorscale_choosetype: 'Calculation mode: ',
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
	datatable_legend: '',

	//interface_menutitle: 'Menu',
	//interface_menuepiwk: 'Quickly filter the \'n\' last weeks',
	interface_menureset: 'Reset All',
	interface_menureload: 'Reload',
	interface_menuhelp: 'Help',
	interface_menuautoplay: {
    		play: 'Play',
    		pause: 'Pause'
	},
	interface_menucount: ['out of','records selected','Current Map View:', 'Total Cases:','Total Deaths:'],
	interface_menuviewfilt: 'View Current Filters',
	interface_menufiltsum: 'Current filter summary',	
	interface_menunofilt: 'No filters applied',

	interface_colorscale: 'Go back to the Dashboard',

	intro_intro: "<div style='font: 14px sans-serif;'><h4><b>MSF Dashboard v1.1 - Surveillance Chad ERU</b></h4><p>This dashboard displays health data collected by the <a href='https://www.sante-tchad.org/'>Ministry of Public Health</a> in Chad. It is possible to explore and interact with the data in the dashboard in various ways. Some of the main types of interaction include:</p><ol><li style='margin-bottom: 10px;'><b><i>Filtering the data</b></i><br/>Interacting with the dashboard (by selecting a specific category in a chart or area in a map), <i>filters</i> all data to that selection. This means that all charts in the dashboard will reflect this selection. Selecting the same category a second time '<i>de-</i>selects' that category.</li><li style='margin-bottom: 10px;'><b><i>Combining filters</i></b><br/>Combining filters (by selecting more than one filter simultaneously) allows more specific queries to be explored. For example, it is possible to filter for all cases of <i>Fièvre Jaune</i> in the <i>Last full epi-month</i> in <i>Batha</i>.</li><li style='margin-bottom: 10px;'><b><i>Resetting filters</i></b><br/>Filters can be reset: <ul style='padding-left: 22px;'><li>one at a time (by de-selecting all categories within a chart or map)</li><li>for an entire chart (by clicking the '↻' button if available)</li><li>for the entire dashboard (by clicking the <i>Reset All</i> button)</li></ul></li><li style='margin-bottom: 10px;'><b><i>Hovering chart elements to display associated values</b></i><br/>For example, hovering over an area in the map displays the associated value in the top-right window in the map. Hovering over a data point in a chart displays a pop-up with the associated value.</li></ol><p>This Help tour will take you through the main features of the site. Click <i>Next</i> below or press the right arrow on your keyboard to continue. You can also click any of the '?' buttons to consult each chart's specific help.</p></div>",

	intro_menu: "<div style='font: 14px sans-serif;'><h4><b>General Dashboard Options</b></h4><p>There are a number of options that can be applied to the entire dashboard. These are located down the left-hand side of the dashboard and include:</p><ul><li style='margin-bottom: 10px;'><b>Help</b><br/>Opens the Help tour.</li><li style='margin-bottom: 10px;'><b>Reload</b><br/>Reloads the entire dashboard.</li><li style='margin-bottom: 10px;'><b>Play/Pause</b><br/>Plays through all epi-weeks of data for the current view. The epi-week currently displayed is written beneath the button when in <i>Play</i> mode. <i>Pause</i> can be selected at any time.</li><li style='margin-bottom: 10px;'><b>Current Map View</b><br/>These statistics display the total number of <i>Cases</i> and <i>Deaths</i> that are displayed in the current view of the map.</li><li style='margin-bottom: 10px;'><b>Reset All</b><br/>Resets all filters in the data (i.e. it '<i>de-</i>selects' all data) except for <i>Diseases</i>. It is assumed that the user normally wants to view one disease at a time.</li><li style='margin-bottom: 10px;'><b>View Current Filters</b><br/>Displays a summary of all filters currently applied in the dashboard. It is possible to toggle it on or off at any time.</li></div>",

	intro_multiadm: '<div style="font: 14px sans-serif;"><h4><b>The Map</b></h4><p><b>Statistics</b><br/>The map displays one of the following statistics: Cases, Deaths, Incidence Rate, Mortality Rate, and Completeness (the frequency of reports made). The statistic displayed can be selected using the buttons above the map.</p><p><b>Divisional Level</b><br/>Data can be viewed by <i>Region</i> or <i>District</i> level. These can be selected using the buttons above the map.</p><p><b>Filter by area</b><br/>Selecting an area on the map filters all data in the dashboard to that area. Multiple areas can be selected. To <i>de-</i>select areas, either click a selected area a second time, or click the "↻" button to de-select all areas simultaneously.</p><p><b>Zoom to an area</b><br/>You can zoom directly to a specific area using the <i>Quick zoom</i> drop-down menus (progressively from highest to lowest levels). You can also navigate the map using the zoom buttons (+/-) and by panning with your mouse.</p><p><b>Other optional buttons:</b><ul style="padding-left: 22px;"><li style="margin-bottom: 5px;">click "<span class="ft">⬙</span>" to adjust the colorscale limit values for the current dataset (if it is not already in <i>auto</i> mode)</li><li style="margin-bottom: 5px;">click "<span class="ft">⚙</span>" to access more optional map parameters (such as the colorscale type and the interval calculation mode)</li><li style="margin-bottom: 5px;">click "<span class="ft">◰</span>" to enlarge or reduce the size of the map window</li></p></div>',

	intro_disease: "<div style='font: 14px sans-serif;'><h4><b>Disease Chart</b></h4><p>This chart displays all diseases reported in the data. It measures the number of times each disease was reported (i.e. +1 per area and per week, where there was at least 1 case reported).</p><p>To filter all dashboard data to a specific disease, select it by clicking on its bar. <i>De-</i>select it by either clicking it a second time, or by selecting a different disease.</p></div>",

	intro_container_ser_lin: "<div style='font: 14px sans-serif;'><h4><b>Epi-week Charts</b></h4><p>The charts in this section show either the number of <i>Cases & Deaths</i> or the <i>Incidence & Mortality rates</i> per epi-week, as selected in the buttons above the map. They can be viewed either by <i>continuous</i> (or chronological) time or <i>by year</i>, which can be alternated using the buttons at the top. Hovering over a data point in a chart displays its value as a pop-up.</p><p> The Epi-week Range Chart (below) can be used to select a range of epi-weeks as desired.</p><p>The following Help sections describe these charts in more detail.</p></div>",

	intro_case_ser: "<div style='font: 14px sans-serif;'><h4><b>Epi-week Charts - continuous</b></h4><p>These charts display numbers or rates by epi-week as a continuous time series for <i>all ages</i> combined. They cannot be used to filter the dataset. However, they are automatically zoomed to the epi-weeks selected in the Epi-week Range Chart below. </p></div>",

	intro_case_lin: "<div style='font: 14px sans-serif;'><h4><b>Epi-week Charts - by Year</b></h4><p>These charts display numbers or rates by epi-week for each year. They cannot be used to filter the dataset. However, they are automatically zoomed to the epi-weeks selected in the Epi-week Range Chart below.</p><p>To display data for only some years, it is possible to filter the <i>Years</i> pie chart.</p></div>",

	intro_ser_range: "<div style='font: 14px sans-serif;'><h4><b>Epi-week Range Chart</b></h4><p>This chart can be used to select any continuous range of epi-weeks. All data in the dashboard is filtered to these weeks.</p><p>Selecting a range of epi-weeks can be done in two ways:</p><ol><li style='margin-bottom: 5px;'>By clicking and dragging the range handles on either side of the selected epi-weeks</li><li style='margin-bottom: 5px;'>By clicking one of the buttons below the chart with a pre-specified time range (e.g. <i>Last full epi-month</i>)</li></ol><p>Note: Epi-weeks start on a Monday.</p></div>",

	intro_year: "<div style='font: 14px sans-serif;'><h4><b>Years Pie Chart</b></h4><p>This chart displays case numbers by year.</p><p>Clicking a slice selects or <i>de-</i>selects all data for that year, and filters all dashboard data accordingly. It is possible to select multiple years and compare them in the <i>Epi-week Chart by Year</i> charts.</p></div>",

	intro_table: "<div style='font: 14px sans-serif;'><h4><b>Data Table</b></h4><p>This table displays all records in the current selection (accounting for all filters applied in the dashboard).</p><p>Clicking the <i>Copy to clipboard</i> button copies the content of the entire table. This can be used to export to Excel, for example.</p></div>",

};
