const multer = require('multer');
const { spawn } = require('child_process');
const { promisify } = require('util');

const studentController = require('./studentController');
const { promiseBasedQuery } = require('../helpers/commonHelpers');

const getStudentData = async (unitCode, year, period) => {
	console.log('IM HERE');
	const studentsData = await promiseBasedQuery(
		'SELECT stud.student_id, stud.preferred_name, stud.last_name, stud.email_address, stud.wam_val ' +
			'FROM student stud ' +
			'inner join unit_enrolment ue on ue.stud_unique_id=stud.stud_unique_id ' +
			'inner join unit_offering unit on ue.unit_off_id=unit.unit_off_id ' +
			'WHERE unit.unit_code=? ' +
			'AND unit.unit_off_year=? ' +
			'AND unit.unit_off_period=?',
		[ unitCode, year, period ]
	);
	//console.log(studentsData);
	return studentsData; // return the student data instead of sending a response
};

const uploadCustomScript = async (req, res) => {
	const { unitCode, year, period } = req.params;
	// Step 1: Load student data for the unit
	const students = await getStudentData(unitCode, year, period);
	//console.log(students);

	try {
		// Ensure that scriptContent is in the request body
		const { scriptContent } = req.body;
		if (!scriptContent) {
			return res.status(400).send('Script content is missing.');
		}

		// Step 2: Run the script with the student data as input
		const pythonArgs = [ unitCode, year, period, JSON.stringify(students) ];
		const pythonProcess = spawn('python', [ '-c', scriptContent, ...pythonArgs ]);

		let output = '';
		await new Promise((resolve, reject) => {
			pythonProcess.on('close', (code) => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error(`Failed to run python script with code: ${code}`));
				}
			});

			pythonProcess.stdout.on('data', (data) => {
				output += data.toString();
			});

			pythonProcess.stderr.on('error', (data) => {
				console.error(data.toString());
				reject(new Error('An error occurred while processing the script.' + data.toString()));
			});
		});

		console.log(output);
		// Parse the output to JSON
		const parsedOutput = JSON.parse(output);
		console.log(parsedOutput);
		// Step 3: Read the output groups and send these groups to our database
		//await storeGroupsInDatabase(unitCode, year, period, parsedOutput);

		// Send a success response
		//res.json({ message: "Groups generated and stored successfully." });
	} catch (error) {
		console.error('An unexpected error occurred:', error);
		res.status(500).json({ error: 'An error occurred while processing the request.' });
	}
};

module.exports = {
	uploadCustomScript
};
