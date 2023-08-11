const multer = require('multer');
const { spawn } = require('child_process');

const uploadCustomScript = async (req, res) => {
  const {
        unitCode,
        year,
        period
    } = req.params;

  const pythonCode = req.file.buffer.toString('utf-8');
  console.log(pythonCode);
  const students = [{ id: 30722055, wam: 1 }, {id: 233122, wam: 2}];
  
  const pythonArgs = [unitCode, year, period, JSON.stringify(students)]; 
  const pythonProcess = spawn('python3', ['-c', pythonCode, ...pythonArgs]);
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
}





module.exports = {
    uploadCustomScript
}
