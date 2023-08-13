const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
const uploadCustomScript = async (req, res) => {
    // ... (other code)

    try {
        // ... (other code)
        
        // Execute the Python process
        await new Promise((resolve, reject) => {
            pythonProcess.on('close', (code) => {
                console.log(`Python script exited with code ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Python script exited with non-zero code: ${code}`));
                }
            });

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(data.toString());
            });
        });

        // ... (other code)
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    } finally {
        // unlink the file after finish processing / error occur
      try {
        //
        // if (save) {
          //associate req.user.id (sesson auth) / req.jwt (token auth) -> uploadedFile.filename
        // } else { 
          //await unlinkAsync(req.file.path);
        // }
            await unlinkAsync(req.file.path);
        } catch (error) {
            console.error('An error occurred while deleting the file:', error);
        }
    }
};




module.exports = {
    uploadCustomScript
}
