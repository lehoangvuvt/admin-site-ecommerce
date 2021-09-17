import {
  AiOutlineShoppingCart,
} from "react-icons/ai";
import {
  RiDashboardFill
} from "react-icons/ri";
import {
  MdPermDataSetting
} from "react-icons/md";
import {
  HiOutlineDocumentReport
} from "react-icons/hi";
import {
  FiSettings
} from "react-icons/fi";
import { Reducer, ActionType } from "typesafe-actions";
import { actions } from "./actions";
import { ConfigType, NavigationType } from "../types";
import { useRef } from "react";
import {
  CLOSE_GLOBAL_SEARCH,
  OPEN_GLOBAL_SEARCH,
  OPEN_SIDEBAR,
  SET_SIDEBAR,
} from "../../constants/actions";

let initialState: State;

initialState = {
  navigation: [
    {
      title: "",
      items: [
        {
          url: "/dashboard",
          title: "Dashboard",
          icon: <RiDashboardFill size={20} />,
          items: [],
        },
        {
          url: "/",
          title: "E-commerce",
          icon: <AiOutlineShoppingCart size={20} />,
          items: [
            {
              url: "/",
              title: "Products",
              items: [
                {
                  url: "/e-commerce/products?q=*&page=1",
                  title: "Products",
                  items: [],
                },
                {
                  url: "/e-commerce/brands",
                  title: "Brands",
                  items: [],
                },
                {
                  url: "/e-commerce/categories",
                  title: "Categories",
                  items: [],
                },
                {
                  url: "/e-commerce/attributes",
                  title: "Attributes",
                  items: [],
                },
                {
                  url: "/e-commerce/attribute-sets",
                  title: "Attribute Sets",
                  items: [],
                },
              ],
            },
            {
              url: "/e-commerce/orders?q=*&sort=CREATED_DATETIME%20DESC&page=1",
              title: "Orders",
              items: [],
            },
            {
              url: "/",
              title: "Customers",
              items: [
                {
                  url: "/e-commerce/customers?q=*&page=1",
                  title: "Customers",
                  items: [],
                },
                {
                  url: "/e-commerce/segments",
                  title: "Segments",
                  items: [],
                },
                {
                  url: "/e-commerce/customers/loyalty",
                  title: "Loyalty",
                  items: [],
                },
                {
                  url: '/e-commerce/customers/coupon',
                  title: 'Coupon',
                  items: []
                }
              ],
            },
            {
              url: "/e-commerce/promotion",
              title: "Promotion",
              items: [],
            },
            {
              url: "/e-commerce/shipping-methods",
              title: "Shipping Methods",
              items: [],
            },
            {
              url: "/e-commerce/store",
              title: "Store",
              items: []
            }
          ],
        },
        {
          url: "/",
          icon: <HiOutlineDocumentReport size={20} />,
          title: "Reports",
          items: [
            {
              url: "/",
              title: "Customer Report",
              items: [
                {
                  url: "/reports/orders?q=*&page=1",
                  title: "Orders",
                  items: [],
                },
                {
                  url: "/reports/segments",
                  title: "Segments",
                  items: [],
                },
                {
                  url: "/reports/accounts",
                  title: "Accounts",
                  items: [],
                },
              ],
            },
            {
              url: "/",
              title: "Product Report",
              items: [
                {
                  url: "/reports/bestsellers",
                  title: "Bestsellers",
                  items: [],
                },
                {
                  url: "/reports/lowStock",
                  title: "Low Stock",
                  items: [],
                },
                {
                  url: "/reports/productViews",
                  title: "Product Views",
                  items: [],
                },
                {
                  url: "/reports/orderedProducts",
                  title: "Ordered Products",
                  items: [],
                },

              ],
            },
            {
              url: "/",
              title: "Marketing",
              items: [
                {
                  url: "/reports/marketing",
                  title: "Product In Cart",
                  items: [],
                },
                {
                  url: "/reports/searchterm",
                  title: "Search Term",
                  items: [],
                },
              ],
            },
            {
              url: "/reports/sales",
              title: "Sales",
              items: [],
            },
          ],
        },
        {
          url: "/",
          title: "Permissions",
          icon: <MdPermDataSetting size={20} />,
          items: [
            {
              url: "/permissions/roles",
              title: "Roles",
              items: [],
            },
            {
              url: "/permissions/resources",
              title: "Resources",
              items: [],
            },
          ],
        },
        {
          url: "/",
          title: "Settings",
          icon: <FiSettings size={20} />,
          items: [
            {
              url: "/settings/mail-settings",
              title: "Mail Settings",
              items: [],
            }, {
              url: "/settings/activeRecommend",
              title: "Admin Setting",
              items: [],
            },
          ],
        },
      ],
    },
  ],
  config: {
    name: "D-board",
    description: "Next.js Tailwind CSS admin template",
    url: "https://d-board-nextjs.mobifica.com",
    collapsed: false,
    isShowGlobalSearch: false,
    darkMode: false,
  },
};

type State = {
  navigation: Array<NavigationType>;
  config: ConfigType;
};

type Action = ActionType<typeof actions>;

export const globalReducer: Reducer<Readonly<State>, Action> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_SIDEBAR:
      return {
        ...state,
        config: {
          ...state.config,
          collapsed: !state.config.collapsed,
        },
      };
    case OPEN_SIDEBAR:
      return {
        ...state,
        config: {
          ...state.config,
          collapsed: false,
        },
      };
    case OPEN_GLOBAL_SEARCH:
      return {
        ...state,
        config: {
          ...state.config,
          isShowGlobalSearch: true,
        },
      };
    case CLOSE_GLOBAL_SEARCH:
      return {
        ...state,
        config: {
          ...state.config,
          isShowGlobalSearch: false,
        },
      };
    default:
      return state;
  }
};

export default globalReducer;
