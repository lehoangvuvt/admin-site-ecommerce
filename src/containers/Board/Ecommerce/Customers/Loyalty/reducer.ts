import { Reducer, ActionType } from 'typesafe-actions';
import { GET_CUSTOMER_LOYALTY_SUCCESS, SET_CUSTOMER_LOYALTY_RATE_RESULT, SET_CUSTOMER_LOYALTY_LEVEL_RESULT } from '../../../../../constants/actions';
import { CustomerLoyaltyDto, ResultRequest } from '../../../../types';
import { actionsCustomerLoyalty } from './action';


interface ResultRequestDTO extends ResultRequest {
    duration: number;
}

type State = {
    loyalty: CustomerLoyaltyDto;
    setLoyaltyRate: {
        success: boolean | undefined;
        duration: number;
    },
    setLoyaltyLevel: ResultRequestDTO
}
type Action = ActionType<typeof actionsCustomerLoyalty>;

const initialState = {
    loyalty: {
        loyaltyLevel: [],
        loyaltyRate: {
            ID: "",
            RATE: 0
        }
    },
    setLoyaltyRate: {
        success: undefined,
        duration: 0
    },
    setLoyaltyLevel: {
        success: undefined,
        error: "",
        message: "",
        duration: 0
    }
}

export const customerLoyalty: Reducer<Readonly<State>, Action> = (state = initialState, action) => {
    switch (action.type) {
        case GET_CUSTOMER_LOYALTY_SUCCESS:
            return {
                ...state,
                loyalty: action.payload.data
            }
        case SET_CUSTOMER_LOYALTY_RATE_RESULT: 
            return {
                ...state,
                setLoyaltyRate: {
                    success: action.payload.success,
                    duration: Date.now()
                }
            }
        case SET_CUSTOMER_LOYALTY_LEVEL_RESULT: 
            return {
                ...state,
                setLoyaltyLevel: {
                    ...action.payload.result,
                    duration: Date.now()
                }
            }
        default:
            return {
                ...state
            }
    }
}