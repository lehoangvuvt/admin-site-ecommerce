import Main from "../../../../../components/Main"
import CustomerLoyaltyForm from "./CustomerLoyaltyForm"

const MainCustomerLoyalty: React.FC = () => {
    return (
        <Main 
            title1="E-commerce"
            title2="Customer loyalty"
            children={<CustomerLoyaltyForm/>}
        />
    )
}

export default MainCustomerLoyalty