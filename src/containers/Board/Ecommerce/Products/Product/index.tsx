import Main from '../../../../../components/Main';
import Product from './Product';
import './style.scss';

const MainProduct = () => {
    return (
        <Main
            title1={'Products'}
            title2={'Edit product'}
            children={<Product />}
        />
    )
}

export default MainProduct;