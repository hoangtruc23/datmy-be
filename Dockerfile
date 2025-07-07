FROM node:22.16.0-slim
WORKDIR /home/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    fonts-noto-core \
    fonts-noto-ui-core \
    fonts-dejavu-core \
    fonts-liberation \
    libglib2.0-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]