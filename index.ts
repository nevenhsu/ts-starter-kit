import _ from 'lodash'
import logger from 'utils/logger'
import env from 'utils/env'
import { terminate, wait } from 'utils/helper'

exec()

function exec() {}

const exitHandler = terminate(err => {
  logger.error(err)
})

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))
