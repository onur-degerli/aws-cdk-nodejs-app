import pino from 'pino';
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { level: label.toUpperCase() };
    },
  },
});

export const log = {
  info: (msg: string, meta?: unknown) => logger.info(meta ?? {}, msg),
  warn: (msg: string, meta?: unknown) => logger.warn(meta ?? {}, msg),
  debug: (msg: string, meta?: unknown) => logger.debug(meta ?? {}, msg),
  error: (err: unknown, msg?: string) => {
    if (err instanceof Error) {
      logger.error(
        {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
        msg || err.message
      );
    } else {
      logger.error({ err }, msg || 'Unknown error');
    }
  },
};
