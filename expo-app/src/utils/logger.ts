import { env } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function minLevel(): LogLevel {
  if (env.ENABLE_DEBUG_LOGS || __DEV__) return 'debug';
  return 'warn';
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_RANK[level] >= LEVEL_RANK[minLevel()];
}

function format(scope: string | undefined, args: unknown[]): unknown[] {
  if (!scope) return args;
  return [`[${scope}]`, ...args];
}

/**
 * Centralized logging. Debug/info silenced in production unless ENABLE_DEBUG_LOGS.
 * Future: forward warn/error to remote sink when crash reporting is enabled.
 */
export const logger = {
  debug: (...args: unknown[]) => {
    if (shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always surface errors; production may also ship to CrashReporting later
    // eslint-disable-next-line no-console
    console.error(...args);
  },
  scoped: (scope: string) => ({
    debug: (...args: unknown[]) => logger.debug(...format(scope, args)),
    info: (...args: unknown[]) => logger.info(...format(scope, args)),
    warn: (...args: unknown[]) => logger.warn(...format(scope, args)),
    error: (...args: unknown[]) => logger.error(...format(scope, args)),
  }),
};
