import { useState, useEffect, createContext, useContext } from 'react';
import React from 'react';
import { ButtonStyle } from '../helpers/compInterface';
import './User.css';

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextType {
    user: User | null;
    checkoutPage: number;
    isLoggedIn: boolean;
    rememberUser: boolean;
    showLoginModal: boolean;
    showSignUpModal: boolean;
    setCheckoutPage: (newPage: number) => void;
    fetchUserInfo: (token: string) => void;
    closeLoginModal: () => void;
    closeSignUpModal: () => void;
    openSignUpModal: () => void;
    handleLogOut: () => void;
    updateUser: (field: keyof User, value: string) => void;
    updateUserAddress: (value: Address) => void;
    openLoginModal: () => void;
    refreshUserInfo: () => void;
    handleRememberUser: () => void;
}

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export interface Address {
    country: string;
    place: string;
    street: string;
    houseNumber: string;
}

export interface User {
    name: string;
    surname: string;
    username: string;
    email: string;
    phone: string;
    country: string;
    place: string;
    street: string;
    houseNumber: string;
    password: string;
}

export interface IUser {
    style?: ButtonStyle;
    children?: React.ReactNode;
}

export const defUser: User = {
    name: '',
    surname: '',
    username: '',
    email: '',
    phone: '',
    country: '',
    place: '',
    street: '',
    houseNumber: '',
    password: '',
};

const UserProvider: React.FC<IUser> = ({ children }) => {
    const getStoredUser = (): User => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : defUser;
    };

    const [user, setUser] = useState<User>(getStoredUser);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
    const [rememberUser, setRememberUser] = useState<boolean>(() => {
        return localStorage.getItem('user') ? true : false;
    });
    const [checkoutPage, setCheckoutPageState] = useState<number>(1);
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('authToken'));

    const refreshUserInfo = () => {
        const token = localStorage.getItem('authToken');
        if (token)
            fetchUserInfo(token);
    }

    const handleRememberUser = () => {
        setRememberUser(!rememberUser);
        if (!rememberUser && user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    const setCheckoutPage = (newPage: number) => {
        const clampedPage = Math.min(5, Math.max(1, newPage));
        setCheckoutPageState(clampedPage);
    };

    const fetchUserInfo = async (token: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                handleLogOut();
                return;
            }

            const data = await response.json();
            const fetchedUser = data?.user;

            if (fetchedUser) {
                const { username, email, phone, address: addressString } = fetchedUser;
                const addressParts = addressString.split('/').filter(Boolean);
                const [country, place, street, houseNumber] = addressParts;

                const newUser: User = {
                    name: '',
                    surname: '',
                    username: username || '',
                    email: email || '',
                    phone: phone || '',
                    country: country || '',
                    place: place || '',
                    street: street || '',
                    houseNumber: houseNumber || '',
                    password: '',
                };

                if (!user)
                    setUser(newUser);
                if (rememberUser) {
                    localStorage.setItem('user', JSON.stringify(newUser));
                }
                setIsLoggedIn(true);
            } else {
                handleLogOut();
            }
        } catch (error) {
            handleLogOut();
        }
    };

    const openLoginModal = () => setShowLoginModal(true);

    const openSignUpModal = () => setShowSignUpModal(true);

    const closeLoginModal = () => setShowLoginModal(false);

    const closeSignUpModal = () => setShowSignUpModal(false);

    const handleLogOut = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        if (!rememberUser)
            setUser(defUser);
    };

    const updateUser = (field: keyof User, value: string) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            [field]: value,
        };

        setUser(updatedUser);

        if (rememberUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const updateUserAddress = (value: Address) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            country: value.country,
            place: value.place,
            street: value.street,
            houseNumber: value.houseNumber,
        };

        setUser(updatedUser);

        if (rememberUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    useEffect(() => {
        if (showLoginModal || showSignUpModal) {
            document.body.style.position = 'fixed';
        } else {
            document.body.style.position = 'inherit';
        }

        return () => {
            document.body.style.position = 'inherit';
        };
    }, [showLoginModal, showSignUpModal]);

    return (
        <UserContext.Provider value={{
            user,
            checkoutPage,
            isLoggedIn,
            rememberUser,
            showLoginModal,
            showSignUpModal,
            updateUser,
            updateUserAddress,
            closeLoginModal,
            closeSignUpModal,
            openSignUpModal,
            handleLogOut,
            setCheckoutPage,
            fetchUserInfo,
            openLoginModal,
            handleRememberUser,
            refreshUserInfo,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;