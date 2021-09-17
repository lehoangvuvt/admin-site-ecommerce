import Main from '../../../../../components/Main';
import MethodDetails from './MethodDetails';
import './style.scss';

const MainMethodDetails = () => {
    return (
        <Main
            title1={'Shipping Methods'}
            title2={'Method Details'}
            children={<MethodDetails />}
        />
    )
}

export default MainMethodDetails;