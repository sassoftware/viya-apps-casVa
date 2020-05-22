/*
 *  ------------------------------------------------------------------------------------
 *  * Copyright (c) SAS Institute Inc.
 *  *  Licensed under the Apache License, Version 2.0 (the 'License');
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  * http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *  Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an 'AS IS' BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  limitations under the License.
 * ----------------------------------------------------------------------------------------
 *
 */
'use strict'; // import '@babel/polyfill';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iapp = iapp;
exports.icli = icli;

require("core-js/stable");

require("regenerator-runtime/runtime");

var _fs = _interopRequireDefault(require("fs"));

var _iService = _interopRequireDefault(require("./iService"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function icli(uTable, useDefault) {
  var argv = require('yargs').argv;

  var env = argv.env == null ? null : argv.env;
  var appenv = argv.appenv == null ? null : argv.appenv;
  var docker = argv.docker == null ? null : argv.docker;

  if (useDefault == null) {
    useDefault = true;
  }

  console.log("Configuration:\n          Dockerfile: ".concat(docker, "\n          env file  : ").concat(env, "\n          app env   : ").concat(appenv, "\n          "));
  iapp(appenv, env, docker, uTable, useDefault);
}

function iapp(appSrc, rafEnv, dockerFile, uTable, useDefault) {
  var asset = setup(rafEnv, dockerFile);

  if (appSrc === null) {
    appSrc = process.env.APPENV == null ? null : process.env.APPENV;
  }

  if (appSrc != null) {
    createPayload(appSrc, function (err, appEnv) {
      if (err) {
        console.log(err);
        console.log('createPayload failed');
        process.exit(1);
      } else {
        (0, _iService["default"])(uTable, useDefault, asset, appEnv);
      }
    });
  } else {
    var appEnv = getAllEnv(null);
    (0, _iService["default"])(uTable, useDefault, asset, appEnv);
  }
}

function setup(rafEnv, dockeFile) {
  (0, _config["default"])(rafEnv, dockeFile);
  var asset = process.env.APPLOC === '.' ? process.cwd() : process.env.APPLOC;
  process.env.APPASSET = asset;
  return asset;
}

function createPayload(srcName, cb) {
  var src = _fs["default"].readFileSync(srcName, 'utf8');

  if (src === null) {
    cb("Error: ".concat(srcName, " was not found. "));
  }

  try {
    // console.log(src);
    var f = new Function(src);
    console.log("".concat(srcName, " compile completed"));
    var r = f();
    f = null;
    var ar = getAllEnv(r);
    cb(null, ar);
  } catch (err) {
    console.log("".concat(srcName, " compile failed"));
    cb(err);
  }
}

function getAllEnv(userData) {
  var env;
  var l = null;
  var authflow = trimit('AUTHFLOW');

  if (authflow === 'authorization_code' || authflow === 'code') {
    authflow = 'server';
  }

  var redirect = "Set when clientid was created";
  var host = trimit('VIYA_SERVER');
  var clientID = trimit('CLIENTID');
  var keepAlive = trimit('KEEPALIVE');
  var appName = trimit('APPNAME');

  if (authflow === 'server' || authflow === 'implicit') {
    if (authflow === 'implicit') {
      redirect = trimit('REDIRECT');
      redirect = redirect == null ? "".concat(appName, "/callback") : "".concat(process.env.APPNAME, "/").concat(redirect);
    }

    ;
    l = {
      authType: authflow,
      redirect: redirect,
      host: host,
      clientID: clientID,
      appName: appName,
      keepAlive: null
    };
    if (authflow === 'server' && keepAlive !== null) l.keepAlive = "http://".concat(process.env.APPHOST, ":").concat(process.env.APPPORT, "/").concat(appName, "/keepAlive");
    console.log("Authorization configuration\n         ".concat(JSON.stringify(l, null, 4), "\n         ").concat(process.env.CLIENTSECRET, "\n       "));
  }

  env = l !== null ? "let LOGONPAYLOAD = ".concat(JSON.stringify(l), ";") : "let LOGONPAYLOAD=null;";

  if (userData !== null) {
    env += "let APPENV = ".concat(JSON.stringify(userData), ";");
  } else {
    env += "let APPENV = {none: 'none'};";
  }

  return env;
}

function trimit(e) {
  var a = process.env[e];
  return a == null ? null : a.trim();
}