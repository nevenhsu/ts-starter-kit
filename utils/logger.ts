import { join } from 'path'
import { createLogger, format, transports } from 'winston'

const { combine, timestamp, splat, json, colorize, simple } = format
const toLogPath = (filename: string) => join(__dirname, '../../log', filename)

const customFormat = format((info, opts) => {
  let { message, stack, ...rest } = info
  if (info instanceof Error) {
    // An error object is not 100% like a normal object, so
    // we have to jump through hoops to get needed info out
    // of error objects for logging.
    message = `${message} ${stack}`

    return {
      ...rest,
      message,
    }
  }
  return info
})

const logger = createLogger({
  level: 'info',
  format: combine(
    customFormat(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    splat(),
    json()
  ),
  defaultMeta: { service: 'uni_v3' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({
      filename: toLogPath('error.log'),
      level: 'error',
      maxsize: 1000000,
      maxFiles: 10,
    }),
    new transports.File({
      filename: toLogPath('combined.log'),
      maxsize: 1000000,
      maxFiles: 10,
    }),
    new transports.Console({
      format: combine(colorize(), simple()),
    }),
  ],
})

export default logger

// test()

function test() {
  // ***************
  // Allows for JSON logging
  // ***************

  logger.log({
    level: 'info',
    message: 'Pass an object and this works',
    additional: 'properties',
    are: 'passed along',
  })

  logger.info('Use a helper method if you want')

  // ***************
  // Allows for parameter-based logging
  // ***************

  logger.log('info', 'Pass a message and this works', {
    additional: 'properties',
    are: 'passed along',
  })

  logger.info('Use a helper method if you want', {
    additional: 'properties',
    are: 'passed along',
  })

  // ***************
  // Allows for string interpolation
  // ***************

  // info: test message my string {}
  logger.log('info', 'test message %s', 'my string')

  // info: test message my 123 {}
  logger.log('info', 'test message %d', 123)

  // info: test message first second {number: 123}
  logger.log('info', 'test message %s, %s', 'first', 'second', { number: 123 })

  // prints "Found error at %s"
  logger.info('Found %s at %s', 'error', new Date())
  logger.info('Found %s at %s', 'error', new Error('chill winston'))
  logger.info('Found %s at %s', 'error', /WUT/)
  logger.info('Found %s at %s', 'error', true)
  logger.info('Found %s at %s', 'error', 100.0)
  logger.info('Found %s at %s', 'error', ['1, 2, 3'])

  // ***************
  // Allows for logging Error instances
  // ***************

  logger.warn(new Error('Error passed as info'))
  logger.log('error', new Error('Error passed as message'))

  logger.warn('Maybe important error: %s', new Error('Error passed as meta'))
  logger.log('error', 'Important error: ', new Error('Error passed as meta'))

  logger.error(new Error('Error as info'))
}
