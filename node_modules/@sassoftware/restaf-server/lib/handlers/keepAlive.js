/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict'; // primarly to do a keepAlive of sasLogon

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function keepAlive(_x, _x2) {
  return _keepAlive.apply(this, arguments);
}

function _keepAlive() {
  _keepAlive = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, h) {
    var SASLogon;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            SASLogon = "".concat(process.env.VIYA_SERVER, "/SASLogon/");
            return _context.abrupt("return", h.response().redirect(SASLogon).code(302));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _keepAlive.apply(this, arguments);
}

var _default = keepAlive;
exports["default"] = _default;