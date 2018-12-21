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
async function vaSetup(store, session, services, appEnv) {
    // create casl statements
    let casl = `
        /* Drop the table in memory */
        action table.dropTable/
        caslib='${appEnv.work.caslib}' name='${appEnv.work.table}' quiet=TRUE;

        /* Delete the table from the source */
        action table.deletesource / 
        caslib='${appEnv.work.caslib}' source='${appEnv.work.table}.sashdat' quiet=TRUE;

        /* Run data step to copy the template table to worklib */
        action datastep.runCode /
            code='
            data ${appEnv.work.caslib}.${appEnv.work.table}; 
            set ${appEnv.template.caslib}.${appEnv.template.table};
            run;';
        
        /* Save the new work table */
        action table.save /
            caslib  = '${appEnv.work.caslib}'
            name    = '${appEnv.work.table}'
            replace = TRUE
            table= {
                caslib = '${appEnv.work.caslib}'
                name   = '${appEnv.work.table}'
            };
            
        /* Drop the table to force report to reload the new table */
        action table.dropTable/
            caslib='${appEnv.work.caslib}' name='${appEnv.work.table}' quiet=TRUE;
        
       
    `;

    // run casl statements on the server
    let payload = {
        action: 'sccasl.runCasl',
        data: {code: casl}
    }
    await store.runAction(session, payload);

    // Create temporary copy of the template report
    await reportViewer(store, services, appEnv);
    return true;
}