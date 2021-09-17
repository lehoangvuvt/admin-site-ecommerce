import Main from "../../../../../components/Main";
import AddPromotionForm from "./AddPromotionForm";
import { useRouter } from "../../../../../hooks/router";

const MainAddPromotion: React.FC = () => {
    const router = useRouter();
    const type: string | undefined = router.pathname.split('/').pop();
    if (type === 'edit') 
        return (
            <Main 
                title1="E-commerce"
                title2="Edit promotion"
                children={<AddPromotionForm type={type}/>}
            />
        )
    else
        return (
            <Main 
                title1="E-commerce"
                title2="Add promotion"
                children={<AddPromotionForm type={type}/>}
            />
        )
}

export default MainAddPromotion;