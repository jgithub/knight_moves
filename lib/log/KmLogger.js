"use strict";
exports.__esModule = true;
exports.KmLogger = void 0;
require('dotenv').config();
/**
 * Logger for the "Knight Moves Project"
 * Has similar interface to log4js logger
 *
 * TODO:  Consider aggregating a log4js-node logger instance herein
 */
var KmLogger = /** @class */ (function () {
    function KmLogger(loggerName) {
        this.m_loggerName = loggerName;
        var LOGGING_ENABLED_FLAG = process.env.LOGGING_ENABLED_FLAG != null ? ['true', 't', '1', 'yes', 'y'].includes(process.env.LOGGING_ENABLED_FLAG) : false;
        this.m_traceEnabledFlag = false;
        this.m_debugEnabledFlag = LOGGING_ENABLED_FLAG;
        this.m_infoEnabledFlag = LOGGING_ENABLED_FLAG;
        this.m_warnEnabledFlag = LOGGING_ENABLED_FLAG;
    }
    // TODO: Create KMLoggerFactory
    KmLogger.getLogger = function (loggerName) {
        return new KmLogger(loggerName);
    };
    // TODO: replace with log4js and named loggers
    KmLogger.prototype.trace = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.m_traceEnabledFlag) {
            if (args.length > 0) {
                console.log("".concat(this.m_loggerName, ".").concat(msg), args);
            }
            else {
                console.log("".concat(this.m_loggerName, ".").concat(msg));
            }
        }
    };
    KmLogger.prototype.debug = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.m_debugEnabledFlag) {
            if (args.length > 0) {
                console.log("".concat(this.m_loggerName, ".").concat(msg), args);
            }
            else {
                console.log("".concat(this.m_loggerName, ".").concat(msg));
            }
        }
    };
    KmLogger.prototype.info = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.m_infoEnabledFlag) {
            if (args.length > 0) {
                console.info("".concat(this.m_loggerName, ".").concat(msg), args);
            }
            else {
                console.info("".concat(this.m_loggerName, ".").concat(msg));
            }
        }
    };
    KmLogger.prototype.warn = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.m_warnEnabledFlag) {
            if (args.length > 0) {
                console.warn("".concat(this.m_loggerName, ".").concat(msg), args);
            }
            else {
                console.warn("".concat(this.m_loggerName, ".").concat(msg));
            }
        }
    };
    return KmLogger;
}());
exports.KmLogger = KmLogger;
