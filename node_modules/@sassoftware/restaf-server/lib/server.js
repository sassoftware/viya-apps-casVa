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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var fs = require('fs'); // let isDocker = require('is-docker');


var Hapi = require('@hapi/hapi');

var _require = require('should-send-same-site-none'),
    isSameSiteNoneCompatible = _require.isSameSiteNoneCompatible;

var debug = require('debug')('server');

function server(userRouterTable, asset, allAppEnv) {
  // process.env.APPHOST_ADDR = process.env.APPHOST;
  var isSameSite = 'None';
  var isSecure = false;

  if (process.env.SAMESITE != null) {
    var _process$env$SAMESITE = process.env.SAMESITE.split(','),
        _process$env$SAMESITE2 = _slicedToArray(_process$env$SAMESITE, 2),
        s1 = _process$env$SAMESITE2[0],
        s2 = _process$env$SAMESITE2[1];

    isSameSite = s1;
    isSecure = s2 === 'secure' ? true : false;
  }

  var sConfig = {
    port: process.env.APPPORT,
    host: process.env.APPHOST,
    state: {
      isSameSite: isSameSite,
      isSecure: isSecure,
      contextualize: function () {
        var _contextualize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(definition, request) {
          var userAgent;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  userAgent = request.headers['user-agent'] || false;

                  if (userAgent && isSameSiteNoneCompatible(userAgent)) {
                    definition.isSecure = isSecure;
                    definition.isSameSite = isSameSite;
                  }

                  request.response.vary('User-Agent');

                case 3:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function contextualize(_x, _x2) {
          return _contextualize.apply(this, arguments);
        }

        return contextualize;
      }()
    },

    /* debug   : {request: ['*']},*/
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
        additionalHeaders: ['multipart/form-data', 'content-disposition'],
        additionalExposedHeaders: ['location']
      }
    }
  };
  var tls = {};

  if (process.env.TLS_CERT != null) {
    tls.cert = fs.readFileSync(process.env.TLS_CERT);
  }

  if (process.env.TLS_CERT != null) {
    tls.key = fs.readFileSync(process.env.TLS_KEY);
  }

  if (process.env.TLS_CABUNDLE != null) {
    tls.CA = fs.readFileSync(process.env.TLS_CABUNDLE);
  }

  if (process.env.TLS_PFX != null) {
    tls.pfx = fs.readFileSync(process.env.TLS_PFX);
  }

  if (process.env.TLS_PW != null) {
    tls.passphrase = process.env.TLS_PW;
  }

  if (Object.keys(tls).length > 0) {
    sConfig.tls = tls;
  }

  if (asset !== null) {
    sConfig.routes.files = {
      relativeTo: asset
    };
  }

  debug(sConfig);
  var hapiServer = Hapi.server(sConfig);

  var init = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var pluginSpec, hh;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              pluginSpec = {
                plugin: require('./plugins/restafServer'),
                options: {
                  routes: userRouterTable,
                  appenv: allAppEnv,
                  isSameSite: isSameSite,
                  isSecure: isSecure
                }
              };
              _context2.next = 3;
              return hapiServer.register(pluginSpec);

            case 3:
              _context2.next = 5;
              return hapiServer.register({
                plugin: require('hapi-require-https'),
                options: {}
              });

            case 5:
              _context2.next = 7;
              return hapiServer.start();

            case 7:
              hh = hapiServer.info.uri.replace(/0.0.0.0/, 'localhost');
              console.log("Visit ".concat(hh, "/").concat(process.env.APPNAME));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function init() {
      return _ref.apply(this, arguments);
    };
  }();

  process.on('unhandledRejection', function (err) {
    console.log(err);
    process.exit(1);
  });
  debug(process.env.DEBUG);
  init();
}

var _default = server;
exports["default"] = _default;