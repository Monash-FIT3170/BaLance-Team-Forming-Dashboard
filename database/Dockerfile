# todo FROM ...
LABEL authors="s.a.baaset.moslih@gmail.com"

WORKDIR /balance_database

# last path is the destination, rest are sources
COPY schemaCreation.sql databaseTriggers.sql ./

EXPOSE 3306

# run on container starting
CMD ["nodemon", "server.js"]