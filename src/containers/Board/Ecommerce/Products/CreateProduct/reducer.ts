import { ActionType, Reducer } from "typesafe-actions";
import { RESET_CREATE_PRODUCT, SET_PRODUCT_INFORMATION, SET_STEP } from "../../../../../constants/actions";
import { AttributeSetType, ProductInformationType } from "../../../../types";
import { actions } from "./actions";

const initialState = {
    step: 1,
    productInformation: null,
    selectedAttributeSet: null,
};

type State = {
    step: number;
    productInformation: ProductInformationType | null,
    selectedAttributeSet: AttributeSetType | null,
};

type Action = ActionType<typeof actions>;

export const createProductReducer: Reducer<Readonly<State>, Action> = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            return {
                ...state,
                step: action.payload.step,
            }
        case SET_PRODUCT_INFORMATION:
            return {
                ...state,
                productInformation: action.payload.productInformation,
                selectedAttributeSet: action.payload.attributeSet,
            }
        case RESET_CREATE_PRODUCT:
            return {
                ...state,
                step: 1,
                productInformation: null,
                selectedAttributeSet: null,
            }
        default:
            return state;
    }
}