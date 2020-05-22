/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _setCookies = _interopRequireDefault(require("./setCookies"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var debug = require('debug')('getapp');

function codeAuth(_x, _x2) {
  return _codeAuth.apply(this, arguments);
}

function _codeAuth() {
  _codeAuth = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, h) {
    var indexHTML;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            debug('passing thru codeAuth');
            debug(req.state);
            _context.next = 4;
            return (0, _setCookies["default"])(req, h);

          case 4:
            indexHTML = process.env.APPENTRY == null ? 'index.html' : process.env.APPENTRY; // return h.redirect(`/${process.env.APPNAME}/${indexHTML}`);

            return _context.abrupt("return", h.file(indexHTML));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _codeAuth.apply(this, arguments);
}

var _default = codeAuth;
exports["default"] = _default;