import type { NextApiRequest, NextApiResponse } from 'next';
import { createToken } from '@/utils/token';
import { allowCors } from '@/utils/allowCors';

interface LoginResponse {
    token?: string;
    message?: string;
}

async function getUsers() {
    const res = await fetch('http://localhost:8090/api/collections/users/records');
    const data = await res.json();
    return data?.items ?? [];
}

async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
    if (req.method === 'POST') {
        const { identifier, password }: { identifier: string; password: string } = req.body;

        const users = await getUsers();

        try {
            const user = users.find((u: any) => (u.username === identifier || u.email === identifier) && u.password === password);

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const payload = {
                username: user.username,
                email: user.email,
                address: user.address,
                phone: user.phone
            };

            const token = createToken(payload);

            return res.status(200).json({ token });
        } catch (error) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    if (req.method === 'GET') {
        const { identifier }: { identifier?: string } = req.query;

        if (!identifier) {
            return res.status(400).json({ message: 'Identifier (email or username) is required' });
        }

        try {
            const users = await getUsers();

            const user = users.find((u: any) => u.username === identifier || u.email === identifier);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ message: 'User exists' });
        } catch (error) {
            return res.status(500).json({ message: 'Error checking user existence' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default allowCors(handler);