import Main from '../../../../components/Main';
import ReportSales from './ReportSales';
import './style.scss';
import "antd/dist/antd.css";

const MainReportSales = () => {
    return (
        <Main
            title1={'Reports'}
            title2={'Sales'}
            children={<ReportSales />}
        />
    )
}

export default MainReportSales;