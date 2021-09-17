import { useEffect, useState } from 'react';
import axios from 'axios';
import Check from '@material-ui/icons/Check';
import { useRouter } from '../../../../../hooks/router';
import { OrderHistoryType, PaymentMethodType, ProductType, StoreType } from '../../../../types';
import LoadingBar from '../../../../../components/LoadingBar';
import { formatter as currencyFormatter } from '../../../../../utils/currency.formatter';
import './style.scss';
import { CircularProgress } from '@material-ui/core';
import UpdateStatusModal from './UpdateStatusModal';
import moment from 'moment';

export type orderDetailsInfoType = {
    ID: number,
    CREATED_DATETIME: Date,
    MODIFIED_DATETIME: Date,
    STATUS: number,
    SID_CUSTOMER: string,
    SESSION_ID: string,
    IP_ADDRESS: string,
    EMAIL: string,
    S_FIRST_NAME: string,
    S_LAST_NAME: string,
    S_COMPANY: string,
    S_STREET_ADDRESS: string,
    S_COUNTRY: string,
    S_CITY: string,
    S_DISTRICT: string,
    S_ZIP_CODE: string,
    S_PHONE: string,
    ORDER_TYPE: number,
    S_TYPE: number,
    P_TYPE: number,
    SHIPPING_AMT: number,
    DISC_PERC: number,
    DISC_AMT: number,
    TRANSACTION_SUBTOTAL: number,
    TRANSACTION_TOTAL_TAX_AMT: number,
    TRANSACTION_TOTAL_AMT: number,
    TRANSACTION_TOTAL_WITH_TAX: number,
    TOTAL_LINE_ITEM: number,
    TOTAL_ITEM_COUNT: number,
    NOTE: string,
    ERROR_LOG: string,
    historyLines: Array<OrderHistoryType>,
    customerInfo: any,
    STORE_CODE: string,
    store: StoreType,
    orderItems: Array<{
        ID: number,
        ORDER_ID: number,
        SID_PRODUCT: string,
        CREATED_DATETIME: Date,
        QUANTITY: number,
        PRODUCT_NAME: string,
        ATTRIBUTE_VALUE: string,
        GROUP_ATTRIBUTE_VALUE: string,
        PRODUCT_PRICE: number,
        TAX_AMOUNT: number,
        DISCOUNT_AMOUNT: number,
        PRICE_WITH_TAX_DIS: number;
        product: ProductType,
    }>
};

