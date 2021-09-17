import { ActionType, Reducer } from "typesafe-actions";
import { SET_USER_INFO } from "../../constants/actions";
import { actions } from "./actions";

const initialState = {
  userInfo: "some info",
};

type State = {
  userInfo: any | null;
};

type Action = ActionType<typeof actions>;

export const userInfoReducer: Reducer<Readonly<State>, Action> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userInfo: action.payload.userInfo,
      };
    default:
      return state;
  }
};
