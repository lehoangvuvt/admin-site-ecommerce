import { MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useRouter } from "../../../../../hooks/router";
import { orderDetailsInfoType } from "./OrderDetails";

type UpdateStatusModalPropsType = {
    isOpen: boolean,
    orderDetails: orderDetailsInfoType,
    getStatusName: (value: number) => string,
    getStatusColor: (value: number) => {
        background: string,
        color: string
    },
    closeUpdateStatusModal: () => void,
}

const statuses = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const UpdateStatusModal: FC<UpdateStatusModalPropsType> = ({ isOpen, orderDetails, getStatusColor, getStatusName, closeUpdateStatusModal }) => {
    const router = useRouter();
    const [selectedStatus, setSelectedStatus] = useState(statuses.filter(status => status > orderDetails.STATUS)[0]);
    const [note, setNote] = useState('');

    const updateStatus = async (e: any) => {
        e.preventDefault();
        if (note.trim() !== '' && note !== '') {
            const body = {
                orderId: orderDetails.ID,
                status: selectedStatus,
                note,
            }
            const response = await axios({
                url: `http://localhost:5035/orders/order/update-status`,
                method: 'PUT',
                data: body,
                withCredentials: true
            })
            const data = response.data;
            if (data.error) {
                alert('Update status failed');
                router.push(`/e-commerce/orders?q=*&page=1&sort=CREATED_DATETIME%20DESC`);
            } else {
                const order = data.order;
                alert('Update status success');
                router.push(`/e-commerce/orders?q=*&page=1&sort=CREATED_DATETIME%20DESC`);
            }
        } else {
            alert('Please enter note');
        }
        e.preventDefault();
    }

    return (
        isOpen ?
            <div className='order-details-container__update-status-modal'>
                <div className='order-details-container__update-status-modal__container'>
                    <div className='order-details-container__update-status-modal__container__left'>
                        <p>From </p>
                        <div
                            className='order-details-container__update-status-modal__container__left__from-status-container'
                            style={{
                                color: getStatusColor(orderDetails.STATUS).color,
                                background: getStatusColor(orderDetails.STATUS).background
                            }}>
                            <p>{getStatusName(orderDetails.STATUS)}</p>
                        </div>
                    </div>
                    <div className='order-details-container__update-status-modal__container__right'>
                        <p>To </p>
                        <div className='order-details-container__update-status-modal__container__right__to-status-container'>
                            <Select
                                value={selectedStatus}
                                onChange={(e: any) => {
                                    setSelectedStatus(parseInt(e.target.value))
                                }}
                            >
                                {statuses.filter(status => status > orderDetails.STATUS).map(status =>
                                    <MenuItem selected value={status} key={status}>{getStatusName(status)}</MenuItem>
                                )}
                            </Select>
                        </div>
                    </div>
                    <div className='order-details-container__update-status-modal__container__note'>
                        <p>Note</p>
                        <input
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value);
                            }}
                            placeholder='Enter note'
                            type='text' />
                    </div>
                    <div className='order-details-container__update-status-modal__container__bottom'>
                        <button
                            onClick={() => {
                                closeUpdateStatusModal();
                            }}
                        >Close</button>
                        <button
                            onClick={(e: any) => { updateStatus(e) }}
                        >Update</button>
                    </div>
                </div>
            </div>
            : null
    )
}

export default UpdateStatusModal;