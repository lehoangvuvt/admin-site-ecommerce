import Main from '../../../../components/Main';
import Products from './Products';
import './style.scss';

const MainProducts = () => {
    return (
        <Main
            title1={'Products'}
            title2={'Products management'}
            children={<Products />}
        />
    )
}

export default MainProducts;