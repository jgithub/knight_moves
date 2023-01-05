"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NextDirectionGuesserFactoryBruteForceImpl = void 0;
var NextDirectionGuesserBruteForceImpl_1 = require("./NextDirectionGuesserBruteForceImpl");
var inversify_1 = require("inversify");
require("reflect-metadata");
// TODO: Talk to Chris, Michael, Varley about existing naming conventions for interfaces vs implementation
/**
 * An implementation of the NextDirectionGuesserFactory contract that
 * constructs a NextDirectionGuesserBruteForceImpl implementation of
 * NextDirectionGuesser
 */
var NextDirectionGuesserFactoryBruteForceImpl = /** @class */ (function () {
    function NextDirectionGuesserFactoryBruteForceImpl() {
    }
    NextDirectionGuesserFactoryBruteForceImpl.prototype.build = function () {
        return new NextDirectionGuesserBruteForceImpl_1.NextDirectionGuesserBruteForceImpl();
    };
    NextDirectionGuesserFactoryBruteForceImpl = __decorate([
        (0, inversify_1.injectable)()
    ], NextDirectionGuesserFactoryBruteForceImpl);
    return NextDirectionGuesserFactoryBruteForceImpl;
}());
exports.NextDirectionGuesserFactoryBruteForceImpl = NextDirectionGuesserFactoryBruteForceImpl;
