import Button from "../button_comp/Button";
import Container from "../container_comp/Container";
import Field from "../container_comp/Field";
import { ButtonStyle, ConStyle, ConType, InputStyle, InputType, Size } from "../helpers/compInterface";
import React, { useRef, useState } from "react";
import Input from "../input_comp/Input";
import validateEmail from "../helpers/validateEmail";
import Loader from "../image_comp/Loader";
import PasswordInput from "../input_comp/Password";
import { useUserContext } from "./UserContext";

const LOGIN = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState('LOGIN');
    const [loginModal, setLoginModal] = useState(true);
    const [identifierPlaceholder, setIdentifierPlaceholder] = useState('username or email');
    const [passwordPlaceholder, setPasswordPlaceholder] = useState('password');

    const identifierRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const { closeLoginModal, openSignUpModal, fetchUserInfo } = useUserContext();

    const openSignUpInstead = () => {
        openSignUpModal();
        closeLoginModal();
    }

    const handleIdentifierChange = (value: string) => {
        setIdentifier(value);

        if (value.includes('@')) {
            setIdentifierPlaceholder('email');
        } else {
            setIdentifierPlaceholder('username');
        }

        setLogin('LOGIN');
    };

    const handleLogin = async () => {
        const isEmail = validateEmail(identifier);

        if (!identifier) {
            setIdentifierPlaceholder(' * username or email is required');
            identifierRef.current?.focus();
            return;
        }
        if (!isEmail && identifier.includes('@')) {
            setIdentifierPlaceholder('Invalid email format');
            setIdentifier('');
            identifierRef.current?.focus();
            return;
        }
        if (!password) {
            setPasswordPlaceholder(' * password is required');
            passwordRef.current?.focus();
            return;
        }

        try {
            setLogin('Loading ');
            const response = await fetch('http://localhost:3000/api/ilogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });

            if (response.ok) {

                const data = await response.json();
                const fakeLoadingTime = Math.random() * 200 + 100;

                setTimeout(() => {
                    localStorage.setItem('authToken', data.token);
                }, fakeLoadingTime);

                setTimeout(() => {
                    closeLoginModal();
                    resetModal();
                    fetchUserInfo(data.token);
                }, fakeLoadingTime + 100);


            } else {
                const fakeLoadingTime = Math.random() * 1000 + 1000;
                const errorData = await response.json();
                setTimeout(() => {
                    setLoginModal(false);
                    resetModal();
                }, fakeLoadingTime);
                setTimeout(() => {
                    setLogin(errorData.message);
                    setIdentifierPlaceholder(' * username or email is required');
                    setLoginModal(true);
                }, fakeLoadingTime + 100);
                setTimeout(() => {
                    identifierRef.current?.focus();
                }, fakeLoadingTime + 200);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const resetModal = () => {
        setIdentifier('');
        setPassword('');
        setIdentifierPlaceholder('username or email');
        setPasswordPlaceholder('password');
        setLogin('LOGIN');
    };

    return (
        <Container style={ConStyle.BLUR} size={Size.FULLSCREEN}>
            {loginModal && (
                <Container style={ConStyle.GHOST} type={ConType.LOGIN} size={Size.FOUR}>
                    <div>
                        <Button size={Size.SEVEN} action={closeLoginModal}>
                            EXIT
                        </Button>
                        <h2>{login === 'Loading ' && <Loader />}<b>{login}</b></h2>
                    </div>
                    <Field size={Size.LARGE}>
                        <Input
                            ref={identifierRef}
                            type={validateEmail(identifier) ? InputType.EMAIL : InputType.TEXT}
                            placeholder={identifierPlaceholder}
                            size={Size.LARGE}
                            value={identifier}
                            id={"identifierLoginInput"}
                            name={"identifier"}
                            onChange={(e) => {
                                handleIdentifierChange(e.target.value);
                            }}
                            style={identifierPlaceholder.includes('required') || identifierPlaceholder.includes('Invalid') ? InputStyle.ERROR : InputStyle.MIN}
                        />
                        <PasswordInput
                            ref={passwordRef}
                            type={InputType.PASSWORD}
                            placeholder={passwordPlaceholder}
                            size={Size.LARGE}
                            value={password}
                            id={"passwordLoginInput"}
                            name={"password"}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordPlaceholder('password');
                                setLogin('LOGIN');
                            }}
                            style={passwordPlaceholder.includes('required') || passwordPlaceholder.includes('Invalid') ? InputStyle.ERROR : InputStyle.MIN}
                        />
                    </Field>
                    <Button style={ButtonStyle.BUBBLE} size={Size.FOUR} action={handleLogin}>
                        <b>Log in</b>
                    </Button>
                    <hr />
                    <Button style={ButtonStyle.TEXT} size={Size.SMALL} action={openSignUpInstead}>
                        Sign up?
                    </Button>
                </Container>
            )}
        </Container>
    );
};

export default LOGIN;