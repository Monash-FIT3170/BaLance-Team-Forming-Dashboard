FROM mysql:8.0.33
LABEL authors="s.a.baaset.moslih@gmail.com"

WORKDIR /balance_database

# last path is the destination, rest are sources
COPY schemaCreation.sql databaseTriggers.sql database_setup.sh ./

EXPOSE 3306

# run on container starting - setup the db
CMD ["sh", "database_setup.sh"]