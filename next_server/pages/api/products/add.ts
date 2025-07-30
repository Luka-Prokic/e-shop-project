import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCors } from '@/utils/allowCors';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

interface AddProductResponse {
    message?: string;
    id?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<AddProductResponse>) {
    if (req.method === 'POST') {
        const { name, description, price, discount, tags } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Missing required fields: name, image, and price are mandatory.' });
        }

        try {
            const record = await pb.collection('temu').create({
                "name": name,
                "description": description,
                "price": price,
                "discount": discount,
                "tags": tags
            });

            return res.status(200).json({ message: 'Product successfully added', id: record.id });
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