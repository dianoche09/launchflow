import { log } from '@axiomhq/nextjs';

export const logger = {
    info: (message: string, context?: Record<string, any>) => {
        log.info(message, context);
    },
    warn: (message: string, context?: Record<string, any>) => {
        log.warn(message, context);
    },
    error: (message: string, context?: Record<string, any>) => {
        log.error(message, context);
    },
};
