import { Application } from 'express';
import consentsRouter from './consents';
import dataRouter from './data';

export const setupRoutes = (app: Application) => {
    app.use('/consent', consentsRouter);
    app.use('/data', dataRouter);
};
