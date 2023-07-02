FROM node:18.17-alpine3.17
LABEL authors="s.a.baaset.moslih@gmail.com"

WORKDIR /balance_frontend

# copy package.json before backend code for efficiency
# if code changes, this won't repeat
COPY package.json .

RUN npm install

# copy code in parent dir to speficied WORKDIR
# if code changes, only here below is run
COPY . .

EXPOSE 3000

# run on container starting
CMD ["npm", "start"]