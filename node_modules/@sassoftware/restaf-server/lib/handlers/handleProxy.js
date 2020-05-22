/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var debug = require('debug');

var debugProxy = debug('proxy');
var proxyLogger = debug('proxylogger');
var responseLogger = debug('response');

var boom = require('@hapi/boom'); // let request = require('request');
//
// Warning: This section is here for historical reasons since authorization_code works
// properly since the first maintenance of Viya 3.5
//


function handleProxy(_x, _x2) {
  return _handleProxy.apply(this, arguments);
}

function _handleProxy() {
  _handleProxy = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, h) {
    var token, proxyResponse, response, hkey;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return getToken(req, h);

          case 3:
            token = _context.sent;
            _context.next = 6;
            return handleProxyRequest(req, h, token);

          case 6:
            proxyResponse = _context.sent;
            response = h.response(proxyResponse.body);

            for (hkey in proxyResponse.headers) {
              response.header(hkey, proxyResponse.headers[hkey]);
            }

            return _context.abrupt("return", response);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", boom.unauthorized(_context.t0));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));
  return _handleProxy.apply(this, arguments);
}

function getToken(_x3, _x4) {
  return _getToken.apply(this, arguments);
}

function _getToken() {
  _getToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, h) {
    var sid;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(req.auth.credentials !== null)) {
              _context2.next = 4;
              break;
            }

            return _context2.abrupt("return", req.auth.credentials.token);

          case 4:
            _context2.next = 6;
            return req.server.app.cache.get(sid);

          case 6:
            sid = _context2.sent;
            return _context2.abrupt("return", sid.credentials);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getToken.apply(this, arguments);
}

function handleProxyRequest(_x5, _x6, _x7) {
  return _handleProxyRequest.apply(this, arguments);
}
/*
function handleProxyRequest (req, h, token) {
    return new Promise((resolve, reject) => {
        
       // let uri = `${process.env.SAS_PROTOCOL}${process.env.VIYA_SERVER}/${req.params.params}`;
        let uri = `${process.env.VIYA_SERVER}/${req.params.params}`;
        let headers = { ...req.headers };
        delete headers.host;
        delete headers['user-agent'];
        delete headers.origin;
        delete headers.referer;
        delete headers.connection;
        if (headers.cookie) {
            delete headers.cookie;
        }
        
        let config = {
            url    : uri,
            method : req.method,
            headers: headers,
            gzip   : true,
            auth   : {
                bearer: token
            }
        };


        if (req.payload != null) {
            // debugProxy(headers['content-type']);
            if (headers['content-type'] === 'application/octet-stream') {
                config.body = req.payload;
            } else {
                config.body = (typeof req.payload === 'object') ? JSON.stringify(req.payload) : req.payload;
            }
        }

        if (req.query !== null && Object.keys(req.query).length > 0) {
            config.qs = req.query;
        }

        debugProxy(JSON.stringify(config, null, 4));
        proxyLogger(config.url);
        
        request(config, (err, response, body) => {
            
            if (err) {
                reject(err);
            } else {
                
                responseLogger({ url: `------------------------------------------${config.url}` });
                responseLogger(req.query);
                responseLogger((typeof body === 'string' ? { body: body } : body));
                // eslint-disable-next-line no-prototype-builtins
                if (response.headers.hasOwnProperty('content-encoding')) {
                    delete response.headers['content-encoding'];
                }
                responseLogger(response.headers['content-coding']);
                
                resolve({ headers: response.headers, body: body });

            }
        });
        
    });
   
}
*/


function _handleProxyRequest() {
  _handleProxyRequest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, h, token) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            throw 'Proxy Handling temporarily disabled';

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _handleProxyRequest.apply(this, arguments);
}

var _default = handleProxy;
exports["default"] = _default;