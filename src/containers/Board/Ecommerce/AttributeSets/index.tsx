import Main from '../../../../components/Main';
import AttributeSets from './AttributeSets';
import '../../../../table.scss';
import './style.scss';

const MainAttributeSets = () => {
    return (
        <Main
            title1={'Products'}
            title2={'Attribute sets management'}
            children={<AttributeSets />}
        />
    )
}

export default MainAttributeSets;