import Main from '../../../../../components/Main';
import LowStockReport from './LowStockReport';
import './style.scss';

const MainLowStockReport = () => {
    return (
        <Main
            title1={'Product report'}
            title2={'Low Stock'} 
            children={<LowStockReport />}
        />
    )
}

export default MainLowStockReport;