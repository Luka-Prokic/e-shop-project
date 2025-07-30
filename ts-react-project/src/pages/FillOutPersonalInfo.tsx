import './FillOutPersonalInfo.css'
import React, { useState } from "react";
import { ButtonStyle, ButtonType, ConStyle, ConType, InputStyle, InputType, Size } from "../helpers/compInterface";
import { IPage } from './ProductPage';
import Button from "../button_comp/Button";
import Container from "../container_comp/Container";
import Input from "../input_comp/Input";
import { User, useUserContext } from "../user_comp/UserContext";

const FillOutPersonalInfo: React.FC<IPage> = ({ size = Size.FULLSCREEN, page }) => {
    const { user, checkoutPage, setCheckoutPage, handleRememberUser, updateUser } = useUserContext();

    const [name, setName] = useState(user?.name || "");
    const [surname, setSurname] = useState(user?.surname || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");

    const handleBlur = (field: keyof User, value: string) => {
        if (updateUser) {
            updateUser(field, value);
        }
    };



    return (
        <section className={`personal-checkout-part ${size}`}>
            <Container style={ConStyle.GHOST} size={Size.LARGE} type={ConType.CHECKOUT}>
                {[4].includes(checkoutPage) && <b>ENTER YOUR PERSONAL INFO :</b>}
                <Container style={ConStyle.FRONT} size={Size.MAX} type={ConType.FC}>
                    <Container style={ConStyle.FRONT} size={Size.LARGE} type={ConType.FC}>
                        <div>
                            <Input
                                type={InputType.TEXT}
                                placeholder="Name"
                                size={Size.THREE}
                                value={name}
                                id="nameCheckoutInput"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                onBlur={(e) => handleBlur("name", e.target.value)}
                                style={InputStyle.MIN}
                            />
                            <Input
                                type={InputType.TEXT}
                                placeholder="Surname"
                                size={Size.LARGE}
                                value={surname}
                                id="surnameCheckoutInput"
                                name="surname"
                                onChange={(e) => setSurname(e.target.value)}
                                onBlur={(e) => handleBlur("surname", e.target.value)}
                                style={InputStyle.MIN}
                            />
                        </div>
                        <Input
                            type={InputType.EMAIL}
                            placeholder="Email"
                            size={Size.LARGE}
                            value={email}
                            id="emailCheckoutInput"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => handleBlur("email", e.target.value)}
                            style={InputStyle.MIN}
                        />
                        <Input
                            type={InputType.TEL}
                            placeholder="Phone"
                            size={Size.LARGE}
                            value={phone}
                            id="phoneCheckoutInput"
                            name="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={(e) => handleBlur("phone", e.target.value)}
                            style={InputStyle.MIN}
                        />
                        {phone && email && name && surname && <Button style={ButtonStyle.BUBBLE} size={Size.MAX} type={ButtonType.TOGGLE} action={() => handleRememberUser()}>
                            <b>REMEBER ME</b>
                        </Button>}
                    </Container>
                </Container>
                <Container style={ConStyle.FRONT} size={Size.MAX} type={ConType.FC}>
                    <>{checkoutPage === 4 && <>
                        <Button style={ButtonStyle.BUBBLE} size={Size.MAX} action={() => setCheckoutPage(page ? page - 1 : 1)}>
                            <b>PREV</b>
                        </Button>
                        <Button style={ButtonStyle.BUBBLE} size={(phone && email && name && surname) ? Size.MAX : Size.NONE} action={() => setCheckoutPage(page ? page + 1 : 1)}>
                            <b>NEXT</b>
                        </Button>
                    </>}</>
                </Container>
            </Container>
        </section >
    );
};

export default FillOutPersonalInfo;