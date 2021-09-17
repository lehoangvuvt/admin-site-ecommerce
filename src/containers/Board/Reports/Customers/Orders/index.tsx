import Main from '../../../../../components/Main';
import OrdersReports from './OrdersReport';
import '../../../../../table.scss';
import './style.scss';

const MainOrdersReport = () => {
    return (
        <Main
            title1={'Customer report'}
            title2={'Orders'}
            children={<OrdersReports />}
        />
    )
}

export default MainOrdersReport;