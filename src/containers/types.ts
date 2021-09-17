import { IconType } from "react-icons/lib";

export interface NavigationType {
    title: string,
    items: Array<NavigationItemType>
}

export interface NavigationItemType {
    url: string,
    icon?: JSX.Element,
    items: Array<NavigationItemType>,
    title: string,
    badge?: {
        color: string,
        text: number
    },
}

export interface ConfigType {
    name: string,
    description: string,
    url: string,
    collapsed: boolean,
    isShowGlobalSearch: boolean,
    darkMode: boolean,
}

export interface ProductImageType {
    CREATED_BY: string | null;
    CREATED_DATETIME: Date;
    IMAGE_TYPE: number;
    PRISM_URL: string;
    IMAGE_NAME: string;
    MODIFIED_BY: string | null;
    MODIFIED_DATETIME: Date | null;
    PRODUCT_SID: string;
    SID: string;
}

export interface CategoryType {
    CATEGORY_NAME: string;
    CREATED_BY: string | null;
    CREATED_DATETIME: Date;
    LONG_DESCRIPTION: string;
    MODIFIED_BY: string | null;
    MODIFIED_DATETIME: Date | null;
    SHORT_DESCRIPTION: string;
    SID: string
}

export interface CategoryConnectionsType {
    SID_CATEGORY: string;
    SID_PRODUCT: string;
    category: CategoryType
}

export interface CreateProductInformationType {
    SID_BRAND: string;
    PRODUCT_NAME: string;
    LONG_DESCRIPTION: string;
    SHORT_DESCRIPTION: string;
    UNIT_PRICE: number;
    TAX: number,
    DISCOUNT: number,
    SID_CATEGORY: string,
}

export interface ProductInformationType {
    SID: string;
    SID_BRAND: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    PRODUCT_NAME: string;
    LONG_DESCRIPTION: string;
    SHORT_DESCRIPTION: string;
    THRESHOLD: number;
    CAN_PREORDER: boolean;
    PRODUCT_GENDER: 'Men' | 'Women' | 'Both';
    products: ProductType[];
    categoryConnections: CategoryConnectionsType[];
    productBrand: ProductBrandType;
    productReviews: ProductReviewType[];
    productPrices: ProductPriceType[];
    productAttributeGroups: ProductAttributeGroupType[];
    SELLABLE_QTY?: number | 0;
    COUNT_CHECK: number | 0;
}

export interface ProductAttributeGroupType {
    ID: number;
    PRODUCT_INFORMATION_SID: string;
    GROUP_ATTRIBUTE_ID: number;
    GROUP_VALUE_VARCHAR: string;
    GROUP_VALUE_INT: number;
    GROUP_VALUE_DECIMAL: number;
    GROUP_VALUE_DATETIME: Date;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    productAttributeValues: ProductAttributeValueType[];
    productAttribute: ProductAttributeType;
}

export interface ProductPriceType {
    ID: number;
    SID_PRODUCT_INFORMATION: string;
    CREATED_DATETIME: Date;
    UNIT_PRICE: number;
    TAX: number;
    DISCOUNT: number;
}

export interface ProductReviewType {
    ID: number;
    SID_PRODUCT_INFORMATION: string;
    CREATED_BY: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    CONTENT: string;
    RATING: number;
    productInformation: ProductInformationType;
}

export interface ProductBrandType {
    SID: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    NAME: string;
}

export interface ProductType {
    SID: string;
    SID_PRODUCT_INFORMATION: string;
    QTY: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    images: ProductImageType[];
    status?: number;
}

export interface ProductAttributeType {
    ID: number;
    ATTRIBUTE_NAME: string;
    LABEL_TEXT: string;
    VALUE_TYPE: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
}

export interface ProductAttributeValueType {
    ID: number;
    SID_PRODUCT: string;
    PRODUCT_ATTRIBUTE_ID: number;
    CHECK?: boolean;
    SELECTED?: boolean;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    VALUE_VARCHAR: string;
    VALUE_INT: string;
    VALUE_DECIMAL: number;
    VALUE_DATETIME: Date;
    product: ProductType;
    productAttribute: ProductAttributeType;
}

export interface CartItemType {
    CART_SID: string;
    CREATED_DATETIME: string;
    MODIFIED_DATETIME: string;
    QUANTITY: number;
    SID_PRODUCT: string;
    product: CartItemProductType
}

export interface CartItemProductType {
    SID: string;
    SID_PRODUCT_INFORMATION: string;
    QTY: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    images: ProductImageType[];
    PRICE: number;
    PRODUCT_NAME: string;
}

export interface CartInfoType {
    CREATED_DATETIME: Date;
    SID: string;
    SID_CUSTOMER: string;
    STATUS: number;
    SUB_TOTAL: number;
    TOTAL_ITEMS: number;
    items: CartItemType[],
    havePromo: boolean,
    promoName: string,
    discValue: number
}

