/* The following file is for testing random queries against the database.
*/
SELECT * FROM unit_offering;
SELECT * FROM student;

INSERT IGNORE INTO student (stud_unique_id) VALUES (100000044); 