import type { NextApiRequest, NextApiResponse } from 'next';
import { createToken } from '@/utils/token';
import { allowCors } from '@/utils/allowCors';
import PocketBase from 'pocketbase';
import formidable from 'formidable';

const pb = new PocketBase('http://127.0.0.1:8090');

export const config = {
    api: {
        bodyParser: false,
    },
};

interface SignUpResponse {
    token?: string;
    message?: string;
    id?: string;
    avatarUrl?: string;
}

async function findUserByName(username: any) {
    try {
        const userFoundByName = await pb.collection('users').getFirstListItem(`username="${username}"`);
        if (userFoundByName) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

async function findUserByEmail(email: any) {
    try {
        const userFoundByEmail = await pb.collection('users').getFirstListItem(`email="${email}"`);
        if (userFoundByEmail) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

async function handler(req: NextApiRequest, res: NextApiResponse<SignUpResponse>) {
    if (req.method === 'POST') {
        const form = formidable({ multiples: false });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return res.status(500).json({ message: 'Error parsing form' });
            }

            const username = fields.username;
            const email = fields.email;
            const password = fields.password;
            const phone = fields.phone;
            const address = fields.address;
            const avatar = files.avatar;

            console.log(username, email, password, phone, address)
            console.log(avatar)


            const existingName = await findUserByName(username);
            const existingEmail = await findUserByEmail(email);
            if (existingName || existingEmail) {
                return res.status(400).json({ message: 'User already exists' });
            }

            try {

                const data = {
                    "username": `${username}`,
                    "email": `${email}`,
                    "password": `${password}`,
                    "phone": `${phone}`,
                    "address": `${address}`
                };

                const newUser = await pb.collection('users').create(data);

                const payload = {
                    username: newUser.username,
                    email: newUser.email,
                    address: newUser.address,
                    phone: newUser.phone
                };

                const token = createToken(payload);

                return res.status(200).json({ token });
            } catch (error) {
                console.error('Server error:', error);
                return res.status(500).json({ message: 'Server error during user creation' });
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
export default allowCors(handler);