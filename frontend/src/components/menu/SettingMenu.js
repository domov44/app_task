import MenuItem from '../ui/aside-section/HeaderItems';
import { CiBellOn, CiFaceSmile, CiImageOn } from 'react-icons/ci';
import Title from '../ui/textual/Title';


function SettingMenu() {
    return (
        <ul className="menu">
            <Title level={6}>
                Général
            </Title>
            <MenuItem text="Thème" icon={CiImageOn} variant="classique" to="/parametres" />
            <MenuItem text="Accessibilité" icon={CiFaceSmile} variant="classique" to="/parametres/accessiblite" />
            <MenuItem text="Notifications" icon={CiBellOn} variant="classique" to="/parametres/notifications" />
        </ul>
    );
}

export default SettingMenu;