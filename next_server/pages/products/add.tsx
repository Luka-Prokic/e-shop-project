"use client"
import { useState } from 'react';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [discount, setDiscount] = useState('');
    const [description, setDescription] = useState('');
    const [buttonText, setButtonText] = useState('ADD');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [imageInputKey, setImageInputKey] = useState(Date.now());

    const addProduct = async () => {
        if (!base64Image) {
            console.error('No image selected or failed to convert image to Base64!');
            return;
        }
        if (countdown === null) {
            try {
                const response = await fetch('/api/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        description,
                        price,
                        discount
                    }),
                });

                const button = document.getElementById('AddProductButton');
                if (button) button.style.color = 'white';
                if (response.ok) {
                    if (button) button.style.backgroundColor = 'blueviolet';

                    const data = await response.json();
                    const id = data.id;

                    try {
                        const imageResponse = await fetch('/api/products/update/image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id,
                                base64Image,
                                imageName: image?.name
                            }),
                        });

                        if (imageResponse.ok) {
                            if (button) {
                                button.style.borderColor = 'blueviolet';
                            }
                            console.log('Image uploaded successfully!');
                        } else {
                            console.error('Failed to upload image.');
                            if (button) {
                                button.style.backgroundColor = 'red';
                                button.style.borderColor = 'red';
                            }
                        }
                    } catch (error) {
                        console.error('Error adding image to product:', error);
                    }
                } else {
                    if (button) button.style.backgroundColor = 'red';
                }
            } catch (error) {
                console.error('Error adding product:', error);
            }
            startCountdown(2);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
            convertImageToBase64(selectedFile);
        }
    };

    const convertImageToBase64 = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result) {
                setBase64Image(reader.result.toString());
                console.log('Base64 Image:', reader.result);
            }
        };
        reader.onerror = (error) => console.error('Error converting image to Base64:', error);
    };

    const startCountdown = (seconds: number) => {
        setCountdown(seconds);
        const intervalId = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === null || prevCountdown <= 1) {
                    clearInterval(intervalId);
                    resetForm();
                    return null;
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setImage(null);
        setBase64Image(null);
        setDiscount('');
        setDescription('');
        setButtonText('ADD');
        setCountdown(null);

        const button = document.getElementById('AddProductButton');
        if (button) {
            button.style.backgroundColor = '';
            button.style.color = '';
            button.style.borderColor = '';
        }
        setImageInputKey(Date.now());
    };

    return (
        <div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(20, 1fr)`,
                gap: '20px',
                paddingLeft: '20px',
                paddingRight: '20px',
                background: 'red'
            }}>
                <a href={'/products'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>BACK</h2></a>
            </div>
            <h1>Add Product</h1>
            <ul style={{ listStyleType: 'none', padding: '20px' }}>
                <input
                    name="name"
                    type="text"
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    name="discount"
                    type="number"
                    placeholder="Discount (0 to 100)"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                />
                <input
                    name="description"
                    type="text"
                    placeholder="Product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    key={imageInputKey}
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </ul>
            <button
                id="AddProductButton"
                style={{ width: '128px', height: '64px' }}
                onClick={addProduct}
                disabled={countdown !== null}
            >
                {countdown !== null ? `Resetting in ${countdown}...` : buttonText}
            </button>
        </div>
    );
};

export default AddProductPage;
