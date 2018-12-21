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
function genCode(budget, appEnv) {

	let pgm = optCode(budget, appEnv)
    let caslStatements = `

	    action table.dropTable/
			caslib='${appEnv.work.caslib}' name='${appEnv.work.table}' quiet=TRUE;
		
			
		action table.deletesource / 
		   caslib='${appEnv.work.caslib}' source='${appEnv.work.table}.sashdat' quiet=TRUE;
		

	    /* Assumption: All necessary input tables are in memory */
		pgm = "${pgm}";
		
		loadactionset 'optimization';
			action optimization.runOptmodel / 
			code=pgm printlevel=0; 
			run; 
		
		/* save result of optimization for VA to use */
		action table.save /
			caslib  = '${appEnv.work.caslib}'
			name    = '${appEnv.work.table}'
			replace = TRUE
			table= {
				caslib = '${appEnv.work.caslib}'
				name   = '${appEnv.work.table}'
			};

		/* fetch results to return for the UI to display */
		action table.fetch r=result /
			table= {caslib = '${appEnv.work.caslib}' name = '${appEnv.work.table}'};
		run;

		/* drop the table to force report to reload the new table */
		action table.dropTable/
			caslib='${appEnv.work.caslib}' name='${appEnv.work.table}' quiet=TRUE;
	
		send_response(result);
		run;
		`
	return caslStatements;
}


