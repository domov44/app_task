import React from 'react';
import Main from '../components/box/main/Main';
import '../assets/style/style.css';

const LogoutLayout = ({ children }) => {
    return (
        <Main variant="wnotsidebar">
            {children}
        </Main>
    );
}

export default LogoutLayout;