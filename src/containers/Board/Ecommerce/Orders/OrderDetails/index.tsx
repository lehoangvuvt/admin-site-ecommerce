import Main from "../../../../../components/Main";
import { useRouter } from "../../../../../hooks/router";
import OrderDetails from "./OrderDetails";

const MainOrderDetails = () => {
    const router = useRouter();

    const getOrderId = () => {
        return router.pathname.split('/')[router.pathname.split('/').length - 1];
    }

    return (
        <Main
            title1={'Order Details'}
            title2={`Order #${getOrderId()}`}
            children={<OrderDetails />}
        />
    )
}

export default MainOrderDetails;