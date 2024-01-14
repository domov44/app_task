import MenuItem from '../ui/aside-section/HeaderItems';
import { CiBullhorn, CiCircleQuestion, CiSettings, CiViewList } from 'react-icons/ci';
import { Link } from "react-router-dom";
import Logout from '../../hooks/login-gestion/Logout';


function SecondaryMenu() {
    return (
        <ul className="menu">
            <MenuItem text="Paramètres" icon={CiSettings} variant="classique" to="/parametres" />
            <MenuItem text="Aide" icon={CiCircleQuestion} variant="classique" to="/aide" />
            <MenuItem text="Signalement" icon={CiBullhorn} variant="classique" to="/signalement" />
            <Logout />
        </ul>
    );
}

export default SecondaryMenu;