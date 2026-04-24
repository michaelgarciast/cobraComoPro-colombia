FROM oven/bun:alpine

WORKDIR /app

RUN apk add --no-cache bash

CMD ["bash"]