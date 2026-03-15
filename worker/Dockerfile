FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install bullmq ioredis playwright @sentry/node @axiomhq/js
RUN npx playwright install chromium

COPY index.ts .
COPY tsconfig.json .

RUN npm install -g typescript
RUN tsc

CMD ["node", "index.js"]
