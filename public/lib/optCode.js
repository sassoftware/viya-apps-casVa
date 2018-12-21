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

// A sample optimization for demonstration purposes only
  
 function optCode(budget, appEnv) {
    let pgm = `
    set PROCESSES={1..4};
    set PRODUCTS={'choco','toffee'};
    var Qty{PRODUCTS} >= 0;
    num cost{PRODUCTS,PROCESSES};
    num budget=${budget};
    /* read data */
    read data ${appEnv.cost.caslib}.${appEnv.cost.table}
    into [product process]
    cost;
    maximize profit = 0.25*Qty['choco'] + 0.75*Qty['toffee'];
    /* subject to constraints */
    con Budget_Constraint{prc in PROCESSES}:
    sum {prd in PRODUCTS} cost[prd,prc]*Qty[prd]<=budget;
    solve with lp / solver = primal_spx;
    /* create output */
    create data ${appEnv.work.caslib}.${appEnv.work.table}
    from [products]
    Qty.Sol;	
    `;
    return pgm;
 }