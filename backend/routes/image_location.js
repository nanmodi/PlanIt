import express from 'express';
import processimage from '../services/image_tolabel.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

const process_router = express.Router();

process_router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log('File uploaded:', req.file);
        const imagePath = req.file.path; 
        console.log('Image path:', imagePath);
        if (!imagePath) {
            return res.status(400).json({ error: 'Invalid file' });
        }
        const result = await processimage(imagePath);
        console.log('R',result);
        res.json({ message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing image' });
    }
});

export default process_router;
