/* The following file is for testing random queries against the database.
*/

USE student_group_db;
-- Get all info and then append belbin data to it
SELECT * FROM student;
SELECT * FROM unit_offering;
SELECT * FROM unit_enrolment;
SELECT * FROM personality_test_attempt;
SELECT * FROM belbin_result;
SELECT * FROM effort_result;

SELECT *
FROM personality_test_attempt t
   INNER JOIN student s ON s.stud_unique_id=t.stud_unique_id
   INNER JOIN unit_enrolment e ON e.stud_unique_id=t.stud_unique_id
WHERE
   e.unit_off_id=100000000
   AND t.test_type='effort'
   AND s.student_id IN (
	54321867, 12345678, 12345677, 12398267, 39187204, 40887212, 32459103, 45310009,
	12569024, 34251045, 33333333, 10982943, 56783124, 40981234, 10986402, 45670987,
	10908070, 54210982, 19749075, 30982934, 38976210, 37609812
   );
   
-- ONLY FINDS STUDENTS WITH NO ATTEMPT, NOT NECESSARILY THOSE WITH BELBIN ATTEMPTS
SELECT * 
FROM student s 
	INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id
    INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id 
	LEFT JOIN personality_test_attempt t ON t.stud_unique_id=s.stud_unique_id
WHERE
	u.unit_code='GG'
    AND u.unit_off_year=66
    AND u.unit_off_period='S1'
    AND t.test_attempt_id IS NULL;
    
-- FIND ALL STUDENTS WITH BELBIN TYPE
SELECT count(*) AS `missingValues`
FROM student s 
	INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id
    INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id 
WHERE
	u.unit_code='GG'
    AND u.unit_off_year=66
    AND u.unit_off_period='S1'
    AND s.stud_unique_id NOT IN (
		SELECT s.stud_unique_id 
		FROM student s 
			INNER JOIN unit_enrolment e ON e.stud_unique_id=s.stud_unique_id
			INNER JOIN unit_offering u ON u.unit_off_id=e.unit_off_id 
			INNER JOIN personality_test_attempt t ON t.stud_unique_id=s.stud_unique_id
		WHERE
			u.unit_code='GG'
			AND u.unit_off_year=66
			AND u.unit_off_period='S1'
			AND t.test_type='belbin'
    );


    