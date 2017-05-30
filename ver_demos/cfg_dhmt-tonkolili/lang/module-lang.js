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
g.module_lang.current = 'eng';

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
	main_title: 'MSF Dashboard v1.1 | Surveillance Tonkolili DHMT',
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
	chart_fyo_title: 'Classes d\'Ages',
	chart_fyo_labelu: 'Moins de 5 ans',							
	chart_fyo_labelo: 'Plus de 5 ans',							
	chart_fyo_labela: 'Tous Ages',   						
	chart_multiadm_title: 'Emplacements', 					
	chart_ser_range_title: 'Semaine Epi',			

	epiweek_all: 'Toutes',								
	epiweek_none: 'Aucune',									
	epiweek_playing: 'En cours de lecture: ',				
	epiweek_selected: 'Semaine epi sélectionnée: ',			

	filtext: 'Filtre actuel:',
	
	map_title: '',
	map_legendNA: '0',
	map_legendEmpty: 'Absence de données',
	map_hover: 'Survolez pour afficher',
	map_unit_title: {
		Cases: 'Nombre de cas',
		IncidenceProp: 'Taux d\'incidence (/10 000 personnes)',
		Deaths: 'Nombre de décès',
		MortalityProp: 'Taux de mortalité (/10 000 personnes)',
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
		title: 'Chiefdom'
	},
	map_admN2: {
		title: 'PHU'
	},
	map_hosp: {
		title: 'Hôpitaux'					
	},

	chartwarper_btn_container_ser_outer:'par classe d\'age',				
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
	datatable_legend: 'FYO (Five Years Old): u = Under (<5 ans), o = Over (>5 ans)',

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
	interface_menuviewfilt: 'Voir Filtres Activé',					
	interface_menufiltsum: 'Résumé des filtres activés',					
	interface_menunofilt: 'Aucun filtre activé',				

	interface_colorscale: 'Retourner au Dashboard',

	intro_intro: "<div style='font: 14px sans-serif;'><h4><b>MSF Dashboard v1.1 - Surveillance Tonkolili DHMT</b></h4><p>Ce dashboard représente des données médicales collectées dans des PHUs et des hôpitaux du Tonkolili en Sierra Leone. Il est possible d’explorer, de visualiser et d’interagir avec les données de plusieurs façons. Les interactions principales consistent en:</p><ol><li style='margin-bottom: 10px;'><b><i> Filtrer les données </b></i><br/> Interagir avec les données en sélectionnant/cliquant sur une catégorie spécifique sur les graphiques ou la carte aura pour résultat de <i>filtrer</i> toutes les données par rapport á la catégorie choisie. Les graphiques du dashboard représenteront alors uniquement le choix de la catégorie sélectionnée. Sélectionner/cliquer une seconde fois sur la même catégorie aura pour conséquence <i>d’annuler</i> la sélection et les graphiques et la carte reviendront à leur représentation initiale.</li><li style='margin-bottom: 10px;'><b><i>Combiner plusieurs filtres</i></b><br/> Si une exploration/visualisation plus précise de certains paramètres est nécessaire, il est possible de combiner les filtres en sélectionnant/cliquant sur plus d’une catégorie à la fois. Par exemple, il est possible de filtrer tous les cas de <i>typhoïde</i> apparus lors du dernier <i>mois épidémiologique</i> dans la région de <i>Gbonkolenken</i>.</li><li style='margin-bottom: 10px;'><b><i>Retirer un ou plusieurs filtres </i></b><br/>Les filtres peuvent être retirer:<ul style='padding-left: 22px;'><li> un à la fois en sélectionnant/cliquant une seconde fois sur la catégorie que l’on veut retirer</li><li>retirer toutes les sélections d’un graphique en cliquant sur le bouton '↻' si celui-ci est présent</li><li>retirer toutes les sélections du dashboard et revenir à la représentation initiale en cliquant sur le bouton <i>Réinitialiser</i>.</li></ul></li><li style='margin-bottom: 10px;'><b><i>Survoler les éléments des graphiques pour afficher les valeurs associées </b></i><br/>Par exemple, survolez avec le curseur une région spécifique sur la carte et les valeurs associées s’afficheront en haut, à droite de la carte. Survolez avec le curseur un point  spécifique sur un graphique et les valeurs associées apparaitront au niveau du point sélectionné.</li></ol><p>Cette aide est destinée à une meilleure compréhension sur comment utiliser le dashboard, parcourir les différents graphiques et comprendre leurs spécificités. Pour continuer, cliquez sur le bouton <i>Next</i> ou appuyez sur la flèche droite de votre clavier. Alternativement, revenez plus tard si nécessaire: soit en cliquant le bouton <i>Aide</i> du menu latéral, soit les boutons ‘?’ pour consulter l'aide spécifique à chaque graphique.</p></div>",

	intro_menu: "<div style='font: 14px sans-serif;'><h4><b>Options générales du dashboard</b></h4><p>Certaines options s’appliquent directement à l’ensemble du dashboard. Ces options sont situées sur la gauche du dashboard et comprennent:</p><ul><li style='margin-bottom: 10px;'><b>Aide</b><br/>Lance la visite guidée du dashboard.</li><li style='margin-bottom: 10px;'><b>Recharger</b><br/>Recharge l’ensemble du dashboard.</li><li style='margin-bottom: 10px;'><b>Lecture/Pause</b><br/>Lecture chronologique de toutes les semaines épi des données représentées. Lors de la lecture, le nom de la semaine épi représentée s’affiche sous le bouton. <i>Pause</i> peut être activé/désactivé à tout moment.</li><li style='margin-bottom: 10px;'><b>Chiffres clés </b><br/>Ces statistiques indiquent le nombre de cas total de décès représentés sur la carte</li><li style='margin-bottom: 10px;'><b>Réinitialiser</b><br/>Ce bouton retire tous les filtres appliqués aux données à l’exception des <i>Pathologies</i>. Il est entendu que l’utilisateur désire généralement visualiser une maladie à la fois.</li><li style='margin-bottom: 10px;'><b>Voir Filtres Actuel</b><br/>Permet de faire apparaître un résumé de tous les filtres appliqués au dashboard. Il est possible de l’activé ou désactivé a tout moment.</li></div>",

	intro_multiadm: '<div style="font: 14px sans-serif;"><h4><b>La Carte</b></h4><p><b> Statistiques</b><br/>La carte représente les statistiques suivantes : nombre de cas, nombre de décès, taux d\’incidence, taux de mortalité et  fréquence de transmission (i.e. la fréquence à laquelle les rapports sont faits). L\’élément statistique à visualiser peut être choisi en cliquant sur le bouton correspondant au-dessus de la carte.</p><p><b>Niveaux divisionels</b><br/>Les données peuvent être visualiser selon 3 niveaux divisionels: le <i>Chiefdom</i>, le <i>PHU</i> ou les <i>Hôpitaux</i>. Choisissez en cliquant sur le bouton correspondant au-dessus de la carte.</p><p><b>Filtrer par aire géographique</b><br/>Sélectionner une aire géographique spécifique sur la carte permet d\’afficher les données correspondantes à cette aire. Plusieurs aires géographiques peuvent être sélectionnées simultanément. Pour désélectionner une aire, cliquez une deuxième fois sur l\’aire concernée ou sur le bouton « ↻ » pour tout réinitialiser simultanément.</p><p><b>Zoomer sur une aire géographique</b><br/>Vous pouvez vous rendre directement sur une aire spécifique en utilisant les listes de sélection <i>Zoom rapide</i> (au-dessus à droite de la carte, la sélection se fait progressivement de l\’aire géographique la plus large à la plus petite). Vous pouvez également parcourir la carte en utilisant les boutons de zoom (+/-) ainsi que la souris (clic maintenu pour bouger la carte).</p><p><b>Autres boutons:</b><ul style="padding-left: 22px; "><li style="margin-bottom: 5px; ">cliquer "<span class="ft">⬙</span>" permet d\'ajuster l\'échelle de couleurs au jeu de données actuel (si le mode <i>auto</i> n\'est pas déjà activé)</li><li style="margin-bottom: 5px; ">cliquer "<span class="ft">⚙</span>" permet d\'accéder à plus d\'options pour paramétrer la carte</li><li style="margin-bottom: 5px; ">cliquer "<span class="ft">◰</span>" permet d\'agrandir/réduire la carte</li></p></div>',

	intro_disease: "<div style='font: 14px sans-serif;'><h4><b>Graphique des pathologies</b></h4><p>Ce graphique indique toutes les pathologies représentées. Il indique combien de fois chaque pathologies a été rapportée (i.e. +1 par région et par semaine là où il y a eu au moins un nouveau cas rapporté).</p><p>Pour sélectionner les données par rapport à une pathologie spécifique, cliquez sur la barre de la pathologie désirée. Désélectionnez en cliquant sur la même pathologie une deuxième fois ou en sélectionnant une nouvelle pathologie.</p></div>",

	intro_container_ser_lin: "<div style='font: 14px sans-serif;'><h4><b>Graphiques des semaines épi</b></h4><p>Selon le bouton sélectionné au-dessus de la carte, les graphiques de cette section représenteront soit le <i>nombre de cas et de décès</i>, soit le <i>taux d’incidence et de mortalité</i>, pour une semaine épi donnée. Ils peuvent être visualisés par <i>classe d’âge</i> ou par <i>année</i> selon le bouton sélectionné au-dessus de la carte. Survolez avec la souris un point spécifique sur le graphique et les valeurs associées apparaitront au niveau du point sélectionné. </p><p>Le graphique de sélection de semaines épi (voir ci-dessous) permet de sélectionner plusieurs semaines épi selon ces besoins.</p><p>L’aide suivante permet une description plus précise de ces graphiques.</p></div>",

	intro_case_ser: "<div style='font: 14px sans-serif;'><h4><b>Graphique de semaine épidémiologique (semaine épi) par classe d’âge</b></h4><p> Ces graphiques représentent le nombre de cas ou de décès par semaine épi pour chaque classe d’âge (<i>Tous âges</i>, <i>Moins de 5 ans</i>, <i>Plus de 5 ans</i>). Ces graphiques ne permettent pas de filtrer les données. Toutefois vous pouvez visualiser les données d'une période spécifique en cliquant sur la barre de la semaine épi souhaitée.</p></div>",

	intro_case_lin: "<div style='font: 14px sans-serif;'><h4><b>Graphique de semaine épidémiologique par année</b></h4><p>Ces graphiques représentent les nombre de cas ou de décès par semaine épi et par année. Ces graphiques ne permettent pas de filtrer les données. Toutefois vous pouvez visualiser les données d'une période spécifique en cliquant sur la barre de la semaine épi souhaitée.</p><p>Pour visualiser les données du dashboard uniquement pour certaines années, il est possible de filtrer les années directement sur le graphique des <i>Années</i> (diagramme circulaire).</p></div>",

	intro_ser_range: "<div style='font: 14px sans-serif;'><h4><b>Graphique de sélection de semaines épi</b></h4><p>Ce graphique permet de sélectionner une ou un groupe spécifique de semaines épi. Toutes les données du dashboard seront alors filtrées en fonction de la ou des semaines épi sélectionnées.</p><p>Sélectionner une ou un groupe de semaine épi peut se faire de deux manières :</p><ol><li style='margin-bottom: 5px;'>Faire un clic maintenu et bouger la souris d’un côté ou de l’autre de la période (groupe de semaines épi) que l’on veut sélectionner</li><li style='margin-bottom: 5px;'>En cliquant sur l’un des boutons situés en-dessous du graphique avec une période de semaines épi présélectionnée (e.g. <i>Mois-epi en cours</i>)</li></ol><p>Note: une semaine épi commence le lundi.</p></div>",

	intro_fyo: "<div style='font: 14px sans-serif;'><h4><b>Graphique par classes d’âge</b></h4><p> Ce diagramme circulaire représente le nombre de cas par classe d’âge (<i>Moins de 5</i>, <i>Plus de 5</i> ans).</p><p>Cliquez sur les sections du diagramme pour filtrer par classe d’âge toutes les données du dashboard.</p></div>",

	intro_year: "<div style='font: 14px sans-serif;'><h4><b>Graphique par année</b></h4><p>Ce diagramme circulaire représente le nombre de cas par année.</p><p> Cliquez sur les sections du diagramme pour filtrer par année toutes les données du dashboard. Il est possible de sélectionner plusieurs années simultanément pour les comparer dans le graphique de <i>Semaine épidémiologique par année.</i></p></div>",

	intro_table: "<div style='font: 14px sans-serif;'><h4><b>Tableau</b></h4><p>Ce tableau présente les entrées sélectionnées (en tenant compte de tous les filtres appliqués au dashboard).</p><p>Cliquez sur le bouton <i>Copier vers le presse-papier</i> pour copier tout le contenu du tableau (afin d'en exporter le contenu vers Excel par exemple).</p></div>",

};

