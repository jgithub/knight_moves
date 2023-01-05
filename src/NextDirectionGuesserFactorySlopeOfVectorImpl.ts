import { NextDirectionGuesserFactory } from './NextDirectionGuesserFactory'
import { NextDirectionGuesser } from './NextDirectionGuesser'
import { NextDirectionGuesserBruteForceImpl } from './NextDirectionGuesserBruteForceImpl'
import { injectable } from 'inversify'
import 'reflect-metadata'

// TODO: Talk to Arqu about preferred naming conventions (interfaces vs implementation here)
// For what it's worth, historically we have allowed long IMPLEMENTATION names because
// something like NextDirectionGuesserFactorySlopeOfVectorImpl is long and ugly
// which means it should be used rarely.  `Impls` should show up sparingly in factories, and not anywhere else in code
//  If you see Impl all over the place, something is failing the smell test

@injectable()
export class NextDirectionGuesserFactorySlopeOfVectorImpl implements NextDirectionGuesserFactory {
  public build (): NextDirectionGuesser {
    return new NextDirectionGuesserBruteForceImpl()
  }
}
