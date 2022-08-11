import _ from 'lodash'

const env = {
  // ENV & ETH
  timezone: process.env.TIMEZONE,
  nodeEnv: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
  timeout: Number(process.env.TIMEOUT) || 120,
}

export default env

function toArray(val: string) {
  const value = _.split(val, ',').map(el => _.trim(el))
  return _.compact(value)
}

function toBool(value: any) {
  if (_.isNil(value)) {
    return undefined
  }

  if (value === true || Number(value) >= 1 || _.lowerCase(value) === 'true') {
    return true
  }

  return false
}
