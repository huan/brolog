/*!
 * Brolog JavaScript Library v0.2.0
 * https://github.com/zixia/brolog
 *
 * Copyright Zhuohuan LI <zixia@zixia.net>
 * Released under the ISC license
 * https://github.com/zixia/brolog/blob/master/LICENSE
 *
 * Date: 2016-07
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["SILENT"] = 0] = "SILENT";
        LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
        LogLevel[LogLevel["WARN"] = 2] = "WARN";
        LogLevel[LogLevel["INFO"] = 3] = "INFO";
        LogLevel[LogLevel["VERBOSE"] = 4] = "VERBOSE";
        LogLevel[LogLevel["SILLY"] = 5] = "SILLY";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    var Brolog = (function () {
        function Brolog() {
            console.log('constructor');
        }
        Brolog.prototype.level = function (levelName) { return Brolog.level(levelName); };
        Brolog.level = function (levelName) {
            if (levelName) {
                console.log('levelName: ' + levelName);
                // http://stackoverflow.com/a/21294925/1123955
                var logLevel = LogLevel[levelName.toUpperCase()];
                if (!logLevel) {
                    console.log(logLevel);
                    console.log(LogLevel);
                    throw new Error('level name error');
                }
                Brolog.logLevel = logLevel;
            }
            return LogLevel[Brolog.logLevel];
        };
        Brolog.prototype.log = function (levelTitle, prefix, message) { return Brolog.log(levelTitle, prefix, message); };
        Brolog.log = function (levelTitle, prefix, message) {
            var args = Array.prototype.slice.call(arguments, 3) || [];
            args.unshift(Brolog.timestamp() + ' ' + levelTitle + ' ' + prefix + ' ' + (message || ''));
            switch (levelTitle) {
                case 'ERR':
                    console.error.apply(console, args);
                    break;
                case 'WARN':
                    console.warn.apply(console, args);
                    break;
                case 'INFO':
                    console.info.apply(console, args);
                    break;
                default:
                case 'VERB':
                case 'SILL':
                    console.log.apply(console, args);
            }
        };
        Brolog.prototype.error = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return Brolog.error.apply(null, arguments);
        };
        Brolog.error = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Brolog.logLevel < LogLevel.ERROR) {
                return;
            }
            var argList = Array.prototype.slice.call(arguments);
            argList.unshift('ERR');
            Brolog.log.apply(null, argList);
        };
        Brolog.prototype.warn = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return Brolog.warn.apply(null, arguments);
        };
        Brolog.warn = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Brolog.logLevel < LogLevel.WARN) {
                return;
            }
            var argList = Array.prototype.slice.call(arguments);
            argList.unshift('WARN');
            Brolog.log.apply(null, argList);
        };
        Brolog.prototype.info = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return Brolog.info.apply(null, arguments);
        };
        Brolog.info = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Brolog.logLevel < LogLevel.INFO) {
                return;
            }
            var argList = Array.prototype.slice.call(arguments);
            argList.unshift('INFO');
            Brolog.log.apply(null, argList);
        };
        Brolog.prototype.verbose = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return Brolog.verbose.apply(null, arguments);
        };
        Brolog.verbose = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Brolog.logLevel < LogLevel.VERBSOE) {
                return;
            }
            var argList = Array.prototype.slice.call(arguments);
            argList.unshift('VERB');
            Brolog.log.apply(null, argList);
        };
        Brolog.prototype.silly = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return Brolog.silly.apply(null, arguments);
        };
        Brolog.silly = function (prefix) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (Brolog.logLevel < LogLevel.SILLY) {
                return;
            }
            var argList = Array.prototype.slice.call(arguments);
            argList.unshift('SILL');
            Brolog.log.apply(null, argList);
        };
        Brolog.timestamp = function () {
            var date = new Date();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var stampStr = '';
            stampStr += (sec < 10) ? ('0' + sec) : sec;
            stampStr += ':';
            stampStr += (min < 10) ? ('0' + min) : min;
            stampStr += ':';
            stampStr += (hour < 10) ? ('0' + hour) : hour;
            return stampStr;
        };
        return Brolog;
    }());
    Brolog.logLevel = LogLevel.INFO;
    exports.Brolog = Brolog;
    exports.log = new Brolog();
    exports["default"] = exports.log;
});
