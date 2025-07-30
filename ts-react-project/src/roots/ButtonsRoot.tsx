import Button from "../button_comp/Button";
import Container from "../container_comp/Container";
import React from "react";
import { ButtonStyle, ButtonType, ConStyle, ConType, Size } from "../helpers/compInterface";
import Lake from "../custom_comp/Lake";


const ButtonsRoot = () => {
    return (<>
        <Container
            type={ConType.FC}
            size={Size.FULLSCREEN}
        >
            <Button
                style={ButtonStyle.PORT}
                size={Size.ONE}
            >
                port
            </Button>
            <Button
                style={ButtonStyle.MIN}
                size={Size.THREE}
            >
                <Lake
                    style={ConStyle.LAKE}
                />
            </Button>
            <Button
                style={ButtonStyle.JAVA}
                size={Size.SEVEN}
            >
                java
            </Button>
            <Button
                style={ButtonStyle.BUBBLE}
                size={Size.ONE}
            >
                <b>BUBBLE</b>
            </Button>
        </Container>
        <Container
            type={ConType.FC}
            size={Size.FULLSCREEN}
        >
            <Button
                style={ButtonStyle.BUBBLE}
                size={Size.MAX}
                type={ButtonType.TOGGLE}
            >
                <b>BUBBLEBUBBLEBUBBLEBUBBLEBUBBLEBUBBLEBUBBLEBUBBLE</b>
            </Button>
        </Container>
    </>)
}

export default ButtonsRoot;