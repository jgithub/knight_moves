import { NextDirectionGuesser } from './NextDirectionGuesser'

/**
 * Standardized factory Interface for creating objects that implement NextDirectionGuesser
 */

export interface NextDirectionGuesserFactory {
  build: () => NextDirectionGuesser
}
