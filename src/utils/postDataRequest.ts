import axios from 'axios';
import { VisionsTrustConsentImportPayload } from '../types';

/**
 * POSTs a data request using the signed consent containing the access token
 * @param payload The payload received from VisionsTrust to your consent/import endpoint
 * @returns The response promise made to the Export Service
 */
export const postDataRequest = async (
    payload: VisionsTrustConsentImportPayload
) => {
    const response = await axios({
        method: 'POST',
        url: payload.serviceExportUrl,
        data: {
            ...payload,
        },
        headers: {
            'content-type': 'application/json',
        },
    });

    return response;
};
