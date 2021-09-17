import { action } from 'typesafe-actions';
import { SET_SELECTED_PRODUCTS } from '../../../../../constants/actions';
import { ProductType } from './ProductsSelect';

export const actions = {
    setSelectedProducts: (selectedProducts: Array<ProductType>) => action(SET_SELECTED_PRODUCTS, { selectedProducts }),
}