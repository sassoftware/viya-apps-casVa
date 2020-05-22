/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _codeAuth = _interopRequireDefault(require("./codeAuth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// handle all callback
function appCallback(_x, _x2) {
  return _appCallback.apply(this, arguments);
}

function _appCallback() {
  _appCallback = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, h) {
    var debug, indexHTML;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            debug = require('debug')('callback');
            console.log("..... AUTHFLOW: ".concat(process.env.AUTHFLOW));
            debug('passing thru appCallback'); // if authorization code process the auth info from saslogon via SASauth

            if (!(process.env.AUTHFLOW === 'authorization_code' || process.env.AUTHFLOW === 'code')) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", (0, _codeAuth["default"])(req, h));

          case 7:
            indexHTML = process.env.APPENTRY == null ? 'index.html' : process.env.APPENTRY;
            console.log("Redirecting to default ".concat(indexHTML));
            return _context.abrupt("return", h.file("".concat(indexHTML)));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _appCallback.apply(this, arguments);
}

var _default = appCallback;
exports["default"] = _default;