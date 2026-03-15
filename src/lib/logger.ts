export const logger = {
    info: (message: string, context?: Record<string, any>) => {
        console.log(JSON.stringify({ level: 'info', message, ...context }));
    },
    warn: (message: string, context?: Record<string, any>) => {
        console.warn(JSON.stringify({ level: 'warn', message, ...context }));
    },
    error: (message: string, context?: Record<string, any>) => {
        console.error(JSON.stringify({ level: 'error', message, ...context }));
    },
};
