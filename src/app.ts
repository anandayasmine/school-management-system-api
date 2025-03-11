import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './routes/api';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use("/api", router);
export default app; // Exporting app for testing
