FROM node:18.16-alpine3.17
LABEL authors="s.a.baaset.moslih@gmail.com"

# nodemon auto-restarts server on changes
RUN npm install -g nodemon

WORKDIR /balance_backend

# copy package.json before backend code for efficiency
# if code changes, this won't repeat
COPY package.json .

RUN npm install

# copy code in parent dir to speficied WORKDIR
# if code changes, only here below is run
COPY . .

EXPOSE 8080

# run on container starting
CMD ["nodemon", "-L", "server.js"]

