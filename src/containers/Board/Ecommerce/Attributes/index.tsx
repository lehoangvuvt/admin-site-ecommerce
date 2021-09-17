import Main from '../../../../components/Main';
import Attributes from './Attributes';
import '../../../../table.scss';
import './style.scss';

const MainAttributes = () => {
    return (
        <Main
            title1={'Products'}
            title2={'Attributes management'}
            children={<Attributes />}
        />
    )
}

export default MainAttributes;