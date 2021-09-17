import { Typography } from '@material-ui/core';
import {FC} from 'react'
import Main from '../../../../components/Main';
import PromotionDetail from './PromotionDetail';

const MainPromotion: FC = () => {
    return (
        <Main 
            title1={'E-commerce'}
            title2={'Promotion'}
            children={<PromotionDetail />}
        />
    )
}

export default MainPromotion;