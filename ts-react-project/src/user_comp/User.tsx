import React from 'react';
import Button from '../button_comp/Button';
import { ButtonStyle, Size } from '../helpers/compInterface';
import './User.css';
import ProfileImage from '../image_comp/ProfileImage';
import SIGNUP from './SignUp';
import LOGIN from './Login';
import { IUser, useUserContext } from './UserContext';


const USER: React.FC<IUser> = ({ style = ButtonStyle.JAVA }) => {

    const { isLoggedIn, handleLogOut, openLoginModal, openSignUpModal, showLoginModal, showSignUpModal} = useUserContext();

    return (

        <>
            {style !== ButtonStyle.TEXT && isLoggedIn ? (
                <>
                    <Button
                        style={style}
                        size={Size.MAX}
                        action={handleLogOut}
                    >
                        <b>Log out</b>
                    </Button>

                    <ProfileImage
                        size={Size.SIX}
                    />
                </>
            ) : (
                <>
                    <Button
                        style={style}
                        size={Size.MAX}
                        action={openLoginModal}
                    >
                        <b>Log in</b>
                    </Button>
                    <Button
                        style={style}
                        size={Size.MAX}
                        action={openSignUpModal}
                    >
                        <b>Sign up</b>
                    </Button>
                </>
            )}
            {showLoginModal && (
                <LOGIN />
            )}
            {showSignUpModal && (
                <SIGNUP />
            )}
        </>
    );
};

export default USER;