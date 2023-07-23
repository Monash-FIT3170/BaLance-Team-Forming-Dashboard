FROM mysql:8.0.33-debian
LABEL authors="s.a.baaset.moslih@gmail.com"

WORKDIR /balance_database

EXPOSE 3306

# last path is the destination, rest are sources
COPY schemaCreation.sql databaseTriggers.sql database_setup.sh ./

# setup the db
CMD ["sh", "database_setup.sh"]
