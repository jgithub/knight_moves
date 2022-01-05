"use strict";
/**
 * Dependency Injection
 */
exports.__esModule = true;
var inversify_1 = require("inversify");
var diTypes_1 = require("./diTypes");
var NextDirectionGuesserFactoryBruteForceImpl_1 = require("./NextDirectionGuesserFactoryBruteForceImpl");
// import { NextDirectionGuesserFactorySlopeOfVectorImpl } from "./NextDirectionGuesserFactorySlopeOfVectorImpl";
var container = new inversify_1.Container();
// Use the brute-force impl for the mvp
container.bind(diTypes_1["default"].NextDirectionGuesserFactory).to(NextDirectionGuesserFactoryBruteForceImpl_1.NextDirectionGuesserFactoryBruteForceImpl);
// vs
// container.bind<NextDirectionGuesserFactory>(DI_TYPES.NextDirectionGuesserFactory).to(NextDirectionGuesserFactorySlopeOfVectorImpl);
exports["default"] = container;
