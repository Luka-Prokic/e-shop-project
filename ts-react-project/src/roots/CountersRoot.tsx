import Container from "../container_comp/Container";
import React from "react";
import { ButtonStyle, ConStyle, ConType, InputType, Size } from "../helpers/compInterface";
import Counter from "../button_comp/Counter";
import Buy from "../button_comp/Buy";
import Lake from "../custom_comp/Lake";


const CountersRoot = () => {
    return (<>
        <Container
            type={ConType.FC}
            size={Size.FULLSCREEN}
        >
            <Counter
                size={Size.ONE}
                style={ButtonStyle.JAVA}
            />
            <Counter
                size={Size.ONE}
                style={ButtonStyle.BUBBLE}
            />
            <Counter
                size={Size.ONE}
                style={ButtonStyle.PORT}
            ></Counter>
            <Buy
                size={Size.ONE}
                style={ButtonStyle.PORT}
            />
            <Buy
                size={Size.ONE}
                style={ButtonStyle.BUBBLE}
            />
            <Buy
                size={Size.ONE}
                style={ButtonStyle.JAVA}
            >
                <Lake
                    style={ConStyle.LAKE}
                >
                </Lake>
            </Buy>
        </Container>
    </>)
}

export default CountersRoot;