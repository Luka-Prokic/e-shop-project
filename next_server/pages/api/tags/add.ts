import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCors } from '@/utils/allowCors';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

interface AddTagResponse {
    message?: string;
    id?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<AddTagResponse>) {
    if (req.method === 'POST') {
        const { name, special, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Missing required fields: name' });
        }

        try {
            const record = await pb.collection('tags').create({
                "name": name,
                "special": special,
                "description": description,
            });

            return res.status(200).json({ message: 'Tag successfully added', id: record.id });
        } catch (error: any) {
            console.error('Error adding tag:', error);
            return res.status(500).json({ message: error.message || 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default allowCors(handler);