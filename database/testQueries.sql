/* The following file is for testing random queries against the database.
*/

USE student_group_db;
-- Get all info and then append belbin data to it
		SELECT s.stud_unique_id FROM unit_enrolment e
			INNER JOIN unit_offering u ON u.unit_off_id = e.unit_off_id
			INNER JOIN student s ON s.stud_unique_id = e.stud_unique_id
		WHERE 
			u.unit_code='FIT3170'
			AND u.unit_off_year=2023
			AND u.unit_off_period='FY'
			AND s.student_id=12345678;

SELECT unit_off_id FROM unit_offering
WHERE unit_code='FIT3170'
    AND unit_off_year=2023
    AND unit_off_period='FY';
    
 -- then we can add to personality test attempt
 
 -- then fetch the personality test attempts for the unit
 
 -- then insert the effort results

SELECT * FROM unit_offering;

INSERT IGNORE INTO personality_test_attempt (test_type, unit_off_id, stud_unique_id)
VALUES (
	?, ?, (
		SELECT s.stud_unique_id FROM unit_enrolment e
			INNER JOIN unit_offering u ON u.unit_off_id = e.unit_off_id
			INNER JOIN student s ON s.stud_unique_id = e.stud_unique_id
		WHERE 
			u.unit_code=?
			AND u.unit_off_year=?
			AND u.unit_off_period=?
			AND s.student_id=?
	)
);

-- obtain test attempt id and student id
SELECT t.test_attempt_id, s.student_id 
FROM personality_test_attempt t
	INNER JOIN student s ON s.stud_unique_id=t.stud_unique_id
    INNER JOIN unit_enrolment e ON e.unit_off_id=t.unit_off_id
WHERE
	e.unit_off_id=?
    AND s.student_id=?;

INSERT INTO belbin_result (personality_test_attempt, belbin_type)
VALUES ((
		SELECT test_attempt_id FROM personality_test_attempt 
		WHERE test_type LIKE 'belbin' 
		AND stud_unique_id LIKE (
			SELECT stud_unique_id FROM student 
            WHERE student_id LIKE ? 
            AND test_type = 'belbin'
		) 
		AND unit_off_id LIKE (
			SELECT unit_off_id FROM unit_offering 
            WHERE unit_code like ? 
            AND unit_off_year like ? 
            AND lower(unit_off_period) like ?
		)
	), ?
)
    
    
    
    
    
    