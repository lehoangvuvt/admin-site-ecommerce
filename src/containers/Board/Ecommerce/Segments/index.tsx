import Main from '../../../../components/Main';
import Segments from './Segments';
import './style.scss';

const MainSegments = () => {
    return (
        <Main
            title1={'Customers'}
            title2={'Segments'}
            children={<Segments />}
        />
    )
}

export default MainSegments;