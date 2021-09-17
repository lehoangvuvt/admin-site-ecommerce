import { spawn } from 'redux-saga/effects';
import { watchGetCustomerLoyalty, watchSetCustomerLoyaltyRate, watchSetCustomerLoyaltyLevel } from './Board/Ecommerce/Customers/Loyalty/saga';

export default function* rootSaga() {
    yield spawn(watchGetCustomerLoyalty);
    yield spawn(watchSetCustomerLoyaltyRate);
    yield spawn(watchSetCustomerLoyaltyLevel);
}