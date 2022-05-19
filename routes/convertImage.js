const express = require('express');
const router = express.Router();
const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');

// converting HEIC to PNG for user uploading iphone photos
router.post('/', async (req, res) => {

    console.log('Hit hit the converter route and got data: ', req.file)
    const heicFilePath = req.file.path;
    const imgSuff = req.file.filename + '.png';

    try {
        const inputBuffer = await promisify(fs.readFile)(heicFilePath);
        //const inputBuffer = await promisify(fs.readFile)('/path/to/my/image.heic');
        const outputBuffer = await convert({
            buffer: inputBuffer, // the HEIC file buffer
            format: 'PNG',      // output format
            // quality: 1           // the jpeg compression quality, between 0 and 1
        });

        // writing png file to uploads
        await promisify(fs.writeFile)('uploads/' + imgSuff, outputBuffer);

        // deleting heic file
        fs.unlink(heicFilePath, function (err) {
            if (err) {
                console.log('Could not delete heic file: ', heicFilePath);
            }
            else { 
                console.log('File deleted'); 
            }
        });
        const imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + imgSuff;
        console.log('Found image url: ', imageUrl);
        return res.json({ imageUrl: imageUrl });

    } catch (error) {
        console.log('Could not convert: ', error)

    }

})



router.post('/deleteimage', async (req, res) => {
    console.log('Hit hit the delete route and got data: ', req.body)
    const filePath = 'uploads/' + req.body.imageUrl.split('/').pop();
    fs.unlink(filePath, function (err) {
        if (err) {
            console.log('Could not delete: ', err)
            return res.json({ err });
        };
        // if no error, file has been deleted successfully
        console.log('File deleted');
        return res.json({ filePath });
    });
})

module.exports = router;