const OrderDetails = () => {
    const router = useRouter();
    const [orderDetails, setOrderDetails] = useState<orderDetailsInfoType | null>(null);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [option, setOption] = useState(1);
    const [activeStep, setActiveStep] = useState(1);
    const [isOpenModal, setOpenModal] = useState(false);
    const [isOpenUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<Array<PaymentMethodType>>([]);

    const getStatusName = (value: number) => {
        let statusName = 'Undefined';
        switch (value) {
            case 1:
                statusName = 'New order';
                break;
            case 2:
                statusName = ' On hold';
                break;
            case 3:
                statusName = 'Processing';
                break;
            case 4:
                statusName = 'Store assigned';
                break;
            case 5:
                statusName = 'Cancelled';
                break;
            case 6:
                statusName = 'In delivery';
                break;
            case 7:
                statusName = 'Completed';
                break;
            case 8:
                statusName = 'Closed';
                break;
            case 9:
                statusName = 'Pick up on hold';
                break;
            default:
                break;
        }
        return statusName;
    }

    const getStatusIcon = (value: number) => {
        let statusIcon = <i className="far fa-question-circle"></i>;
        switch (value) {
            case 1:
                statusIcon = <i className="fas fa-star"></i>;
                break;
            case 2:
                statusIcon = <i className="fas fa-pause"></i>
                break;
            case 3:
                statusIcon = <i className="fas fa-spinner"></i>;
                break;
            case 4:
                statusIcon = <i className="fas fa-store"></i>
                break;
            case 5:
                statusIcon = <i className="far fa-times-circle"></i>
                break;
            case 7:
                statusIcon = <i className="far fa-check-circle"></i>;
                break;
            default:
                break;
        }
        return statusIcon;
    }

    const getStatusColor = (value: number) => {
        let style = {
            background: 'black',
            color: 'white'
        }
        switch (value) {
            case 1:
                style.background = '#fff44f';
                style.color = 'black';
                break;
            case 2:
                style.background = '#2c3e50';
                style.color = 'white';
                break;
            case 3:
                style.background = '#3498db';
                style.color = 'white';
                break;
            case 4:
                style.background = '#1abc9c';
                style.color = 'white';
                break;
            case 5:
                style.background = '#e74c3c';
                style.color = 'white';
                break;
            case 7:
                style.background = '#25D366';
                style.color = 'white';
                break;
            default:
                break;
        }
        return style;
    }

    const getOrderDetails = async () => {
        const pathArr = router.pathname.split('/');
        const SID = pathArr[pathArr.length - 1];
        const url = `http://localhost:5035/orders/order/${SID}`;
        setIsLoading(true);
        const response = await axios({
            url,
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setPercentCompleted(percentCompleted);
            }
        });
        const orderDetails = response.data.orderDetails;
        setOrderDetails(orderDetails);
        setActiveStep(orderDetails.STATUS);
        setIsLoading(false);
    }

    const getAllPaymentMethods = async () => {
        const response = await axios({
            url: "http://localhost:5035/payment/payment-methods/get-all",
            method: "GET",
            withCredentials: true
        })
        const data = response.data;
        setPaymentMethods(data.paymentMethods);
    }

    useEffect(() => {
        getAllPaymentMethods();
        getOrderDetails();
    }, [router.pathname])

    const checkIsClickOptionToggle = (e: any) => {
        if (e.srcElement
            && e.srcElement.parentElement
            && e.srcElement.parentElement.firstChild && e.srcElement.parentElement.firstChild.className) {
            if (e.srcElement.parentElement.firstChild.className !== 'fas fa-angle-down'
                && e.srcElement.parentElement.firstChild.className !== 'order-details-container__general-info__right__modal__option'
                && e.srcElement.parentElement.firstChild.className !== 'order-modal-btn') {
                setOpenModal(false);
            }
        }
    }

    useEffect(() => {
        window.addEventListener('click', checkIsClickOptionToggle, false);

        return () => {
            window.removeEventListener('click', checkIsClickOptionToggle, false);
        }
    }, [])

    const closeUpdateStatusModal = () => {
        setOpenUpdateStatusModal(false);
    }

    const getDeliveryMethodName = (S_TYPE: number) => {
        let deliveryMethodName = '';
        switch (S_TYPE) {
            case 1:
                deliveryMethodName = 'Normal Delivery';
                break;
            case 2:
                deliveryMethodName = 'Fast Delivery';
                break;
            default:
                return;
        }
        return deliveryMethodName;
    }

    return (
        <>
            <LoadingBar percentCompleted={percentCompleted} />
            {orderDetails && paymentMethods.length > 0 && !isLoading ?
                <div className='order-details-container'>
                    <UpdateStatusModal
                        getStatusColor={getStatusColor}
                        getStatusName={getStatusName}
                        isOpen={isOpenUpdateStatusModal}
                        orderDetails={orderDetails}
                        closeUpdateStatusModal={closeUpdateStatusModal}
                    />
                    <div className='order-details-container__general-info'>
                        <div className='order-details-container__general-info__left'>
                            <div className='order-details-container__general-info__left__info-field'>
                                <p>Current Status: </p>
                                <div className='order-details-container__general-info__left__info-field__status'
                                    style={{
                                        background: getStatusColor(orderDetails.STATUS).background,
                                        color: getStatusColor(orderDetails.STATUS).color,
                                    }}
                                >
                                    <p>{getStatusName(orderDetails.STATUS)}</p>
                                </div>
                            </div>
                            <div className='order-details-container__general-info__left__info-field'>
                                <p>Order Type: </p>
                                <div className='order-details-container__general-info__left__info-field__other'>
                                    <p>{orderDetails.ORDER_TYPE === 1 ?
                                        'Pick Up In Store' :
                                        'Deliver'}</p>
                                </div>
                            </div>
                            <div className='order-details-container__general-info__left__info-field'>
                                <p>Payment Method: </p>
                                <div className='order-details-container__general-info__left__info-field__other'>
                                    <p>{paymentMethods.filter(payment => payment.ID === orderDetails.P_TYPE)[0].PAYMENT_DESCRIPTION}</p>
                                </div>
                            </div>
                            {
                                orderDetails.ORDER_TYPE !== 1 ?
                                    <div className='order-details-container__general-info__left__info-field'>
                                        <p>Delivery Method: </p>
                                        <div className='order-details-container__general-info__left__info-field__other'>
                                            <p>{getDeliveryMethodName(orderDetails.S_TYPE)}</p>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>

                        <div className='order-details-container__general-info__right'>
                            <button
                                className='order-modal-btn'
                                style={{
                                    background: isOpenModal ? 'rgba(0, 0, 0, 0.04)' : 'white',
                                }}
                                onClick={() => {
                                    setOpenModal(!isOpenModal)
                                }}
                            >
                                Action <i className={isOpenModal ? "fas fa-angle-up" : "fas fa-angle-down"}></i>
                            </button>
                            {isOpenModal ?
                                <div className='order-details-container__general-info__right__modal'>
                                    <button
                                        disabled={orderDetails.STATUS === 5 || orderDetails.STATUS === 7 || orderDetails.STATUS === 8}
                                        onClick={() => {
                                            setOpenModal(false);
                                            setOpenUpdateStatusModal(true);
                                        }}
                                        className='order-details-container__general-info__right__modal__option'>
                                        <p>Update Status</p>
                                    </button>
                                    <button className='order-details-container__general-info__right__modal__option'>
                                        <p>Delete Order</p>
                                    </button>
                                </div>
                                : null}
                        </div>

                    </div>

                    <div className='order-details-container__tabs'>
                        <div className={
                            option === 1 ?
                                'order-details-container__tabs__tab order-details-container__tabs__tab--active' :
                                'order-details-container__tabs__tab order-details-container__tabs__tab--inactive'
                        }
                            onClick={() => setOption(1)}
                        >
                            <h1>Order History</h1>
                        </div>

                        <div className={
                            option === 2 ?
                                'order-details-container__tabs__tab order-details-container__tabs__tab--active' :
                                'order-details-container__tabs__tab order-details-container__tabs__tab--inactive'
                        }
                            onClick={() => setOption(2)}
                        >
                            <h1>Order Items</h1>
                        </div>

                        <div className={
                            option === 5 ?
                                'order-details-container__tabs__tab order-details-container__tabs__tab--active' :
                                'order-details-container__tabs__tab order-details-container__tabs__tab--inactive'
                        }
                            onClick={() => setOption(5)}
                        >
                            <h1>Customer Info</h1>
                        </div>

                        <div className={
                            option === 3 ?
                                'order-details-container__tabs__tab order-details-container__tabs__tab--active' :
                                'order-details-container__tabs__tab order-details-container__tabs__tab--inactive'
                        }
                            onClick={() => setOption(3)}
                        >
                            <h1>{orderDetails.ORDER_TYPE === 1 ? "Pick Up Info" : "Shipping Info"}</h1>
                        </div>


                        <div className={
                            option === 4 ?
                                'order-details-container__tabs__tab order-details-container__tabs__tab--active' :
                                'order-details-container__tabs__tab order-details-container__tabs__tab--inactive'
                        }
                            onClick={() => setOption(4)}
                        >
                            <h1>Customer's Note</h1>
                        </div>
                    </div>

                    {
                        option === 1 ?
                            <div className='order-details-container__order-history-container'>
                                <div className='order-details-container__order-history-container__table'>
                                    {orderDetails.historyLines.sort((a, b) => {
                                        return new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime()
                                    }).map(line =>
                                        <div className={
                                            line.ORDER_STATUS === activeStep ?
                                                'order-details-container__order-history-container__table__row order-details-container__order-history-container__table__row--active'
                                                : 'order-details-container__order-history-container__table__row order-details-container__order-history-container__table__row--inactive'
                                        }>
                                            <h1>{moment(line.CREATED_DATETIME).format('DD/MM/YYYY HH:mm')}</h1>
                                            <p>{getStatusName(line.ORDER_STATUS)}</p>
                                            <p>{line.NOTE}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            : null
                    }

                    {
                        option === 2 ?
                            <>
                                <div className='order-details-container__items-table'>
                                    <div className='order-details-container__items-table__header'>
                                        <div className='order-details-container__items-table__header__header1'>
                                            <h1>Description</h1>
                                        </div>
                                        <div className='order-details-container__items-table__header__header2'>
                                            <h1>Quantity</h1>
                                        </div>
                                        <div className='order-details-container__items-table__header__header3'>
                                            <h1>Unit price</h1>
                                        </div>
                                        <div className='order-details-container__items-table__header__header4'>
                                            <h1>Tax amount</h1>
                                        </div>
                                        <div className='order-details-container__items-table__header__header5'>
                                            <h1>Discount amount</h1>
                                        </div>
                                        <div className='order-details-container__items-table__header__header6'>
                                            <h1>Total</h1>
                                        </div>
                                    </div>

                                    {orderDetails.orderItems.map(item =>
                                        <div className='order-details-container__items-table__row'>
                                            <div className='order-details-container__items-table__row__column1'>
                                                <div><h1>{item.PRODUCT_NAME}</h1></div>
                                                <div><h1>{item.ATTRIBUTE_VALUE}, {item.GROUP_ATTRIBUTE_VALUE}</h1></div>
                                            </div>
                                            <div className='order-details-container__items-table__row__column2'>
                                                {item.QUANTITY}
                                            </div>
                                            <div className='order-details-container__items-table__row__column3'>
                                                {currencyFormatter(item.PRODUCT_PRICE)}
                                            </div>
                                            <div className='order-details-container__items-table__row__column4'>
                                                {currencyFormatter(item.TAX_AMOUNT)}
                                            </div>
                                            <div className='order-details-container__items-table__row__column5'>
                                                {currencyFormatter(item.DISCOUNT_AMOUNT)}
                                            </div>
                                            <div className='order-details-container__items-table__row__column6'>
                                                <p>{currencyFormatter(item.PRICE_WITH_TAX_DIS * item.QUANTITY)}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className='order-details-container__items-table__footer'>
                                        <div className='order-details-container__items-table__footer__left'>
                                        </div>
                                        <div className='order-details-container__items-table__footer__right'>
                                            <p>Total Amount: <span>{currencyFormatter(orderDetails.TRANSACTION_TOTAL_WITH_TAX)}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : null
                    }
                </div >
                :
                null}

            {
                option === 3 && orderDetails ?
                    orderDetails.ORDER_TYPE === 1 ?
                        <div className='order-details-container__customer-info-container'>
                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Customer name</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_FIRST_NAME} {orderDetails.S_LAST_NAME}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Phone number</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <a href={`tel:${orderDetails.S_PHONE}`}>{orderDetails.S_PHONE}</a>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Email</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <a href={`mailto:${orderDetails.EMAIL}`}>{orderDetails.EMAIL}</a>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Store code</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.store.STORE_CODE}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Store's name</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.store.NAME}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Store's address</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.store.ADDRESS}, District {orderDetails.store.DISTRICT}, {orderDetails.store.CITY} City</p>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='order-details-container__customer-info-container'>
                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Customer name</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_FIRST_NAME} {orderDetails.S_LAST_NAME}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Phone number</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <a href={`tel:${orderDetails.S_PHONE}`}>{orderDetails.S_PHONE}</a>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Email</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <a href={`mailto:${orderDetails.EMAIL}`}>{orderDetails.EMAIL}</a>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>City</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_CITY}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>District</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_DISTRICT}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Address</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_STREET_ADDRESS}</p>
                                </div>
                            </div>
                        </div>
                    : null
            }

            {option === 4 && orderDetails ?
                <div className='order-details-container__customer-note-container'>
                    <p>{orderDetails.NOTE ? orderDetails.NOTE : ''}</p>
                </div>
                :
                null}

            {
                isLoading ?
                    <div style={{
                        width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent
                            : 'center'
                    }}>
                        <CircularProgress />
                    </div>
                    : null
            }

            {
                option === 5 && orderDetails ?
                    orderDetails.customerInfo ?
                        <div>
                            <div className='order-details-container__customer-info-container'>
                                <div className='order-details-container__customer-info-container__row'>
                                    <div className='order-details-container__customer-info-container__row__label'>
                                        <p>Customer name</p>
                                    </div>
                                    <div className='order-details-container__customer-info-container__row__content'>
                                        <p>{orderDetails.customerInfo.S_FIRST_NAME} {orderDetails.customerInfo.LAST_NAME}</p>
                                    </div>
                                </div>

                                <div className='order-details-container__customer-info-container__row'>
                                    <div className='order-details-container__customer-info-container__row__label'>
                                        <p>Phone number</p>
                                    </div>
                                    <div className='order-details-container__customer-info-container__row__content'>
                                        <a href={`tel:${orderDetails.customerInfo.addresses[0].PHONE}`}>
                                            {orderDetails.customerInfo.addresses[0].PHONE}
                                        </a>
                                    </div>
                                </div>

                                <div className='order-details-container__customer-info-container__row'>
                                    <div className='order-details-container__customer-info-container__row__label'>
                                        <p>Email</p>
                                    </div>
                                    <div className='order-details-container__customer-info-container__row__content'>
                                        <a href={`mailto:${orderDetails.customerInfo.EMAIL}`}>
                                            {orderDetails.customerInfo.EMAIL}
                                        </a>
                                    </div>
                                </div>

                                <div className='order-details-container__customer-info-container__row'>
                                    <div className='order-details-container__customer-info-container__row__label'>
                                        <p>City</p>
                                    </div>
                                    <div className='order-details-container__customer-info-container__row__content'>
                                        <p>{orderDetails.customerInfo.addresses[0].CITY}</p>
                                    </div>
                                </div>

                                <div className='order-details-container__customer-info-container__row'>
                                    <div className='order-details-container__customer-info-container__row__label'>
                                        <p>District</p>
                                    </div>
                                    <div className='order-details-container__customer-info-container__row__content'>
                                        <p>{orderDetails.customerInfo.addresses[0].DISTRICT}</p>
                                    </div>
                                </div>

                                <div className='order-details-container__customer-info-container__row'>
                                    <div className='order-details-container__customer-info-container__row__label'>
                                        <p>Address</p>
                                    </div>
                                    <div className='order-details-container__customer-info-container__row__content'>
                                        <p>{orderDetails.customerInfo.addresses[0].STREET_ADDRESS}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                        :
                        <div className='order-details-container__customer-info-container'>
                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Customer name</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_FIRST_NAME} {orderDetails.S_LAST_NAME}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Phone number</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <a href={`tel:${orderDetails.S_PHONE}`}>{orderDetails.S_PHONE}</a>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Email</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <a href={`mailto:${orderDetails.EMAIL}`}>{orderDetails.EMAIL}</a>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>City</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_CITY}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>District</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_DISTRICT}</p>
                                </div>
                            </div>

                            <div className='order-details-container__customer-info-container__row'>
                                <div className='order-details-container__customer-info-container__row__label'>
                                    <p>Address</p>
                                </div>
                                <div className='order-details-container__customer-info-container__row__content'>
                                    <p>{orderDetails.S_STREET_ADDRESS}</p>
                                </div>
                            </div>

                        </div>
                    :
                    null
            }
        </>
    )
}

export default OrderDetails;