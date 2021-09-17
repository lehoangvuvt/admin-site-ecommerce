import { Button, CircularProgress, Container, MenuItem, Snackbar, TextField, Checkbox, FormControlLabel, Select, Input, Modal, Typography, Paper, Tabs, Tab } from "@material-ui/core";
import { Alert, Autocomplete } from '@material-ui/lab'
import { Close } from '@material-ui/icons'
import { useEffect } from 'react'
import moment from 'moment';
import { NumberFormatCustom } from "../../../../../components/NumberFormatCustom";
import './style.scss';
import { useState } from 'react'
import { promotionForm } from './data'
import axios from 'axios'
import { useRouter } from '../../../../../hooks/router'
import CustomerFilter from "../../../../../components/CustomerFilter";
import { DataGrid, GridColDef, GridValueGetterParams, GridRowId } from '@material-ui/data-grid'
import SelectProductForm from './SelectProductForm'
import { continueStatement } from "@babel/types";


interface CustomerLoyaltyLevel {
    name: string;
    LOYALTY_SID: string;
}

interface ProductType {
    SID: string;
    PRODUCT_NAME: string;
    VALUE_DECIMAL?: string;
    VALUE_VARCHAR?: string;
    GROUP_VALUE_DECIMAL?: string;
    GROUP_VALUE_VARCHAR?: string;
    active?: boolean;
}

interface DiscountProductType extends ProductType {
    id?: number;
    DISC_VALUE: string;
}

interface RewardDiscountItem {
    SID_PRODUCT: string;
    DISC_VALUE: number;
}

interface ProductInfoType {
    NAME: string;
    SID: string;
    childProduct: DiscountProductInfoType[];
    COUNT_CHECK: number;
}

interface DiscountProductInfoType {
    SID: string;
    PRODUCT_NAME: string;
    DISCOUNT_VALUE: number;
    CHECK?: boolean;
}

interface IndexType {
    type: string | undefined
}

