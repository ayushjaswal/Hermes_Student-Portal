FROM ubuntu

RUN apt-get update && apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app

EXPOSE 3000

ENTRYPOINT [ "node", "server.js" ]
