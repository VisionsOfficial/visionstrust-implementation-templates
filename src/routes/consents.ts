import crypto from 'crypto';
import { NextFunction, Request, Response, Router } from 'express';
import { decryptSignedConsent } from '../utils/decryptConsent';
import { postAccessToken } from '../utils/postAccessToken';
import { postDataRequest } from '../utils/postDataRequest';

const router = Router();

router.post('/export', async (req: Request, res: Response) => {
    try {
        if (!req.body?.signedConsent)
            return res.status(400).json({
                error: 'Missing signed consent from the request payload',
            });

        // Generate access token
        const token = crypto.randomUUID();

        // Send OK response to requester
        res.status(200).json({ message: 'OK', token });

        // Decrypt signed consent
        const decryptedConsent = decryptSignedConsent(req.body.signedConsent);
        const { consentId } = decryptedConsent;

        // POST access token to VisionsTrust
        await postAccessToken(consentId, token);
    } catch (err) {
        // LOG ERROR
    }
});

router.post(
    '/import',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // [opt] verify req.body for wanted information
            const { serviceExportUrl, signedConsent } = req.body;
            if (!serviceExportUrl || !signedConsent)
                return res.status(400).json({
                    error: 'missing params from request payload',
                });

            // Send OK response to requester
            res.status(200).json({ message: 'OK' });

            // POST data request with signedConsent from body to the export service endpoint specified in payload
            await postDataRequest(req.body);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
