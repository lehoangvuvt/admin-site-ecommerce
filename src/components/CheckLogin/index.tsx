import { useEffect } from "react";
import { useRouter } from "../../hooks/router";

const CheckLogin = () => {
    const router = useRouter();

    useEffect(() => {
        if (true) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [])

    return null
}

export default CheckLogin;