// 2) English
//------------------------------------------------------------------------------------
g.module_lang.text.eng = {
	main_title: 'MSF Dashboard v1.1 | Surveillance Tonkolili DHMT',
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
	chart_fyo_title: 'Age Groups',
	chart_fyo_labelu: 'Under 5',
	chart_fyo_labelo: 'Over 5',
	chart_fyo_labela: 'All Ages',   				
	chart_multiadm_title: 'Locations',				
	chart_ser_range_title: 'Epiweeks',	
	
	epiweek_all: 'All',
	epiweek_none: 'None',
	epiweek_playing: 'Currently playing epiweek: ',
	epiweek_selected: 'Epiweeks selected: ',
	
	filtext: 'Current filter:',
	
	map_title: '',		
	map_legendNA: '0',
	map_legendEmpty: 'No records',
	map_hover: 'Hover to display',
	map_unit_title: {
		Cases: 'Number of Cases',
		IncidenceProp: 'Incidence Rate (/10,000)',
		Deaths: 'Number of Deaths',
		MortalityProp: 'Mortality Rate (/10,000)',
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
		title: 'Chiefdom'
	},
	map_admN2: {
		title: 'PHU'
	},
	map_hosp: {
		title: 'Hospitals'
	},

	chartwarper_btn_container_ser_outer:'by age group',				
	chartwarper_btn_container_lin_outer:'by year',

	qf_btns_last1epiweeks: 'Last full epiweek',
	qf_btns_last4epiweeks: 'Last 4 epiweeks',
	qf_btns_last52epiweeks: 'Last 52 epiweeks',
	qf_btns_last0epimonths: 'Current epimonth',
	qf_btns_last1epimonths: 'Last full epimonth',
	qf_btns_last3epimonths: 'Last 3 epimonths',
	qf_btns_last0epiyears: 'Current epiyear',
	qf_btns_last1epiyears: 'Last full epiyear',
	
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
	datatable_legend: 'FYO (Five Yrs Old): u = Under (<5 yrs old), o = Over (>5 yrs old)',

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

	intro_intro: "<div style='font: 14px sans-serif;'><h4><b>MSF Dashboard v1.1 - Surveillance Tonkolili DHMT</b></h4><p>This dashboard displays health data collected from PHUs and hospitals in Tonkolili, Sierra Leone. It is possible to explore and interact with the data in the dashboard in various ways. Some of the main types of interaction include:</p><ol><li style='margin-bottom: 10px;'><b><i>Filtering the data</b></i><br/>Interacting with the dashboard (by selecting a specific category in a chart or area in a map), <i>filters</i> all data to that selection. This means that all charts in the dashboard will reflect this selection. Selecting the same category a second time '<i>de-</i>selects' that category.</li><li style='margin-bottom: 10px;'><b><i>Combining filters</i></b><br/>Combining filters (by selecting more than one filter simultaneously) allows more specific queries to be explored. For example, it is possible to filter for all cases of <i>Typhoid Fever</i> in the <i>Last full epimonth</i> in <i>Gbonkolenken</i>.</li><li style='margin-bottom: 10px;'><b><i>Resetting filters</i></b><br/>Filters can be reset: <ul style='padding-left: 22px;'><li>one at a time (by de-selecting all categories within a chart or map)</li><li>for an entire chart (by clicking the '↻' button if available)</li><li>for the entire dashboard (by clicking the <i>Reset All</i> button)</li></ul></li><li style='margin-bottom: 10px;'><b><i>Hovering chart elements to display associated values</b></i><br/>For example, hovering over an area in the map displays the associated value in the top-right window in the map. Hovering over a data point in a chart displays a pop-up with the associated value.</li></ol><p>This Help tour will take you through the main features of the site. Click <i>Next</i> below or press the right arrow on your keyboard to continue. You can also click any of the '?' buttons to consult each chart's specific help.</p></div>",

	intro_menu: "<div style='font: 14px sans-serif;'><h4><b>General Dashboard Options</b></h4><p>There are a number of options that can be applied to the entire dashboard. These are located down the left-hand side of the dashboard and include:</p><ul><li style='margin-bottom: 10px;'><b>Help</b><br/>Opens the Help tour.</li><li style='margin-bottom: 10px;'><b>Reload</b><br/>Reloads the entire dashboard.</li><li style='margin-bottom: 10px;'><b>Play/Pause</b><br/>Plays through all epiweeks of data for the current view. The epiweek currently displayed is written beneath the button when in <i>Play</i> mode. <i>Pause</i> can be selected at any time.</li><li style='margin-bottom: 10px;'><b>Current Map View</b><br/>These statistics display the total number of <i>Cases</i> and <i>Deaths</i> that are displayed in the current view of the map.</li><li style='margin-bottom: 10px;'><b>Reset All</b><br/>Resets all filters in the data (i.e. it '<i>de-</i>selects' all data) except for <i>Diseases</i>. It is assumed that the user normally wants to view one disease at a time.</li><li style='margin-bottom: 10px;'><b>View Current Filters</b><br/>Displays a summary of all filters currently applied in the dashboard. It is possible to toggle it on or off at any time.</li></div>",

	intro_multiadm: '<div style="font: 14px sans-serif;"><h4><b>The Map</b></h4><p><b>Statistics</b><br/>The map displays one of the following statistics: Cases, Deaths, Incidence Rate, Mortality Rate, and Completeness (the frequency of reports made). The statistic displayed can be selected using the buttons above the map.</p><p><b>Divisional Level</b><br/>Data can be viewed by <i>Chiefdom</i>, <i>PHU</i> or <i>Hospital</i> level. These can be selected using the buttons above the map.</p><p><b>Filter by area</b><br/>Selecting an area on the map filters all data in the dashboard to that area. Multiple areas can be selected. To <i>de-</i>select areas, either click a selected area a second time, or click the "↻" button to de-select all areas simultaneously.</p><p><b>Zoom to an area</b><br/>You can zoom directly to a specific area using the <i>Quick zoom</i> drop-down menus (progressively from highest to lowest levels). You can also navigate the map using the zoom buttons (+/-) and by panning with your mouse.</p><p><b>Other optional buttons:</b><ul style="padding-left: 22px;"><li style="margin-bottom: 5px;">click "<span class="ft">⬙</span>" to adjust the colorscale limit values for the current dataset (if it is not already in <i>auto</i> mode)</li><li style="margin-bottom: 5px;">click "<span class="ft">⚙</span>" to access more optional map parameters (such as the colorscale type and the interval calculation mode)</li><li style="margin-bottom: 5px;">click "<span class="ft">◰</span>" to enlarge or reduce the size of the map window</li></p></div>',

	intro_disease: "<div style='font: 14px sans-serif;'><h4><b>Disease Chart</b></h4><p>This chart displays all diseases reported in the data. It measures the number of times each disease was reported (i.e. +1 per area and per week, where there was at least 1 case reported).</p><p>To filter all dashboard data to a specific disease, select it by clicking on its bar. <i>De-</i>select it by either clicking it a second time, or by selecting a different disease.</p></div>",

	intro_container_ser_lin: "<div style='font: 14px sans-serif;'><h4><b>Epiweek Charts</b></h4><p>The charts in this section show either the number of <i>Cases & Deaths</i> or the <i>Incidence & Mortality rates</i> per epiweek, as selected in the buttons above the map. They can be viewed either by <i>Age Group</i> or by <i>Year</i>, which can be alternated using the buttons at the top. Hovering over a data point in a chart displays its value as a pop-up.</p><p> The Epiweek Range Chart (below) can be used to select a range of epiweeks as desired.</p><p>The following Help sections describe these charts in more detail.</p></div>",

	intro_case_ser: "<div style='font: 14px sans-serif;'><h4><b>Epiweek Chart by Age Group</b></h4><p>These charts display numbers or rates by epiweek for each age group (<i>All Ages</i>, <i>Under 5</i> and <i>Over 5</i> yrs old). They cannot be used to filter the dataset. However, they are automatically zoomed to the epiweeks selected in the Epiweek Range Chart below. </p></div>",

	intro_case_lin: "<div style='font: 14px sans-serif;'><h4><b>Epiweek Chart by Year</b></h4><p>These charts display numbers or rates by epiweek for each year. They cannot be used to filter the dataset. However, they are automatically zoomed to the epiweeks selected in the Epiweek Range Chart below.</p><p>To display data for only some years, it is possible to filter the <i>Years</i> pie chart.</p></div>",

	intro_ser_range: "<div style='font: 14px sans-serif;'><h4><b>Epiweek Range Chart</b></h4><p>This chart can be used to select any continuous range of epiweeks. All data in the dashboard is filtered to these weeks.</p><p>Selecting a range of epiweeks can be done in two ways:</p><ol><li style='margin-bottom: 5px;'>By clicking and dragging the range handles on either side of the selected epiweeks</li><li style='margin-bottom: 5px;'>By clicking one of the buttons below the chart with a pre-specified time range (e.g. <i>Last full epimonth</i>)</li></ol><p>Note: Epiweeks start on a Monday.</p></div>",

	intro_fyo: "<div style='font: 14px sans-serif;'><h4><b>Age Group Pie Chart</b></h4><p>This chart displays case numbers by age group (<i>Under 5</i>, <i>Over 5</i> yrs old).</p><p>Clicking a slice selects or <i>de-</i>selects that age group, and filters all dashboard data accordingly.</p></div>",

	intro_year: "<div style='font: 14px sans-serif;'><h4><b>Years Pie Chart</b></h4><p>This chart displays case numbers by year.</p><p>Clicking a slice selects or <i>de-</i>selects all data for that year, and filters all dashboard data accordingly. It is possible to select multiple years and compare them in the <i>Epiweek Chart by Year</i> charts.</p></div>",

	intro_table: "<div style='font: 14px sans-serif;'><h4><b>Data Table</b></h4><p>This table displays all records in the current selection (accounting for all filters applied in the dashboard).</p><p>Clicking the <i>Copy to clipboard</i> button copies the content of the entire table. This can be used to export to Excel, for example.</p></div>",

};

