import Main from "../../../../components/Main";
import Orders from "./Orders";
import '../../../../table.scss';    

const MainOrders = () => {
    return (
        <Main
            title1={'E-commerce'}
            title2='Orders management'
            children={<Orders />}
        />
    )
}

export default MainOrders;