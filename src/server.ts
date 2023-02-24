import express, { NextFunction, Request, Response } from 'express';
import { setupRoutes } from './routes';

export const startServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    setupRoutes(app);

    //eslint-disable-next-line
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        // GLOBAL ERROR HANDLER
        return res
            .status(500)
            .json({ error: 'internal server error', details: err.message });
    });

    app.listen(process.env.PORT, () => {
        //eslint-disable-next-line
        console.log(
            `VisionsTrust connector running on http://localhost:${process.env.PORT}`
        );
    });

    return app;
};
