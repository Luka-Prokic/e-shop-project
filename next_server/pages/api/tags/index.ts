import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCors } from '@/utils/allowCors';

interface TagsResponse {
    message?: string;
    items?: any;
}

async function handler(req: NextApiRequest, res: NextApiResponse<TagsResponse>) {
    if (req.method === 'GET') {
        const { filter } = req.query; 

        try {
            const response = await fetch('http://localhost:8090/api/collections/tags/records?perPage=1000');
            const record = await response.json(); 

            return res.status(200).json({ 
                message: 'Tags successfully fetched', 
                items: record.items 
            });
        } catch (error: any) {
            console.error('Error getting tags:', error);
            return res.status(500).json({ message: error.message || 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default allowCors(handler);
