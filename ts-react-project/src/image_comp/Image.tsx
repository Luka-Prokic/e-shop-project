import { ExcludeFullscreen, ImageStyle, ImageType, Size } from '../helpers/compInterface';
import './Image.css';
import React from 'react';

export interface IImage {
    style?: ImageStyle | string;
    size?: ExcludeFullscreen<Size>;
    type?: ImageType;
    src?: string;
    alt?: string;
    margin?: string;
    children?: React.ReactNode;
    loading?: any;
    action?: () => void;
}

const ImagE: React.FC<IImage> = ({ style = 'default', size, src, alt, children, type = ImageType.IMG, loading = 'lazy', action }) => {
    const className = `${style}-image ${size}`;
    return <>
        {(type === ImageType.BTN) ? <button onClick={action}
            className={className}>
            {src ? <>
                <img
                    alt={alt}
                    src={src}
                    loading={loading}
                    decoding="async"
                />
                <div className="pick-image-overlay">{children}</div>
            </> : <div style={{background: 'gray', width: '100%', height: '100%'}}></div>}
        </button >
            :
            <>
                {src ? <img
                    className={className}
                    alt={alt}
                    src={src}
                    loading={loading}
                    decoding="async"
                >
                    {children}
                </img> : <div style={{background: 'gray', width: '100%', height: '100%'}}></div>}
            </>
        }
    </>
}

export default ImagE;