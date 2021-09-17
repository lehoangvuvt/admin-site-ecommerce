import Main from '../../../../../components/Main';
import ProductsSelect from './ProductsSelect';
import './style.scss';

const MainProductsSelect = () => {
    return (
        <Main
            title1={'Products bulk update'}
            title2={'Step 1. Select products to be updated'}
            children={<ProductsSelect />}
        />
    )
}

export default MainProductsSelect;