/**
 * Dependency Injection
 */

import { Container } from 'inversify'
import DI_TYPES from './diTypes'
import { NextDirectionGuesserFactory } from './NextDirectionGuesserFactory'
import { NextDirectionGuesserFactoryBruteForceImpl } from './NextDirectionGuesserFactoryBruteForceImpl'
// import { NextDirectionGuesserFactorySlopeOfVectorImpl } from "./NextDirectionGuesserFactorySlopeOfVectorImpl";

const container = new Container()
// Use the brute-force impl for the mvp
container.bind<NextDirectionGuesserFactory>(DI_TYPES.NextDirectionGuesserFactory).to(NextDirectionGuesserFactoryBruteForceImpl)
// vs
// container.bind<NextDirectionGuesserFactory>(DI_TYPES.NextDirectionGuesserFactory).to(NextDirectionGuesserFactorySlopeOfVectorImpl);

export default container
