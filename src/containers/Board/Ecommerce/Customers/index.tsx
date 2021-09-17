import Main from '../../../../components/Main';
import Customers from './Customers';
import '../../../../table.scss';
import './style.scss';

const MainCustomers = () => {
    return (
        <Main
            title1={'Customers'}
            title2={'Customers management'}
            children={<Customers />}
        />
    )
}

export default MainCustomers;