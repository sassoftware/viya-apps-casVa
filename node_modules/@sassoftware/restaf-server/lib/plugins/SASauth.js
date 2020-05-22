"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
var bell = require('@hapi/bell'),
    // eslint-disable-next-line no-unused-vars
uuid = require('uuid'),
    cookie = require('@hapi/cookie');

var debug = require('debug');

var debugbell = debug('bell');
var debugCookie = debug('cookie');
var debugloc = debug('loc');
exports.plugin = {
  name: 'SASauth',
  version: '1.0.0',
  register: iSASauth
};

function iSASauth(_x, _x2) {
  return _iSASauth.apply(this, arguments);
}

function _iSASauth() {
  _iSASauth = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(hapiServer, options) {
    var authCookieOptions, bellAuthOptions, provider, getLocation, authURL;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            authCookieOptions = {
              cookie: {
                password: uuid.v4(),
                name: 'authCookie',
                domain: process.env.APPHOST,
                isSecure: options.isSecure,
                isSameSite: options.isSameSite
              },
              validateFunc: function () {
                var _validateFunc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, session) {
                  var sid, credentials, cred;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          // https://hapi.dev/module/cookie/api/?v=11.0.1
                          ;
                          debugCookie('------------------------------------------------');
                          sid = session.sid;
                          /* set in getAuthApp */

                          debugCookie(sid);
                          _context.next = 6;
                          return req.server.app.cache.get(sid);

                        case 6:
                          credentials = _context.sent;
                          debugCookie(credentials);
                          cred = {
                            valid: credentials != null ? true : false,
                            credentials: credentials,
                            sid: sid
                          };
                          debugCookie('------------------------------------------------');
                          return _context.abrupt("return", cred);

                        case 11:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                function validateFunc(_x3, _x4) {
                  return _validateFunc.apply(this, arguments);
                }

                return validateFunc;
              }()
            };

            getLocation = function getLocation(req) {
              var route = process.env.REDIRECT == null ? "/".concat(process.env.APPNAME) : '/' + process.env.REDIRECT;
              var info = req.server.info;
              debugloc(req.server.info);
              var location = info.uri + route; // Need to do this for docker deployment

              if (info.host === '0.0.0.0') {
                location = "".concat(info.protocol, "://localhost:").concat(info.port).concat(route);
              }

              debugloc(location);
              return location;
            };

            if (!(process.env.AUTHFLOW == 'authorization_code' || process.env.AUTHFLOW === 'code')) {
              _context3.next = 13;
              break;
            }

            authURL = process.env.VIYA_SERVER;
            provider = {
              name: 'sas',
              protocol: 'oauth2',
              useParamsAuth: false,
              auth: authURL + '/SASLogon/oauth/authorize',
              token: authURL + '/SASLogon/oauth/token',
              profileMethod: 'get',
              profile: function () {
                var _profile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(credentials, params, get) {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          ;
                          debugbell('processing bell profile..........................');
                          debugbell(credentials);
                          debugbell(params);
                          debugbell(get);
                          debugbell('processing bell profile..........................');

                        case 6:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                function profile(_x5, _x6, _x7) {
                  return _profile.apply(this, arguments);
                }

                return profile;
              }()
            };
            bellAuthOptions = {
              provider: provider,
              password: uuid.v4(),
              clientId: process.env.CLIENTID.trim(),
              clientSecret: process.env.CLIENTSECRET == null ? ' ' : process.env.CLIENTSECRET,

              /*location    : getLocation,*/
              isSecure: false
            };
            _context3.next = 8;
            return hapiServer.register(bell);

          case 8:
            _context3.next = 10;
            return hapiServer.register(cookie);

          case 10:
            hapiServer.auth.strategy('session', 'cookie', authCookieOptions);
            hapiServer.auth.strategy('sas', 'bell', bellAuthOptions);
            hapiServer.auth["default"]('session');

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _iSASauth.apply(this, arguments);
}