import Main from '../../../../../components/Main';
import ProductViewsReport from './ProductViewsReport';
import './style.scss';

const MainProductViewsReport = () => {
    return (
        <Main
            title1={'Product report'}
            title2={'Most viewed'}
            children={<ProductViewsReport />}
        />
    )
}

export default MainProductViewsReport;