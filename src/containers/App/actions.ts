import { action } from 'typesafe-actions';
import { SET_SIDEBAR, OPEN_GLOBAL_SEARCH, CLOSE_GLOBAL_SEARCH, OPEN_SIDEBAR } from '../../constants/actions';

export const actions = {
    setSideBar: () => action(SET_SIDEBAR),
    openSideBar: () => action(OPEN_SIDEBAR),
    openGlobalSearch: () => action(OPEN_GLOBAL_SEARCH),
    closeGlobalSearch: () => action(CLOSE_GLOBAL_SEARCH),
}