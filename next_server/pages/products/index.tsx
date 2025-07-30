"use client"
import { useEffect, useRef, useState } from 'react';

interface Product {
    id: any;
    name: string;
    image: string | File;
    price: number;
    discount?: number;
    description?: string;
    tags: string[];
}

interface Tag {
    id: any;
    name: string;
    special: boolean;
    description?: string;
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [columns, setColumns] = useState<number>(4);
    const [loading, setLoading] = useState(true);
    const [editingProductId, setEditingProductId] = useState<any>(null);
    const [copyingProductId, setCopyingProductId] = useState<any>(null);
    const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAddTagToProduct, setShowAddTagToProduct] = useState(false);
    const [showRemoveTagFromProduct, setShowRemoveTagFromProduct] = useState(false);
    const [pickedTag, setPickedTag] = useState('ALL');
    const [inputValue, setInputValue] = useState<string>('');
    const [foundTags, setFoundTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>('');


    const inputRef = useRef<HTMLInputElement>(null);

    const startEditing = (product: Product) => {
        setEditingProductId(product.id);
        setEditedProduct({ ...product });


        setIsCreating(false);
    };

    const startCopying = async (product: Product) => {
        setEditingProductId(null);

        if (editedProduct.tags) {
            const updatedTags = Array.from(
                new Set([...editedProduct.tags, ...product.tags])
            );

            const updatedProduct: Product = {
                ...product,
                tags: updatedTags
            };
            setEditedProduct({ ...updatedProduct });
        } else
            setEditedProduct({ ...product });

        const imageUrl = `http://localhost:8090/api/files/temu/${product.id}/${product.image}`;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${product.image}`, { type: blob.type });
            setSelectedImage(file);
        } catch (error) {
            console.error('Error copying image file:', error);
        }
        setCopyingProductId(product.id);
    };

    const cancelEditing = () => {
        setEditingProductId(null);
        setSelectedImage(null);

        setEditedProduct((prevEditedProduct) => {
            if (!prevEditedProduct || !prevEditedProduct.tags) {
                return {};
            }

            const product = products.find(p => p.id === copyingProductId);

            if (!product || !product.tags) {
                return { tags: prevEditedProduct.tags };
            }

            const updatedTags = prevEditedProduct.tags.filter(
                (tag) => !product.tags.some((productTag) => productTag === tag)
            );

            setCopyingProductId(null);
            return {
                tags: updatedTags,
            };
        });

        setShowAddTagToProduct(false);
        setShowRemoveTagFromProduct(false);
        setInputValue('');
        setFoundTags([]);
        setSelectedTag('');
    };



    const confirmDelete = async () => {
        if (editedProduct) {
            const id = editedProduct.id;
            try {
                await fetch('/api/products/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                });
            } catch (error) {
                console.error('Error removing product:', error);
            }

            setProducts(products.filter(p => p.id !== editedProduct.id));
        }
        setShowDeleteConfirm(false);
        cancelEditing();
    };

    const confirmChanges = async () => {
        try {
            const { id, name, description, price, discount, tags } = editedProduct;

            const requestBody = { id, name, description, price, discount, tags };

            const response = await fetch('/api/products/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const data = await response.json();

                if (selectedImage) {
                    const base64Image = await convertImageToBase64(selectedImage);
                    await fetch('/api/products/update/image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: data.id,
                            base64Image,
                            imageName: selectedImage.name
                        }),
                    });
                }
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }

        setProducts(prevProducts => prevProducts.map(p =>
            p.id === editingProductId ? { ...p, ...editedProduct } : p
        ));

        cancelEditing();
    };

    const handleFieldChange = (field: keyof Product, value: string | number) => {
        setEditedProduct(prev => ({ ...prev, [field]: value }));
    };

    const createNewProduct = async () => {
        if (!editedProduct.name || !editedProduct.price) {
            alert('Please provide product name and price');
            return;
        }

        if (!selectedImage && !editedProduct.image) {
            console.error('No image selected!');
            return;
        }

        try {
            const { name, description, price, discount, tags } = editedProduct;

            const response = await fetch('/api/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, price, discount, tags }),
            });

            if (response.ok) {
                const data = await response.json();
                const id = data.id;

                if (selectedImage) {
                    const base64Image = await convertImageToBase64(selectedImage);
                    await fetch('/api/products/update/image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id,
                            base64Image,
                            imageName: selectedImage.name
                        }),
                    });
                }
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
        fetchProducts();
        cancelEditing();
    };

    const convertImageToBase64 = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8090/api/collections/temu/records?perPage=200`);
            const data = await res.json();
            const productsArray = data?.items ?? [];
            setProducts(productsArray);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateFilteredProducts = () => {
        if (pickedTag === 'ALL') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.tags && product.tags.includes(pickedTag)
            );
            setFilteredProducts(filtered);
        }
    };
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch('/api/tags', { method: 'GET' });

                if (res.ok) {
                    const data = await res.json();
                    const tagsArray = data?.items ?? [];
                    setTags(tagsArray);
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        fetchTags();
        updateFilteredProducts();
    }, []);

    useEffect(() => {
        updateFilteredProducts();
    }, [pickedTag, products]);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {

        if (event.key === 'Enter') {
            setInputValue(foundTags[0])
            setSelectedTag(foundTags[0])
        }

        if (event.key === 'Escape') {
            setShowAddTagToProduct(false);
        }
    };

    const addTag = (tag: any) => {
        const product = products.find(p => p.id === editingProductId);
        const tagExists = tags.find(t => t.name === tag.name);

        if (product) {
            if (!tagExists) {
                const updatedTags = Array.isArray(product.tags) ? [...product.tags, tag] : [tag];

                const updatedProduct: Product = {
                    ...product,
                    tags: updatedTags
                };

                setEditedProduct(prev => ({
                    ...prev,
                    tags: updatedTags
                }));

                const updatedProducts = products.map(p =>
                    p.id === editingProductId ? updatedProduct : p
                );

                setProducts(updatedProducts);
            }
        } else {

            if (!tagExists) {
                const updatedTags = Array.isArray(editedProduct.tags) ? [...editedProduct.tags, tag] : [tag];

                setEditedProduct(prev => ({
                    ...prev,
                    tags: updatedTags
                }));
            }
        }

        setShowAddTagToProduct(false);
        setInputValue('');
        setSelectedTag('');
    };


    const confirmRemoveTag = () => {
        if (!selectedTag) return;

        const product = products.find(p => p.id === editingProductId);

        if (product) {
            const updatedTags = product.tags.filter(tag => tag !== selectedTag);

            const updatedProduct: Product = {
                ...product,
                tags: updatedTags
            };

            setEditedProduct(prev => ({
                ...prev,
                tags: updatedTags
            }));

            const updatedProducts = products.map(p =>
                p.id === editedProduct?.id ? updatedProduct : p
            );

            setProducts(updatedProducts);
        } else {

            const updatedTags = Array.isArray(editedProduct.tags) ? editedProduct.tags.filter(tag => tag !== selectedTag) : [];

            setEditedProduct(prev => ({
                ...prev,
                tags: updatedTags
            }));
        }

        setShowRemoveTagFromProduct(false);
    };



    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setInputValue(input);

        if (input.trim() !== '') {
            const tagMatches = tags.filter(tag => tag.name?.toUpperCase().startsWith(input.toUpperCase()));

            const selectedProductTags = editedProduct?.tags || [];

            const filteredTagMatches = tagMatches.filter(tag =>
                !selectedProductTags.some(selectedTag => selectedTag === tag.name));

            setFoundTags(filteredTagMatches.map(tag => tag.name).slice(0, 4));

        } else {
            setFoundTags([]);
        }
    };

    if (loading) {
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
                    {/* <a href={'products/add'} style={{
                        color: 'white',
                        textDecoration: 'none'
                    }}><h2>ADD</h2></a> */}
                    <a href={'users'} style={{
                        color: 'white',
                        textDecoration: 'none'
                    }}><h2>USERS</h2></a>
                    <a href={'tags'} style={{
                        color: 'white',
                        textDecoration: 'none'
                    }}><h2>TAGS</h2></a>
                </div>
                <h1>Loading...</h1>
            </div>
        );
    }

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
                {/* <a href={'products/add'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>ADD</h2></a> */}
                <a href={'users'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>USERS</h2></a>
                <a href={'tags'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>TAGS</h2></a>
            </div>

            <div style={{ userSelect: 'none' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns + 6}, 1fr)`,
                    gap: '2px',
                }}>
                    <button onClick={() => setPickedTag('ALL')} style={pickedTag === 'ALL' ? { backgroundColor: 'red', color: 'white' } : {}}>ALL</button>
                    {tags
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(t => (
                            <button
                                key={t.name}
                                onClick={() => setPickedTag(t.name)}
                                style={pickedTag === t.name ? { backgroundColor: 'red', color: 'white' } : {}}
                            >
                                {t.name}
                            </button>
                        ))}
                </div>
                <h1>Products</h1>
                <button onClick={() => setColumns(prev => prev > 1 ? prev - 1 : prev)}><b>-</b></button>
                <span> columns | {columns} | </span>
                <button onClick={() => setColumns(prev => prev < 20 ? prev + 1 : prev)}><b>+</b></button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: '20px',
                padding: '20px'
            }}>
                {isCreating ? (
                    <div style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left', position: 'relative' }}>
                        {showRemoveTagFromProduct ?
                            <>
                                <h4>Are you sure you want to remove this tag?</h4>
                                <button onClick={() => setShowRemoveTagFromProduct(false)} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                                <button onClick={confirmRemoveTag}>Confirm</button>
                            </> : <>
                                <h2>Create New Product</h2>
                                <strong>IMAGE:</strong>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                        style={{
                                            width: '128px',
                                            height: '128px',
                                            border: '2px dashed #ccc',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            position: 'relative',
                                        }}
                                        onClick={() => document.getElementById('fileInput')?.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                setSelectedImage(e.dataTransfer.files[0]);
                                            }
                                        }}
                                    >
                                        {(!selectedImage && !editedProduct.image) ? (
                                            <b style={{ position: 'absolute', color: '#888', fontSize: '22px', textAlign: 'center' }}>
                                                IMG
                                            </b>
                                        ) : (
                                            <img
                                                src={selectedImage ? `${URL.createObjectURL(selectedImage)}` : ` `}
                                                width="100%"
                                                height="100%"
                                                style={{ objectFit: 'contain' }}
                                            />)}
                                    </div>

                                    <input
                                        id="fileInput"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setSelectedImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>
                                <p>
                                    <strong>NAME:</strong>
                                    <input
                                        type="text"
                                        value={editedProduct.name || ''}
                                        onChange={e => handleFieldChange('name', e.target.value)}
                                    />
                                </p>
                                <p>
                                    <strong>DESCRIPTION:</strong>
                                    <textarea rows={5} cols={30}
                                        placeholder="Write your description here..."
                                        value={editedProduct.description || ''}
                                        onChange={e => handleFieldChange('description', e.target.value)}
                                    ></textarea>
                                </p>
                                <p>
                                    <strong>PRICE:</strong>
                                    <input
                                        type="number"
                                        value={editedProduct.price || ''}
                                        onChange={e => handleFieldChange('price', Number(e.target.value))}
                                    />
                                </p>
                                <p>
                                    <strong>DISCOUNT:</strong>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={editedProduct.discount || ''}
                                        onChange={e => handleFieldChange('discount', Number(e.target.value))}
                                    />
                                </p>

                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {editedProduct?.tags?.map((tag, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                backgroundColor: '#eee',
                                                padding: '5px 10px',
                                                borderRadius: '15px',
                                                fontSize: '12px',
                                                color: '#333',
                                                marginBottom: '5px',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                                setShowRemoveTagFromProduct(true);
                                                setShowAddTagToProduct(false);
                                                setSelectedTag(tag);
                                            }}
                                            title-custom="Click to remove"
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                    {pickedTag && pickedTag !== 'ALL' && <div
                                        key={-1}
                                        style={{
                                            backgroundColor: '#eee',
                                            padding: '5px 10px',
                                            borderRadius: '15px',
                                            fontSize: '12px',
                                            color: '#333',
                                            marginBottom: '5px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setShowRemoveTagFromProduct(true);
                                            setShowAddTagToProduct(false);
                                            setSelectedTag(pickedTag);
                                        }}
                                    >
                                        {pickedTag}
                                    </div>}
                                    {showAddTagToProduct ? <>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="tag"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                autoComplete="off"
                                                name="tagInput"
                                                ref={inputRef}
                                                onKeyDown={handleKeyDown}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    fontSize: '14px',
                                                    borderRadius: '5px',
                                                    border: '1px solid #ccc',
                                                }}
                                            />
                                            {selectedTag ? (
                                                <div
                                                    key={'add'}
                                                    style={{
                                                        backgroundColor: '#eee',
                                                        padding: '5px 10px',
                                                        borderRadius: '15px',
                                                        fontSize: '12px',
                                                        color: '#333',
                                                        marginBottom: '5px',
                                                        cursor: 'pointer',
                                                        minWidth: 'fit-content'
                                                    }}
                                                    onClick={() => addTag(selectedTag)}
                                                >
                                                    + {selectedTag}
                                                </div>
                                            ) : (
                                                <div
                                                    key={'clear'}
                                                    style={{
                                                        backgroundColor: 'yellow',
                                                        padding: '5px 10px',
                                                        borderRadius: '15px',
                                                        fontSize: '12px',
                                                        color: 'black',
                                                        marginBottom: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => {
                                                        setShowAddTagToProduct(false);
                                                        setInputValue('');
                                                        setSelectedTag('');
                                                    }}
                                                >
                                                    ⨯
                                                </div>
                                            )}
                                        </div>

                                        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
                                            {foundTags?.map((tag, index) => (
                                                <li
                                                    key={index}
                                                    role="option"
                                                    style={{
                                                        padding: '8px 12px',
                                                        border: '1px solid #ccc',
                                                        marginBottom: '4px',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#f9f9f9',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => (e.target as HTMLLIElement).style.backgroundColor = '#e0e0e0'}
                                                    onMouseLeave={(e) => (e.target as HTMLLIElement).style.backgroundColor = '#f9f9f9'}
                                                    onClick={() => {
                                                        setSelectedTag(foundTags[index]);
                                                        setInputValue(foundTags[index]);
                                                        setFoundTags([]);
                                                    }}
                                                >
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>
                                    </> : <div
                                        key={'add'}
                                        style={{
                                            backgroundColor: '#eee',
                                            padding: '5px 10px',
                                            borderRadius: '15px',
                                            fontSize: '12px',
                                            color: '#333',
                                            marginBottom: '5px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setShowAddTagToProduct(true);
                                            setTimeout(() => {
                                                if (inputRef.current) {
                                                    inputRef.current.focus();
                                                }
                                            }, 100);

                                        }}
                                    >
                                        +
                                    </div>}
                                </div>

                                <hr />

                                <button onClick={() => setIsCreating(false)} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                                <button onClick={createNewProduct}>Create New</button>
                            </>
                        }
                    </div>
                ) : (<button onClick={() => {
                    setIsCreating(true);
                    cancelEditing();
                }}>+ Create New Product</button>)}

                {filteredProducts.slice().reverse().map(p => (
                    <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left', position: 'relative' }}>
                        <p><strong>ID:</strong> {p.id}</p>

                        {editingProductId === p.id ? (
                            <>{showDeleteConfirm ?
                                <>
                                    <h4>Are you sure you want to delete this product?</h4>
                                    <button onClick={() => setShowDeleteConfirm(false)} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                                    <button onClick={confirmDelete}>Confirm</button>
                                </> : <> {showRemoveTagFromProduct ?
                                    <>
                                        <h4>Are you sure you want to remove this tag?</h4>
                                        <button onClick={() => setShowRemoveTagFromProduct(false)} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                                        <button onClick={confirmRemoveTag}>Confirm</button>
                                    </> : <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div
                                                style={{
                                                    width: '128px',
                                                    height: '128px',
                                                    border: '2px dashed #ccc',
                                                    overflow: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                }}
                                                onClick={() => document.getElementById('fileInput')?.click()}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                        setSelectedImage(e.dataTransfer.files[0]);
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={selectedImage ? `${URL.createObjectURL(selectedImage)}` : `http://localhost:8090/api/files/temu/${p.id}/${p.image}`}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ objectFit: 'contain' }}
                                                />
                                                {!selectedImage && !p.image && (
                                                    <b style={{ position: 'absolute', color: '#888', fontSize: '22px', textAlign: 'center' }}>
                                                        IMG
                                                    </b>
                                                )}
                                            </div>

                                            <input
                                                id="fileInput"
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setSelectedImage(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <p>
                                            <strong>NAME:</strong>
                                            <input
                                                type="text"
                                                value={editedProduct.name || ''}
                                                onChange={e => handleFieldChange('name', e.target.value)}
                                            />
                                        </p>
                                        <p>
                                            <strong>DESCRIPTION:</strong>
                                            <textarea rows={5} cols={30}
                                                placeholder="Write your description here..."
                                                value={editedProduct.description || ''}
                                                onChange={e => handleFieldChange('description', e.target.value)}
                                            ></textarea>
                                        </p>
                                        <p>
                                            <strong>PRICE:</strong>
                                            <input
                                                type="number"
                                                value={editedProduct.price || ''}
                                                onChange={e => handleFieldChange('price', Number(e.target.value))}
                                            />
                                        </p>
                                        <p>
                                            <strong>DISCOUNT:</strong>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={editedProduct.discount || ''}
                                                onChange={e => handleFieldChange('discount', Number(e.target.value))}
                                            />
                                        </p>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {p.tags?.map((tag, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        backgroundColor: '#eee',
                                                        padding: '5px 10px',
                                                        borderRadius: '15px',
                                                        fontSize: '12px',
                                                        color: '#333',
                                                        marginBottom: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => {
                                                        setShowRemoveTagFromProduct(true);
                                                        setShowAddTagToProduct(false);
                                                        setSelectedTag(tag);
                                                    }}
                                                    title-custom="Click to remove"
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                            {showAddTagToProduct ? <>
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="tag"
                                                        value={inputValue}
                                                        onChange={handleInputChange}
                                                        autoComplete="off"
                                                        name="tagInput"
                                                        ref={inputRef}
                                                        onKeyDown={handleKeyDown}
                                                        style={{
                                                            flex: 1,
                                                            padding: '8px',
                                                            fontSize: '14px',
                                                            borderRadius: '5px',
                                                            border: '1px solid #ccc',
                                                        }}
                                                    />
                                                    {selectedTag ? (
                                                        <div
                                                            key={'add'}
                                                            style={{
                                                                backgroundColor: '#eee',
                                                                padding: '5px 10px',
                                                                borderRadius: '15px',
                                                                fontSize: '12px',
                                                                color: '#333',
                                                                marginBottom: '5px',
                                                                cursor: 'pointer',
                                                                minWidth: 'fit-content'
                                                            }}
                                                            onClick={() => addTag(selectedTag)}
                                                        >
                                                            + {selectedTag}
                                                        </div>
                                                    ) : (
                                                        <div
                                                            key={'clear'}
                                                            style={{
                                                                backgroundColor: 'yellow',
                                                                padding: '5px 10px',
                                                                borderRadius: '15px',
                                                                fontSize: '12px',
                                                                color: 'black',
                                                                marginBottom: '5px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => {
                                                                setShowAddTagToProduct(false);
                                                                setInputValue('');
                                                                setSelectedTag('');
                                                            }}
                                                        >
                                                            ⨯
                                                        </div>
                                                    )}
                                                </div>

                                                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
                                                    {foundTags?.map((tag, index) => (
                                                        <li
                                                            key={index}
                                                            role="option"
                                                            style={{
                                                                padding: '8px 12px',
                                                                border: '1px solid #ccc',
                                                                marginBottom: '4px',
                                                                borderRadius: '4px',
                                                                backgroundColor: '#f9f9f9',
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s',
                                                            }}
                                                            onMouseEnter={(e) => (e.target as HTMLLIElement).style.backgroundColor = '#e0e0e0'}
                                                            onMouseLeave={(e) => (e.target as HTMLLIElement).style.backgroundColor = '#f9f9f9'}
                                                            onClick={() => {
                                                                setSelectedTag(foundTags[index]);
                                                                setInputValue(foundTags[index]);
                                                                setFoundTags([]);
                                                            }}
                                                        >
                                                            {tag}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </> : <div
                                                key={'add'}
                                                style={{
                                                    backgroundColor: '#eee',
                                                    padding: '5px 10px',
                                                    borderRadius: '15px',
                                                    fontSize: '12px',
                                                    color: '#333',
                                                    marginBottom: '5px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    setShowAddTagToProduct(true);
                                                    setTimeout(() => {
                                                        if (inputRef.current) {
                                                            inputRef.current.focus();
                                                        }
                                                    }, 100);

                                                }}
                                            >
                                                +
                                            </div>}
                                        </div>

                                        <hr />

                                        <button onClick={cancelEditing} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                                        <button onClick={confirmChanges}>Confirm</button>
                                        <button onClick={() => {
                                            setShowDeleteConfirm(true);
                                            setShowAddTagToProduct(false);
                                            setShowRemoveTagFromProduct(false);
                                        }} style={{ backgroundColor: 'red', color: 'white', position: 'absolute', bottom: '10px', right: '10px' }}>Delete</button>

                                    </>}</>}
                            </>
                        ) : (
                            <>
                                <div
                                    style={{
                                        width: '128px',
                                        height: '128px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <img
                                        src={`http://localhost:8090/api/files/temu/${p.id}/${p.image}`}
                                        width="100%"
                                        height="100%"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                                <p><strong>NAME:</strong> {p.name}</p>
                                <p><strong>DESCRIPTION:</strong> {p.description}</p>
                                <p><strong>PRICE:</strong> {p.price}</p>
                                <p><strong>DISCOUNT:</strong> {p.discount}</p>
                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {p.tags?.map((tag, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                backgroundColor: '#eee',
                                                padding: '5px 10px',
                                                borderRadius: '15px',
                                                fontSize: '12px',
                                                color: '#333',
                                                marginBottom: '5px'
                                            }}
                                        >
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                                <hr />
                                <button onClick={() => startEditing(p)}>Change</button>
                                {isCreating && <>
                                    <button onClick={() => startCopying(p)}>Copy</button>
                                    {copyingProductId === p.id && <button onClick={cancelEditing} style={{ backgroundColor: 'yellow' }}>Cancel</button>}
                                </>}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div >
    );
};

export default ProductsPage;