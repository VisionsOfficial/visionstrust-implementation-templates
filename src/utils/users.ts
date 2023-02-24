import axios from 'axios';
import { generateAuthToken } from './auth';

/**
 * Gets the user identifier information previously
 * registered in VisionsTrust for the specified email
 * @param email The user email
 */
export const getUser = async (email: string) => {
    const res = await axios({
        url: `${process.env.VISIONSTRUST_API_BASE_URL}/users/${email}`,
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${generateAuthToken()}`,
        },
    });

    if (res.status !== 200) return null;
    return res.data;
};

/**
 * Creates a user Identifier in VisionsTrust or returns an existing one
 * if it has previously been created
 * @param email The user email
 * @param userServiceId The ID of the user in your service / database
 */
export const createUser = async (email: string, userServiceId: string) => {
    const existingUser = await getUser(email);
    if (existingUser) return existingUser;

    const newUserResponse = await axios({
        url: `${process.env.VISIONSTRUST_API_BASE_URL}/users`,
        method: 'POST',
        data: {
            email,
            userServiceId,
        },
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${generateAuthToken()}`,
        },
    });

    return newUserResponse.data;
};
