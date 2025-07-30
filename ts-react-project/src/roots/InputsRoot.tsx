import Button from "../button_comp/Button";
import Container from "../container_comp/Container";
import React from "react";
import { ButtonStyle, ConType, InputType, Size } from "../helpers/compInterface";
import Field from "../container_comp/Field";
import Input from "../input_comp/Input";
import CCV from "../input_comp/CCV";
import CreditCard from "../input_comp/CreditCard";


const InputsRoot = () => {
    return (<>
        <Container
            type={ConType.FC}
            size={Size.FULLSCREEN}
        >
            <Field
                type={ConType.CCF}
                size={Size.SMALL}
            >
                <div style={{ display: "flex" }}>
                    <Input
                        size={Size.LARGE}
                        placeholder="name"
                    >
                    </Input>
                    <CCV
                        size={Size.SMALL}
                    >
                    </CCV>
                </div>
                <CreditCard
                    size={Size.MAX}
                >
                </CreditCard>
                <Input
                    size={Size.MAX}
                    type={InputType.PASSWORD}
                    placeholder='password'
                >
                </Input>
                <Button
                    style={ButtonStyle.PORT}
                    size={Size.MAX}
                >
                    submit
                </Button>
            </Field>
        </Container>
    </>)
}

export default InputsRoot;