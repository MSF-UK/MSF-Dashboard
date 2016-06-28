MSF-Dashboard 1.5-dev
=====================

A lightweight and modular data visualization micro-website that can be offlined and adapted to various data-feeds.

Want to contribute to MSF-Dashboard? Please read `CONTRIBUTING.md`.


Installation and Usage
----------------------

MSF Dashboard can be deployed in a variety of contexts. It is a micro-website which, in its 'essential' version, does not require more than a web browser (Firefox or equivalent or Chrome or equivalent, IE is support is not guaranteed at the moment). It is run offline thanks to nwjs which includes a node instance and allow usage of more advanced file manipulation.

The main constraints for installation are:
- Online or offline implementation.
- Connexion with data source. 

The setup that are currently supported and have been tested include:
- Offline implementation with nwjs micro-server (data parsed via excel-spreadsheets, csv, tsv, dedicated datamanager).
- Online implementation without backend (data parsed via json file directly uploaded to the website).
- Online implementation with backend (data parsed via various APIs...).

The technical side of a MSF-Dashboard deployment is generally a 3-steps process:
- 1) Parsing and formatting data 
- 2) Configuring the MSF-Dashboard
- 3) Hosting the MSF-Dashboard

[Get last release!](http://braimbault.github.io/NA)

Templates and Examples
----------------------

The MSF-Dashboard community has created some templates and examples to help you generate and customize your own MSF-Dashboard. Here are a few public ones:

+ [Outbreak-Lubumbashi](http://braimbault.github.io/NA) - January 2016 (offline, data parsed via tsv)
+ [Surveillance-Tonkolili](http://braimbault.github.io/MSF-Dashboard_Surveillance-Tonkolili/demo-site/) - April 2016 (offline, data parsed via dedicated datamanager)
+ [Surveillance-ERU](http://braimbault.github.io/NA) - June 2016 (offline, data parsed via excel-spreadsheets)

To get started, you can also consult the implementation examples of different charts:

+ [Bar Chart](http://braimbault.github.io/NA)
+ [Multi Map](http://braimbault.github.io/NA)


General Architecture
--------------------

```
index.html                           - Defines the layout of the dashboard (charts position and identifiers). 
|                                      @see: Bootstrap grid system: http://getbootstrap.com/css/#grid.  
|
├── dev/dev-defined.js               - Parameters to get and check medical and geometry data, define charts and maps.
|                                      @see: All the defined parameters are global and members of 'module:g'.
|
├── lang/module-lang.js              - Stores texts visible to the end user in available languages.
|                                      @see: 'module:module_lang'
|
├-- js/module-chartwarper.js         - [Optional] Warp charts/containers under tabs.
|                                      @see 'module:module_chartwarper'
|
└── js/main-loadfiles.js             - Combines functions of: requesting data from sources, reading and formatting
    |                                  data, connecting with other components.
    |                                  @see: 'module:main_loadfiles'
    |
    ├── js/module-datacheck.js       - Medical data quality check and processing (runs through all the medical
    |                                  records).
    |                                  @see: 'module:module_datacheck'
    |
    └── js/main-core.js              - Central component: setup and pulls the data in the charts and maps. Define  
        |                              the interactions. Connects with other components.
        |                              @see 'module:main_core'
        |
        ├── js/module-interface.js   - A lateral menu and exta functionalities buttons for charts/maps. 
        |   |                          @see 'module:module_interface'
        |   |          
        |   └-- js/module-intro.js   - [Optional] intro.js to access quick interactive help: setup.
        |                              @see 'module:module_intro'
        |
        ├-- js/module-datatable.js   - [Optional] datatables.js to display data: setup, display and interactions.
        |                              @see 'module:module_datatable'
        |
        ├-- js/module-multiadm.js    - [Optional] Maps warper (tabs) and 'Goto' dropdown lists: setup, display and 
        |                              interactions.
        |                              @see 'module:module_multiadm'
        |
        └-- js/module-colorscale.js  - [Optional] Provide functions to deal with maps colorscale (automatic 
                                       adaptation, diffrent computing methods - geostats.js - or color tones...).
                                       @see 'module:module_colorscale'          
    
```

For More Information
--------------------

+ Documentation is available at [Use MSF-Dashboard](https://MSF-UK.github.io/MSF-Dashboard).
+ Report issues or ask for help  at [Issues MSF-Dashboard](https://github.com/MSF-UK/MSF-Dashboard/issues).
+ Track last changes [Releases history MSF-Dashboard](https://github.com/MSF-UK/MSF-Dashboard/).

License
-------

MSF-Dashboard is copyright (c) 2015-present, [Contributors to MSF-Dashboard](https://github.com/MSF-UK/MSF-Dashboard/graphs/contributors) for MSF.

MSF-Dashboard is free software, licensed under the MIT License. See the file `LICENSE.md` in this distribution for more details on the license and see `LICENSES-DEP.md` to know more about the dependencies.
