import { useEffect, useState } from 'react';
import React from 'react';
import ImagE from './Image';
import { useUserContext } from '../user_comp/UserContext';

const ProfileImage = ({ size }) => {
    const [profilePic, setProfilePic] = useState('../dump/profil.png');
    const { handleLogOut } = useUserContext();

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            fetch('http://localhost:3000/api/users/avatar', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        handleLogOut();
                    }
                })
                .then(data => {
                    if (data && data.avatar) {
                        setProfilePic(data.avatar);
                    }
                })

        } else {
            handleLogOut();
        }
    }, [localStorage.getItem('authToken')]);

    return (
        <ImagE
            src={profilePic}
            size={size}
        />
    );
};

export default ProfileImage;