export interface CustomerInfoType {
    ACTIVE: number;
    BIRTH_DAY: number | null;
    BIRTH_MONTH: number | null;
    BIRTH_YEAR: number | null;
    CREATED_DATETIME: Date;
    CREDIT_LIMIT: number | null;
    CREDIT_USED: number | null;
    CUST_TYPE: number | null;
    EMAIL: string;
    FIRST_NAME: string;
    FIRST_SALE_DATE: Date | null;
    GENDER: number | null;
    LAST_NAME: string;
    LAST_ORDER_DATE: Date | null;
    LAST_SALE_AMT: number | null;
    LAST_SALE_DATE: Date | null;
    MIDDLE_NAME: string | null;
    MODIFIED_DATETIME: Date | null;
    ORDER_ITEM_COUNT: number | null;
    PAYMENT_TERMS_SID: number | null;
    RETURN_ITEM_COUNT: number | null;
    SALE_ITEM_COUNT: number | null;
    SID: string;
    TOTAL_TRANSACTIONS: number | null;
    addresses: []
}

export interface ItemPropsType {
    productInformation: ProductInformationType;
}

export interface ShippingInfoType {
    EMAIL: string;
    S_FIRST_NAME: string;
    S_LAST_NAME: string;
    S_STREET_ADDRESS: string;
    S_COUNTRY: string;
    S_CITY: string;
    S_DISTRICT: string;
    S_PHONE: string;
    S_TYPE: number;
    P_TYPE: number;
}

export interface BillingInfoType {
    B_FIRST_NAME: string;
    B_LAST_NAME: string;
    B_STREET_ADDRESS: string;
    B_COUNTRY: string;
    B_CITY: string;
    B_DISTRICT: string;
    B_PHONE: string;
}

export interface DistrictOfCityType {
    name: string;
    districts: string[];
}


export interface OrderItemType {
    SID_PRODUCT: string;
    QUANTITY: number;
}

export interface CreateOrderType {
    STATUS: number;
    EMAIL: string;
    S_FIRST_NAME: string;
    S_LAST_NAME: string;
    S_STREET_ADDRESS: string;
    S_COUNTRY: string;
    S_CITY: string;
    S_DISTRICT: string;
    S_PHONE: string;
    S_TYPE: number;
    P_TYPE: number;
    ITEMS: OrderItemType[];
}


export interface OrderType {
    CREATED_DATETIME: Date;
    STATUS: number;
    EMAIL: string;
    SID_CUSTOMER: string;
    SESSION_ID: string;
    S_FIRST_NAME: string;
    S_LAST_NAME: string;
    S_STREET_ADDRESS: string;
    S_COUNTRY: string;
    S_CITY: string;
    S_DISTRICT: string;
    S_ZIP_CODE: string;
    S_PHONE: string;
    S_TYPE: number;
    P_TYPE: number;
    ITEMS: OrderItemType[];
}

export interface OutOfStockItemType {
    SID_PRODUCT: string;
    exceedQty: number;
}

export interface ErrorFieldsType {
    fieldName: string;
    error: string;
}

export interface StoreType {
    STORE_ID: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    NAME: string;
    LATITUDE: string
    LONGITUDE: string;
    CITY: string;
    DISTRICT: string;
    ADDRESS: string;
    STORE_CODE: string;
}

export interface SelectedFilterType {
    filterFieldName: string;
    filterName: string;
    filterValue: string | number | Date;
    filterSetValue: string;
}

export interface AttributeSetType {
    ID: number;
    SET_NAME: string;
    ID_ATTRIBUTE_1: number;
    ID_ATTRIBUTE_2: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    productAttribute1: ProductAttributeType;
    productAttribute2: ProductAttributeType;
}

export interface CreateAttributeGroupType {
    PRODUCT_INFORMATION_SID: string;
    GROUP_ATTRIBUTE_ID: number;
    GROUP_VALUE_VARCHAR?: string;
    GROUP_VALUE_INT?: number;
    GROUP_VALUE_DECIMAL?: number;
    GROUP_VALUE_DATETIME?: Date;
}

export interface CreateAttributeValueType {
    SID_PRODUCT: string;
    PRODUCT_ATTRIBUTE_ID: number;
    PRODUCT_ATTRIBUTE_GROUP_ID: number;
    VALUE_VARCHAR?: string;
    VALUE_INT?: number;
    VALUE_DECIMAL?: number;
    VALUE_DATETIME?: Date;
}

export interface CreateProductType {
    SID_PRODUCT_INFORMATION: string;
    QTY: number;
}

