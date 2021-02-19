FROM node:14-buster-slim

RUN  apt-get update \
	&& apt-get install -y wget \
	&& rm -rf /var/lib/apt/lists/*

COPY /app/package*.json /app/
WORKDIR /app
RUN npm ci

COPY /app /app

EXPOSE 8080

HEALTHCHECK --interval=30m --timeout=5s \
	CMD wget --no-verbose --spider http://localhost:8080/health || exit 1

CMD ["npm", "run", "start"]
