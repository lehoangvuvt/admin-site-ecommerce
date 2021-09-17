import axios from "axios";
import { takeLatest, put } from "redux-saga/effects";
import { GET_CUSTOMER_LOYALTY, SET_CUSTOMER_LOYALTY_RATE, SET_CUSTOMER_LOYALTY_LEVEL } from "../../../../../constants/actions";
import {actionsCustomerLoyalty} from './action'

function* getCustomerLoyalty({payload}:any):any {
    try{
        const response = yield axios({
            method: "GET",
            url: "http://localhost:5035/customers/loyalty",
            withCredentials: true
        })
        yield put(actionsCustomerLoyalty.getCustomerLoyaltySuccess(response.data));
    }
    catch(ex) {

    }
}

function* setCustomerLoyaltyRate({payload}: any): any {
    try {
        // console.log(payload);
        const response = yield axios({
            method: "POST",
            url: "http://localhost:5035/customers/loyalty/rate",
            withCredentials: true,
            data: {
                RATE: payload.rate
            }
        })
        if (response.status === 200) 
            yield put(actionsCustomerLoyalty.setCustomerLoyaltyRateResult(true))
        else 
            yield put(actionsCustomerLoyalty.setCustomerLoyaltyRateResult(false));
    }
    catch(ex) {
        yield put(actionsCustomerLoyalty.setCustomerLoyaltyRateResult(false));
    }
}

function* setCustomerLoyaltyLevel({payload}: any):any {
    try {
        const response = yield axios({
            method: "POST",
            url: "http://localhost:5035/customers/loyalty/level",
            withCredentials: true,
            data: {
                data_lst: payload.data
            }
        })
        if (response.status === 200) 
            yield put(actionsCustomerLoyalty.setCustomerLoyaltyLevelResult({
                success: true,
                error: "",
                message: ""
            }))
    }
    catch(ex: any) {
        console.log(ex.response);
        if (ex.response.status === 400) {
            yield put(actionsCustomerLoyalty.setCustomerLoyaltyLevelResult({
                success: false,
                error: "Bad Request",
                message: ex.response.data.messages[0]
            }))
        }
           
        else 
            yield put(actionsCustomerLoyalty.setCustomerLoyaltyLevelResult({
                success: false,
                error: "Some thing error",
                message: "Some thing went wrong"
            }))
    }
}

export function* watchGetCustomerLoyalty() {
    yield takeLatest(GET_CUSTOMER_LOYALTY, getCustomerLoyalty);
}

export function* watchSetCustomerLoyaltyRate() {
    yield takeLatest(SET_CUSTOMER_LOYALTY_RATE, setCustomerLoyaltyRate);
}

export function* watchSetCustomerLoyaltyLevel() {
    yield takeLatest(SET_CUSTOMER_LOYALTY_LEVEL, setCustomerLoyaltyLevel);
}