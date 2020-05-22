/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var debug = require('debug')('logout');

function logout(_x, _x2) {
  return _logout.apply(this, arguments);
}

function _logout() {
  _logout = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, h) {
    var q, hh, callbackUrl, url, credentials, sid;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            q = req.query;
            debug(req.state);
            hh = req.server.info.uri.replace(/0.0.0.0/, 'localhost');
            callbackUrl = "".concat(hh, "/").concat(process.env.APPNAME);

            if (q.callbackUrl != null) {
              callbackUrl = "".concat(callbackUrl, "/").concat(q.callbackUrl);
            }

            ;
            url = "".concat(process.env.VIYA_SERVER, "/SASLogon/logout.do?callbackUrl=").concat(callbackUrl);

            if (!(process.env.AUTHFLOW === 'code' || process.env.AUTHFLOW === 'authorization_code')) {
              _context.next = 19;
              break;
            }

            credentials = req.auth.credentials;
            debug(credentials);

            if (!(credentials != null)) {
              _context.next = 18;
              break;
            }

            sid = credentials.sid;
            debug(sid);
            _context.next = 15;
            return req.server.app.cache.del(sid);

          case 15:
            req.cookieAuth.clear('authCookie');
            _context.next = 19;
            break;

          case 18:
            console.log('Warning: No cookie returned by the browser - probably related to sameSite settings');

          case 19:
            return _context.abrupt("return", h.redirect(url).unstate('authCookie'));

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _logout.apply(this, arguments);
}

function ViyaLogout() {
  return _ViyaLogout.apply(this, arguments);
}

function _ViyaLogout() {
  _ViyaLogout = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var p, r;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            p = {
              method: 'GET',
              url: "".concat(process.env.VIYA_SERVER, "/SASLogon/logout")
            };
            _context2.next = 3;
            return (0, _axios["default"])(p);

          case 3:
            r = _context2.sent;
            debug(r);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ViyaLogout.apply(this, arguments);
}

var _default = logout;
exports["default"] = _default;