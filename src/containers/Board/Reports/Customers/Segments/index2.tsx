import Main from '../../../../../components/Main';
import SegmentDetailsReport from './SegmentDetailsReport';
import '../../../../../table.scss';
import './style.scss';

const MainSegmentDetailsReport = () => {
    return (
        <Main
            title1={'Customer report'}
            title2={'Segment details'}
            children={<SegmentDetailsReport />}
        />
    )
}

export default MainSegmentDetailsReport;