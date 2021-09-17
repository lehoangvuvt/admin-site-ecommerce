import axios from 'axios';
import { createRef, useState } from 'react';
import Info from '../../../../../components/Tooptip/Info';
import { tooltipContents } from '../../../../../data/tooltip_content';
import { useRouter } from '../../../../../hooks/router';

const CreateCategory = () => {
    const router = useRouter();
    const [categoryName, setCategoryName] = useState('');
    const [shortDes, setShortDes] = useState('');
    const [longDes, setLongDes] = useState('');
    let categoryNameRef: React.RefObject<HTMLInputElement>;
    let shortDesRef: React.RefObject<HTMLInputElement>;
    let longDesRef: React.RefObject<HTMLInputElement>;
    categoryNameRef = createRef();
    shortDesRef = createRef();
    longDesRef = createRef();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (categoryName !== '' && categoryName.trim() !== ''
            && shortDes !== '' && shortDes.trim() !== ''
            && longDes !== '' && longDes.trim() !== '') {
            const body = {
                CATEGORY_NAME: categoryName,
                SHORT_DESCRIPTION: shortDes,
                LONG_DESCRIPTION: longDes
            };
            const response = await axios({
                url: `http://localhost:5035/categories/create`,
                data: body,
                method: 'POST',
                withCredentials: true
            })
            const data = response.data;
            if (data.error) {
                console.log(data.error);
                alert('Cannot create new category');
            } else {
                alert('Create new category success');
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
        <div className='create-category-container'>
            <form onSubmit={handleSubmit}>
                <div className='create-category-container__field-container'>
                    <div className='create-category-container__field-container__label'>
                        <p>Category name</p>
                        <Info content={tooltipContents.brandName} />
                    </div>
                    <div className='create-category-container__field-container__input'>
                        <input
                            value={categoryName}
                            onFocus={() => { handleFocus(categoryNameRef) }}
                            onBlur={() => { handleBlur(categoryNameRef) }}
                            onChange={(e) => { setCategoryName(e.target.value) }}
                            placeholder='Name of the category'
                            ref={categoryNameRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-category-container__field-container'>
                    <div className='create-category-container__field-container__label'>
                        <p>Short description</p>
                        <Info content={tooltipContents.brandName} />
                    </div>
                    <div className='create-category-container__field-container__input'>
                        <input
                            value={shortDes}
                            onFocus={() => { handleFocus(shortDesRef) }}
                            onBlur={() => { handleBlur(shortDesRef) }}
                            onChange={(e) => { setShortDes(e.target.value) }}
                            placeholder='Enter short description'
                            ref={shortDesRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-category-container__field-container'>
                    <div className='create-category-container__field-container__label'>
                        <p>Long description</p>
                        <Info content={tooltipContents.brandName} />
                    </div>
                    <div className='create-category-container__field-container__input'>
                        <input
                            value={longDes}
                            onFocus={() => { handleFocus(longDesRef) }}
                            onBlur={() => { handleBlur(longDesRef) }}
                            onChange={(e) => { setLongDes(e.target.value) }}
                            placeholder='Enter long description'
                            ref={longDesRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-category-container__btn-container'>
                    <button type='submit'>
                        Create category
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateCategory;