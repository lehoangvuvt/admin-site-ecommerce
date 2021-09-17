import { combineReducers } from "redux";
import { filterReducer } from "../components/Filter/reducer";
import globalReducer from "./App/reducer";
import { customerLoyalty } from "./Board/Ecommerce/Customers/Loyalty/reducer";
import { createProductReducer } from "./Board/Ecommerce/Products/CreateProduct/reducer";
import { userInfoReducer } from "./Login/reducer";
import { bulkUpdateReducer } from './Board/Ecommerce/Products/BulkUpdate/reducer';

export const rootReducer = combineReducers({
  global: globalReducer,
  filter: filterReducer,
  createProduct: createProductReducer,
  loyalty: customerLoyalty,
  bulkUpdate: bulkUpdateReducer,
  user: userInfoReducer,
});

export type RootReducerType = ReturnType<typeof rootReducer>;
