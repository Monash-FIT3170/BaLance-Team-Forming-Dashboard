/* The following file is for setting up dummy data in the
   database for test purposes
*/

/* SPECIFY THE DATABASE */
USE student_group_db;

/* POPULATE THE DATABASE WITH SAMPLE DATA */
INSERT INTO unit_offering (unit_off_id, unit_code, unit_name, unit_off_year, unit_off_period, enrolment_count)
VALUES 
	(1600782300, "FIT2099", "OO Design & Implementation", 2023, "S1", 0),
	(1600782359, "FIT2004", "Algorithms & Datastructures", 2019, "S1", 0),
    (1600782371, "FIT3170", "Software Engineering Practice", 2023, "FY", 0),
    (1600782372, "FIT3175", "Usability", 2023, "S2", 0),
	(1600782380, "FIT3171", "Databases", 2020, "S1", 0);






