const multer = require('multer');
const { spawn } = require('child_process');

const { promiseBasedQuery } = require('../helpers/commonHelpers');

async function storeGroupsInDatabase(unitCode, year, period, parsedOutput) {
	const unitOffIdResult = await promiseBasedQuery(
		'SELECT unit_off_id FROM unit_offering WHERE unit_code = ? AND unit_off_year = ? AND unit_off_period = ?',
		[ unitCode, year, period ]
	);

	if (!unitOffIdResult.length) throw new Error('Invalid unit code, year, or period provided.');

	const unitOffId = unitOffIdResult[0].unit_off_id;

	for (let labId in parsedOutput) {
		// Check if the lab exists
		const labExists = await promiseBasedQuery(
			'SELECT unit_off_lab_id FROM unit_off_lab WHERE lab_number = ? AND unit_off_id = ?',
			[ labId, unitOffId ]
		);

		let currentLabId;

		if (!labExists.length) {
			const result = await promiseBasedQuery(
				'INSERT INTO unit_off_lab (unit_off_id, lab_number) VALUES (?, ?);',
				[ unitOffId, parseInt(labId) ]
			);
			currentLabId = result.insertId; // Capture the generated primary key
		} else {
			currentLabId = labExists[0].unit_off_lab_id; // Use the existing lab's ID
		}

		const groupsInThisLab = parsedOutput[labId];
		for (let i = 0; i < groupsInThisLab.length; i++) {
			const group = groupsInThisLab[i];
			const groupNumber = i + 1;

			// Check if the combination already exists
			const labGroupExists = await promiseBasedQuery(
				'SELECT * FROM lab_group WHERE unit_off_lab_id = ? AND group_number = ?',
				[ currentLabId, groupNumber ]
			);

			if (!labGroupExists.length) {
				// If it doesn't exist, perform the insertion
				await promiseBasedQuery('INSERT INTO lab_group (unit_off_lab_id, group_number) VALUES (?, ?);', [
					currentLabId,
					groupNumber
				]);
			} else {
				console.warn(
					`Lab Group with unit_off_lab_id: ${currentLabId} and group_number: ${groupNumber} already exists.`
				);
			}

			console.log(group);
			var labGroupId;
			const result = await promiseBasedQuery('SELECT lab_group_id FROM lab_group WHERE unit_off_lab_id = ?', [
				currentLabId
			]);
			if (result && result.length > 0) {
				labGroupId = result[0].lab_group_id;
			} else {
				throw new Error('No corresponding lab_group_id found for given unit_off_lab_id');
			}

			for (let student of group.members) {
				await promiseBasedQuery('INSERT INTO group_allocation (stud_unique_id, lab_group_id) VALUES (?, ?);', [
					student.stud_unique_id,
					labGroupId
				]);
			}
		}
	}
}

async function getStudentData(unitCode, year, period) {
	return await promiseBasedQuery(
		'SELECT stud.stud_unique_id, stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val ' +
			'FROM student stud ' +
			'INNER JOIN unit_enrolment ue ON ue.stud_unique_id = stud.stud_unique_id ' +
			'INNER JOIN unit_offering unit ON ue.unit_off_id = unit.unit_off_id ' +
			'WHERE unit.unit_code = ? AND unit.unit_off_year = ? AND unit.unit_off_period = ?',
		[ unitCode, year, period ]
	);
}

async function getStudentLabAllocations(students) {
	const studentIds = students.map((s) => s.stud_unique_id);
	return await promiseBasedQuery(
		'SELECT stud_unique_id, unit_off_lab_id FROM student_lab_allocation WHERE stud_unique_id IN (?)',
		[ studentIds ]
	);
}

async function uploadCustomScript(req, res) {
	const { unitCode, year, period } = req.params;
	const students = await getStudentData(unitCode, year, period);
	console.log('Students:', students);

	const studentLabAllocations = await getStudentLabAllocations(students);
	const labGroups = {};

	for (const labAllocation of studentLabAllocations) {
		const labId = labAllocation.unit_off_lab_id;
		const labStudents = students.filter((student) => student.stud_unique_id === labAllocation.stud_unique_id);

		if (!labGroups[labId]) {
			labGroups[labId] = [];
		}

		labGroups[labId].push(labStudents);
	}

	const groupSize = req.body.groupSize || 5; // assuming a default group size of 5 if not provided
	console.log('LAB GROUPS:', labGroups);

	try {
		const { scriptContent } = req.body;
		if (!scriptContent) throw new Error('Script content is missing.');

		// Modified pythonArgs to include the studentLabAllocations and groupSize
		const pythonArgs = [ JSON.stringify(students), JSON.stringify(studentLabAllocations), groupSize.toString() ];

		// Run the Python script for each lab group
		for (const labId in labGroups) {
			const labStudents = labGroups[labId];

			// Modify the pythonArgs to include only the labStudents for the current lab
			const labPythonArgs = [ unitCode, year, period, JSON.stringify(labStudents) ];

			// Serialize the labPythonArgs array into a JSON string
			const labPythonArgsJSON = JSON.stringify(labPythonArgs);
			console.log(labPythonArgsJSON);
			const pythonProcess = spawn('python', [ '-c', scriptContent, ...labPythonArgs ]);

			let output = '';
			await new Promise((resolve, reject) => {
				pythonProcess.stdout.on('data', (data) => {
					//console.log('DATA: ', data);
					output += data.toString();
				});
				pythonProcess.stderr.on('error', (data) => {
					reject(new Error('Error in script execution. ' + data.toString()));
				});
				pythonProcess.on('close', (code) => {
					if (code === 0) resolve();
					else reject(new Error(`Python script exited with code: ${code}`));
				});
			});

			console.log('OUTPUT: ', output);
			const parsedOutput = JSON.parse(output);
			console.log('PARSED OUTPUT: ', parsedOutput);
			await storeGroupsInDatabase(unitCode, year, period, parsedOutput);
		}

		res.json({ message: 'Groups generated and stored successfully.' });
	} catch (error) {
		console.error('An unexpected error occurred:', error);
		res.status(500).json({ error: error.message || 'An error occurred while processing the request.' });
	}
}

module.exports = { uploadCustomScript };
