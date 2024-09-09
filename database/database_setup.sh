
until mysql -h"$MYSQLHOST" -P"$MYSQLPORT" -u"$MYSQLUSER" -p"$MYSQLPASSWORD" -e "SELECT 1"; do
  echo "Waiting for database connection..."
  sleep 5
done

mysql -h"$MYSQLHOST" -P"$MYSQLPORT" -u"$MYSQLUSER" -p"$MYSQLPASSWORD" "$MYSQLDATABASE" < database/schemaCreation.sql
echo "Database schema has been created successfully."