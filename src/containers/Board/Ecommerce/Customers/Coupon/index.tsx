import Main from "../../../../../components/Main"
import CustomerCoupon from './CustomerCoupon'
const MainCoupon: React.FC = () => {
    return (
        <Main 
            title1={'Customers'}
            title2={'Customers coupon'}
            children={<CustomerCoupon />}
        />
    )
}

export default MainCoupon;