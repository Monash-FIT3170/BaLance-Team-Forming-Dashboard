/* The following file is for testing random queries against the database.
*/
SELECT * FROM unit_offering;
SELECT * FROM student;
SELECT * FROM unit_enrolment;
SELECT * FROM unit_off_lab;
SELECT * FROM student_lab_allocation;

-- select all enrolled students for a given unit offering
SELECT student_id, preferred_name, last_name, email_address 
FROM student
INNER JOIN unit_enrolment ON student.stud_unique_id=unit_enrolment.stud_unique_id
INNER JOIN unit_offering ON unit_offering.unit_off_id=unit_enrolment.unit_off_id
WHERE 
	unit_offering.unit_code="FIT2099"
	AND unit_offering.unit_off_year=2023
	AND unit_offering.unit_off_period='S1';
    
-- select student, stud id, lab number,
SELECT stud.stud_unique_id, alloc.unit_off_lab_id
FROM student stud
INNER JOIN student_lab_allocation alloc ON stud.stud_unique_id=alloc.stud_unique_id
INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=alloc.unit_off_lab_id
INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id
WHERE
	unit.unit_code="FIT2099"
	AND unit.unit_off_year=2023
	AND unit.unit_off_period='S1'
ORDER BY unit_off_lab_id;



