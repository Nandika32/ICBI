const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const sampleRoutes = require('./routes/sampleRoutes');
const requestRoutes = require('./routes/requestRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('ICBI Platform API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
