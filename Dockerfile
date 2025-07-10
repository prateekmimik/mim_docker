FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    net-tools iputils-ping iputils-tracepath \
    build-essential \
    curl \
    wget \
    git \
    vim \
    ca-certificates \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY .env .
COPY requests.http .
COPY setup.sh .
COPY bin/ ./bin/
COPY cli-utils/ ./cli-utils/
COPY deploy/ ./deploy/


RUN chmod +x ./setup.sh

CMD ["./setup.sh"]