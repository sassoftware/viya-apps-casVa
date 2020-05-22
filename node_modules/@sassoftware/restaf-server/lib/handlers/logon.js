"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
var debug = require('debug')('logon');

function logon(_x, _x2) {
  return _logon.apply(this, arguments);
}

function _logon() {
  _logon = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, h) {
    var x, redirectUri, url, indexHTML;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            debug('redirect', process.env.REDIRECT);
            debug('authflow', process.env.AUTHFLOW);

            if (!(process.env.AUTHFLOW === 'implicit')) {
              _context.next = 9;
              break;
            }

            x = "".concat(process.env.VIYA_SERVER, "/SASLogon/oauth/authorize?response_type=token&client_id=").concat(process.env.CLIENTID);
            redirectUri = "http://".concat(process.env.APPHOST, ":").concat(process.env.APPPORT, "/callback?host=").concat(process.env.VIYA_SERVER);
            url = "".concat(x, "&redirect_uri=").concat(redirectUri);
            return _context.abrupt("return", h.redirect(url));

          case 9:
            indexHTML = process.env.APPENTRY == null ? 'index.html' : process.env.APPENTRY;
            console.log("Redirecting to default ".concat(indexHTML));
            return _context.abrupt("return", h.file(indexHTML));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _logon.apply(this, arguments);
}

var _default = logon;
exports["default"] = _default;