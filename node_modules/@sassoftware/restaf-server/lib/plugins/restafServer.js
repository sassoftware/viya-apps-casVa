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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var inert = require('@hapi/inert'),
    vision = require('@hapi/vision');

var NodeCache = require("node-cache-promise");

var SASauth = require('./SASauth'); //  WebpackPlugin = require('hapi-webpack-plugin'),/* for hot restart */


exports.plugin = {
  name: 'restafServer',
  version: '1.0.0',
  register: appServer
};

function appServer(_x, _x2) {
  return _appServer.apply(this, arguments);
}

function _appServer() {
  _appServer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(server, options) {
    var routes, appenv, p, nodeCacheOptions, storeCache;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            routes = options.routes, appenv = options.appenv;
            process.env.APPHOST_ADDR = process.env.APPHOST;

            if (!(process.env.AUTHFLOW === 'authorization_code' || process.env.AUTHFLOW === 'code')) {
              _context.next = 6;
              break;
            }

            p = {
              plugin: SASauth,
              options: {
                isSameSite: options.isSameSite,
                isSecure: options.isSecure
              }
            };
            _context.next = 6;
            return server.register(p);

          case 6:
            _context.next = 8;
            return server.register([inert, vision]);

          case 8:
            server.route(routes);
            nodeCacheOptions = {
              stdTTL: 36000,
              checkPeriod: 3600,
              errorOnMissing: true,
              useClones: false,
              deleteOnExpire: true
            };
            storeCache = new NodeCache(nodeCacheOptions);
            server.app.cache = storeCache;

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _appServer.apply(this, arguments);
}

;