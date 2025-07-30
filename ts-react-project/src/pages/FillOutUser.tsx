import './FillOutUser.css'
import React, { useEffect, useRef, useState } from "react";
import { ButtonStyle, ConStyle, ConType, ExcludeFullscreen, InputStyle, InputType, Size } from "../helpers/compInterface";
import { IPage } from './ProductPage';
import Button from "../button_comp/Button";
import Container from "../container_comp/Container";
import Input from "../input_comp/Input";
import { User, useUserContext } from "../user_comp/UserContext";
import PasswordInput from '../input_comp/Password';
import validatePassword from '../helpers/validatePassword';
import PasswordIns from '../helpers/PasswordIns';

const checkIfUserExists = async (identifier: string): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:3000/api/users?identifier=${encodeURIComponent(identifier)}`, {
            method: 'GET',
        });

        if (response.status === 200) {
            return true;
        } else if (response.status === 404) {
            return false;
        } else {
            console.error('Unexpected response:', await response.text());
            return false;
        }
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
};



const FillOutUser: React.FC<IPage> = ({ size = Size.FULLSCREEN }) => {
    const { user, updateUser, isLoggedIn, fetchUserInfo, setCheckoutPage } = useUserContext();

    const [username, setUsername] = useState(user?.username || "");
    const [password, setPassword] = useState("");

    const [usernamePlaceholder, setUsernamePlaceholder] = useState("Username");
    const [passwordPlaceholder, setPasswordPlaceholder] = useState("Password");

    const [response, setResponse] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const nameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const handleBlur = async (field: keyof User, value: string) => {
        if (updateUser) {
            updateUser(field, value);
        }
    };

    const handleLogIn = async () => {
        if (!username) {
            return;
        }
        // if (!password) {
        //     setPasswordPlaceholder('* password is required')
        //     passwordRef.current?.focus();
        //     return;
        // } else if (!validatePassword(password)) {
        //     setPasswordPlaceholder('* invalid password')
        //     passwordRef.current?.focus();
        //     return;
        // }
        if (!user?.email) {
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('email', user?.email);
            formData.append('username', username);
            formData.append('password', password);

            console.log(user?.email)
            console.log(username)
            console.log(password)

            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: formData,
            });
            if (response.ok) {

                const data = await response.json();
                const fakeLoadingTime = Math.random() * 1000;

                setTimeout(() => {
                    localStorage.setItem('authToken', data.token);
                }, fakeLoadingTime);

                setTimeout(() => {
                    fetchUserInfo(data.token);
                    setResponse(0)
                    setLoading(false);
                }, fakeLoadingTime + 100);


            } else {
                const data = await response.json();
                const fakeLoadingTime = Math.random() * 1000;

                setTimeout(() => {
                    if (data.message === 'User already exists') {
                        // updateUser('username', '');
                        // updateUser('email', '');
                        setUsername(' ');
                        setResponse(1)
                        setLoading(false);
                    }
                }, fakeLoadingTime);

            }
        } catch (error) {
            console.error('Error signing up:', error);
        }

    };

    const handleSignUp = async () => {
        if (!username) {
            return;
        }
        if (!password) {
            setPasswordPlaceholder('* password is required')
            passwordRef.current?.focus();
            return;
        } else if (!validatePassword(password)) {
            setPasswordPlaceholder('* invalid password')
            passwordRef.current?.focus();
            return;
        }
        if (!user?.email) {
            return;
        }
        // if (!houseNumber) {
        //     setHouseNumberPlaceholder(' * house number is required');
        //     houseNumberRef.current?.focus();
        //     return;
        // }
        try {
            setLoading(true);

            const base64Image = localStorage.getItem("ProfilePic");
            const imageName = localStorage.getItem("ProfilePicName");

            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', user?.email);
            formData.append('password', password);
            formData.append('phone', user?.phone);
            formData.append('address', `${user?.country}/${user?.place}/${user?.street}/${user?.houseNumber}`);

            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {

                const data = await response.json();
                const fakeLoadingTime = Math.random() * 1000;

                await fetch('http://localhost:3000/api/users/avatar', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${data.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ base64Image, imageName }),
                });

                setTimeout(() => {
                    localStorage.setItem('authToken', data.token);
                }, fakeLoadingTime);

                setTimeout(() => {
                    fetchUserInfo(data.token);
                    setResponse(0)
                    setLoading(false);
                }, fakeLoadingTime + 100);


            } else {
                const data = await response.json();
                const fakeLoadingTime = Math.random() * 1000;

                setTimeout(() => {
                    if (data.message === 'User already exists') {
                        // updateUser('username', '');
                        // updateUser('email', '');
                        setUsername(' ');
                        setResponse(1)
                        setLoading(false);
                    }
                }, fakeLoadingTime);

            }
        } catch (error) {
            console.error('Error signing up:', error);
        }

    };


    const checkUsername = async () => {
        if (user?.username) {
            const usernameExists = await checkIfUserExists(user.username);
            if (usernameExists)
                setResponse(1);
            else
                setResponse(0);
        }
    }

    const checkEmail = async () => {
        if (user?.email) {
            const emailExists = await checkIfUserExists(user.email);
            if (emailExists)
                setResponse(1);
            else
                setResponse(0);
        }
    }

    const checkUser = async () => {
        if (user?.username && response === 0) {
            const usernameExists = await checkIfUserExists(user.username);
            if (usernameExists)
                setResponse(1);
            else
                checkEmail();
        }
        if (user?.email && response === 0) {
            const emailExists = await checkIfUserExists(user.email);
            if (emailExists)
                setResponse(1);
            else
                checkUsername();
        }
    };

    useEffect(() => {
        if (user?.username || user?.email) {
            checkUser();
        }
    }, [user?.username, user?.email]);

    const focusOnModal = () => {
        const element = document.querySelector(".user-checkout-part");
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
    };


    return (<>
        {!isLoggedIn && <section className={`user-checkout-part ${size}`}>
            {!showModal ?
                <Button action={() => { setShowModal(true); focusOnModal(); }} style={ButtonStyle.BUBBLE}>
                   <b>Account?</b> 
                </Button>
                :
                <Container style={ConStyle.GHOST} size={Size.LARGE} type={ConType.CHECKOUT}>
                    {response === 1 ? <b>LOG IN</b> : <b>MAKE ACC ?</b>}
                    <Container style={ConStyle.FRONT} size={Size.MAX} type={ConType.FC}>
                        <Container style={ConStyle.FRONT} size={Size.LARGE} type={ConType.FC}>
                            <Input
                                type={InputType.EMAIL}
                                placeholder={usernamePlaceholder}
                                size={Size.MAX}
                                value={username}
                                id="usernameCheckoutInput"
                                name="username"
                                onChange={(e) => { setUsername(e.target.value); setUsernamePlaceholder('Username'); }}
                                onBlur={(e) => handleBlur("username", e.target.value)}
                                style={usernamePlaceholder.includes('*') || usernamePlaceholder.includes('Invalid') ? InputStyle.ERROR : InputStyle.MIN}
                                ref={nameRef}
                            />
                            <PasswordInput
                                placeholder={passwordPlaceholder}
                                size={Size.MAX}
                                value={password}
                                id="passwordCheckoutInput"
                                name="password"
                                onChange={(e) => { setPassword(e.target.value); setPasswordPlaceholder('Password'); }}
                                onBlur={(e) => handleBlur("password", e.target.value)}
                                style={passwordPlaceholder.includes('*') || passwordPlaceholder.includes('Invalid') ? InputStyle.ERROR : InputStyle.MIN}
                                ref={passwordRef}
                            />
                            <hr />
                            <PasswordIns size={Size.MAX} />
                        </Container>
                    </Container>
                    <Container style={ConStyle.FRONT} size={(username && password) ? Size.MAX : Size.NONE} type={ConType.FC}>
                        {response === 1 && <Button style={ButtonStyle.BUBBLE} size={Size.LARGE} action={() => handleLogIn()} freeze={loading}
                            titleCustom='Log in'>
                            <b>LOG IN</b>
                        </Button>}
                        {response === 0 && <Button style={ButtonStyle.BUBBLE} size={Size.LARGE} action={() => handleSignUp()} freeze={loading}
                            titleCustom='Sing up'>
                            <b>SIGN UP</b>
                        </Button>}
                    </Container>
                </Container>}
        </section >}
    </>
    );
};

export default FillOutUser;