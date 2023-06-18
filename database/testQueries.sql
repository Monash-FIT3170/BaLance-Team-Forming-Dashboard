/* The following file is for testing random queries against the database.
*/

USE student_group_db;

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
	unit_offering.unit_code="FIT3175"
	AND unit_offering.unit_off_year=2023
	AND unit_offering.unit_off_period='S2';
    
-- select student, stud id, lab number,
SELECT stud.stud_unique_id, alloc.unit_off_lab_id, unit.unit_off_id
FROM student stud
INNER JOIN student_lab_allocation alloc ON stud.stud_unique_id=alloc.stud_unique_id
INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=alloc.unit_off_lab_id
INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id
WHERE
	unit.unit_code="FIT2099"
	AND unit.unit_off_year=2023
	AND unit.unit_off_period='S1'
ORDER BY unit_off_lab_id DESC;

-- get all groups in a unit
SELECT g.lab_group_id, g.unit_off_lab_id, g.group_number
FROM lab_group g
INNER JOIN unit_off_lab l ON g.unit_off_lab_id=l.unit_off_lab_id
INNER JOIN unit_offering u ON u.unit_off_id=l.unit_off_id
WHERE
	u.unit_code="FIT3175"
	AND u.unit_off_year=2023
	AND u.unit_off_period='S2';

SELECT * -- stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val, l_group.group_number, lab.lab_number
FROM student stud
INNER JOIN group_allocation g_alloc ON stud.stud_unique_id=g_alloc.stud_unique_id
INNER JOIN lab_group l_group ON g_alloc.lab_group_id=l_group.lab_group_id
INNER JOIN unit_off_lab lab ON lab.unit_off_lab_id=l_group.unit_off_lab_id
INNER JOIN unit_offering unit ON unit.unit_off_id=lab.unit_off_id
WHERE
	unit.unit_code="FIT3175"
	AND unit.unit_off_year=2023
	AND unit.unit_off_period='S2'
ORDER BY stud.student_id;

SELECT * FROM group_allocation
INNER JOIN student ON group_allocation.stud_unique_id=group_allocation.stud_unique_id
INNER JOIN unit_enrolment ON student.stud_unique_id=unit_enrolment.stud_unique_id
INNER JOIN unit_offering ON unit_offering.unit_off_id=unit_enrolment.unit_off_id
WHERE 
	unit_offering.unit_code="FIT3175"
	AND unit_offering.unit_off_year=2023
	AND unit_offering.unit_off_period='S2';

SELECT * FROM student_lab_allocation
INNER JOIN unit_off_lab ON unit_off_lab.unit_off_lab_id=student_lab_allocation.unit_off_lab_id
INNER JOIN unit_offering ON unit_offering.unit_off_id=unit_off_lab.unit_off_id
WHERE
	unit_offering.unit_code="FIT3175"
	AND unit_offering.unit_off_year=2023
	AND unit_offering.unit_off_period='S2';
	