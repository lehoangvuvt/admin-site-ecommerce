import Main from '../../../../../components/Main';
import MailSettingDetails from './MailSettingDetails';
import './style.scss';

const MainDetails = () => {
    return (
        <Main
            title1={'Settings Details'}
            title2={'Mail Settings'}
            children={<MailSettingDetails />}
        />
    )
}

export default MainDetails;