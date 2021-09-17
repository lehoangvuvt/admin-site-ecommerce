import { ActionType, Reducer } from "typesafe-actions";
import { SET_SELECTED_PRODUCTS } from "../../../../../constants/actions";
import { actions } from "./actions";
import { ProductType } from "./ProductsSelect";

const initialState = {
    selectedProducts: []
};

type State = {
    selectedProducts: Array<ProductType>,
};

type Action = ActionType<typeof actions>;

export const bulkUpdateReducer: Reducer<Readonly<State>, Action> = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_PRODUCTS:
            return {
                ...state,
                selectedProducts: action.payload.selectedProducts,
            }
        default:
            return state;
    }
}