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

 //
 // This structure is available in your app as APPENV script variable if you include the following script
 // <script  src='/appenv'><script>
 // For more details on this see the README file in https://github.com/sassoftware/restaf-server
 //

let env =  {
    cost: {
        caslib: `${process.env.COSTCASLIB}`,
        table : `${process.env.COSTNAME}`
    },
    template: {
        caslib: `${process.env.TEMPLATECASLIB}`,
        table : `${process.env.TEMPLATETABLE}`,
        report: `${process.env.TEMPLATEREPORT}`,
    },
    work: {
        caslib: `${process.env.WORKCASLIB}`,
        table:  `${process.env.WORKTABLE}`,
        report: `${process.env.WORKREPORT}`
    },

    host: `${process.env.VIYA_SERVER}`
};
return env;

