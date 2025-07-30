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
        const { email, username, password }: { email: string; username: string; password: string } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Email, username, and password are required' });
        }

        try {
            const users = await getUsers();

            const user = users.find(
                (u: any) => u.email === email && u.username === username && u.password === password
            );

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const payload = {
                username: user.username,
                email: user.email,
                address: user.address,
                phone: user.phone,
            };

            const token = createToken(payload);

            return res.status(200).json({ token });
        } catch (error) {
            console.error('Error authenticating user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default allowCors(handler);