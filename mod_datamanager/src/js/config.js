// Excel spreadsheet configuration:

var data_format = 'IDS';   //IDS (Chad), DHIS2 (Tonkolili), IDSR (previous Tonokolili)

// Configuration for IDS worksheet format - Chad
// Worksheet list
//var sheetListFirst = 1;     // First sheet with data
//var sheetListNum = 15;      // Number of sheets with data (diseases)

// Each standard worksheet
var tableRowFirst = 7;      // First row with data
var tableRowNum = 150;      // Number of rows with data (health facilities)
var tableColFirst = 'F';    // First column with data
var tableColNum = 4;        // Number of columns containing each week

// Each non-standard worksheet  //HEIDI CHECK ALL DECES MATERNEL WORKSHEETS FOR ALL YEARS INCASE DEC FIRST
var non_std_sheets = [{year: 2014, sheetName: 'Paludisme Confirmés 2014', param: 'pc2014'},
                      {year: 2014, sheetName: 'Décés Maternel', param: 'dm2014'},
                      {year: 2015, sheetName: 'DECES MATERNEL 2015', param: 'dm2015'},
                      {year: 2014, sheetName: 'Malnutrition 2014', param: 'mal2014'},
                      {year: 2015, sheetName: 'MALNUTRITION 2015', param: 'mal2015'}
                      ];
var non_std_stats = {
     pc2014: {
        tableRowFirst: 7,      // First row with data
        tableRowNum: 111,      // Last row with data 
        tableColFirst: 'C',    // First column with data
        tableColNum: 4,        // Number of columns containing each week
    },
    dm2014: {
        tableRowFirst: 7,      // First row with data
        tableRowNum: 112,      // Last row with data 
        tableColFirst: 'F',    // First column with data
        tableColNum: 2,        // Number of columns containing each week
    },
    dm2015: {
        tableRowFirst: 7,      // First row with data
        tableRowNum: 112,      // Last row with data 
        tableColFirst: 'F',    // First column with data
        tableColNum: 4,        // Number of columns containing each week
    },
    mal2014: {
        tableRowFirst: 6,      // First row with data
        tableRowNum: 110,      // Last row with data 
        tableColFirst: 'F',    // First column with data
        tableColNum: 4,        // Number of columns containing each week
    },
    mal2015: {
        tableRowFirst: 7,      // First row with data
        tableRowNum: 112,      // Last row with data 
        tableColFirst: 'C',    // First column with data
        tableColNum: 4,        // Number of columns containing each week
    }
}


/*
// Configuration for DHIS2 worksheet format (as of 02/2017) - Tonkolili
var newFirstRow = 5;          // First row with data
var newNumRows = 150;         // Max number of rows with data (health facilities)
var newFirstCol = 'B';        // First column with data
var newColsPerDisease = 4;    // Number of columns containing each disease
var newNumDiseases = 29;      // Number of diseases
var newFileEpiweekCell = 'A2';   // Cell containing epiweek number defining file
*/

/*// Configuration for IDSR worksheet format - Tonkolili
// Worksheet list
var sheetListFirst = 4;     // First sheet with data
var sheetListNum = 29;      // Number of sheets with data (diseases)

// Each worksheet
var tableRowFirst = 9;      // First row with data
var tableRowNum = 107;      // Number of rows with data (health facilities)
var tableColFirst = 'F';    // First column with data
var tableColNum = 8;        // Number of columns containing each week*/


// Parameters for any format:
// Folders
var folderHISfiles = '..\\..\\data-folders\\01-datamanager-IDS-excel\\';
var folderErrorLog = '..\\..\\data-folders\\01a-datamanager-IDS-excel-error_log\\';
var folderDatabases = '..\\..\\data-folders\\02-datamanager-databases\\';
var folderBackups = '..\\..\\data-folders\\03-datamanager-backup\\';
var folderDashboard = '..\\..\\data-folders\\04-dashboard-input\\';

// Dashbord index.html
var dashboardIndex = '\\dashboard\\src\\cfg_eru-chad\\index.html';

// Data check parameters
//var ignoreEmpty = true;
var testType = {
    disease: 'none',
    district: 'none',
    region: 'none',
    an: 'int_test',
    pop: 'int_test',
    epiweek: 'epiweek_test',
    cas: 'int_test',
    dec: 'int_test',
    //taux_att: 'pos_real_test',
    //let:'pos_real_test'
    taux_att: 'none',
    let: 'none'
};

var districtSpellUpdates = [{
        data_name: 'Alifa',
        geo_name: 'Alifat'
    }, {
        data_name: 'Isserom',
        geo_name: 'Isseirom'
    }
];

