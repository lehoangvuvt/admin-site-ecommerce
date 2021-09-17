import Main from '../../../../../components/Main';
import ProductInCart from './ProductInCart';
import './style.scss';

const MainProductInCart = () => {
    return (
        <Main
            title1={'Marketing report'}
            title2={'Product in cart'}
            children={<ProductInCart />}
        />
    )
}

export default MainProductInCart;