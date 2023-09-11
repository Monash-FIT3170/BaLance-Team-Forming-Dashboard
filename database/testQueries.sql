/* The following file is for testing random queries against the database.
*/

USE student_group_db;
-- Get all info and then append belbin data to it
SELECT unit_off_id FROM unit_offering
WHERE u.unit_code='FIT3170'
    AND u.unit_off_year=2023
    AND u.unit_off_period='FY';
    
 -- then we can add to personality test attempt
 
 -- then fetch the personality test attempts for the unit
 
 -- then insert the effort results

SELECT * FROM unit_offering;

INSERT INTO personality_test_attempt (test_type, stud_unique_id, unit_off_id)
VALUES (
	'belbin', (
        -- obtain the student's stud_unique_id
		SELECT s.stud_unique_id FROM unit_enrolment e
			INNER JOIN unit_offering u ON u.unit_off_id = e.unit_off_id
			INNER JOIN student s ON s.stud_unique_id = e.stud_unique_id
		WHERE 
			u.unit_code='FIT3170'
			AND u.unit_off_year=2023
			AND u.unit_off_period='FY'
			AND s.student_id=54321867
	), (
		SELECT unit_off_id FROM unit_offering
		WHERE unit_code='FIT3170'
			AND unit_off_year=2023
			AND unit_off_period='FY'
	) 
);
    
    
    
    
    
    