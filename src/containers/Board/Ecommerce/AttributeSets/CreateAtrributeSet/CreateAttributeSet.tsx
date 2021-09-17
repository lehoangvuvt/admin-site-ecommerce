import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { createRef, useEffect, useState } from 'react';
import LoadingBar from '../../../../../components/LoadingBar';
import Info from '../../../../../components/Tooptip/Info';
import { tooltipContents } from '../../../../../data/tooltip_content';
import { ProductAttributeType } from '../../../../types';

const CreateAttributeSet = () => {
    const [attributeSetName, setAttributeSetName] = useState('');
    const [selectedMainAttributeId, setSelectedMainAttributeId] = useState(1);
    const [selectedSubAttributeId, setSelectedSubAttributeId] = useState(1);
    const [allAttributes, setAllAttributes] = useState<Array<ProductAttributeType>>([]);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [isLoading, setLoading] = useState(false);
    let attributeSetNameRef: React.RefObject<HTMLInputElement>;
    let mainAttributeRef: React.RefObject<HTMLSelectElement>;
    let subAttributeRef: React.RefObject<HTMLSelectElement>;
    attributeSetNameRef = createRef();
    mainAttributeRef = createRef();
    subAttributeRef = createRef();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (attributeSetName.trim() !== '' && attributeSetName !== '' && selectedMainAttributeId !== selectedSubAttributeId) {
            const body = {
                SET_NAME: attributeSetName,
                ID_ATTRIBUTE_1: selectedMainAttributeId,
                ID_ATTRIBUTE_2: selectedSubAttributeId,
            }
            const response = await axios({
                url: `http://localhost:5035/products/attribute-set/create`,
                method: 'POST',
                data: body,
                withCredentials: true,
            })
            const data = response.data;
            if (data.error) {
                console.log(data.error);
                alert('Cannot create new attribute set');
            } else {
                const attributeSet = data.attributeSet;
                alert('Create new attribute set success');
            }
        }
        setLoading(false);
        e.preventDefault();
    }

    const handleFocus = (ref: React.RefObject<any>) => {
        if (ref && ref.current) ref.current.style.border = '2px solid #3f51b5';
    }

    const handleBlur = (ref: React.RefObject<any>) => {
        if (ref && ref.current) ref.current.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    }

    const getAllAttributes = async () => {
        const response = await axios({
            url: `http://localhost:5035/products/attributes`,
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            },
        })
        const data = response.data;
        setAllAttributes(data.attributes);
    }

    useEffect(() => {
        getAllAttributes();
    }, [])

    return (
        <div className='create-attribute-set-container'>
            <LoadingBar percentCompleted={percentCompleted} />
            <form onSubmit={handleSubmit}>
                <div className='create-attribute-set-container__field-container'>
                    <div className='create-attribute-set-container__field-container__label'>
                        <p>Attribute set name</p>
                        <Info content={tooltipContents.attributeSetName} />
                    </div>
                    <div className='create-attribute-set-container__field-container__input'>
                        <input
                            value={attributeSetName}
                            onFocus={() => { handleFocus(attributeSetNameRef) }}
                            onBlur={() => { handleBlur(attributeSetNameRef) }}
                            onChange={(e) => { setAttributeSetName(e.target.value) }}
                            placeholder='Name of the attribute'
                            ref={attributeSetNameRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-attribute-set-container__field-container'>
                    <div className='create-attribute-set-container__field-container__label'>
                        <p>Main attribute</p>
                        <Info content={tooltipContents.mainAttribute} />
                    </div>
                    <div className='create-attribute-set-container__field-container__input'>
                        <select
                            value={selectedMainAttributeId}
                            onChange={(e) => { setSelectedMainAttributeId(parseInt(e.target.value.toString())) }}
                            ref={mainAttributeRef}
                            onFocus={() => { handleFocus(mainAttributeRef) }}
                            onBlur={() => { handleBlur(mainAttributeRef) }}
                        >
                            {allAttributes.length > 0 ?
                                allAttributes.map(attribute =>
                                    <option value={attribute.ID} key={attribute.ID}>{attribute.ATTRIBUTE_NAME}</option>
                                )
                                : null}
                        </select>
                    </div>
                </div>

                <div className='create-attribute-set-container__field-container'>
                    <div className='create-attribute-set-container__field-container__label'>
                        <p>Sub attribute</p>
                        <Info content={tooltipContents.subAttribute} />
                    </div>
                    <div className='create-attribute-set-container__field-container__input'>
                        <select
                            value={selectedSubAttributeId}
                            onChange={(e) => { setSelectedSubAttributeId(parseInt(e.target.value.toString())) }}
                            ref={subAttributeRef}
                            onFocus={() => { handleFocus(subAttributeRef) }}
                            onBlur={() => { handleBlur(subAttributeRef) }}
                        >
                            {allAttributes.length > 0 ?
                                allAttributes.map(attribute =>
                                    <option value={attribute.ID} key={attribute.ID}>{attribute.ATTRIBUTE_NAME}</option>
                                )
                                : null}
                        </select>
                    </div>
                </div>

                <div className='create-attribute-set-container__btn-container'>
                    <button type='submit'>
                        Create attribute set
                    </button>
                </div>

                {isLoading ?
                    <div className='create-attribute-set-container__loading-modal'>
                        <CircularProgress />
                    </div>
                    : null
                }
            </form>
        </div>
    )
}

export default CreateAttributeSet;