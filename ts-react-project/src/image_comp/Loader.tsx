import React from "react";
import { IImage } from "./Image";
import { Size } from "../helpers/compInterface";

const Loader: React.FC<IImage> = ({ size = Size.ONE, src, alt, margin, children }) => {
    return (
        <img src={src ? src : "/dump/load.gif"} alt={alt} width={size} loading={'eager'} style={{ mixBlendMode: 'multiply', margin: margin, animation: 'ghost .1s ease', userSelect: 'none' }}>
            {children}
        </img>
    );
}

export default Loader;