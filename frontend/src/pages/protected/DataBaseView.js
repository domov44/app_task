import React from 'react';
import CrudAccount from '../../hooks/AdminTools/CrudAccount';
import Hero from '../../components/box/section/Hero';
import Container from '../../components/box/container/Container';
import DefaultLayout from '../../layout/DefaultLayout'

function DataBaseView() {
    return (
        <DefaultLayout>
            <Hero>
                <Container variant="normal" width="100%">
                    <CrudAccount />
                </Container>
            </Hero>
        </DefaultLayout>
    );
}

export default DataBaseView;