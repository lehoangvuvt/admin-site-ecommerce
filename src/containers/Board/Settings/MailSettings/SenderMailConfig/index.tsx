import Main from '../../../../../components/Main';
import SenderMailConfig from './SenderMailConfig';
import './style.scss';

const MainDetails = () => {
    return (
        <Main
            title1={'Settings'}
            title2={'Sender Mail Config'}
            children={<SenderMailConfig />}
        />
    )
}

export default MainDetails;