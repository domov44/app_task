import React from 'react';
import Hero from '../../components/box/section/Hero';
import RequestLog from '../../hooks/AdminTools/RequestLog';
import Container from '../../components/box/container/Container';
import DefaultLayout from '../../layout/DefaultLayout'


function AppLog() {
    return (
        <DefaultLayout>
            <Hero>
                <Container variant="normal" width="100%">
                    <RequestLog />
                </Container>
            </Hero>
        </DefaultLayout>
    );
}

export default AppLog;