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
        const { id } = req.body;

        try {
            const record = await pb.collection('tags').delete(id);

            if(record){
                return res.status(200).json({ message: 'Tag successfully removed' });
            }
        } catch (error: any) {
            console.error('Error adding product:', error);
            return res.status(500).json({ message: error.message || 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default allowCors(handler);