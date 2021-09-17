import Main from "../../../components/Main";
import Dashboard from "./Dashboard";
import './style.scss';

const MainDashboard = () => {
    return (
        <Main
            title1={'Overview'}
            title2={'Dashboards'}
            children={<Dashboard />}
        />
    )
}

export default MainDashboard;