// 3) Castilian Spanish - Not translated yet
//------------------------------------------------------------------------------------
/*g.module_lang.text.cas = {
	main_title: 'MSF Dashboard v1.0.0 | Surveillance Tonkolili DHMT',
    main_description: 'VERSIÓN PILOTO. Esta versión utiliza datos de monitoreo. Esta herramienta esta desarrollada por la Manson Unit, MSF UK - <a href="mailto:gis.mansonunit@london.msf.org">gis.mansonunit@london.msf.org</a>.<br><i>Haga clic en los gráficos para filtrar las múltiples dimensiones de su conjunto de datos. Consulta la ayuda para mas detalles.</i>',

    loadfiles_choose: 'ESCOGE UN ARCHIVO PARA CARGAR',
    loadfiles_selected: ['El archivo seleccionado contiene','entradas.'],
    loadfiles_load: 'Cargar el Dashboard',

    chart_disease_title: 'Patología',
    chart_disease_labelx: 'Veces Señalada',
    chart_disease_labely: 'Patología',
    chart_case_bar_title: 'Casos & Fallecimientos',
    chart_case_lin_title: 'Casos & Fallecimientos',
    chart_case_labelx: 'Semana Epi',
    chart_case_labely: 'Casos',
    chart_death_labelx: 'Semana Epi',
    chart_death_labely: 'Fallecimientos',
    chart_year_title: 'Años',
    chart_fyo_title: 'Clases de Edad',
    chart_fyo_labelu: 'Under 5',
    chart_fyo_labelo: 'Over 5',

    filtext: 'Filtro actual:',
   
    map_title: 'Mapa',
    map_legendNA: '0',
    map_legendEmpty: 'Cero entradas',
    map_hover: 'Mantenga el ratón sobre un área para mostrar',
    map_unit_title: {
        Cases: 'Numero de Casos',
        IncidenceProp: 'Tasa de Incidencia (/10,000 personas)',
        Deaths: 'Numero de Fallecimientos',
		MortalityProp: 'Tasa de Mortalidad (/10,000 personas)',
        Completeness: 'Frequencia estructuras transmiten datos, en %'
    },
    jumpto: 'Ir a...',
    map_admN1: {
        title: 'Chiefdom'
    },
    map_admN2: {
        title: 'PHU'
    },

    chartwarper_tab_container_bar:'Por clase de edad',
    chartwarper_tab_container_lin:'Por año',
   
    colorscale_title: 'PARÁMETROS DEL MAPA',
    colorscale_unitintro: 'Unidad del mapa: ',
    colorscale_modeintro: 'Limites de la escala: ',
    colorscale_modeauto: 'Automático',
    colorscale_modepresets: 'Predefinidos',
    colorscale_modemanual: 'Manual',
    colorscale_howto: '',
    colorscale_choosetype: 'Modo de calculo: ',
    colorscale_choosecolor: 'Tipo de escala: ',

    datacheck_title: 'VERIFICACIÓN RÁPIDA DE LOS DATOS',
    datacheck_intro: 'Aquí encontrara  un breve <b>resumen de los datos faltantes o erróneos</b>.<br>Eso puede dar una indicación sobre la necesidad de revisar la calidad del conjunto de datos. Consulta el log de errores para mas detalles.',
    datacheck_header: 'Header',
    datacheck_error: 'Error',
	datacheck_empty: 'Vacio',

    datacheck_more: 'Mostrar el log de errores...',
    datacheck_less: 'Esconder el log de errores...',

    datacheck_emptmore: 'Mostrar entr. vacías',
    datacheck_emptless: 'Esconder entr. vacías',

    datacheck_copy: 'Copiar al portapapeles',

    datatable_more: 'Mostrar la tabla de entradas...',
    datatable_less: 'Esconder la tabla de entradas...',
    datatable_text: {
        button: 'Copiar al portapapeles',
        language: {
            "sProcessing":     "Procesando...",
            "sSearch":         "Buscar:",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    },
    datatable_legend: 'FYO (Five Years Old): u = Under (< 5 años), o = Over (> 5 años)',

    interface_menutitle: 'MENU',
    interface_menuepiwk: 'Filtrar rápidamente las \'n\' ultimas semanas',
    interface_menureset: 'Reiniciar',
    interface_menureload: 'Volver a cargar',
    interface_menuhelp: 'Ayuda',
    interface_menuautoplay: {
            play: 'Play',
            pause: 'Pause'
    },
    interface_menucount: ['entradas seleccionadas sobre','','Cifras claves:', 'Casos:','Fallecimientos:'],
   
    interface_colorscale: 'Volver al Dashboard',

    intro_intro: '<p>Puede interactuar con los datos del Dashboard seleccionando los elementos de los gráficos (áreas, bares...).</p><p><b>1) Filtrar una dimensión del conjunto de datos.</b><br>Cada interacción filtra el conjunto de datos y por lo tanto afecta todos los gráficos.</p><p><b>2) Combina los filtros.</b><br>Puede por ejemplo filtrar casos de "tal" semana Y en "tal" área.</p><p><b>3) Reiniciar filtros.</b><br>Los filtros se pueden reiniciar uno por uno, todos los de un grafico (haciendo clic en el botón "<span class="ft">↻</span>") o todos los del dashboard haciendo clic en el botón "Reiniciar" del menú lateral.</p><p><b>4) Pasa el ratón sobre los elementos de los gráficos para mostrar los valores asociados.</b></p><br><p>Haga clic en "Next" o pulse la flecha hacia la derecha para recorrer los gráficos y consultar sus especificidades o vuelva cuando lo necesites: haciendo clic en el botón de "Ayuda" del menú lateral, o en los botones "?" para consultar la ayuda especifica de cada gráfico.</p>',

    intro_multiadm: 'Este mapa muestra el numero de casos o la tasa de incidencia al nivel divisional elegido.<br><i>Haga clic en el mapa para filtrar datos por área. Puede seleccionar múltiples áreas. Para reiniciar los filtros, haga clic en los áreas seleccionados uno por uno, o haga clic sobre el botón "<span class="ft">↻</span>".<br>Haga clic en las pestañas para navegar entre los distintos niveles de división geográfica.<br>Puede enfocar el mapa directamente sobre áreas especificas utilizando los menús "Ir a..." (progresivamente desde el nivel mas alto hacia el mas bajo).<br>Puede también recorrer el mapa utilizando los botones +/- y el ratón.</i><br>Otros Botones :<br> - haga clic en el botón "<span class="ft">⬙</span>" para ajustar los valores limites de la escala de color al conjunto de datos actualmente seleccionado (si no esta ya en modo \'auto\'),<br> - haga clic en el botón "<span class="ft">⚙</span>" para acceder a mas parámetros,<br> - haga clic en el botón "<span class="ft">◰</span>" para ensanchar/reducir el mapa.',

    intro_disease: 'Este gráfico en filas muestra las patologías representadas.<br><i>Haga clic en las filas para mostrarlos datos de una patología especifica.<br>El eje horizontal muestra el numero de veces que una patología haya sido señalada ie. +1 por Area y por Semana donde 1 o mas casos de la patología han sido señalados.</i>',

    intro_case_bar: 'Estos gráficos de barras muestran números de casos y fallecimientos por semana epidemiologica (epi-week) y por clase de edad (+/- 5 años).<br><i>Haga clic en las barras par filtrar por una epi-week especifica. Puede seleccionar múltiples epi-weeks. Para reiniciar los filtros, haga clic otra vez sobre las epi-weeks seleccionadas (una por una) o haga clic en el botón "<span class="ft">↻</span>".</i>',

    intro_case_lin: 'Estos gráficos muestran números de casos y fallecimientos por semana y por años.<br><i>Estos gráficos no pueden ser usados para filtrar el conjunto de datos.</i>',

	intro_fyo: 'Este gráfico circular muestra el numero de casos por clase de edad (+/- 5 años).<br><i>Haga clic en los sectores para filtrar por una clase de edad especifica. Para reiniciar los filtros, haga clic en los sectores seleccionados uno por uno o haga clic en el botón "<span class="ft">↻</span>".</i>',

    intro_year: 'Este gráfico circular muestra el numero de casos por año.<br><i>Haga clic en los sectores para filtrar por una clase de edad especifica. Para reiniciar los filtros, haga clic en los sectores seleccionados uno por uno o haga clic en el botón "<span class="ft">↻</span>".</i>',

    intro_table: 'Esta tabla muestra las entradas seleccionadas.<br><i>Haga clic en el botón "Copiar en el portapapeles" para copiar el contenido de toda la tabla (para exportar a Excel por ejemplo).</i>'
};*/
