// Excel spreadsheet configuration:

// New Excel format - DHIS2 (as of 02/2017)
var DHIS2_format = true;

// Sheet parameters
var newFirstRow = 5;          // First row with data
var newNumRows = 117;         // Number of rows with data (health facilities)
var newFirstCol = 'B';        // First column with data
var newColsPerDisease = 4;    // Number of columns containing each disease
var newNumDiseases = 29;      // Number of diseases
var newFileEpiweekCell = 'A2';   // Cell containing epiweek number defining file

// Configuration for previous Excel format
// Sheet list
var sheetListFirst = 4;     // First sheet with data
var sheetListNum = 29;      // Number of sheets with data (diseases)

// Each sheet
var tableRowFirst = 9;      // First row with data
var tableRowNum = 107;      // Number of rows with data (health facilities)
var tableColFirst = 'F';    // First column with data
var tableColNum = 8;        // Number of columns containing each week


// Parameters for any format:
// Folders
var folderHISfiles = '..\\..\\data-folders\\01-datamanager-DHIS2-excel\\';
var folderErrorLog = '..\\..\\data-folders\\01a-datamanager-DHIS2-excel-error_log\\';
var folderDatabases = '..\\..\\data-folders\\02-datamanager-databases\\';
var folderBackups = '..\\..\\data-folders\\03-datamanager-backup\\';
var folderDashboard = '..\\..\\data-folders\\04-dashboard-input\\';

// Dashbord index.html
var dashboardIndex = '\\dashboard\\src\\cfg_dhmt-tonkolili\\index.html';

// Data check parameters
var ignoreEmpty = true;
var testType = {
    disease: 'none',
    chiefdom: 'none',
    PHU: 'none',
    an: 'int_test',			
    pop: 'int_test',
    epiweek: 'epiweek_test',
    lesscas: 'int_test',
    lessdth: 'int_test',
    morecas: 'int_test',
    moredth: 'int_test',
    totalcas: 'int_test',
    totaldth: 'int_test',
    tax: 'pos_real_test',
    let: 'pos_real_test'
};