export interface OrderInformationType {
    id: number;
    ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    MODIFIED_BY: string;
    STATUS: number;
    SID_CUSTOMER: string;
    SESSION_ID: string;
    IP_ADDRESS: string;
    EMAIL: string;
    S_FIRST_NAME: string;
    S_LAST_NAME: string;
    S_COMPANY: string;
    S_STREET_ADDRESS: string;
    S_COUNTRY: string;
    S_CITY: string;
    S_DISTRICT: string;
    S_ZIP_CODE: string;
    S_PHONE: string;
    S_TYPE: number;
    P_TYPE: number;
    SHIPPING_AMT: number;
    DISC_PERC: number;
    DISC_AMT: number;
    TRANSACTION_SUBTOTAL: number;
    TRANSACTION_TOTAL_TAX_AMT: number;
    TRANSACTION_TOTAL_AMT: number;
    TRANSACTION_TOTAL_WITH_TAX: number;
    TOTAL_LINE_ITEM: number;
    TOTAL_ITEM_COUNT: number;
    ERROR_LOG: string;
    NOTE: string,
    orderItems: Array<OrderItemType>;
}
export interface orderedProduct {
    ID: number;
    SKU: string;
    SID: string;
    PRODUCT_NAME: string;
    BRAND: string;
    UNIT_PRICE: string;
    SIZE: string;
    COLOR: string;
    ORDER_QTY: string;
}
export interface OrderItemType {
    ID: number;
    SID_ORDER: string;
    SID_PRODUCT: string;
    CREATED_DATETIME: Date;
    QUANTITY: number;
    product: ProductType;
}

export interface OrderHistoryType {
    ID: number;
    ORDER_ID: number;
    ORDER_STATUS: number;
    NOTE: string;
    CREATED_DATETIME: Date;
}

export interface PromotionDTO {
    DESCRIPTION: string;
    CREATED_BY: string;
    PROMO_NAME: string;
    DISCOUNT_REASON: string;
    PROMO_GROUP: string;
    PROMO_TYPE: number;
    START_DATE: Date;
    END_DATE: Date;
    START_TIME: number;
    END_TIME: number;
    USE_STORES: boolean;
    USE_PRICE_LEVEL: boolean;
    CAN_BE_COMBINED: boolean;
    APPLY_COUNT: number;
    VALIDATION_USE_ITEMS: boolean;
    VALIDATION_USE_SUBTOTAL: boolean;
    VALIDATION_SUBTOTAL: number;
    VALIDATION_USE_COUPON: boolean;
    VALIDATION_USE_CUSTOMERS: boolean;
    VALIDATION_CUSTOMER_FILTER: number;
    REWARD_VALIDATION_ITEMS: boolean;
    REWARD_VALIDATION_MODE: number;
    REWARD_VALIDATION_DISC_TYPE: number;
    REWARD_VALIDATION_DISC_VALUE: number;
    REWARD_TRANSACTION: boolean;
    REWARD_TRANSACTION_MODE: number;
    REWARD_TRANSACTION_DISC_TYPE: number;
    REWARD_TRANSACTION_DISC_VALUE: number;
    item_rule: PromotionValidationItemRuleDTO[];
    priority: object;
}

export interface PromotionValidationItemRuleDTO {
    CREATED_BY: string;
    SUBTOTAL: number;
    filter_element: PromotionValidationFilterElementDto[];
}

export interface PromotionValidationFilterElementDto {
    CREATED_BY: string;
    FIELD: string;
    OPERATOR: number;
    OPERAND: string;
    JOIN_OPERATOR: number;
}

export interface CustomerLoyaltyDto {
    loyaltyLevel: CustomerLoyaltyLevelDTO[],
    loyaltyRate: {
        ID: string;
        RATE: number;
    }
}

export interface CustomerLoyaltyLevelDTO {
    DESCRIPTION: string;
    ID: number;
    LOW_RANGE: number;
    NAME: string;
    UPPER_RANGE: number;
    EARN_MULTIPLIER: number;
    REDEEM_MULTIPLIER: number;
    HEX_COLOR: string;
}

export interface ResultRequest {
    success?: boolean;
    error: string;
    message: string;
}

export interface CouponList {
    SID: string;
    COUPON_NAME: string;
    APPLY_COUNT?: number | 0;
    START_DATE: string;
    END_DATE: string;
    ACTIVE: boolean;
}

export interface MailSettingType {
    ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    MAIL_FOR: string;
    DESCRIPTION: string;
    mailTemplates: MailTemplateType[];
}

export interface MailTemplateType {
    ID: number;
    MAIL_SETTING_ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    TEMPLATE_NAME: string;
    REF_TABLE: string;
    MAIL_SUBJECT: string;
    MAIL_CONTENTS: string;
}

export interface PaymentMethodType {
    ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    PAYMENT_DESCRIPTION: string;
    ICON_URL: string;
}

export interface ShippingMethodType {
    ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    SHIPPING_METHOD_NAME: string;
    DESCRIPTION: string;
    FLAT_PRICE: number;
}