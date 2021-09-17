import Main from '../../../../components/Main';
import ShippingMethods from './ShippingMethods';
import './style.scss';

const MainShippingMethods = () => {
    return (
        <Main
            title1={'E-commerce'}
            title2={'Shipping Methods'}
            children={<ShippingMethods />}
        />
    )
}

export default MainShippingMethods;