import React, { useState } from "react";
import './PasswordIns.css'
import { ICon } from "../container_comp/Container";

const PasswordIns: React.FC<ICon> = ({ size }) => {
    const [passwordIns, setPasswordIns] = useState('none');
    const [passwordInsAnimation, setPasswordInsAnimation] = useState('0');


    const handlePasswordIns = () => {
        if (passwordIns === 'none') {
            setPasswordIns('block')
        } else {
            setPasswordIns('none')
            setPasswordInsAnimation('1')
            setTimeout(() => { setPasswordInsAnimation('0') }, 500)
        }
    }

    return (
        <div className={`password-ins ${size}`}>
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
            </p> : <span style={{
                marginTop: '12px'
            }} />}
        </div>
    );
}

export default PasswordIns;


