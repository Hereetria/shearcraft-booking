export function logError(err: unknown, context?: string) {
  const prefix = context ? `[${context}]` : "[Error]"
  if (err instanceof Error) {
    console.error(`${prefix} ${err.message}\n${err.stack}`)
  } else {
    console.error(`${prefix} ${JSON.stringify(err)}`)
  }
}

export function logInfo(message: string, data?: unknown) {
  const prefix = "[Info]"
  if (data !== undefined) {
    console.info(`${prefix} ${message}`, data)
  } else {
    console.info(`${prefix} ${message}`)
  }
}

export function logWarn(message: string, data?: unknown) {
  const prefix = "[Warn]"
  if (data !== undefined) {
    console.warn(`${prefix} ${message}`, data)
  } else {
    console.warn(`${prefix} ${message}`)
  }
}
