import MenuItem from '../ui/aside-section/HeaderItems';
import { CiHome, CiUser, CiViewList, CiBellOn } from 'react-icons/ci';


function MainMenu() {
    return (
        <ul className="menu">
            <MenuItem text="Accueil" icon={CiHome} variant="classique" to="/" />
            <MenuItem text="Tâches" icon={CiViewList} variant="classique" to="/taches" />
            <MenuItem text="Notifications" icon={CiBellOn} variant="classique" to="/notifications" />
            <MenuItem text="Profil" icon={CiUser} variant="classique" to="/profil" />
        </ul>
    );
}

export default MainMenu;