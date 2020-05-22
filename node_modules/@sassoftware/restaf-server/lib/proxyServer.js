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
'use strict'; // proxy server

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var os = require('os');

var Hapi = require('@hapi/hapi'),
    h2o2 = require('@hapi/h2o2');

function proxyServer() {
  var host = process.env.VHOST === '*' ? os.hostname() : process.env.VHOST;
  var sConfig = {
    port: 8080,
    host: host,
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
        additionalHeaders: ['multipart/form-data', 'content-disposition'],
        additionalExposedHeaders: ['location']
      }
    }
  };
  var hapiServer = Hapi.server(sConfig);

  var init = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var route, uri;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return hapiServer.register([h2o2]);

            case 2:
              route = {
                method: '*',
                path: '/{param*}',
                vhost: process.env.VHOST,
                handler: {
                  proxy: {
                    host: process.env.APPHOST,
                    port: process.env.APPPORT,
                    protocol: 'http',
                    passThrough: true
                  }
                }
              };
              console.log(route);
              hapiServer.route(route);
              _context.next = 7;
              return hapiServer.start();

            case 7:
              console.log("Visit ".concat(hapiServer.info.uri, "/documentation for documentation on the API"));
              uri = hapiServer.info.uri; // Need to do this for docker deployment

              if (hapiServer.info.host === '0.0.0.0') {
                uri = "".concat(hapiServer.info.protocol, "://localhost:").concat(hapiServer.info.port);
              }

              console.log("To access application visit ".concat(uri, "/").concat(process.env.APPNAME));

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function init() {
      return _ref.apply(this, arguments);
    };
  }();

  process.on('unhandledRejection', function (err) {
    console.log(err);
    console.log('unhandled exception');
    process.exit(2);
  });
  init();
}

var _default = proxyServer;
exports["default"] = _default;