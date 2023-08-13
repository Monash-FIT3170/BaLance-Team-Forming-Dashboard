const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const uploadCustomScript = async (req, res) => {
  const {
        unitCode,
        year,
        period,
        save
    } = req.params;

    // Access the uploaded file using req.file
    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).send('No file uploaded.');
    }
  req.file.student_id = req.body.student_id;
  console.log(req.file);
    // Read the uploaded file as a string
  const filePath = uploadedFile.path;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const pythonFileString = fileContent.toString();
  
    // .buffer
    // .toString('utf-8');
  console.log(pythonFileString);
  const students = [{ id: 30722055, wam: 1 }, {id: 233122, wam: 2}];
  
  
  const pythonArgs = [unitCode, year, period, JSON.stringify(students)]; 
  const pythonProcess = spawn('python3', ['-c', pythonFileString, ...pythonArgs]);
    console.log(__dirname + '/uploads'); // Outputs the absolute path of the current module's directory

  let output = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);

    try {
      const parsedOutput = JSON.parse(output);
        console.log(parsedOutput);
      res.json(parsedOutput);
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse Python output.' });
    }
    
  });

  if (save) {

  }
  else { 
    await unlinkAsync(req.file.path)
  }
}





module.exports = {
    uploadCustomScript
}
