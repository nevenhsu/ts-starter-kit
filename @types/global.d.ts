declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ENV
      NODE_ENV: 'production' | 'development'
      TIMEZONE: string
      TIMEOUT: string
    }
  }
}

export {}