const AddPromotionForm: React.FC<IndexType> = ({ type }) => {
    const [sid, setSID] = useState<string>("");
    const [rewardTransactionType, setRewardTransactionType] = useState<string>("1");
    const [promoName, setPromoName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [discountReason, setDiscountReason] = useState<string>("");
    const [startDate, setStartDate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState<string>(moment(new Date()).format("YYYY-MM-DD"));
    const [startTime, setStartTime] = useState<string>("00:00");
    const [endTime, setEndTime] = useState<string>("23:59");
    const [validationSubTotal, setValidationSubTotal] = useState<string>("0");
    const [rewardTransactionValue, setRewardTransactionValue] = useState<string>("0");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");
    const [applyCount, setApplyCount] = useState<string>('0');
    const [useSubtotal, setUseSubTotal] = useState<boolean>(true);
    const [unlimited, setUnlimited] = useState<boolean>(false);
    const [useValidationCustLoyalty, setUseValidationCustLoyalty] = useState<boolean>(false);
    const [listCustLoyalty, setListCustLoyalty] = useState<CustomerLoyaltyLevel[]>([]);
    const [chooseListCustLoyalty, setChooseListCustLoyalty] = useState<string[]>([]);
    const [useCustomerFilter, setUseCustomerFilter] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [applyWithUnauthorizedCustomer, setApplyWithUnauthorizedCustomer] = useState<boolean>(false);
    const [listColumn, setListColumn] = useState<string[]>([]);
    const [filterStr, setFilterStr] = useState<string>("");
    const [rewardMode, setRewardMode] = useState<string>("0");
    const [listProduct, setListProduct] = useState<ProductType[]>([]);
    const [listProductDiscount, setListProductDiscount] = useState<ProductType[]>([]);
    const [itemReward, setItemReward] = useState<ProductType | null>(null);
    // const [lstDiscountItem, setLstDiscountItem] = useState<DiscountProductType[]>([]);
    const [lstDiscountItem, setLstDiscountItem] = useState<ProductInfoType[]>([]);
    const [canBeAppliedWithOthers, setCanBeAppliedWithOthers] = useState<boolean>(false);
    const [image1, setImage1] = useState<FileList | null>(null);
    const [urlImage, setUrlImage] = useState<string | null>(null);
    const [modalProduct, setModalProduct] = useState<boolean>(false);
    const [valueTab, setValueTab] = useState<number>(0);
    const router = useRouter();
    // const [selectItem, setSelectItem] = useState<Set>(new Set());
    const changeRewardTransactionType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRewardTransactionType(event.target.value);
    }
    useEffect(() => {
        async function fetchLoyalty() {
            const response = await axios({
                method: "GET",
                url: "http://localhost:5035/customers/loyalty",
                withCredentials: true
            })
            if (response.status === 200) {
                let tmpLst: CustomerLoyaltyLevel[] = [];
                response.data.loyaltyLevel.map((item: any) => {
                    tmpLst.push({
                        name: item.NAME,
                        LOYALTY_SID: item.ID
                    })
                })
                setListCustLoyalty(tmpLst);
            }
        }

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

        async function fetchListProduct() {
            const response = await axios({
                method: "GET",
                url: "http://localhost:5035/products/product/all",
                withCredentials: true
            })
            if (response.status === 200) {
                // console.log(response.data);
                let tempLst: ProductType[] = [];
                response.data.map((item: any) => {
                    tempLst.push({
                        SID: item.SID,
                        PRODUCT_NAME: item.productInformation.PRODUCT_NAME,
                        VALUE_DECIMAL: item.productAttributeValues[0].VALUE_DECIMAL,
                        VALUE_VARCHAR: item.productAttributeValues[0].VALUE_VARCHAR,
                        GROUP_VALUE_DECIMAL: item.productAttributeValues[0].productAttributeGroup.GROUP_VALUE_DECIMAL,
                        GROUP_VALUE_VARCHAR: item.productAttributeValues[0].productAttributeGroup.GROUP_VALUE_VARCHAR,
                        active: true
                    })
                })
                setListProduct(tempLst);
                setListProductDiscount(tempLst);
            }
        }

        async function fetchEdit() {
            if (type === 'edit') {
                const query: any = router.query;
                const id: any = query["?id"];
                const response = await axios({
                    method: "GET",
                    url: `http://localhost:5035/promotion/get/${id}`,
                    withCredentials: true
                })
                if (response.status === 200) {
                    updateValues(response.data);
                }
            }
        }
        fetchLoyalty();
        fetchColumnName();
        fetchListProduct();
        fetchEdit();
    }, []);

    const formatNumber = (num: number) => {
        let numStr: string = num.toString();
        while (numStr.length < 2)
            numStr = "0" + numStr;
        return numStr;
    }

    const updateValues = (data: any) => {
        setSID(data.SID);
        setPromoName(data.PROMO_NAME);
        setDescription(data.DESCRIPTION);
        setDiscountReason(data.DISCOUNT_REASON);
        if (data.APPLY_COUNT === null)
            setUnlimited(true);
        else
            setApplyCount(data.APPLY_COUNT);
        setStartDate(moment(data.START_DATE).format("YYYY-MM-DD"));
        setEndDate(moment(data.END_DATE).format("YYYY-MM-DD"));
        setStartTime(`${formatNumber(Math.floor(data.START_TIME / 3600))}:${formatNumber(Math.floor((data.START_TIME % 3600) / 60))}`);
        setEndTime(`${formatNumber(Math.floor(data.END_TIME / 3600))}:${formatNumber(Math.floor((data.END_TIME % 3600) / 60))}`);
        setCanBeAppliedWithOthers(data.CAN_BE_APPLIED);
        setUrlImage(`http://localhost:5035/promotion/image/${data.images[0].IMAGE_NAME}`)
        setApplyWithUnauthorizedCustomer(data.APPLY_WITH_UNAUTHORIZED_CUSTOMER);
        setUseSubTotal(data.VALIDATION_USE_SUBTOTAL);
        if (data.VALIDATION_USE_SUBTOTAL === true) {
            console.log(data.VALIDATION_SUBTOTAL);
            setValidationSubTotal(data.VALIDATION_SUBTOTAL);
        }
        if (Number(data.VALIDATION_CUSTOMER_LOYALTY) === 1) {
            setUseValidationCustLoyalty(true);
            let tempChooseLoyalty: string[] = [];
            data.validation_customer_loyalty.map((item: any) => tempChooseLoyalty.push(JSON.stringify({
                name: item.name,
                LOYALTY_SID: item.LOYALTY_SID
            })))
            setChooseListCustLoyalty(tempChooseLoyalty);
        }
        else
            setUseValidationCustLoyalty(false);
        setUseCustomerFilter(Number(data.VALIDATION_CUSTOMER_FILTER) ? true : false);
        setFilterStr(data.VALIDATION_CUSTOMER_FILTER_STR);
        setRewardMode(data.REWARD_MODE);
        setRewardTransactionType(data.REWARD_TRANSACTION_DISC_TYPE);
        setRewardTransactionValue(data.REWARD_TRANSACTION_DISC_VALUE);
        if (data.rewardSID) {
            let tempLst: ProductType = {
                SID: data.rewardSID.SID,
                PRODUCT_NAME: data.rewardSID.productInformation.PRODUCT_NAME,
                VALUE_DECIMAL: data.rewardSID.productAttributeValues[0].VALUE_DECIMAL,
                VALUE_VARCHAR: data.rewardSID.productAttributeValues[0].VALUE_VARCHAR,
                GROUP_VALUE_DECIMAL: data.rewardSID.productAttributeValues[0].productAttributeGroup.GROUP_VALUE_DECIMAL,
                GROUP_VALUE_VARCHAR: data.rewardSID.productAttributeValues[0].productAttributeGroup.GROUP_VALUE_VARCHAR,
                active: true
            };
            setItemReward(tempLst)
        }
        if (data.reward_discount_item) {
            let mapping: Map<{ NAME: string; SID: string }, [{ SID: string; PRODUCT_NAME: string; DISCOUNT_VALUE: number; }]> = new Map();
            for (let index = 0; index < data.reward_discount_item.length; index++) {
                let key: { NAME: string; SID: string } = {
                    NAME: data.reward_discount_item[index].productInformation.PRODUCT_NAME,
                    SID: data.reward_discount_item[index].SID
                }
                let arrMap: [{ SID: string; PRODUCT_NAME: string; DISCOUNT_VALUE: number; }] | undefined = mapping.get(key);
                let GROUP_VALUE_VARCHAR = data.reward_discount_item[index].productAttributeValues[0].productAttributeGroup.GROUP_VALUE_VARCHAR;
                let VALUE_VARCHAR = data.reward_discount_item[index].productAttributeValues[0].VALUE_VARCHAR;
                if (arrMap !== undefined) {
                    arrMap.push({
                        SID: data.reward_discount_item[index].SID,
                        PRODUCT_NAME: `${data.reward_discount_item[index].productInformation.PRODUCT_NAME} - ${GROUP_VALUE_VARCHAR}, ${VALUE_VARCHAR}`,
                        DISCOUNT_VALUE: data.reward_discount_item[index].DISC_VALUE
                    });
                    mapping.set(key, arrMap);
                }
                else {
                    arrMap = [{
                        SID: data.reward_discount_item[index].SID,
                        PRODUCT_NAME: `${data.reward_discount_item[index].productInformation.PRODUCT_NAME} - ${GROUP_VALUE_VARCHAR}, ${VALUE_VARCHAR}`,
                        DISCOUNT_VALUE: data.reward_discount_item[index].DISC_VALUE
                    }];
                    mapping.set(key, arrMap);
                }
            }
            let lstDisc: ProductInfoType[] = [];
            for (const [key,value] of mapping) { 
                lstDisc.push({
                    SID: key.SID,
                    NAME: key.NAME,
                    COUNT_CHECK: 0,
                    childProduct: value
                })
            }
            setLstDiscountItem(lstDisc);
        }
    }

    const checkImageSize = async (image: FileList | null): Promise<boolean> => {
        return new Promise<boolean>((resolve, reject) => {
            if (image) {
                var imagePromo = new Image();
                imagePromo.onload = function () {
                    let width = imagePromo.width;
                    let height = imagePromo.height;
                    URL.revokeObjectURL(imagePromo.src);
                    if (width === 1367 && height === 635)
                        resolve(true);
                    resolve(false);
                };
                imagePromo.src = URL.createObjectURL(image ? image[0] : "");
            }
            else
                resolve(false);
        })

    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (type !== 'edit') {
            if (!image1) {
                alert('Bạn phải chèn hình ảnh khuyến mãi')
                return;
            }
            if (!(await checkImageSize(image1))) {
                alert("Kích thước hình ảnh khuyến mãi phải là (1367,635)");
                return;
            }
        }
        
        const momentStartTime = moment(`${startDate}T${startTime}:00`);
        const momentEndTime = moment(`${endDate}T${endTime}:00`);
        let rewardDiscountItem: RewardDiscountItem[] = [];
        lstDiscountItem.map((item) => item.childProduct.map((ele) => {
            rewardDiscountItem.push({
                SID_PRODUCT: ele.SID,
                DISC_VALUE: Number(ele.DISCOUNT_VALUE)
            })
        }));
        let data = {
            ...promotionForm,
            PROMO_NAME: promoName,
            DESCRIPTION: description,
            DISCOUNT_REASON: discountReason,
            APPLY_COUNT: (unlimited) ? null : parseInt(applyCount),
            START_DATE: momentStartTime.format("YYYY-MM-DD"),
            END_DATE: momentEndTime.format("YYYY-MM-DD"),
            START_TIME: momentStartTime.hour() * 3600 + momentStartTime.minute() * 60 + momentStartTime.second(),
            END_TIME: momentEndTime.hour() * 3600 + momentEndTime.minute() * 60 + momentEndTime.second(),
            CAN_BE_APPLIED: canBeAppliedWithOthers,
            APPLY_WITH_UNAUTHORIZED_CUSTOMER: applyWithUnauthorizedCustomer,
            VALIDATION_USE_SUBTOTAL: useSubtotal ? 1 : 0,
            VALIDATION_SUBTOTAL: useSubtotal ? parseInt(validationSubTotal) : 0,
            VALIDATION_CUSTOMER_LOYALTY: useValidationCustLoyalty ? 1 : 0,
            VALIDATION_CUSTOMER_FILTER: (useCustomerFilter) ? 1 : 0,
            VALIDATION_CUSTOMER_FILTER_STR: filterStr,
            REWARD_MODE: parseInt(rewardMode),
            REWARD_ITEMS_SID: (rewardMode === '1') ? itemReward?.SID : "",
            REWARD_TRANSACTION_DISC_TYPE: (rewardMode === '0') ? parseInt(rewardTransactionType) : 0,
            REWARD_TRANSACTION_DISC_VALUE: (rewardMode === '0') ? parseInt(rewardTransactionValue) : 0,
            validation_customer_loyalty: useValidationCustLoyalty ? chooseListCustLoyalty.map((item: string) => ({
                name: JSON.parse(item).name,
                LOYALTY_SID: JSON.parse(item).LOYALTY_SID
            })) : [],
            reward_discount_item: (rewardMode === '2') ? rewardDiscountItem : [],
        };
        setIsLoading(true);
        if (type === 'edit') {
            const response = await axios({
                method: "PUT",
                url: `http://localhost:5035/promotion/update/${sid}`,
                data,
                withCredentials: true
            })
            setIsLoading(false);
            if(response.status === 200) {
                let SID: string = response.data.SID;
                await addImages(SID);
                setResult("success")
            }
            else
                setResult("failed")
        }
        else {
            const response = await axios({
                method: "POST",
                url: "http://localhost:5035/promotion",
                data
            })
            // console.log(response);
            setIsLoading(false);
            if (response.status === 200) {
                let SID: string = response.data.SID;
                await addImages(SID);
                setResult("success")
            }
            else
                setResult("failed")
        }
        
    }

    const addImages = async (SID: string) => {
        if (image1) {
            const file1 = image1[0];
            let data = new FormData();
            data.append("PROMOTION_SID", SID);
            data.append("files", file1);
            const response = await axios({
                method: "POST",
                url: "http://localhost:5035/promotion/add-images",
                data,
                headers: {
                    'Content-type': 'multipart/form-data'
                },
                withCredentials: true
            })
        }
    }

    const getDataFromModal = (data: ProductInfoType[]) => {
        setLstDiscountItem(data);
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (result === "success")
            router.push("/e-commerce/promotion")
        setResult("");
    };

    const handleModal = (vari: boolean) => {
        setOpenModal(vari);
    }

    const handleSaveFilter = (filter: string) => {
        setFilterStr(filter);
    }

    const handleModalProduct = (i: boolean) => {
        setModalProduct(i);
    }

    const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValueTab(newValue);
    }

    return (
        <Container className="root">
            <form onSubmit={handleSubmit} id="form-submit-promotion">
                <div className="tabbar">
                    <Tabs
                        textColor="primary"
                        indicatorColor="primary"
                        value={valueTab}
                        onChange={handleChangeTab}
                    >
                        <Tab label="General" />
                        <Tab label="Activation" />
                        <Tab label="Validation" />
                        <Tab label="Reward" />
                    </Tabs>
                    <div className="create-product-container__btn-container" style={{ marginTop: '20px' }}>
                        <Button type="submit" variant="contained" color="primary">
                            {
                                isLoading ?
                                    <CircularProgress color="primary" />
                                    :
                                    (type === 'edit') ? "Edit" : "Submit"
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
                    <div className="general-div">
                        <div >
                            <div>
                                <TextField
                                    id="PROMO_NAME" label="Promotion Name" required
                                    value={promoName}
                                    onChange={(e) => setPromoName(e.target.value)}
                                    style={{width: '300px'}}
                                />
                            </div>
                            <div>
                                <TextField
                                    id="DESCRIPTION"
                                    label="Description"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{width: '300px'}}
                                />
                            </div>
                            <div>
                                <TextField
                                    id="DISCOUNT_REASON"
                                    label="Discount reason"
                                    required
                                    style={{width: '300px'}}
                                    value={discountReason}
                                    onChange={(e) => setDiscountReason(e.target.value)}
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
                        </div>
                        <div>
                            <div
                                onClick={() => {
                                    const input = document.getElementById('upload-image-1');
                                    if (input) input.click();
                                }}
                                className='create-product-container__field-container__input__upload-img'>
                                {(image1) ? <img id="image-promotion" src={URL.createObjectURL(image1[0])} />
                                    :
                                    (urlImage) ? <img id="image-promotion" src={urlImage} /> : null
                                }
                                <input
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setImage1(e.target.files);
                                        }
                                    }}
                                    id='upload-image-1'
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="input-group input-file" />
                                <i className="far fa-image"></i>
                                <p>Click here to select your image</p>
                                <p>Size of image is (1367, 635)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    role="tabpanel"
                    hidden={valueTab !== 1}
                    id={`simple-tabpanel-1`}
                    aria-labelledby={`simple-tab-1`}
                    className="tab-panel-id"
                >
                    <div className="layout-datetime">
                        <TextField
                            id="start_date"
                            label="Start date"
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value) }}
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
                    <div className="layout-datetime" >
                        <TextField
                            id="end_date"
                            label="End date"
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
                    hidden={valueTab !== 2}
                    id={`simple-tabpanel-2`}
                    aria-labelledby={`simple-tab-2`}
                    className="tab-panel-id"
                >
                    <div style={{ padding: '0' }}>
                        <FormControlLabel
                            label="Can be applied with other promotion"
                            style={{ margin: '0' }}
                            control={
                                <Checkbox
                                    checked={canBeAppliedWithOthers}
                                    onChange={(e) => setCanBeAppliedWithOthers(e.target.checked)}
                                    color="primary"
                                />
                            }
                        />
                    </div>
                    <div style={{ padding: '0' }}>
                        <FormControlLabel
                            label="Apply with unauthorized customer"
                            style={{ margin: '0' }}
                            control={
                                <Checkbox
                                    checked={applyWithUnauthorizedCustomer}
                                    onChange={(e) => setApplyWithUnauthorizedCustomer(e.target.checked)}
                                    color="primary"
                                />
                            }
                        />
                    </div>
                    <div style={{ padding: '0' }}>
                        <FormControlLabel
                            label="Use Subtotal"
                            style={{ margin: '0' }}
                            control={
                                <Checkbox
                                    checked={useSubtotal}
                                    onChange={(e) => setUseSubTotal(e.target.checked)}
                                    color="primary"
                                />
                            }
                        />
                    </div>
                    <div>
                        <TextField
                            label="Validation subtotal"
                            // onChange={handleChange}
                            disabled={!useSubtotal}
                            value={validationSubTotal}
                            onChange={(e) => setValidationSubTotal(e.target.value)}
                            name="VALIDATION_SUBTOTAL"
                            id={"đ"}
                            InputProps={{
                                inputComponent: NumberFormatCustom as any,
                            }}
                        />
                    </div>
                    <div style={{ padding: '0' }}>
                        <FormControlLabel
                            label="Use Customer Loyalty"
                            style={{ margin: '0' }}
                            control={
                                <Checkbox
                                    checked={useValidationCustLoyalty}
                                    onChange={(e) => setUseValidationCustLoyalty(e.target.checked)}
                                    color="primary"
                                />
                            }
                        />
                    </div>
                    <div>
                        <Select
                            multiple
                            value={chooseListCustLoyalty}
                            input={<Input />}
                            disabled={!useValidationCustLoyalty}
                            onChange={(e) => setChooseListCustLoyalty(e.target.value as string[])}
                            style={{ width: '200px', maxWidth: '200px' }}
                        >
                            {
                                listCustLoyalty.map((item) => (
                                    <MenuItem key={item.name} value={JSON.stringify(item)} >{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </div>

                    <div style={{ padding: '0' }}>
                        <FormControlLabel
                            label="Use Customer Filter"
                            style={{ margin: '0' }}
                            control={
                                <Checkbox
                                    checked={useCustomerFilter}
                                    onChange={(e) => setUseCustomerFilter(e.target.checked)}
                                    color="primary"
                                />
                            }
                        />
                        <Button variant="contained" color="primary" disabled={!useCustomerFilter} onClick={(e) => setOpenModal(true)}>Change</Button>
                        <Modal
                            open={openModal}
                            className="modal-paper"
                        >
                            <CustomerFilter listColumn={listColumn} filterStr={filterStr} setOpenModal={handleModal} handleSaveFilter={handleSaveFilter} />
                        </Modal>
                    </div>
                    <div>
                        <Typography variant="body1">{filterStr}</Typography>
                    </div>
                </div>

                <div
                    role="tabpanel"
                    hidden={valueTab !== 3}
                    id={`simple-tabpanel-3`}
                    aria-labelledby={`simple-tab-3`}
                    className="tab-panel-id"
                >
                    <div>
                        <TextField
                            id="REWARD_MODE"
                            label="Reward mode"
                            select
                            value={rewardMode}
                            onChange={(e) => setRewardMode(e.target.value)}
                        >
                            <MenuItem key="transaction" value="0">
                                Transaction Reward
                            </MenuItem>
                            <MenuItem key="item" value="1">
                                Item Reward
                            </MenuItem>
                            <MenuItem key="discount-items" value="2">
                                Discount Items
                            </MenuItem>
                        </TextField>
                    </div>

                    {
                        (rewardMode === '0') ?
                            (
                                <div>
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
                                            value={rewardTransactionValue}
                                            onChange={(e) => setRewardTransactionValue(e.target.value)}
                                            name="REWARD_TRANSACTION_DISC_VALUE"
                                            id={(rewardTransactionType === "1") ? "đ" : "%"}
                                            InputProps={{
                                                inputComponent: NumberFormatCustom as any,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                            : (rewardMode === '1') ? (
                                <div>
                                    <Autocomplete
                                        id="choose item reward"
                                        options={listProduct}
                                        getOptionLabel={(option) => `${option.PRODUCT_NAME} - ${(option.VALUE_DECIMAL) ? option.VALUE_DECIMAL : option.VALUE_VARCHAR}, ${(option.GROUP_VALUE_DECIMAL) ? option.GROUP_VALUE_DECIMAL : option.GROUP_VALUE_VARCHAR}`}
                                        style={{ width: '300px' }}
                                        value={itemReward}
                                        onChange={(event, newValue) => {
                                            setItemReward(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Item Reward" variant="outlined" />}
                                    />
                                </div>
                            )
                                : (
                                    <div>
                                        <Typography variant="body1">Select product</Typography>
                                        <Button color="primary" variant="contained" onClick={() => setModalProduct(true)}>
                                            Select
                                        </Button>
                                        <Modal
                                            open={modalProduct}
                                            className="modal-product"
                                        >
                                            <SelectProductForm setOpenModal={handleModalProduct} getDataFromModal={getDataFromModal} selectedProductList={lstDiscountItem} />
                                        </Modal>
                                    </div>
                                )
                    }
                </div>

                <Snackbar open={result !== ""} autoHideDuration={4000} onClose={handleClose} >
                    {
                        (result === "success") ?
                            <Alert onClose={handleClose} severity="success">
                                {(type === 'edit') ? 'Update promotion successfully' : 'Create promotion successfully'}
                            </Alert>
                            :
                            <Alert severity="error">
                                Something went wrong
                            </Alert>
                    }
                </Snackbar>
            </form>

        </Container>
    )
}

export default AddPromotionForm;