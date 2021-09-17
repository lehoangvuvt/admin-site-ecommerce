import axios from 'axios';
import { createRef, useState } from 'react';
import Info from '../../../../../components/Tooptip/Info';
import { tooltipContents } from '../../../../../data/tooltip_content';

const CreateAttribute = () => {
    const [attributeName, setAttributeName] = useState('');
    const [attributeLabel, setAttributeLabel] = useState('');
    const [selectedValueType, setSelectedValueType] = useState(1);
    let attributeNameRef: React.RefObject<HTMLInputElement>;
    let attributeLabelRef: React.RefObject<HTMLInputElement>;
    let valueTypeRef: React.RefObject<HTMLSelectElement>;
    attributeNameRef = createRef();
    attributeLabelRef = createRef();
    valueTypeRef = createRef();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (attributeName.trim() !== "" && attributeName !== "" && attributeLabel.trim() !== "" && attributeLabel !== "") {
            let valueType = '';
            switch (selectedValueType) {
                case 1:
                    valueType = 'VARCHAR';
                    break;
                case 2:
                    valueType = 'INT';
                    break;
                case 3:
                    valueType = 'DECIMAL';
                    break;
                case 4:
                    valueType = 'DATETIME';
                    break;
                default:
                    break;
            }
            const body = {
                ATTRIBUTE_NAME: attributeName,
                LABEL_TEXT: attributeLabel,
                VALUE_TYPE: valueType
            };
            const response = await axios({
                url: `http://localhost:5035/products/attributes`,
                method: "POST",
                data: body,
                withCredentials: true
            });
            const data = response.data;
            if (data.error) {
                alert('Cannot create new attribute');
                console.log(data.error);
            } else {
                const newAttribute = data.newAttribute;
                alert('Create new attribute success');
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
        <div className='create-attribute-container'>
            <form onSubmit={handleSubmit}>
                <div className='create-attribute-container__field-container'>
                    <div className='create-attribute-container__field-container__label'>
                        <p>Attribute name</p>
                        <Info content={tooltipContents.attributeName} />
                    </div>
                    <div className='create-attribute-container__field-container__input'>
                        <input
                            value={attributeName}
                            onFocus={() => { handleFocus(attributeNameRef) }}
                            onBlur={() => { handleBlur(attributeNameRef) }}
                            onChange={(e) => { setAttributeName(e.target.value) }}
                            placeholder='Name of the attribute'
                            ref={attributeNameRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-attribute-container__field-container'>
                    <div className='create-attribute-container__field-container__label'>
                        <p>Attribute label</p>
                        <Info content={tooltipContents.attributeLabel} />
                    </div>
                    <div className='create-attribute-container__field-container__input'>
                        <input
                            value={attributeLabel}
                            onFocus={() => { handleFocus(attributeLabelRef) }}
                            onBlur={() => { handleBlur(attributeLabelRef) }}
                            onChange={(e) => { setAttributeLabel(e.target.value) }}
                            placeholder='Name of the attribute label'
                            ref={attributeLabelRef}
                            type='text' />
                    </div>
                </div>

                <div className='create-attribute-container__field-container'>
                    <div className='create-attribute-container__field-container__label'>
                        <p>Attribute value type</p>
                        <Info content={tooltipContents.attributeValueType} />
                    </div>
                    <div className='create-attribute-container__field-container__input'>
                        <select
                            value={selectedValueType}
                            onChange={(e) => { setSelectedValueType(parseInt(e.target.value.toString())) }}
                            ref={valueTypeRef}
                            onFocus={() => { handleFocus(valueTypeRef) }}
                            onBlur={() => { handleBlur(valueTypeRef) }}
                        >
                            <option value={1} key={1}>VARCHAR</option>
                            <option value={2} key={2}>INT</option>
                            <option value={3} key={3}>DECIMAL</option>
                            <option value={4} key={4}>DATETIME</option>
                        </select>
                    </div>
                </div>

                <div className='create-attribute-container__btn-container'>
                    <button type='submit'>
                        Create attribute
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateAttribute;