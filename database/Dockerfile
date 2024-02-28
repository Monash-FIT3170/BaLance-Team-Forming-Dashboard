FROM mysql:8.0.33-debian
LABEL authors="s.a.baaset.moslih@gmail.com"

WORKDIR /balance_database

EXPOSE 3306

COPY schemaCreation.sql databaseTriggers.sql database_setup.sh ./

CMD ["sh", "database_setup.sh"]
