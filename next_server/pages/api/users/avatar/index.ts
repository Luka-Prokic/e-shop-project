import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { allowCors } from '@/utils/allowCors';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

interface AvatarRes {
    avatar?: string | null;
    message?: string;
}

interface User {
    id: string;
    username: string;
    avatar: string | null;
}

async function getUsers() {
    const res = await fetch('http://localhost:8090/api/collections/users/records');
    const data = await res.json();
    return data?.items ?? [];
}

const secretKey = process.env.JWT_SECRET || 'capanCapa';

async function handler(req: NextApiRequest, res: NextApiResponse<AvatarRes>) {
    if (req.method === 'GET') {
        const authHeader = req.headers['authorization'];
        const users: User[] = await getUsers();
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, secretKey) as { username: string };
            const user = users.find(u => u.username === decoded.username);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const avatarUrl = user.avatar ? `http://127.0.0.1:8090/api/files/users/${user.id}/${user.avatar}` : null;
            return res.status(200).json({ avatar: avatarUrl });
        } catch (error) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    }

    if (req.method === 'POST') {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, secretKey) as { username: string };
            const { username } = decoded;
            const users: User[] = await getUsers();
            const user = users.find(u => u.username === username);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
        const { base64Image, imageName }: { base64Image: string; imageName: string } = req.body;


        const byteString = atob(base64Image.split(",")[1]);
            const mimeString = base64Image.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const avatar = new File([blob], `${imageName}`, { type: mimeString });

            if (!avatar) {
                return res.status(400).json({ message: 'No avatar file uploaded' });
            }
            
            await pb.collection('users').update(user.id, {
                'avatar': avatar,
            });

            return res.status(200).json({ message: 'Avatar updated successfully' });
        } catch (error) {
            return res.status(403).json({ message: 'Invalid token' });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default allowCors(handler);