import { config } from 'dotenv';
import path from 'path';
import { startServer } from './server';

config({ path: path.join(__dirname, '..', '.env') });

startServer();
