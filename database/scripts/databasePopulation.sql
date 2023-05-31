/* The following file is for setting up dummy data in the
   database for test purposes
*/

/* SPECIFY THE DATABASE */
USE student_group_db;

/* POPULATE THE DATABASE WITH SAMPLE DATA */
-- Insert 1 unit
INSERT INTO unit_offering VALUES 
	(1600782300, "FIT2099", "OO Design & Implementation", 2023, "S1", 0),
	(1600782359, "FIT2004", "Algorithms & Datastructures", 2019, "S1", 0),
    (1600782371, "FIT3170", "Software Engineering Practice", 2023, "FY", 0),
    (1600782372, "FIT3175", "Usability", 2023, "S2", 0),
	(1600782380, "FIT3171", "Databases", 2020, "S1", 0);

/*
-- Insert 25 students
INSERT INTO student VALUES	
	(1000325001, "29716264", "Edgar", "Djikstra", "edji001@student.monash.edu", "BEng-70", 70, "M"),
    (1000325022, "29716265", "Steve", "Jobs", "sjob002@student.monash.edu", "BEng-65", 65, "M"),
    (1000325003, "29716266", "Don", "Wilhelm", "dwil011@student.monash.edu", "BInfoTech-50", 50, "M"),
    (1000325044, "29716267", "Po", "Po", "popo005@student.monash.edu", "BInfoTech-90", 90, "F"),
    (1000325065, "29716268", "Luke", "Konman", "lkon001@student.monash.edu", "BEng-68", 68, "M"),
    (1000325090, "29716269", "Allen", "Schteinbeck", "asch001@student.monash.edu", "BInfoTech-83", 83, "M"),
	(1028325002, "29794264", "Wyoming", "Sutler", "wsut001@student.monash.edu", "BCompSci-70", 70, "F"),
    (1094125005, "31716264", "Sara", "Short", "ssho001@student.monash.edu", "BInfoTech-90", 90, "F"),
    (1008273106, "67716264", "Tess", "Trun", "ttru001@student.monash.edu", "BCompSci-80", 80, "F"),
    (1000325099, "29715264", "Tony", "Phony", "tpho001@student.monash.edu", "BCompSci-52", 52, "M"),
    (1293725011, "29717265", "Stanely", "Yelnats", "syel001@student.monash.edu", "BEng-75", 75, "M"),
    (1000325023, "29717266", "Jemima", "White", "jwhi001@student.monash.edu", "BInfoTech-78", 78, "F"),
    (1000325045, "29718267", "Jon", "Itt", "jitt001@student.monash.edu", "BEng-45", 45, "M"),
    (1000355001, "29716299", "Rod", "Runner", "rrun001@student.monash.edu", "BCompSci-71", 71, "M"),
    (2003325326, "44716264", "Carol", "Wong", "cwon001@student.monash.edu", "BEng-50", 50, "F"),
    (1400325222, "83716264", "Mary", "Gordon", "mgor001@student.monash.edu", "BCompSci-73", 73, "F"),
    (1058325114, "30716261", "Shelly", "Varchar", "svae001@student.monash.edu", "BEng-77", 77, "F"),
    (1000325025, "29719268", "Marty", "McFly", "mmcf001@student.monash.edu", "BInfoTech-61", 61, "M"),
    (1000725010, "29711464", "Alex", "Schnell", "asch001@student.monash.edu", "BCompSci-64", 64, "F"),
    (1890325001, "29719364", "Kooi", "Rup", "krup001@student.monash.edu", "BEng-99", 99, "F");

-- Insert 3 staff
INSERT INTO staff VALUES 
	(300016, "58322", "Rio", "Alfredo", "rio.alfredo@monash.edu"),
    (300025, "58322", "Ian", "Felix", "ian.felix@monash.edu"),
    (300095, "58322", "Jean-Guy", "Schneider", "jean.guy.schneider@monash.edu");

-- Insert 2 labs 
INSERT INTO unit_off_lab VALUES
	(1748, 1600782300, "02_OnCampus"),
    (7694, 1600782300, "06_OnlineRealTime");

-- Insert 5 groups
INSERT INTO lab_group VALUES 
	(1, 1748), -- lab 02
    (2, 1748),
    (3, 1748),
    (4, 1748),
    (5, 7694), -- lab 06
    (6, 7694);

-- Connect all staff to the offering
INSERT INTO unit_employment VALUES 
	(104757, 300016, 1600782300, "active"),
	(104760, 300025, 1600782300, "active"),
	(105099, 300095, 1600782300, "active");

-- Connect staff to labs
INSERT INTO staff_lab_allocation VALUES 
	(1001, 1748, 300016, "super admin"),
    (1002, 1748, 300025, "admin"),
    (1003, 7694, 300095, "super admin");

-- Connect all students to the offering
INSERT INTO unit_enrolment VALUES 
	(3001, 1000325001, 1600782300, "active"),
    (3002, 1000325022, 1600782300, "active"),
    (3003, 1000325003, 1600782300, "active"),
    (3004, 1000325044, 1600782300, "active"),
    (3005, 1000325065, 1600782300, "active"),
    (3006, 1000325090, 1600782300, "active"),
	(3007, 1028325002, 1600782300, "active"),
    (3008, 1094125005, 1600782300, "active"),
    (3009, 1008273106, 1600782300, "active"),
    (3010, 1000325099, 1600782300, "active"),
    (3011, 1293725011, 1600782300, "active"),
    (3012, 1000325023, 1600782300, "active"),
    (3013, 1000325045, 1600782300, "active"),
    (3014, 1000355001, 1600782300, "active"),
    (3015, 2003325326, 1600782300, "active"),
    (3016, 1400325222, 1600782300, "active"),
    (3017, 1058325114, 1600782300, "active"),
    (3018, 1000325025, 1600782300, "active"),
    (3019, 1000725010, 1600782300, "active"),
    (3020, 1890325001, 1600782300, "active");

-- Connect student to their labs
INSERT INTO student_lab_allocation VALUES 
	(3001, 1748, 1000325001), -- group 1
    (3002, 1748, 1000325022),
    (3003, 1748, 1000325003),
    (3004, 1748, 1000325044),
    (3005, 1748, 1000325065), -- group 2
    (3006, 1748, 1000325090),
	(3007, 1748, 1028325002),
    (3008, 1748, 1094125005), 
    (3009, 1748, 1008273106), -- group 3
    (3010, 1748, 1000325099),
    (3011, 1748, 1293725011),
    (3012, 1748, 1000325023), -- group 4
    (3013, 1748, 1000325045),
    (3014, 1748, 1000355001),
    (3015, 7694, 2003325326), -- group 5
    (3016, 7694, 1400325222),
    (3017, 7694, 1058325114),
    (3018, 7694, 1000325025), -- group 6
    (3019, 7694, 1000725010),
    (3020, 7694, 1890325001);

-- Connect student to their lab groups
INSERT INTO group_allocation VALUES 
	(3001, 1000325001, 1), -- group 1
    (3002, 1000325022, 1),
    (3003, 1000325003, 1),
    (3004, 1000325044, 1),
    (3005, 1000325065, 2), -- group 2
    (3006, 1000325090, 2),
	(3007, 1028325002, 2),
    (3008, 1094125005, 2), 
    (3009, 1008273106, 3), -- group 3
    (3010, 1000325099, 3),
    (3011, 1293725011, 3),
    (3012, 1000325023, 4), -- group 4
    (3013, 1000325045, 4),
    (3014, 1000355001, 4),
    (3015, 2003325326, 5), -- group 5
    (3016, 1400325222, 5),
    (3017, 1058325114, 5),
    (3018, 1000325025, 6), -- group 6
    (3019, 1000725010, 6),
    (3020, 1890325001, 6);
*/






