window.onload = function () {
    console.log('#{ticket}');

    var options = {
        width: 1920,
        height: 1200,
        hideToolbar: false,
        hideTabs: true,
        onFirstInteractive: function () {
            workbook = viz.getWorkbook();
            activeSheet = workbook.getActiveSheet();
            queryDashboard(workbook);
            viz2 = new tableauSoftware.Viz(vizDivFilters, vizURLFilters, optionsFilters);
        }
    };
    // var optionsFilters = {
    //     width: 1920,
    //     height: 1200,
    //     hideTabs: true,
    //     hideToolbar: true,
    //     onFirstInteractive: function () {
    //         workbookFilters = viz2.getWorkbook();
    //         activeSheetFilters = workbookFilters.getActiveSheet();
    //         queryDashboard(workbookFilters);
    //         queryFilters(workbookFilters);
    //     }
    // };

    viz = new tableauSoftware.Viz(vizDiv, vizURL, options);

    viz.addEventListener('tabswitch', function (event) {
        var oldSheetName = event.getOldSheetName();
        var newSheetName = event.getNewSheetName();
        var isNewSheetLandingPage = landingPages.indexOf(newSheetName);
        var isOldSheetLandingPage = landingPages.indexOf(oldSheetName);
        //console.log(newSheetName);
        //console.log(landingPages.indexOf(newSheetName));
        var urlPrefix = "#/";
        var urlSheet = event.getNewSheetName();
        var urlString = urlPrefix.concat(urlSheet.replace(" ", "%20"));
        pos += 1;
        //console.log("about to run history.pushState; stateValue=" + pos);
        history.pushState({pos: pos, sheetName: newSheetName}, 'New Title', urlString);
        $(document).ready(function () {
            $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
        });
    })
};

window.onpopstate = function (event) {
    console.log("running onpopstate function");
    console.log("location: " + document.location + ", state: " + event.state.pos + ", SheetName: " + event.state.sheetName);
    if (pos !== null) {
        workbook.activateSheetAsync(event.state.sheetName);
    } else {
        sheetName = "Landing_page";
        workbook.activateSheetAsync(event.state.sheetName);
    }
    if (event.originalEvent.state != null) {
        alert("location: " + document.location);
    }
};

var switchView = function (sheetName) {
    try {
        console.log("running switchView function");
        workbook = viz.getWorkbook();
        //alert(workbook);
        workbook.activateSheetAsync(sheetName)
            .then(function (sheet) {
                worksheet = sheet;
                console.log("running then function");
            });
    }
    catch (err) {
        alert(sheetName);
        alert(err.message);
    }
};

function getSheetsAlertText(sheets) {
    var alertText = [];
    for (var i = 0, len = sheets.length; i < len; i++) {
        var sheet = sheets[i];
        alertText.push(" Sheet " + i);
        alertText.push(" (" + sheet.getSheetType() + ")");
        alertText.push(" - " + sheet.getName());
        alertText.push("\n");
    }
    return alertText.join("");
}

function querySheets(workbook) {
    var sheets = workbook.getPublishedSheetsInfo();
    var text = getSheetsAlertText(sheets);
    text = "Sheets in the workbook:\n" + text;
    // alert(text);
}

function queryDashboard(workbook) {
    var worksheets = workbook.getActiveSheet().getWorksheets();
    var text = getSheetsAlertText(worksheets);
    text = "Worksheets in the dashboard:\n" + text;
    // alert(text);
}

function queryFilters(workbook) {
    var worksheets = workbook.getActiveSheet().getWorksheets().get("Filters WS").getFiltersAsync();
    var text = getSheetsAlertText(worksheets);
    text = "Filters in the sheet:\n" + text;
    // alert(text);
}

function filterSingleValue(activeSheet) {
    activeSheet.applyFilterAsync(
        "Company Region",
        "Americas",
        tableau.FilterUpdateType.REPLACE);
}