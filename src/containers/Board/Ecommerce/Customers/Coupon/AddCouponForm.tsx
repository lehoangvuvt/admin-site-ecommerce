import Main from "../../../../../components/Main"
import './style.scss'
import { Container, TextField, FormControlLabel, Checkbox, Typography, Button, Modal, CircularProgress, Snackbar, MenuItem, Tabs, Tab } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useState, useEffect } from 'react'
import { NumberFormatCustom } from '../../../../../components/NumberFormatCustom'
import moment from 'moment'
import axios from 'axios'
import CustomerFilter from '../../../../../components/CustomerFilter'
import { useRouter } from '../../../../../hooks/router'

const AddCouponForm: React.FC = () => {
    const router = useRouter();
    const [couponName, setCouponName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [applyCount, setApplyCount] = useState<string>("0");
    const [unlimited, setUnlimited] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));
    const [startTime, setStartTime] = useState<string>("00:00");
    const [endTime, setEndTime] = useState<string>("23:59");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [filterStr, setFilterStr] = useState<string>("");
    const [listColumn, setListColumn] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");
    const [useSubtotal, setUseSubTotal] = useState<boolean>(true);
    const [validationSubTotal, setValidationSubTotal] = useState<string>("0");
    const [rewardTransactionValue, setRewardTransactionValue] = useState<string>("0");
    const [rewardTransactionType, setRewardTransactionType] = useState<string>("0");
    const [valueTab, setValueTab] = useState<number>(0);

    useEffect(() => {
        async function fetchColumnName() {
            const response = await axios({
                method: "GET",
                url: "http://localhost:5035/customers/columns-info",
                withCredentials: true
            })
            if (response.status === 200) {
                // console.log(response);
                let tmpLstColumn: string[] = [];
                response.data.map((item: any) => {
                    tmpLstColumn.push(item.Field);
                })
                setListColumn(tmpLstColumn);
            }
        }
        fetchColumnName()
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const momentStartTime = moment(`${startDate}T${startTime}:00`);
        const momentEndTime = moment(`${endDate}T${endTime}:00`);

        let data = {
            COUPON_NAME: couponName,
            DESCRIPTION: description,
            APPLY_COUNT: (unlimited) ? null : parseInt(applyCount),
            START_DATE: momentStartTime.format("YYYY-MM-DD"),
            END_DATE: momentEndTime.format("YYYY-MM-DD"),
            START_TIME: momentStartTime.hour() * 3600 + momentStartTime.minute() * 60 + momentStartTime.second(),
            END_TIME: momentEndTime.hour() * 3600 + momentEndTime.minute() * 60 + momentEndTime.second(),
            FILTER_STR: filterStr,
            VALIDATION_USE_SUBTOTAL: useSubtotal,
            VALIDATION_SUBTOTAL: parseInt(validationSubTotal),
            REWARD_MODE: 1,
            REWARD_DISCOUNT_TYPE: parseInt(rewardTransactionType),
            REWARD_DISCOUNT_VALUE: parseInt(rewardTransactionValue)
        }
        setIsLoading(true);
        try {
            const response = await axios({
                method: "POST",
                url: "http://localhost:5035/customers/coupon",
                data
            })

            if (response.status === 200)
                setResult("success")
        }
        catch (ex) {
            setResult("failed")
        }
        setIsLoading(false);
    }

    const handleModal = (vari: boolean) => {
        setOpenModal(vari);
    }

    const handleSaveFilter = (filter: string) => {
        setFilterStr(filter);
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (result === "success")
            router.push("/e-commerce/customers/coupon")
        setResult("");
    };

    const changeRewardTransactionType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRewardTransactionType(event.target.value);
    }

    const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValueTab(newValue);
    }

    return (
        <form onSubmit={handleSubmit} id="couponForm">
            <Container className="root">
                <div className="tabbar">
                    <Tabs
                        textColor="primary"
                        indicatorColor="primary"
                        value={valueTab}
                        onChange={handleChangeTab}
                    >
                        <Tab label="General" />
                        <Tab label="Validation" />
                        <Tab label="Reward" />
                    </Tabs>
                    <div className="create-product-container__btn-container button-submit-coupon">
                        <Button type="submit" variant="contained" color="primary">
                            {
                                isLoading ?
                                    <CircularProgress color="primary" />
                                    :
                                    "Submit"
                            }
                        </Button>
                    </div>
                </div>
                <div
                    role="tabpanel"
                    hidden={valueTab !== 0}
                    id={`simple-tabpanel-0`}
                    aria-labelledby={`simple-tab-0`}
                    className="tab-panel-id"
                >
                    <div>
                        <TextField
                            id="Coupon_name" label="Coupon Name" required
                            value={couponName}
                            onChange={(e) => setCouponName(e.target.value)}
                            style={{width: '300px'}}
                        />
                    </div>
                    <div>
                        <TextField
                            id="Description" label="Description" required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{width: '300px'}}
                        />
                    </div>
                    <div style={{ display: 'flex' }}>
                        <TextField
                            id=""
                            label="Apply Count"
                            disabled={unlimited}
                            required
                            value={applyCount}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                            onChange={(e) => setApplyCount(e.target.value)}
                        />
                        <FormControlLabel
                            label="Unlimit"
                            style={{ margin: '0' }}
                            control={
                                <Checkbox
                                    checked={unlimited}
                                    onChange={(e) => setUnlimited(e.target.checked)}
                                    color="primary"
                                />
                            }
                        />
                    </div>
                    <div className="layout-time-promotion">
                        <TextField
                            id="start_date"
                            label="Start time"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            // className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                        <TextField
                            id="start_time"
                            label="From time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    <div className="layout-time-promotion">
                        <TextField
                            id="end_date"
                            label="End time"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            // className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                        <TextField
                            id="end_time"
                            label="To time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                </div>
                <div
                    role="tabpanel"
                    hidden={valueTab !== 1}
                    id={`simple-tabpanel-1`}
                    aria-labelledby={`simple-tab-1`}
                    className="tab-panel-id"
                >
                    <div style={{ padding: '0' }}>
                        <FormControlLabel
                            label="Use Subtotal"
                            style={{ margin: '0' }}
                            control={
                                <Checkbox
                                    checked={useSubtotal}
                                    color="primary"
                                    onChange={(e) => setUseSubTotal(e.target.checked)}
                                />
                            }
                        />
                    </div>
                    <div>
                        <TextField
                            label="Validation subtotal"
                            // onChange={handleChange}
                            disabled={!useSubtotal}
                            defaultValue={validationSubTotal}
                            onChange={(e) => setValidationSubTotal(e.target.value)}
                            name="VALIDATION_SUBTOTAL"
                            id={"đ"}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                        />
                    </div>
                    <br />
                    <div style={{ padding: '0', display: 'inline-flex' }}>
                        <Typography variant="body1">Use Customer Filter</Typography>
                        <Button variant="contained" color="primary" onClick={(e) => setOpenModal(true)}>Change</Button>
                        <Modal
                            open={openModal}
                            className="modal-paper"
                        >
                            <CustomerFilter listColumn={listColumn} setOpenModal={handleModal} handleSaveFilter={handleSaveFilter} />
                        </Modal>
                    </div>
                    <div>
                        <Typography variant="body1">{filterStr}</Typography>
                    </div>
                </div>
                <div
                    role="tabpanel"
                    hidden={valueTab !== 2}
                    id={`simple-tabpanel-2`}
                    aria-labelledby={`simple-tab-2`}
                    className="tab-panel-id"
                >
                    <div>
                        <TextField
                            id="REWARD_TRANSACTION_TYPE"
                            label="Reward transaction type"
                            select
                            value={rewardTransactionType}
                            onChange={changeRewardTransactionType}
                            helperText="Please select reward transaction type"
                        >
                            <MenuItem key="currency" value="1">
                                Currency
                            </MenuItem>
                            <MenuItem key="percent" value="0">
                                Percent
                            </MenuItem>
                        </TextField>
                    </div>
                    <div>
                        <TextField
                            label="Reward transaction value"
                            // onChange={handleChange}
                            defaultValue={rewardTransactionValue}
                            onChange={(e) => setRewardTransactionValue(e.target.value)}
                            name="REWARD_TRANSACTION_DISC_VALUE"
                            id={(rewardTransactionType === "1") ? "đ" : "%"}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                        />
                    </div>
                </div>

                <Snackbar open={result !== ""} autoHideDuration={4000} onClose={handleClose} >
                    {
                        (result === "success") ?
                            <Alert onClose={handleClose} severity="success">
                                Create coupon successfully
                            </Alert>
                            :
                            <Alert severity="error">
                                Something went wrong
                            </Alert>
                    }
                </Snackbar>
            </Container>
        </form>
    )
}

const MainAddCouponForm: React.FC = () => {
    return (
        <Main
            title1="Coupon"
            title2="Add Coupon"
            children={<AddCouponForm />}
        />
    )
}

export default MainAddCouponForm;