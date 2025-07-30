import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { allowCors } from '@/utils/allowCors';

interface UsersResponse {
    message?: string;
    items?: User[];
    user?: any;
    error?: string;
}

interface User {
    id: string;
    username: string;
    email: string;
}

export async function getUsers(filter: string | null = null): Promise<User[]> {
    const filterParam = filter ? `&filter=${encodeURIComponent(filter)}` : '';
    const url = `http://localhost:8090/api/collections/users/records?perPage=200${filterParam}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Failed to fetch users, status: ${res.status}`);
        }

        const data = await res.json();
        return data?.items ?? [];
    } catch (error: any) {
        console.error('Error fetching users:', error);
        throw new Error(error.message || 'Server error while fetching users');
    }
}

const secretKey = process.env.JWT_SECRET || 'capanCapa';

async function handler(req: NextApiRequest, res: NextApiResponse<UsersResponse>) {
    if (req.method === 'GET') {
        try {
            const { filter } = req.query;
            const userList = await getUsers(filter ? String(filter) : null);

            const authHeader = req.headers['authorization'];

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(200).json({
                    message: 'Users successfully fetched',
                    items: userList
                });
            }

            const token = authHeader.split(' ')[1];

            try {
                const decoded = jwt.verify(token, secretKey) as { username: string };

                const user = userList.find((u: User) => u.username === decoded.username);

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                return res.status(200).json({
                    message: 'User successfully authenticated',
                    user: user
                });

            } catch (error) {
                console.error('JWT verification error:', error);
                return res.status(403).json({ message: 'Invalid token' });
            }
        } catch (error: any) {
            console.error('Error in /api/users:', error);
            res.status(500).json({
                message: 'Failed to fetch users',
                error: error.message
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default allowCors(handler);