require('dotenv').config()

/**
 * Logger for the "Knight Moves Project"
 * Has similar interface to log4js logger
 *
 * TODO:  Consider aggregating a log4js-node logger instance herein
 */

export class KmLogger {
  /**
   * Name of this logger
   */
  private readonly m_loggerName: string
  private readonly m_traceEnabledFlag: boolean
  private readonly m_debugEnabledFlag: boolean
  private readonly m_infoEnabledFlag: boolean
  private readonly m_warnEnabledFlag: boolean

  private constructor (loggerName: string) {
    this.m_loggerName = loggerName
    const LOGGING_ENABLED_FLAG: boolean = process.env.LOGGING_ENABLED_FLAG != null ? ['true', 't', '1', 'yes', 'y'].includes(process.env.LOGGING_ENABLED_FLAG) : false
    this.m_traceEnabledFlag = false
    this.m_debugEnabledFlag = LOGGING_ENABLED_FLAG
    this.m_infoEnabledFlag = LOGGING_ENABLED_FLAG
    this.m_warnEnabledFlag = LOGGING_ENABLED_FLAG
  }

  // TODO: Create KMLoggerFactory
  public static getLogger (loggerName: string) {
    return new KmLogger(loggerName)
  }

  // TODO: replace with log4js and named loggers
  public trace (msg: any, ...args: any[]): void {
    if (this.m_traceEnabledFlag) {
      if (args.length > 0) {
        console.log(`${this.m_loggerName}.${msg}`, args)
      } else {
        console.log(`${this.m_loggerName}.${msg}`)
      }
    }
  }

  public debug (msg: any, ...args: any[]): void {
    if (this.m_debugEnabledFlag) {
      if (args.length > 0) {
        console.log(`${this.m_loggerName}.${msg}`, args)
      } else {
        console.log(`${this.m_loggerName}.${msg}`)
      }
    }
  }

  public info (msg: any, ...args: any[]): void {
    if (this.m_infoEnabledFlag) {
      if (args.length > 0) {
        console.info(`${this.m_loggerName}.${msg}`, args)
      } else {
        console.info(`${this.m_loggerName}.${msg}`)
      }
    }
  }

  public warn (msg: any, ...args: any[]): void {
    if (this.m_warnEnabledFlag) {
      if (args.length > 0) {
        console.warn(`${this.m_loggerName}.${msg}`, args)
      } else {
        console.warn(`${this.m_loggerName}.${msg}`)
      }
    }
  }
}
