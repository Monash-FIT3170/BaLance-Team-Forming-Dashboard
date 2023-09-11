/* The following file is for testing random queries against the database.
*/

USE student_group_db;
-- Get all info and then append belbin data to it

SELECT t.test_attempt_id, s.student_id
FROM personality_test_attempt t 
   INNER JOIN student s ON s.stud_unique_id=t.stud_unique_id
   INNER JOIN unit_enrolment e ON e.unit_off_id=t.unit_off_id
WHERE
	e.unit_off_id=100000000
	AND s.student_id IN (
	'54321867', '12345678', '12345677', '12398267', '39187204', '40887212', '32459103', '45310009',
	'12569024', '34251045', '33333333', '10982943', '56783124', '40981234', '10986402', '45670987',
    '10908070', '54210982', '19749075', '30982934', '38976210', '37609812');
    
    