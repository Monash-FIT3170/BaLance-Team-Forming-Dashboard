/* The following file is for testing random queries against the database.
*/

USE student_group_db;
-- Get all info and then append belbin data to it
SELECT * FROM student;
SELECT * FROM unit_enrolment;
SELECT * FROM personality_test_attempt;
SELECT * FROM belbin_result;

SELECT *
FROM student
WHERE stud_unique_id=100000000;

SELECT ga.group_alloc_id, g.lab_group_id, l.unit_off_lab_id, ga.stud_unique_id
FROM lab_group g
   INNER JOIN unit_off_lab l ON l.unit_off_lab_id = g.unit_off_lab_id
   INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
   INNER JOIN group_allocation ga ON g.lab_group_id = ga.lab_group_id
WHERE g.group_number=1
   AND u.unit_code='TEST2'
   AND u.unit_off_year=2023
   AND u.unit_off_period='S2';   
   
   SELECT ga.group_alloc_id, g.lab_group_id, l.unit_off_lab_id, ga.stud_unique_id
FROM lab_group g
   INNER JOIN unit_off_lab l ON l.unit_off_lab_id = g.unit_off_lab_id
   INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
   INNER JOIN group_allocation ga ON g.lab_group_id = ga.lab_group_id
WHERE g.group_number=5
   AND u.unit_code='TEST2'
   AND u.unit_off_year=2023
   AND u.unit_off_period='S2';  