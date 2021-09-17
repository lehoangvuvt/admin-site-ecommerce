import Main from '../../../../../components/Main';
import CreateMethod from './CreateMethod';
import './style.scss';

const MainCreateMethod = () => {
    return (
        <Main
            title1={'Shipping Methods'}
            title2={'Create New Method'}
            children={<CreateMethod />}
        />
    )
}

export default MainCreateMethod;