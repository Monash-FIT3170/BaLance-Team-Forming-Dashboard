/* The following file is for testing random queries against the database.
*/

USE student_group_db;

-- delete group
DELETE FROM lab_group
WHERE group_alloc_id IN (
    SELECT subquery.group_alloc_id
    FROM (
        SELECT g.lab_group_id
        FROM lab_group g
            INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id
            INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
        WHERE u.unit_code=?
            AND u.unit_off_year=?
            AND u.unit_off_period=?
    ) AS subquery
);

-- delete lab alloc todo
DELETE FROM student_lab_allocation
WHERE stud_lab_alloc_id IN (
    SELECT subquery.stud_lab_alloc_id
    FROM (
        SELECT la.stud_lab_alloc_id
        FROM student_lab_allocation la
            INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id
            INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
            INNER JOIN student_lab_allocation la ON la.unit_off_lab_id = l.unit_off_lab_id
        WHERE u.unit_code=?
            AND u.unit_off_year=?
            AND u.unit_off_period=?
    ) AS subquery
);

-- delete lab todo
DELETE FROM group_allocation
WHERE group_alloc_id IN (
SELECT subquery.group_alloc_id
FROM (
SELECT ga.group_alloc_id
FROM lab_group g
INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id
INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id
WHERE u.unit_code = ''
AND u.unit_off_year = ?
AND u.unit_off_period = ''
) AS subquery
);

-- delete effort result todo
DELETE FROM group_allocation
WHERE group_alloc_id IN (
SELECT subquery.group_alloc_id
FROM (
SELECT ga.group_alloc_id
FROM lab_group g
INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id
INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id
WHERE u.unit_code = ''
AND u.unit_off_year = ?
AND u.unit_off_period = ''
) AS subquery
);

-- delete belbin result todo
DELETE FROM group_allocation
WHERE group_alloc_id IN (
SELECT subquery.group_alloc_id
FROM (
SELECT ga.group_alloc_id
FROM lab_group g
INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id
INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id
WHERE u.unit_code = ''
AND u.unit_off_year = ?
AND u.unit_off_period = ''
) AS subquery
);

-- delete personality test attempt todo
DELETE FROM group_allocation
WHERE group_alloc_id IN (
SELECT subquery.group_alloc_id
FROM (
SELECT ga.group_alloc_id
FROM lab_group g
INNER JOIN unit_off_lab l ON g.unit_off_lab_id = l.unit_off_lab_id
INNER JOIN unit_offering u ON u.unit_off_id = l.unit_off_id
INNER JOIN group_allocation ga ON ga.lab_group_id = g.lab_group_id
WHERE u.unit_code = ''
AND u.unit_off_year = ?
AND u.unit_off_period = ''
) AS subquery
);