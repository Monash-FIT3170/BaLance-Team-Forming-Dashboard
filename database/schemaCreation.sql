/* The following file implements the initial creation
   and setup of the application database and components
   relating to unit, student, lab and groups
*/

-- START FROM CLEAN SLATE
DROP SCHEMA IF EXISTS student_group_db;

-- DATABASE CREATION AND SPECIFICATION
CREATE DATABASE IF NOT EXISTS student_group_db;
USE student_group_db;

-- TABLE CREATION
CREATE TABLE IF NOT EXISTS unit_offering (
    unit_off_id INT AUTO_INCREMENT COMMENT 'unique identifier for a unit offering',
    unit_code VARCHAR(50) COMMENT 'code used by an institute to refer to an offering',
    unit_name VARCHAR(50),
    unit_off_year INTEGER COMMENT 'the year in which the offering is made',
    unit_off_period VARCHAR(20) COMMENT 'the term which the offering is held e.g. S2',
    staff_unique_id INT COMMENT 'unique identifier used by database for staff',
    enrolment_count INT,
    CONSTRAINT pk_unit_off PRIMARY KEY (unit_off_id),
    CONSTRAINT ck_unit_off UNIQUE (unit_code, unit_off_year, unit_off_period)
);
ALTER TABLE unit_offering AUTO_INCREMENT=100000000;

CREATE TABLE IF NOT EXISTS staff (
    staff_unique_id INT AUTO_INCREMENT COMMENT 'unique identifier used by database for staff',
    staff_code VARCHAR(50) COMMENT 'staff code used internally by an institute',
    preferred_name VARCHAR(50),
    last_name VARCHAR(50),
    email_address VARCHAR(256) CHECK (email_address LIKE '%@%'),
    CONSTRAINT pk_staff PRIMARY KEY (staff_unique_id),
    CONSTRAINT ck_staff_email UNIQUE (email_address)
);
ALTER TABLE staff AUTO_INCREMENT=100000000;

CREATE TABLE IF NOT EXISTS student (
    stud_unique_id INT AUTO_INCREMENT COMMENT 'unique identifier used by database for students',
    student_id VARCHAR(50) COMMENT 'student code used internally by an institute',
    preferred_name VARCHAR(50),
    last_name VARCHAR(50),
    email_address VARCHAR(256) CHECK (email_address LIKE '%@%'),
    wam_display VARCHAR(50), -- todo is this necessary? if centralised, these will change between student uploads
    wam_val INT,
    gender ENUM('M', 'F'),
    CONSTRAINT pk_student PRIMARY KEY (stud_unique_id),
    CONSTRAINT ck_student_email UNIQUE (email_address)
);
ALTER TABLE student AUTO_INCREMENT=100000000;

CREATE TABLE IF NOT EXISTS unit_off_lab (
    unit_off_lab_id INT AUTO_INCREMENT COMMENT 'global unique identifier for a lab that is part of some unit offering',
    unit_off_id INT COMMENT 'unique identifier for a unit offering',
    lab_number INT COMMENT 'a generic identifier for a lab internally by a specific unit offering',
    unit_code VARCHAR(50) COMMENT 'code used by an institute to refer to an offering',
    unit_off_year INTEGER COMMENT 'the year in which the offering is made',
    unit_off_period VARCHAR(20) COMMENT 'the term which the offering is held e.g. S2',
    CONSTRAINT pk_lab PRIMARY KEY (unit_off_lab_id),
    CONSTRAINT ck_lab UNIQUE (unit_off_id, lab_number)
);
ALTER TABLE unit_off_lab AUTO_INCREMENT=100000000;

CREATE TABLE IF NOT EXISTS lab_group (
    lab_group_id INT AUTO_INCREMENT COMMENT 'global unique identifier for a group part of some unit offering''s lab',
    unit_off_lab_id INT,
    group_number INT COMMENT 'a generic identifier for a group internally by a specific unit offering',
    CONSTRAINT pk_group PRIMARY KEY (lab_group_id),
    CONSTRAINT ck_group UNIQUE (unit_off_lab_id, group_number)
);
ALTER TABLE lab_group AUTO_INCREMENT=100000000;

