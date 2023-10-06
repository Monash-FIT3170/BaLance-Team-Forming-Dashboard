/* The following file defines the sql triggers that are run
   on modification of a select few tables
*/

USE student_group_db;
DROP TRIGGER IF EXISTS enrolment_insert_trigger;
DROP TRIGGER IF EXISTS enrolment_delete_trigger;

-- UNIT_OFFERING ENROLMENT COUNT


DELIMITER $$
CREATE 
	TRIGGER enrolment_insert_trigger 
	AFTER INSERT
	ON unit_enrolment FOR EACH ROW
	BEGIN
		UPDATE unit_offering
		SET enrolment_count = enrolment_count + 1
		WHERE unit_off_id = NEW.unit_off_id;
	END; $$

CREATE 
	TRIGGER enrolment_delete_trigger 
	AFTER DELETE
	ON unit_enrolment FOR EACH ROW
	BEGIN
		UPDATE unit_offering
		SET enrolment_count = enrolment_count - 1
		WHERE unit_off_id = OLD.unit_off_id;
	END; $$
DELIMITER ;


-- UNIT_OFF_LAB ALLOCATION COUNT

-- LAB_GROUP SIZE

