import axios from "axios";
import { createRef, useState } from "react";
import CurrencyInput from 'react-currency-input-field';
import Info from "../../../../../components/Tooptip/Info";
import { tooltipContents } from "../../../../../data/tooltip_content";
import { useRouter } from "../../../../../hooks/router";

const CreateMethod = () => {
    const router = useRouter();
    const [methodName, setMethodName] = useState('');
    const [description, setDescription] = useState('');
    const [flatPrice, setFlatPrice] = useState(0);
    let methodNameRef: React.RefObject<HTMLInputElement>;
    let descriptionRef: React.RefObject<HTMLInputElement>;
    let flatPriceRef: React.RefObject<HTMLInputElement>;
    methodNameRef = createRef();
    descriptionRef = createRef();
    flatPriceRef = createRef();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (methodName.trim() !== ""
            && methodName !== ""
            && description.trim() !== ""
            && description !== ""
            && flatPrice >= 0
        ) {
            const body = {
                SHIPPING_METHOD_NAME: methodName,
                DESCRIPTION: description,
                FLAT_PRICE: flatPrice
            }
            const response = await axios({
                url: "http://localhost:5035/shipping-methods/create",
                method: "POST",
                withCredentials: true,
                data: body
            })
            const data = response.data;
            if (data.error) {
                alert('Cannot create new shipping method.');
            } else {
                alert('Create shipping method successfully');
            }
        } else {
            alert('Check input...');
        }
        e.preventDefault();
    }

    const handleFocus = (ref: React.RefObject<any>) => {
        if (ref && ref.current) ref.current.style.border = '2px solid #3f51b5';
    }

    const handleBlur = (ref: React.RefObject<any>) => {
        if (ref && ref.current) ref.current.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    }

    return (
        <div className='create-brand-container'>
            <form onSubmit={handleSubmit}>
                <div className='create-brand-container__field-container'>
                    <div className='create-brand-container__field-container__label'>
                        <p>Shipping method's name</p>
                    </div>
                    <div className='create-brand-container__field-container__input'>
                        <input
                            value={methodName}
                            onFocus={() => { handleFocus(methodNameRef) }}
                            onBlur={() => { handleBlur(methodNameRef) }}
                            onChange={(e) => { setMethodName(e.target.value) }}
                            placeholder='Name of the shipping method'
                            ref={methodNameRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-brand-container__field-container'>
                    <div className='create-brand-container__field-container__label'>
                        <p>Description</p>
                    </div>
                    <div className='create-brand-container__field-container__input'>
                        <input
                            value={description}
                            onFocus={() => { handleFocus(descriptionRef) }}
                            onBlur={() => { handleBlur(descriptionRef) }}
                            onChange={(e) => { setDescription(e.target.value) }}
                            placeholder="Shipping method's description"
                            ref={descriptionRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-brand-container__field-container'>
                    <div className='create-brand-container__field-container__label'>
                        <p>Flat price (shipping's price per order)</p>
                    </div>
                    <div className='create-brand-container__field-container__input'>
                        <CurrencyInput
                            id="input-example"
                            name="input-name"
                            prefix="đ"
                            ref={flatPriceRef}
                            onFocus={() => { handleFocus(flatPriceRef) }}
                            onBlur={() => { handleBlur(flatPriceRef) }}
                            placeholder="Price per order"
                            defaultValue={flatPrice}
                            decimalsLimit={2}
                            onValueChange={(value, name) => {
                                if (value) {
                                    setFlatPrice(parseFloat(value));
                                }
                            }}
                        />
                    </div>
                </div>

                <div className='create-brand-container__btn-container'>
                    <button type='submit'>
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateMethod;