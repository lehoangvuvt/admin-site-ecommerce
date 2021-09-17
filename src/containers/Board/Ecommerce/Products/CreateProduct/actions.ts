import { action } from 'typesafe-actions';
import { RESET_CREATE_PRODUCT, SET_PRODUCT_INFORMATION, SET_STEP } from '../../../../../constants/actions';
import { AttributeSetType, ProductInformationType } from '../../../../types';

export const actions = {
    setStep: (step: number) => action(SET_STEP, { step }),
    setProductInformation: (productInformation: ProductInformationType, attributeSet: AttributeSetType) =>
        action(SET_PRODUCT_INFORMATION, { productInformation, attributeSet }),
    resetCreateProduct: () => action(RESET_CREATE_PRODUCT),
}