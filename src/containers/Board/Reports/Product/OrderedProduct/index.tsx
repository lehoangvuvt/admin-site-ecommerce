import Main from '../../../../../components/Main';
import OrderedProductsReport from './OrderedProductsReport';
import './style.scss';

const MainOrderedProducts = () => {
    return (
        <Main
            title1={'Product report'}
            title2={'Ordered Products'} 
            children={<OrderedProductsReport />}
        />
    )
}

export default MainOrderedProducts;