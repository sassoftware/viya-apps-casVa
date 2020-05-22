/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var parser = require('docker-file-parser');

var fs = require('fs');

function parseDocker(dockerFile) {
  ;
  var d = fs.readFileSync(dockerFile, 'utf8');
  var data = parser.parse(d);
  data.forEach(function (d) {
    if (d.name === 'EXPOSE') {
      process.env.EXPOSEDPORT = d.args[0];
      console.log("Exposed port: ".concat(process.env.EXPOSEDPORT));
    } else if (d.name === 'ENV') {
      for (var key in d.args) {
        var v = d.args[key];

        if (v.length === 0) {
          console.log("Value for ".concat(key, " inherited as ").concat(process.env[key]));
        } else {
          process.env[key] = v;
        }
      }
    }
  });
}

var _default = parseDocker;
exports["default"] = _default;