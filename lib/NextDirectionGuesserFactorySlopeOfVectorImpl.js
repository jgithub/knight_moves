"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NextDirectionGuesserFactorySlopeOfVectorImpl = void 0;
var NextDirectionGuesserBruteForceImpl_1 = require("./NextDirectionGuesserBruteForceImpl");
var inversify_1 = require("inversify");
require("reflect-metadata");
// TODO: Talk to Arqu about preferred naming conventions (interfaces vs implementation here)
// For what it's worth, historically we have allowed long IMPLEMENTATION names because
// something like NextDirectionGuesserFactorySlopeOfVectorImpl is long and ugly
// which means it should be used rarely.  `Impls` should show up sparingly in factories, and not anywhere else in code
//  If you see Impl all over the place, something is failing the smell test
var NextDirectionGuesserFactorySlopeOfVectorImpl = /** @class */ (function () {
    function NextDirectionGuesserFactorySlopeOfVectorImpl() {
    }
    NextDirectionGuesserFactorySlopeOfVectorImpl.prototype.build = function () {
        return new NextDirectionGuesserBruteForceImpl_1.NextDirectionGuesserBruteForceImpl();
    };
    NextDirectionGuesserFactorySlopeOfVectorImpl = __decorate([
        (0, inversify_1.injectable)()
    ], NextDirectionGuesserFactorySlopeOfVectorImpl);
    return NextDirectionGuesserFactorySlopeOfVectorImpl;
}());
exports.NextDirectionGuesserFactorySlopeOfVectorImpl = NextDirectionGuesserFactorySlopeOfVectorImpl;
