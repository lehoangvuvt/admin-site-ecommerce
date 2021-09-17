import Main from '../../../../components/Main';
import {FC} from 'react'
import Store from './Store'
const MainStore: FC = () => {
    return (
        <Main 
            title1={'E-commerce'}
            title2={'Store'}
            children={<Store />}
        />
    )
}

export default MainStore;