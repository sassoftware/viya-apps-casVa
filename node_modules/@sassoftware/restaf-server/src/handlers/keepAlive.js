/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';

// primarly to do a keepAlive of sasLogon
async function keepAlive (req,h) {
   let SASLogon = `${process.env.VIYA_SERVER}/SASLogon/`;
   return h.response().redirect(SASLogon).code(302);
}
export default keepAlive;