/*
 * ------------------------------------------------------------------------------------
 *   Copyright (c) SAS Institute Inc.
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 * ---------------------------------------------------------------------------------------
 *
 */
 'use strict';
async function reportViewer(store, reportServices, appEnv){
    let {reports, reportTransforms } = reportServices;

    // If temporary report exists delete it - allows for potential new template report
    let reportsList = await getReport( store, reports, `${APPENV.work.report}`);
    if ( reportsList !== null ) {
        await store.apiCall(reportsList.itemsCmd(reportsList.itemsList(0), 'delete'));
      };

    // get the URI for the template VA report 
    reportsList = await getReport( store, reports, `${appEnv.template.report}`);
    if ( reportsList === null ) {
        throw {Error: `${appEnv.template.report} not found`};
    }
    let reportUri = reportsList.itemsCmd(reportsList.itemsList(0), 'self', 'link', 'uri');

    // setup information for the reportTransforms service
    // reportTransforms service creates a new copy of the report and associates the new table with it
    let data = {
            "inputReportUri"  : `${reportUri}`,
            "resultReportName": `${appEnv.work.report}`,
            "dataSources": [
            {
                "namePattern": "serverLibraryTable",
                "purpose": "replacement",
                "server": "cas-shared-default",
                "library": `${appEnv.work.caslib}`,
                "table": `${appEnv.work.table}`
            },
            {
                "namePattern": "serverLibraryTable",
                "purpose": "original",
                "server": "cas-shared-default",
                "library": `${appEnv.template.caslib}`,
                "table": `${appEnv.template.table}`
            }
            ]
        }

    let qs = {
        failOnDataSourceError:false,
        useSavedReport:true,
        saveResult:true
    }

    let p = {
        qs: qs,
        data: data
    }

    // make the service call to create the temporary report
    let changeData = reportTransforms.links('createDataMappedReport');
    let newReport = await store.apiCall(changeData, p);

    // get the unique id of the new report
    let id = newReport.items('resultReport', 'id');
    reportUri = `/reports/reports/${id}`;

    // create src parameter for the iframe
    let options = "&appSwitcherDisabled=true&reportViewOnly=true&printEnabled=true&sharedEnabled=true&informationEnabled=true&commentEnabled=true&reportViewOnly=true";
    let href = `${appEnv.host}/SASReportViewer/?reportUri=${reportUri}${options}`;
   
    // save href in appEnv to use for displaying VA report in an iframe
    appEnv.href = href;
    console.log(href);
}

// Search the report folders for a report by name
async function getReport( store, reports, name ) {
    let payload = {
        qs: {
            filter: `eq(name,'${name}')`
        }
    }
    // call the reports service
    let reportsList = await store.apiCall(reports.links('reports'), payload);
    // check to see if atleast one report was found(hopefully one only)
    return (reportsList.itemsList().size === 0 ) ? null : reportsList; 
}