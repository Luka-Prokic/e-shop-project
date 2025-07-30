import type { NextApiRequest, NextApiResponse } from 'next';
import { allowCors } from '@/utils/allowCors';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

interface ProductImageRes {
    image?: string | null;
    message?: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse<ProductImageRes>) {
    if (req.method === 'POST') {
        const { id, base64Image, imageName }: { id: string; base64Image: string; imageName: string } = req.body;

        try {
            if (!base64Image || !imageName) {
                return res.status(400).json({ message: 'No image file uploaded' });
            }

            const byteString = atob(base64Image.split(",")[1]); 
            const mimeString = base64Image.split(",")[0].split(":")[1].split(";")[0]; 
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: mimeString });
            const imageFile = new File([blob], imageName, { type: mimeString });

            if (!imageFile) {
                return res.status(400).json({ message: 'Error processing image file' });
            }

            const product = await pb.collection('temu').getOne(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            await pb.collection('temu').update(id, { image: imageFile });

            return res.status(200).json({ message: 'Product image updated successfully' });
        } catch (error: any) {
            console.error('Error:', error);
            
            if (error.status === 404) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            if (error.status === 400) {
                return res.status(400).json({ message: 'Invalid request' });
            }

            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default allowCors(handler);