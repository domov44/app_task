import React, { useState } from 'react';
import Header from '../components/ui/aside-section/Header';
import Main from '../components/box/main/Main';
import TopBar from '../components/ui/topbar/TopBar.js';
import '../assets/style/style.css';

const DefaultLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    return (
        <div className="App">
            <Header isopen={sidebarOpen} />
            <Main variant={sidebarOpen ? 'wsidebar' : 'wnotsidebar'}>
                <TopBar toggleSidebar={toggleSidebar} />
                {children}
            </Main>
        </div>
    );
}

export default DefaultLayout;