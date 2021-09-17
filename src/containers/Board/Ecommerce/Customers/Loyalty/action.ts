import { action } from "typesafe-actions";
import { GET_CUSTOMER_LOYALTY, GET_CUSTOMER_LOYALTY_SUCCESS, SET_CUSTOMER_LOYALTY_LEVEL, SET_CUSTOMER_LOYALTY_RATE, SET_CUSTOMER_LOYALTY_RATE_RESULT, SET_CUSTOMER_LOYALTY_LEVEL_RESULT } from "../../../../../constants/actions";
import { CustomerLoyaltyDto, CustomerLoyaltyLevelDTO, ResultRequest } from "../../../../types";

export const actionsCustomerLoyalty = {
    getCustomerLoyalty: () => action(GET_CUSTOMER_LOYALTY, {}),
    getCustomerLoyaltySuccess: (data: CustomerLoyaltyDto) => action(GET_CUSTOMER_LOYALTY_SUCCESS, {data}),
    setCustomerLoyaltyRate: (rate: number) => action(SET_CUSTOMER_LOYALTY_RATE, {rate}),
    setCustomerLoyaltyRateResult: (success: boolean) => action(SET_CUSTOMER_LOYALTY_RATE_RESULT, {success}),
    setCustomerLoyaltyLevel: (data: CustomerLoyaltyLevelDTO[]) => action(SET_CUSTOMER_LOYALTY_LEVEL, {data}),
    setCustomerLoyaltyLevelResult: (result: ResultRequest) => action(SET_CUSTOMER_LOYALTY_LEVEL_RESULT, {result})
}