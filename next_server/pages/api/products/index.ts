import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCors } from '@/utils/allowCors';

interface ProductsResponse {
    message?: string;
    items?: any;
    error?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ProductsResponse>) {
    if (req.method === 'GET') {
        const { filter } = req.query; 
        const filterParam = filter ? `&filter=${encodeURIComponent(filter as string)}` : ''; 

        try {
            const response = await fetch(`http://localhost:8090/api/collections/temu/records?perPage=200${filterParam}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch products, status: ${response.status}`);
            }

            const record = await response.json();

            res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=60'); 

            return res.status(200).json({ 
                message: 'Products successfully fetched', 
                items: record.items 
            });
        } catch (error: any) {
            console.error('Error getting products:', error);
            return res.status(500).json({ 
                message: error.message || 'Server error', 
                error: error.toString() 
            });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default allowCors(handler);
