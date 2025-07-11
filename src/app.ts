import express from 'express';
import cors from 'cors';
import pool from './config/database';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


export default app; 