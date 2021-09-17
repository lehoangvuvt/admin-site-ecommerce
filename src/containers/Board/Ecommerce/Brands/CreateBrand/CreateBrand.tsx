import axios from 'axios';
import { createRef, useState } from 'react';
import Info from '../../../../../components/Tooptip/Info';
import { tooltipContents } from '../../../../../data/tooltip_content';
import { useRouter } from '../../../../../hooks/router';

const CreateBrand = () => {
    const router = useRouter();
    const [brandName, setBrandName] = useState('');
    let brandRef: React.RefObject<HTMLInputElement>;
    brandRef = createRef();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (brandName !== '' && brandName.trim() !== '') {
            const body = {
                NAME: brandName
            };
            const response = await axios({
                url: `http://localhost:5035/products/brand/create`,
                data: body,
                method: 'POST',
                withCredentials: true
            })
            const data = response.data;
            if (data.error) {
                console.log(data.error);
                alert('Cannot create new product brand');
            } else {
                alert('Create new product brand success');
            }
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
                        <p>Brand name</p>
                        <Info content={tooltipContents.brandName} />
                    </div>
                    <div className='create-brand-container__field-container__input'>
                        <input
                            value={brandName}
                            onFocus={() => { handleFocus(brandRef) }}
                            onBlur={() => { handleBlur(brandRef) }}
                            onChange={(e) => { setBrandName(e.target.value) }}
                            placeholder='Name of the brand'
                            ref={brandRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-brand-container__btn-container'>
                    <button type='submit'>
                        Create brand
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateBrand;