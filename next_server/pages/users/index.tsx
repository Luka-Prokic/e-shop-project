"use client"
import { useEffect, useState } from 'react';

interface User {
    id: any;
    username: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    avatar?: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [collumns, setCollumns] = useState<number>(4);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                const usersArray = data?.items ?? [];
                setUsers(usersArray);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(20, 1fr)`,
                gap: '20px',
                paddingLeft: '20px',
                paddingRight: '20px',
                background: 'red',
            }}>
                <a href={'products'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>PRODUCTS</h2></a>
                <a href={'tags'} style={{
                    color: 'white',
                    textDecoration: 'none'
                }}><h2>TAGS</h2></a>
            </div>
            <h1>Users</h1>
            <div style={{ userSelect: 'none' }}>
                <button onClick={() => setCollumns(prev => prev > 1 ? prev - 1 : prev)}><b>-</b></button>
                <span> collunms | {collumns} | </span>
                <button onClick={() => setCollumns(prev => prev < 20 ? prev + 1 : prev)}><b>+</b></button>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${collumns}, 1fr)`,
                gap: '20px',
                padding: '20px'
            }}>
                {users.map(user => (
                    <div key={user.id} style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'left' }}>
                        <img src={`http://localhost:8090/api/files/users/${user.id}/${user.avatar}`} width={'128px'} height={'128px'} />
                        <p> ID: {user.id}</p>
                        <p>USERNAME: <strong>{user.username}</strong></p>
                        <p>EMAIL: {user.email}</p>
                        <p>PHONE: {user.phone}</p>
                        <p>PASSWORD: <del>{user.password}</del></p>
                        <p>ADDRESS: {user.address}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersPage;