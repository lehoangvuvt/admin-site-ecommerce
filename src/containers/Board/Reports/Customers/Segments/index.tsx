import Main from '../../../../../components/Main';
import SegmentsReport from './SegmentsReport';
import './style.scss';

const MainSegmentsReport = () => {
    return (
        <Main
            title1={'Customer report'}
            title2={'Segments'}
            children={<SegmentsReport />}
        />
    )
}

export default MainSegmentsReport;