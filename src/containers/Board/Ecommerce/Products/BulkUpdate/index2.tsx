import Main from '../../../../../components/Main';
import Update from './Update';
import './style.scss';

const MainUpdate = () => {
    return (
        <Main
            title1={'Products bulk update'}
            title2={'Step 2. Import updated data'}
            children={<Update />}
        />
    )
}

export default MainUpdate;