"use client"
import { useEffect, useState } from 'react';

interface Tag {
    id: any;
    name: string;
    special: boolean;
    description?: string;
}

const ProductsPage = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [columns, setColumns] = useState<number>(4);
    const [loading, setLoading] = useState(true);
    const [editingTagId, setEditingTagId] = useState<any>(null);
    const [copyingTagId, setCopyingTagId] = useState<any>(null);
    const [editedTag, setEditedTag] = useState<Partial<Tag>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const startEditing = (tag: Tag) => {
        setEditingTagId(tag.id);
        setEditedTag({ ...tag });
        setIsCreating(false);
    };

    const startCopying = async (tag: Tag) => {
        setEditedTag({ ...tag });
        setCopyingTagId(tag.id);
    };

    const cancelEditing = () => {
        setEditingTagId(null);
        setCopyingTagId(null);
        setEditedTag({});
    };

    const confirmDelete = async () => {
        if (editedTag) {
            const id = editedTag.id;
            try {
                await fetch('/api/tags/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                });
            } catch (error) {
                console.error('Error removing product:', error);
            }

            setTags(tags.filter(t => t.id !== editedTag.id));
        }
        setShowDeleteConfirm(false);
        cancelEditing();
    };

    const confirmChanges = async () => {
        try {
            const { id, name, special, description } = editedTag;

            const response = await fetch('/api/tags/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, special, description }),
            });
        } catch (error) {
            console.error('Error updating product:', error);
        }

        setTags(prevTags => prevTags.map(t =>
            t.id === editingTagId ? { ...t, ...editedTag } : t
        ));

        cancelEditing();
    };

    const handleFieldChange = (field: keyof Tag, value: string | boolean) => {
        setEditedTag(prev => ({ ...prev, [field]: value }));
    };

    const createNewTag = async () => {
        if (!editedTag.name) {
            alert('Please provide tag name');
            return;
        }

        try {
            const { name, special, description } = editedTag;

            await fetch('/api/tags/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, special, description }),
            });
        } catch (error) {
            console.error('Error adding tag:', error);
        }

        cancelEditing();
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

        fetchTags();
    }, [createNewTag]);

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
                    <a href={'users'} style={{
                        color: 'white',
                        textDecoration: 'none'
                    }}><h2>USERS</h2></a>
                    <a href={'products'} style={{
                        color: 'white',
                        textDecoration: 'none'
                    }}><h2>PRODUCTS</h2></a>
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
                <a href={'users'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>USERS</h2></a>
                <a href={'products'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>PRODUCTS</h2></a>
            </div>

            <div style={{ userSelect: 'none' }}>
                <h1>Tags</h1>
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
                        <h2>Create New Tag</h2>
                        <p>
                            <strong>NAME:</strong>
                            <input
                                type="text"
                                value={editedTag.name || ''}
                                onChange={e => handleFieldChange('name', e.target.value.toUpperCase())}
                            />
                        </p>
                        <p>
                            <strong>DESCRIPTION:</strong>
                            <textarea rows={5} cols={30}
                                placeholder="Write your description here..."
                                value={editedTag.description || ''}
                                onChange={e => handleFieldChange('description', e.target.value)}
                            ></textarea>
                        </p>
                        <p>
                            <input
                                type="checkbox"
                                checked={editedTag.special || false}
                                onChange={e => handleFieldChange('special', e.target.checked)}
                            />
                            <i>SPECIAL</i>
                        </p>
                        <button onClick={() => setIsCreating(false)} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                        <button onClick={createNewTag}>Create Tag</button>
                    </div>
                ) : (<button onClick={() => {
                    setIsCreating(true);
                    cancelEditing();
                }}>+ Create New Tag</button>)}

                {tags.slice().reverse().map(t => (
                    <div key={t.id} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left', position: 'relative' }}>
                        <p><strong>ID:</strong> {t.id}</p>

                        {editingTagId === t.id ? (
                            <>{showDeleteConfirm ?
                                <div className="modal">
                                    <div className="modal-content">
                                        <h4>Are you sure you want to delete this tag?</h4>
                                        <button onClick={() => setShowDeleteConfirm(false)} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                                        <button onClick={confirmDelete}>Confirm</button>
                                    </div>
                                </div> : <>
                                    <p>
                                        <strong>NAME:</strong>
                                        <input
                                            type="text"
                                            value={editedTag.name || ''}
                                            onChange={e => handleFieldChange('name', e.target.value.toUpperCase())}
                                        />
                                    </p>
                                    <p>
                                        <strong>DESCRIPTION:</strong>
                                        <textarea rows={5} cols={30}
                                            placeholder="Write your description here..."
                                            value={editedTag.description || ''}
                                            onChange={e => handleFieldChange('description', e.target.value)}
                                        ></textarea>
                                    </p>
                                    <p>
                                        <input
                                            type="checkbox"
                                            checked={editedTag.special || false}
                                            onChange={e => handleFieldChange('special', e.target.checked)}
                                        />
                                        <i>SPECIAL</i>
                                    </p>

                                    <button onClick={cancelEditing} style={{ backgroundColor: 'yellow' }}>Cancel</button>
                                    <button onClick={confirmChanges}>Confirm</button>
                                    <button onClick={() => setShowDeleteConfirm(true)} style={{ backgroundColor: 'red', color: 'white', position: 'absolute', bottom: '10px', right: '10px' }}>Delete</button>

                                </>}
                            </>
                        ) : (
                            <>
                                <h1>#{t.name}</h1>
                                <hr />
                                <p><strong>DESCRIPTION: </strong>{t.description}</p>
                                {t.special && <p><i>SPECIAL</i></p>}
                                <button onClick={() => startEditing(t)}>Change</button>
                                {isCreating && <>
                                    <button onClick={() => startCopying(t)}>Copy</button>
                                    {copyingTagId === t.id && <button onClick={cancelEditing} style={{ backgroundColor: 'yellow' }}>Cancel</button>}
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