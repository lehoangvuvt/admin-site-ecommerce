import { action } from "typesafe-actions";
import { SET_USER_INFO } from "../../constants/actions";

export const actions = {
  setUserInfomation: (userInfo: any) => action(SET_USER_INFO, { userInfo }),
};
