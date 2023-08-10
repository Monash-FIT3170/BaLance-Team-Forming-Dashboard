const multer = require('multer');
const { spawn } = require('child_process');

const uploadCustomScript = async (req, res) => { 
  const pythonCode = req.file.buffer.toString('utf-8');
  const pythonArgs = [1,2]; // Replace with your specific arguments

  const pythonProcess = spawn('python3',upload.single('pythonFile'), ['-c', pythonCode, ...pythonArgs]);

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
