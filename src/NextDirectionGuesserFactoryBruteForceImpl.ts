import { NextDirectionGuesserFactory } from './NextDirectionGuesserFactory'
import { NextDirectionGuesser } from './NextDirectionGuesser'
import { NextDirectionGuesserBruteForceImpl } from './NextDirectionGuesserBruteForceImpl'
import { injectable } from 'inversify'
import 'reflect-metadata'

// TODO: Talk to Chris, Michael, Varley about existing naming conventions for interfaces vs implementation

/**
 * An implementation of the NextDirectionGuesserFactory contract that
 * constructs a NextDirectionGuesserBruteForceImpl implementation of
 * NextDirectionGuesser
 */

@injectable()
export class NextDirectionGuesserFactoryBruteForceImpl implements NextDirectionGuesserFactory {
  public build (): NextDirectionGuesser {
    return new NextDirectionGuesserBruteForceImpl()
  }
}
