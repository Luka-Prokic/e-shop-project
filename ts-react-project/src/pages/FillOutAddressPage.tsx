import React, { useEffect, useState } from "react";
import { ButtonStyle, ConStyle, ConType, InputStyle, InputType, Size } from "../helpers/compInterface";
import './FillOutAddressPage.css';
import { IPage } from './ProductPage';
import Button from "../button_comp/Button";
import Container from "../container_comp/Container";
import Input from "../input_comp/Input";
import CountryInput from "../input_comp/CountryInput";
import { defUser, User, useUserContext } from "../user_comp/UserContext";
import Map from "../input_comp/Map";
import ClickMap from "../input_comp/ClickMap";

const FillOutAddressPage: React.FC<IPage> = ({ size = Size.FULLSCREEN, page }) => {
    const { user, updateUser, checkoutPage, setCheckoutPage } = useUserContext();

    const [country, setCountry] = useState(user?.country || "");
    const [place, setPlace] = useState(user?.place || "");
    const [street, setStreet] = useState(user?.street || "");
    const [houseNumber, setHouseNumber] = useState(user?.houseNumber || "");

    const [clickOnMap, setClickOnMap] = useState<boolean>(false);

    const handleBlur = (field: keyof User, value: string) => {
        if (updateUser) {
            updateUser(field, value);
        }
    };

    useEffect(() => {
        if (user) {
            setCountry(user.country || "");
            setPlace(user.place || "");
            setStreet(user.street || "");
            setHouseNumber(user.houseNumber || "");
        }
    }, [user]);

    useEffect(() => {
        if (clickOnMap) {
            let element = document.querySelector(".address-map-click");
            if (!element)
                element = document.querySelector(".address-checkout-part");

            element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [clickOnMap]);

    return (
        <section className={`address-checkout-part ${!clickOnMap ? size : Size.MAX}`}>
            <Container style={ConStyle.GHOST} size={Size.LARGE} type={ConType.CHECKOUT}>
                {[2, 3, 4].includes(checkoutPage) && <> {clickOnMap ? <b>CLICK YOUR ADDRESS:</b> : <b>ENTER YOUR ADDRESS :</b>} </>}
                {clickOnMap ? (
                    <div className="address-map-click max" title-custom={`${country} | ${place} | ${street} | ${houseNumber}`}>
                        <ClickMap zoom={user === defUser ? 4 : 16}></ClickMap>
                    </div>
                ) : (
                    <Container style={ConStyle.FRONT} size={Size.LARGE} type={ConType.FC}>
                        <Container style={ConStyle.FRONT} size={Size.SIX} type={ConType.FC}>
                            <CountryInput
                                type={InputType.TEXT}
                                placeholder="Country"
                                size={Size.LARGE}
                                value={country}
                                id="countryCheckoutInput"
                                name="country"
                                onChange={(e) => setCountry(e.target.value)}
                                onBlur={(e) => handleBlur("country", e.target.value)}
                                style={InputStyle.MIN}
                            />
                            <Input
                                type={InputType.TEXT}
                                placeholder="Place"
                                size={Size.LARGE}
                                value={place}
                                id="placeCheckoutInput"
                                name="place"
                                onChange={(e) => setPlace(e.target.value)}
                                onBlur={(e) => handleBlur("place", e.target.value)}
                                style={InputStyle.MIN}
                            />
                            <div>
                                <Input
                                    type={InputType.TEXT}
                                    placeholder="Street"
                                    size={Size.SIX}
                                    value={street}
                                    id="streetCheckoutInput"
                                    name="street"
                                    onChange={(e) => setStreet(e.target.value)}
                                    onBlur={(e) => handleBlur("street", e.target.value)}
                                    style={InputStyle.MIN}
                                />
                                <Input
                                    type={InputType.TEXT}
                                    placeholder="House Number"
                                    size={Size.SMALL}
                                    value={houseNumber}
                                    id="houseNumberCheckoutInput"
                                    name="houseNumber"
                                    onChange={(e) => setHouseNumber(e.target.value)}
                                    onBlur={(e) => handleBlur("houseNumber", e.target.value)}
                                    style={InputStyle.MIN}
                                />
                            </div>
                        </Container>
                        <div className="address-map m" title-custom="double click" onDoubleClick={() => setClickOnMap(true)}>
                            <Map zoom={user === defUser ? 10 : 17}></Map>
                        </div>
                    </Container>
                )}
                <Container style={ConStyle.FRONT} size={Size.MAX} type={ConType.FC}>
                    {clickOnMap ? <Button style={ButtonStyle.BUBBLE} size={Size.MAX} action={() => setClickOnMap(false)}>
                        <b>RETURN</b>
                    </Button> : <>{checkoutPage === 2 && <>
                        <Button style={ButtonStyle.BUBBLE} size={Size.MAX} action={() => setCheckoutPage(page ? page - 1 : 1)}>
                            <b>PREV</b>
                        </Button>
                        <Button style={ButtonStyle.BUBBLE} size={(country && place && street && houseNumber) ? Size.MAX : Size.NONE} action={() => setCheckoutPage(page ? page + 1 : 1)}>
                            <b>NEXT</b>
                        </Button>
                    </>}</>}
                </Container>
            </Container>
        </section >
    );
};

export default FillOutAddressPage;