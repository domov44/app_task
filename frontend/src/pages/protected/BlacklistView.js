import React from 'react';
import Hero from '../../components/box/section/Hero';
import BlacklistTable from '../../hooks/AdminTools/BlackListTable';
import Container from '../../components/box/container/Container';
import DefaultLayout from '../../layout/DefaultLayout'


function Blacklistview() {
    return (
        <DefaultLayout>
            <Hero>
                <Container variant="normal" width="100%">
                    <BlacklistTable />
                </Container>
            </Hero>
        </DefaultLayout>
    );
}

export default Blacklistview;