MSF-Dashboard v1.1
====================

A lightweight and modular data visualization micro-website that can be offlined and adapted to various data-feeds.

A new release (v1.1) is now ready and is available for [download](https://github.com/MSF-UK/MSF-Dashboard/releases/tag/v1.1). This includes various examples of configuration files.

Want to contribute to MSF-Dashboard? Please read `CONTRIBUTING.md`.

Sample Dashboards
------------------

Here are some example use cases of the MSF-Dashboard, including online demo versions. If you are interested, they can be a good start to help you generate and customize your own MSF-Dashboard.

|Description                                           |Links                                                 |
|------------------------------------------------------|------------------------------------------------------|
|**Surveillance: MSF Chad CERU** (updated Mar 2018) - offline, data parsed via dedicated datamanager|[online-demo](http://MSF-UK.github.io/MSF-Dashboard/ver_demos/cfg_eru-chad/) / [download](https://github.com/MSF-UK/MSF-Dashboard/releases/tag/v1.2.1/eru_tchad-incl-datamanager_v1.2.zip)|
|**Outbreak: MSF Lubumbashi Mission** (December 2015) - offline, data parsed via tsv|[online-demo](http://MSF-UK.github.io/MSF-Dashboard/ver_demos/cfg_msf-lubumbashi) / [download](https://github.com/MSF-UK/MSF-Dashboard/releases/tag/v1.0.0_msf-lubumbashi)|
|**Surveillance: MSF Katanga ERU** (updated May 2017) - offline, data parsed via excel-spreadsheets|[online-demo](http://MSF-UK.github.io/MSF-Dashboard/ver_demos/cfg_eru-katanga/) / [download](https://github.com/MSF-UK/MSF-Dashboard/releases/tag/v1.1/eru-katanga_v1.1.zip)|
|**Surveillance: SRE MOH Tonkolili DHMT** (updated May 2017) - offline, data parsed via dedicated datamanager|[online-demo](http://MSF-UK.github.io/MSF-Dashboard/ver_demos/cfg_dhmt-tonkolili/) / [download](https://github.com/MSF-UK/MSF-Dashboard/releases/tag/v1.1/dhmt-tonkolili_v1.1.zip)|
|**Surveillance: MSF Sud-Kivu ERU** (updated May 2017) - offline, data parsed via excel-spreadsheets|[online-demo](http://MSF-UK.github.io/MSF-Dashboard/ver_demos/cfg_eru-sudkivu/) / [download](https://github.com/MSF-UK/MSF-Dashboard/releases/tag/v1.1/eru-sudkivu_v1.1.zip)|
|**Outbreak: MSF Bentiu Mission** (November 2016) - offline, data parsed via csv|[online-demo](http://MSF-UK.github.io/MSF-Dashboard/ver_demos/cfg_msf-bentiu)|
|More to come...| |


Installation and Usage
----------------------

The MSF Dashboard can be deployed either on- or off-line. As an online tool it is a micro-website, requiring only a web browser (Chrome, Firefox or equivalent; IE support is not guaranteed). The offline version uses nwjs, which includes a node instance and allows for more advanced file manipulation.

The technical side of a MSF-Dashboard deployment is generally a 4-step process:
1) Establish the parsing and data formatting workflow 
2) Configure the dashboard
3) Deploy the dashboard
4) Support the end users

The main constraints for installation are the connection with the data source and specific data visualization and interaction needs that are not yet implemented. 
 
Please get in touch [here](https://github.com/MSF-UK/MSF-Dashboard/issues) with any issues or suggestions.
 
<!-- **Ready to try? You can start with the ERU versions:**
+ Download the release including configuration files for the Sud-Kivu ERU here -> [X](https://github.com/MSF-UK/MSF-Dashboard/releases/tag/v1.1_eru-sudkivu)
+ Here is one page guide for quick deployement (included in the release) -> [X](https://github.com/MSF-UK/MSF-Dashboard/blob/master/cfg_eru-sudkivu/doc-dev/eru_dashboard-deployement_onepage.pdf)
+ Here is a simple user guide (included in the release) -> [X](https://github.com/MSF-UK/MSF-Dashboard/blob/master/cfg_eru-sudkivu/doc-user/eru_doc-user_draft.pdf) -->

Customize the Dashboard: Get started!
-------------------------------------

The Dashboard relies on two types of files:
+ source files */src_core/* : These include both third-party libraries (in */src_core/lib/*) and libraries developed specifically for this MSF-Dashboard (other files in */src_core/*). These files should not be changed for a 'simple' customization ('simple' relates to changes in the layout or text, and the reuse of existing charts and functions).
+ configuration files */cfg_[name-your-custom-version-here]/* : There are 3 configuration files: *index.html* for the layout, *lang/module_lang.js* for the texts and their translations, and *dev/dev-defined.js* for defining specific parameters relating to the data, the data files (geojson, population and medical data), and the charts to be implemented.


Current documentation status:
+ A complete documentation of [dev/dev-defined.js](http://msf-uk.github.io/MSF-Dashboard/doc_getting-started/docs/dev-defined.html) for v1.0.0 is available.
+ The documentation for *index.html* (eg. [index.html](https://github.com/MSF-UK/MSF-Dashboard/blob/master/cfg_msf-bentiu/index.html)) for the layout and *lang/module_lang.js* (eg. [lang/module_lang.js](https://github.com/MSF-UK/MSF-Dashboard/blob/master/cfg_msf-bentiu/lang/module-lang.js)) for the texts and their translations, are not yet available.
+ Developer documentation for MSF-Dashboard v0.9.9 is available [here](https://msf-uk.github.io/MSF-Dashboard_doc/). It is currently being updated for v1.1.

Please get in touch [here](https://github.com/MSF-UK/MSF-Dashboard/issues) if you have any problems or suggestions.

General Architecture
--------------------

```
index.html                                - Defines the layout of the dashboard (charts position and 
|                                           identifiers). 
|                                           @see: Bootstrap grid system: http://getbootstrap.com/css/#grid.  
|
└─ js/main-getlibs.js                     - Loads third-party ibrairies and dashboard sources.
   |                                        @see: Folders are defined in 'index.html'.
   |
   ├─ dev/dev-defined.js                  - Parameters to get and check medical and geometry data, define
   |                                        charts and maps.
   |                                        @see: All the defined parameters are global and members of 'module:g'.
   |
   ├─ lang/module-lang.js                 - Stores texts visible to the end user in available languages.
   |                                        @see: 'module:module_lang'
   |
   ├- js/module-chartwarper.js            - [Optional] Warp charts/containers under tabs.
   |                                        @see 'module:module_chartwarper'
   |
   └─ js/main-getdata.js                  - Loads datafiles.
      |                                     @see: 'module:module_getdata'
      |
      └── js/main-loadfiles.js            - Combines functions of: requesting data from sources, reading
          |                                 and formatting data, connecting with other components.
          |                                 @see: 'module:main_loadfiles'
          |
          ├── js/module-datacheck.js      - Medical data quality check and processing (runs through all
          |                                 the medical records).
          |                                 @see: 'module:module_datacheck'
          |
          └── js/main-core.js             - Central component: setup and pulls the data in the charts and   
              |                             maps. Define the interactions. Connects with other components.
              |                             @see 'module:main_core'
              |
              ├── js/module-epitime.js    - Calculates and processes all time-related data based on 
              |                             epidemiological weeks.
              |                             @see 'module:module_epitime'
              |
              ├── js/module-population.js - Processes all population-related data. 
              |                             
              |                             @see 'module:module_population'
              |
              ├── js/module-interface.js  - A lateral menu and exta functionalities buttons for charts/maps. 
              |   |                         @see 'module:module_interface'
              |   |          
              |   └-- js/module-intro.js  - [Optional] intro.js to access quick interactive help: setup.
              |                             @see 'module:module_intro'
              |
              ├── js/module-datatable.js  - [Optional] datatables.js to display data: setup, display and 
              |                             interactions.
              |                             @see 'module:module_datatable'
              |
              ├── js/module-multiadm.js   - [Optional] Maps warper (tabs) and 'Goto' dropdown lists: setup, 
              |                             display and interactions.
              |                             @see 'module:module_multiadm'
              |
              ├── js/module-colorscale.js - [Optional] Provide functions to deal with maps colorscale  
                                            (automatic adaptation, diffrent computing methods - geostats.js -
                                            or color tones...).
                                            @see 'module:module_colorscale'          
    
```

For More Information
--------------------

+ Developer Documentation is available at [Contribute to MSF-Dashboard](https://MSF-UK.github.io/MSF-Dashboard_doc) but is not not complete for v1.1 yet, bear with us!
+ Report issues or ask for help  at [Issues MSF-Dashboard](https://github.com/MSF-UK/MSF-Dashboard/issues).

License
-------

MSF-Dashboard is copyright (c) 2015-present, [Contributors to MSF-Dashboard](https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors) for MSF.

MSF-Dashboard is free software, licensed under the MIT License. See the file `LICENSE.md` in this distribution for more details on the license and see `LICENSES-DEP.md` to know more about the dependencies.
