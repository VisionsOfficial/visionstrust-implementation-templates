import axios from 'axios';
import { decryptSignedConsent } from './decryptConsent';
import { generateAuthToken } from './auth';
import { ValidationData } from '../types';

/**
 * Verifies with VisionsTrust the validity of the consent and returns user data as well as DataType information and the endpoint to which the data needs to be sent back.
 * @param signedConsent The signed consent as per received from the import service
 * @returns The validation request data
 */
export const validateConsent = async (signedConsent: string) => {
    const { consentId, token } = decryptSignedConsent(signedConsent);

    if (!consentId || !token)
        throw new Error(
            'Missing critical info consentId or token from the signedConsent'
        );

    const validation = await axios({
        method: 'POST',
        url:
            process.env.VISIONSTRUST_API_BASE_URL +
            '/consents/exchange/validate',
        data: {
            signedConsent,
            consentId,
            token,
        },
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${generateAuthToken()}`,
        },
    });

    return validation.data as ValidationData;
};
