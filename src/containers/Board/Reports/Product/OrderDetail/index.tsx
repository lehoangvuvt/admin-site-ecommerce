import Main from '../../../../../components/Main';
import { useRouter } from '../../../../../hooks/router';
import ProductOrderDetail from './ProductOrderDetail';

import './style.scss';

const MainOrderDetail = () => {
    const router = useRouter();

    const getOrderId = () => {
        console.log(router.pathname.split('/')[router.pathname.split('/').length - 1])
        return router.pathname.split('/')[router.pathname.split('/').length - 1];
    }


    return (
        <Main
            title1={'Product report'}
            title2={`Order Detail `}
            children={<ProductOrderDetail />}
        />
    )
}

export default MainOrderDetail;