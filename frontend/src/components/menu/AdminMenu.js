import MenuItem from '../ui/aside-section/HeaderItems';
import { CiDatabase, CiRepeat, CiNoWaitingSign } from 'react-icons/ci';
import Pastille from '../ui/textual/Pastille';


function AdminMenu() {
    return (
        <ul className="menu">
            <Pastille variant="success">Admin</Pastille>
            <MenuItem text="Comptes" icon={CiDatabase} variant="classique" to="/admin/comptes" />
            <MenuItem text="Requêtes" icon={CiRepeat} variant="classique" to="/admin/requetes-log" />
            <MenuItem text="Blacklist" icon={CiNoWaitingSign} variant="classique" to="/admin/blacklist" />
        </ul>
    );
}

export default AdminMenu;