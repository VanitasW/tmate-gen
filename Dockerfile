FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TMATE_API_KEY="tmk-914Hzkcw1fm57fD6wJTmyFUzB0"

RUN apt-get update && \
    apt-get install -y \
    tmate \
    openssh-client \
    wget \
    curl \
    git \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
