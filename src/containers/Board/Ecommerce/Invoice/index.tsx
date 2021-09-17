import { useEffect } from "react";
import Main from "../../../../components/Main";

const Invoice = () => {

    useEffect(() => {
  
    }, [])
    const invoiceRendered = <h1>asd</h1>;
    return (
        <Main
            title1={'Pages'}
            title2={'Invoice'}
            children={invoiceRendered}
        />
    )
}

export default Invoice;