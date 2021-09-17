import Main from '../../../../components/Main';
import MailSettings from './MailSettings';
import './style.scss';

const MainMailSettings = () => {
    return (
        <Main
            title1={'Settings'}
            title2={'Mail Settings'}
            children={<MailSettings />}
        />
    )
}

export default MainMailSettings;