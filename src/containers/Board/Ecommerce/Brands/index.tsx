import Main from '../../../../components/Main';
import Brands from './Brands';
import '../../../../table.scss';
import './style.scss';

const MainBrands = () => {
    return (
        <Main
            title1={'Products'}
            title2={'Brands management'}
            children={<Brands />}
        />
    )
}

export default MainBrands;