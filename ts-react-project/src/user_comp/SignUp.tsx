import Button from "../button_comp/Button";
import Container from "../container_comp/Container";
import Field from "../container_comp/Field";
import { ButtonStyle, ConStyle, ConType, InputStyle, InputType, Size } from "../helpers/compInterface";
import React, { useRef, useState } from "react";
import Input from "../input_comp/Input";
import validateEmail from "../helpers/validateEmail";
import Loader from "../image_comp/Loader";
import validatePassword from "../helpers/validatePassword";
import ProfilePicker from "../image_comp/ProfilePicker";
import PasswordConfirmInput from "../input_comp/PasswordConfirm";
import CountryInput from "../input_comp/CountryInput";
import { useUserContext } from "./UserContext";

const SIGNUP = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [place, setPlace] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [signUp, setSignUp] = useState('SIGN UP');
    const [signUpModal, setSignUpModal] = useState(true);
    const [namePlaceholder, setNamePlaceholder] = useState('username');
    const [emailPlaceholder, setEmailPlaceholder] = useState('email');
    const [passwordPlaceholder, setPasswordPlaceholder] = useState('password');
    const [repeatPasswordPlaceholder, setRepeatPasswordPlaceholder] = useState('repeat password');
    const [phonePlaceholder, setPhonePlaceholder] = useState('phone');
    const [countryPlaceholder, setCountryPlaceholder] = useState('country');
    const [placePlaceholder, setPlacePlaceholder] = useState('place');
    const [streetPlaceholder, setStreetPlaceholder] = useState('street');
    const [houseNumberPlaceholder, setHouseNumberPlaceholder] = useState('house number');
    const [passwordIns, setPasswordIns] = useState('none');
    const [passwordInsAnimation, setPasswordInsAnimation] = useState('0');
    const [step, setStep] = useState<number>(1);

    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const repeatPasswordRef = useRef<HTMLInputElement | null>(null);
    const phoneRef = useRef<HTMLInputElement | null>(null);
    const countryRef = useRef<HTMLInputElement | null>(null);
    const placeRef = useRef<HTMLInputElement | null>(null);
    const streetRef = useRef<HTMLInputElement | null>(null);
    const houseNumberRef = useRef<HTMLInputElement | null>(null);

    const { closeSignUpModal, fetchUserInfo } = useUserContext();

    const previousStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    }

    const nextStep = () => {
        setStep((prev) => prev + 1);
        validateInput();
    }

    const handlePasswordIns = () => {
        if (passwordIns === 'none') {
            setPasswordIns('block')
        } else {
            setPasswordIns('none')
            setPasswordInsAnimation('1')
            setTimeout(() => { setPasswordInsAnimation('0') }, 500)
        }
    }

    const validateInput = () => {
        if (step === 1) {
            if (!name) {
                setNamePlaceholder(' * username is required');
                nameRef.current?.focus();
                setStep(1);
            }
        }
        if (step === 2) {
            if (!phone) {
                setPhonePlaceholder(' * phone is required');
                phoneRef.current?.focus();
                setStep(2);
            }
            if (!email) {
                setEmailPlaceholder(' * email is required');
                emailRef.current?.focus();
                setStep(2);
            } else if (!validateEmail(email)) {
                setEmailPlaceholder('* invalid email format');
                setEmail('');
                emailRef.current?.focus();
                setStep(2);
            }
        }
        if (step === 3) {
            if (!password) {
                setPasswordPlaceholder('* password is required');
                passwordRef.current?.focus();
                setStep(3);
            } else if (!validatePassword(password)) {
                setPasswordPlaceholder('* invalid password');
                passwordRef.current?.focus();
                setStep(3);
            } else if (!repeatPassword) {
                setRepeatPasswordPlaceholder('* this is required');
                repeatPasswordRef.current?.focus();
                setStep(3);
            } else if (password !== repeatPassword) {
                setRepeatPasswordPlaceholder('* not same as password');
                repeatPasswordRef.current?.focus();
                setStep(3);
            }
        }
    }

    const resetModal = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRepeatPassword('');
        setPhone('');
        setCountry('');
        setStreet('');
        setHouseNumber('');
        setNamePlaceholder('username');
        setEmailPlaceholder('email');
        setPasswordPlaceholder('password');
        setRepeatPasswordPlaceholder('repeat password');
        setCountryPlaceholder('country');
        setStreetPlaceholder('street');
        setHouseNumberPlaceholder('house number');
        setPhonePlaceholder('phone');
        setSignUp('SIGN UP');
    };

    const handleSignUp = async () => {
        if (!country) {
            setCountryPlaceholder(' * country is required');
            countryRef.current?.focus();
            setStep(4);
            return;
        }
        if (!place) {
            setPlacePlaceholder(' * street is required');
            placeRef.current?.focus();
            setStep(4);
            return;
        }
        if (!street) {
            setStreetPlaceholder(' * street is required');
            streetRef.current?.focus();
            setStep(4);
            return;
        }
        if (!houseNumber) {
            setHouseNumberPlaceholder(' * house number is required');
            houseNumberRef.current?.focus();
            setStep(4);
            return;
        }

        try {
            setSignUp('Loading ');

            const base64Image = localStorage.getItem("ProfilePic");
            const imageName = localStorage.getItem("ProfilePicName");

            const formData = new FormData();
            formData.append('username', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('address', `${country}/${place}/${street}/${houseNumber}`);

            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {

                const data = await response.json();
                const fakeLoadingTime = Math.random() * 1000 + 1000;

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
                    closeSignUpModal();
                    resetModal();
                    fetchUserInfo(data.token);
                }, fakeLoadingTime + 100);


            } else {
                const fakeLoadingTime = Math.random() * 1000 + 1000;
                const errorData = await response.json();

                setTimeout(() => {
                    setSignUpModal(false);
                    resetModal();
                }, fakeLoadingTime);

                setTimeout(() => {
                    setSignUp(errorData.message);
                    setNamePlaceholder(' * username is required');
                    setSignUpModal(true);
                }, fakeLoadingTime + 100);

                setTimeout(() => {
                    nameRef.current?.focus();
                    setStep(1);
                }, fakeLoadingTime + 200);
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }

    };


    return (
        <Container style={ConStyle.BLUR} size={Size.FULLSCREEN}>
            {signUpModal && <Container style={ConStyle.GHOST} type={ConType.SIGNUP} size={Size.FOUR}>
                <div>
                    <Button size={Size.SEVEN} action={closeSignUpModal}>
                        EXIT
                    </Button>
                    <h2>{signUp === 'Loading ' && <Loader />}<b>{signUp}</b></h2>
                </div>
                <Field size={Size.LARGE}>
                    {(step === 1) && <>
                        <Input
                            ref={nameRef}
                            type={InputType.TEXT}
                            placeholder={namePlaceholder}
                            size={Size.LARGE}
                            value={name}
                            id={"usernameSignUpInput"}
                            name={"username"}
                            onChange={(e) => {
                                setName(e.target.value);
                                setNamePlaceholder('username');
                                setSignUp('SIGN UP');
                            }}
                            style={namePlaceholder.includes('*') ? InputStyle.ERROR : InputStyle.MIN}
                        />
                    </>}
                    {(step === 2) && <>
                        <Input
                            ref={emailRef}
                            type={InputType.EMAIL}
                            placeholder={emailPlaceholder}
                            size={Size.LARGE}
                            value={email}
                            id={"emailSignUpInput"}
                            name={"email"}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailPlaceholder('email');
                                setSignUp('SIGN UP');
                            }}
                            style={emailPlaceholder.includes('*') || emailPlaceholder.includes('Invalid') ? InputStyle.ERROR : InputStyle.MIN}
                        />
                        <Input
                            ref={phoneRef}
                            type={InputType.TEL}
                            placeholder={phonePlaceholder}
                            size={Size.LARGE}
                            value={phone}
                            id={"phoneSignUpInput"}
                            name={"phone"}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setPhonePlaceholder('phone');
                                setSignUp('SIGN UP');
                            }}
                            style={phonePlaceholder.includes('*') ? InputStyle.ERROR : InputStyle.MIN}
                        />
                    </>}
                    {(step === 3) && <>
                        <div>
                            <PasswordConfirmInput
                                passwordRef={passwordRef}
                                confirmPasswordRef={repeatPasswordRef}
                                placeholder={passwordPlaceholder}
                                confirmPlaceholder={repeatPasswordPlaceholder}
                                value={password}
                                confirmValue={repeatPassword}
                                styleFirst={passwordPlaceholder.includes('*') || passwordPlaceholder.includes('Invalid') ? InputStyle.ERROR : InputStyle.MIN}
                                styleSecond={repeatPasswordPlaceholder.includes('*') || repeatPasswordPlaceholder.includes('not') ? InputStyle.ERROR : InputStyle.MIN}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordPlaceholder('password');
                                }
                                }
                                onConfirmChange={(e) => {
                                    setRepeatPassword(e.target.value);
                                    setRepeatPasswordPlaceholder('repeat password');
                                }
                                }
                                id={"passwordInput"}
                                confirmId={"repeatPasswordInput"}
                                name={"password"}
                                confirmName={"repeatPassword"}
                            />
                            <hr />
                            <div>
                                <h4>Password must contain:</h4>
                                <h4 className='text-button' onMouseDown={handlePasswordIns}>
                                    {(passwordIns === 'block') ? 'show less' : 'show more...'}
                                </h4>
                            </div>
                            <section style={{
                                display: passwordIns
                            }}>
                                <li>A minimum of 8 characters</li>
                                <li>A minimum of 1 numeric character</li>
                                <li>At least 1 lowercase letter</li>
                                <li>At least 1 uppercase letter</li>
                            </section>
                            {(passwordInsAnimation === '1') ? <p style={{
                                display: (passwordIns === 'block') ? 'none' : 'block'
                            }}>
                            </p> : <div style={{
                                marginTop: '12px'
                            }} />}
                        </div>
                    </>}
                    {(step === 4) && (<>
                        <section>
                            <CountryInput
                                ref={countryRef}
                                type={InputType.TEXT}
                                placeholder={countryPlaceholder}
                                size={Size.LARGE}
                                value={country}
                                id={"countrySignUpInput"}
                                name={"country"}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                    setCountryPlaceholder('country');
                                    setSignUp('SIGN UP');
                                }}
                                style={countryPlaceholder.includes('*') ? InputStyle.ERROR : InputStyle.MIN}
                            />
                            <Input
                                ref={placeRef}
                                type={InputType.TEXT}
                                placeholder={placePlaceholder}
                                size={Size.LARGE}
                                value={place}
                                id={"placeSignUpInput"}
                                name={"place"}
                                onChange={(e) => {
                                    setPlace(e.target.value);
                                    setPlacePlaceholder('place');
                                    setSignUp('SIGN UP');
                                }}
                                style={countryPlaceholder.includes('*') ? InputStyle.ERROR : InputStyle.MIN}
                            />
                            <Input
                                ref={streetRef}
                                type={InputType.TEXT}
                                placeholder={streetPlaceholder}
                                size={Size.LARGE}
                                value={street}
                                id={"streetSignUpInput"}
                                name={"street"}
                                onChange={(e) => {
                                    setStreet(e.target.value);
                                    setStreetPlaceholder('street');
                                    setSignUp('SIGN UP');
                                }}
                                style={streetPlaceholder.includes('*') ? InputStyle.ERROR : InputStyle.MIN}
                            />
                            <Input
                                ref={houseNumberRef}
                                type={InputType.TEXT}
                                placeholder={houseNumberPlaceholder}
                                size={Size.LARGE}
                                value={houseNumber}
                                id={"houseNumberSignUpInput"}
                                name={"houseNumber"}
                                onChange={(e) => {
                                    setHouseNumber(e.target.value);
                                    setHouseNumberPlaceholder('house number');
                                    setSignUp('SIGN UP');
                                }}
                                style={houseNumberPlaceholder.includes('*') ? InputStyle.ERROR : InputStyle.MIN}
                            />
                        </section>
                    </>)}
                </Field>
                {(step === 1) && <ProfilePicker />}
                <section>
                    {(step > 1) && <Button style={ButtonStyle.BUBBLE} size={Size.SMALL} action={previousStep}><b>prev</b></Button>}
                    {(step === 4) ?
                        <Button style={ButtonStyle.BUBBLE} size={Size.SMALL} action={handleSignUp}><b>DONE</b></Button>
                        :
                        <Button style={ButtonStyle.BUBBLE} size={Size.SMALL} action={nextStep}><b>next</b></Button>
                    }
                </section>
            </Container>}
        </Container>
    );
};

export default SIGNUP;