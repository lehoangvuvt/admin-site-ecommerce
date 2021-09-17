import Main from '../../../../../../components/Main';
import TemplateDetails from './TemplateDetails';
import './style.scss';

const MainTemplateDetails = () => {
    return (
        <Main
            title1={'Template Details'}
            title2={'Mail Settings'}
            children={<TemplateDetails />}
        />
    )
}

export default MainTemplateDetails;