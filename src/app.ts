import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import projectRoutes from './routes/projectRoutes';
import { errorHandler } from './utils/errorHandlers';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/*
 * Routes
 */
app.get('/', (request, response) => {
  response.send('Home route response from server');
});
app.use('/projects', projectRoutes);
app.use(errorHandler);

export { app };
