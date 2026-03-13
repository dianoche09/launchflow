FROM node:20-slim

# Install necessary OS dependencies for Playwright
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget gnupg \
    && rm -rf /var/lib/apt/lists/*
RUN npx playwright install-deps chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx playwright install chromium

CMD ["npx", "ts-node", "index.ts"]
