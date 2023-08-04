/* The following file is for testing random queries against the database.
*/

USE student_group_db;

SELECT * FROM unit_offering;
SELECT * FROM student;
SELECT * FROM unit_enrolment;
SELECT * FROM unit_off_lab;
SELECT * FROM student_lab_allocation;
    
DELETE FROM group_allocation 
WHERE group_alloc_id IN (
  SELECT subquery.group_alloc_id
  FROM (
    SELECT ga.group_alloc_id
    FROM lab_group g 
    INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id 
    INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id 
    INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id 
    WHERE u.unit_code = "FIT2099"
      AND u.unit_off_year = 2023
      AND u.unit_off_period = "S1"
  ) AS subquery
);
    
DELETE FROM lab_group
WHERE lab_group_id IN (
  SELECT subquery.lab_group_id
  FROM (
    SELECT g.lab_group_id
    FROM lab_group g
    INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id
    INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
    WHERE
      u.unit_code = "FIT2099"
      AND u.unit_off_year = 2023
      AND u.unit_off_period = "S1"
  ) AS subquery
);
