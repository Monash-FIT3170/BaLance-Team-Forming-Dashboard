const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
const uploadCustomScript = async (req, res) => {
    // ... (other code)
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
      // Read the uploaded file as a string
  try {
        const filePath = uploadedFile.path;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const pythonFileString = fileContent.toString();
        const students = [{ id: 30722055, wam: 1, personality: 'DESSC'}, { id: 233122, wam: 2, personality: 'DSADE'}];
  
        //spawn python process with arg
        const pythonArgs = [unitCode, year, period, JSON.stringify(students)]; 
        const pythonProcess = spawn('python3', ['-c', pythonFileString, ...pythonArgs]);
        // Execute the Python process
        let output = '';
  
    await new Promise((resolve, reject) => {
          
            pythonProcess.on('close', (code) => {
                console.log(`Python script successfully executed with code: ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Failed to run python script: ${code}`));
                }
            });

            pythonProcess.stdout.on('data', async (data) => {
              output += data.toString();
              try {
                const parsedOutput = JSON.parse(output);
              // unlink the file after finish processing / error occur
              //
              // if (save) {
                //associate req.user.id (sesson auth) / req.jwt (token auth) -> uploadedFile.filename
              // } else { 
                //await unlinkAsync(req.file.path);
              // }
                await unlinkAsync(req.file.path);
                
                res.json(parsedOutput);
              } catch (error) {
                res.status(500).json({ error: 'Failed to parse Python output.' });
              }
            });

            pythonProcess.stderr.on('error', (data) => {
              console.error(data.toString());
              res.status(500).json({ error: 'An error occurred while processing the request.' });
            });
        });

        // ... (other code)
    } catch (error) {
        console.error('An unexpected error has occurred:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
};




module.exports = {
    uploadCustomScript
}