CREATE TABLE IF NOT EXISTS unit_enrolment ( -- connection between student and unit offering
    enrolment_id INT AUTO_INCREMENT COMMENT 'unique identifier to refer to a students enrolment to a unit offering',
    stud_unique_id INT,
    unit_off_id INT COMMENT 'unique identifier for a unit offering',
    enrolment_status ENUM('active', 'inactive'), -- todo ask Rio if we still store and maintain this
    unit_code VARCHAR(50) COMMENT 'code used by an institute to refer to an offering',
    unit_off_year INTEGER COMMENT 'the year in which the offering is made',
    unit_off_period VARCHAR(20) COMMENT 'the term which the offering is held e.g. S2',
    CONSTRAINT pk_unit_enrolment PRIMARY KEY (enrolment_id),
    CONSTRAINT ck_unit_enrolment UNIQUE (stud_unique_id, unit_off_id)
);
ALTER TABLE unit_enrolment AUTO_INCREMENT=100000000;

CREATE TABLE IF NOT EXISTS student_lab_allocation ( -- connection between student and unit offering lab
    stud_lab_alloc_id INT AUTO_INCREMENT COMMENT 'unique identifier referring to students allocation to a lab',
    unit_off_lab_id INT,
    stud_unique_id INT,
    CONSTRAINT pk_stud_lab_alloc PRIMARY KEY (stud_lab_alloc_id),
    CONSTRAINT ck_stud_lab_alloc UNIQUE (unit_off_lab_id, stud_unique_id)
);
ALTER TABLE student_lab_allocation AUTO_INCREMENT=100000000;

CREATE TABLE IF NOT EXISTS group_allocation ( -- connection between student and group
    group_alloc_id INT AUTO_INCREMENT COMMENT 'unique identifier for a student allocation to a group',
    stud_unique_id INT,
    lab_group_id INT,
    CONSTRAINT pk_group_alloc PRIMARY KEY (group_alloc_id),
    CONSTRAINT ck_group_alloc UNIQUE (stud_unique_id, lab_group_id)
);
ALTER TABLE group_allocation AUTO_INCREMENT=100000000;


-- FOREIGN KEY CREATION
-- student to enrolment, group allocation, lab allocation
ALTER TABLE unit_enrolment ADD FOREIGN KEY (stud_unique_id) REFERENCES student(stud_unique_id);
ALTER TABLE group_allocation ADD FOREIGN KEY (stud_unique_id) REFERENCES student(stud_unique_id);
ALTER TABLE student_lab_allocation ADD FOREIGN KEY (stud_unique_id) REFERENCES student(stud_unique_id);

-- staff to unit_offering
ALTER TABLE unit_offering ADD FOREIGN KEY (staff_unique_id) REFERENCES staff(staff_unique_id);

-- units to student enrolment, unit labs
ALTER TABLE unit_enrolment ADD FOREIGN KEY (unit_off_id) REFERENCES unit_offering(unit_off_id);
ALTER TABLE unit_enrolment ADD FOREIGN KEY (unit_code, unit_off_year, unit_off_period)
    REFERENCES unit_offering(unit_code, unit_off_year, unit_off_period);
ALTER TABLE unit_off_lab ADD FOREIGN KEY (unit_off_id) REFERENCES unit_offering(unit_off_id);
ALTER TABLE unit_off_lab ADD FOREIGN KEY (unit_code, unit_off_year, unit_off_period)
    REFERENCES unit_offering(unit_code, unit_off_year, unit_off_period);

-- labs to student allocations, group allocations
ALTER TABLE student_lab_allocation ADD FOREIGN KEY (unit_off_lab_id) REFERENCES unit_off_lab(unit_off_lab_id);
ALTER TABLE lab_group ADD FOREIGN KEY (unit_off_lab_id) REFERENCES unit_off_lab(unit_off_lab_id);

-- groups to group allocations
ALTER TABLE group_allocation ADD FOREIGN KEY (lab_group_id) REFERENCES lab_group(lab_group_id);
