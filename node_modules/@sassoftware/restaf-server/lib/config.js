/*
 *  ------------------------------------------------------------------------------------
 *  * Copyright (c) SAS Institute Inc.
 *  *  Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  * http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *  Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  limitations under the License.
 * ----------------------------------------------------------------------------------------
 *
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parseDocker = _interopRequireDefault(require("./parseDocker"));

var _debug = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var fs = require('fs');

var configDebug = (0, _debug["default"])('config');

function config(appEnv, dockerFile) {
  if (dockerFile != null) {
    (0, _parseDocker["default"])(dockerFile);
  }

  if (appEnv != null) {
    iconfig(appEnv);
  }

  if (process.env.APPPORT == null && process.env.EXPOSEDPORT != null) {
    process.env.APPPORT = process.env.EXPOSEDPORT;
    console.log("APPPORT set to value of exposed port ".concat(process.env.APPPORT));
  }

  process.env.SAS_PROTOCOL = process.env.SAS_SSL_ENABLED === 'YES' ? 'https://' : 'http://'; // fixing usual user error of adding a space after the url

  var vserver = process.env.VIYA_SERVER;

  if (vserver != null) {
    vserver = vserver.trim();

    if (vserver.endsWith('/') === true) {
      vserver = vserver.substring(0, vserver.length - 1);
    }

    if (vserver.indexOf('http') < 0) {
      vserver = process.env.SAS_PROTOCOL + vserver;
    }
  }

  process.env.VIYA_SERVER = vserver;
}

function iconfig(appEnv) {
  try {
    var data = fs.readFileSync(appEnv, 'utf8');
    var d = data.split(/\r?\n/);
    d.forEach(function (l) {
      if (l.length > 0 && l.indexOf('#') === -1) {
        var la = l.split('=');
        var envName = la[0];

        if (la.length === 2 && la[1].length > 0) {
          process.env[envName] = la[1];
        }

        configDebug(la[1]);
      }
    });
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

var _default = config;
exports["default"] = _default;