declare namespace NodeJS {
  interface ProcessEnv {
    APP_NAME: string

    SERVER_HOST: string
    SERVER_PORT: number

    FFPROBE_PATH: string
  }
}

declare module 'JSONStream'
