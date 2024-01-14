import LoginForm from '../../hooks/login-gestion/LoginForm';
import Hero from '../../components/box/section/Hero';
import FormContainer from '../../components/box/container/FormContainer';
import LogoutLayout from '../../layout/LogoutLayout'
import Bento from '../../components/box/bento/Bento';

function Login() {
    return (
        <LogoutLayout>
            <Hero>
                <FormContainer>
                    <Bento width="450px" highlight="highlight" padding="40px">
                        <LoginForm />
                    </Bento>
                </FormContainer>
            </Hero>
        </LogoutLayout>
    );
}

export default Login;