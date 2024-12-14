const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Uploads folder created');
}

// Database Connection
mongoose
  .connect('mongodb://localhost:27017/FILE', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Mongoose schema and model
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Post = mongoose.model('Post', postSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log(`Rejected file type: ${file.mimetype}`);
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

// Routes
app.post('/posts', upload.single('image'), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('File Info:', req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }

  try {
    const { title } = req.body;
    const image = req.file.filename;

    const post = new Post({ title, image });
    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Post.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
