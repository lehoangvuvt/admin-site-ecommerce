import { useState, useEffect, MouseEvent } from 'react'
import {
    Paper, Typography, Button, FormControlLabel, Checkbox, Tabs, Tab, List, ListItem, ListItemIcon, ListItemText, Accordion, Divider,
    AccordionSummary, AccordionDetails, TextField, ListItemSecondaryAction
} from '@material-ui/core'
import { Close, ExpandMore } from '@material-ui/icons'
import axios from 'axios';
import { NumberFormatCustom } from '../../../../../components/NumberFormatCustom';
import { ProductAttributeType, ProductInformationType } from '../../../../types'
import { isNumber } from '@material-ui/data-grid';

interface ProductInfoType {
    NAME: string;
    SID: string;
    childProduct: DiscountProductType[];
    COUNT_CHECK: number;
}

interface DiscountProductType {
    SID: string;
    PRODUCT_NAME: string;
    DISCOUNT_VALUE: number;
    CHECK?: boolean;
}


interface IndexType {
    setOpenModal: (vari: boolean) => void;
    getDataFromModal: (data: ProductInfoType[]) => void;
    selectedProductList: ProductInfoType[];
}

interface BrandType {
    CREATED_DATETIME: string;
    MODIFIED_DATETIME: string;
    NAME: string;
    SID: string;
}

const SelectProductForm: React.FC<IndexType> = ({ setOpenModal, getDataFromModal, selectedProductList }) => {
    const [attributes, setAttributes] = useState<Array<{ attributeInfo: ProductAttributeType, attributeValues: Array<Date | number | string>, attributeType: 'm' | 's' }>>([]);
    const [productInformation, setProductInformation] = useState<ProductInformationType[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductInfoType[]>([]);
    const [brandList, setBrandList] = useState<BrandType[]>([]);
    const [checkedM, setCheckedM] = useState<string>("");
    const [checkedS, setCheckedS] = useState<string>("");
    const [valueTab, setValueTab] = useState<number>(0);
    const [brandSID, setBrandSID] = useState<string>("");
    const [discountValue, setDiscountValue] = useState<string>("");
    const [updateSelectedProduct, setUpdateSelectedProduct] = useState<boolean>(false);
    const [query, setQuery] = useState<any>({
        q: '*',
        take: 'get-all',
        page: '1'
    })

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (updateSelectedProduct === false) return;
        UpdateSelectedProduct();
        setUpdateSelectedProduct(false);
    }, [updateSelectedProduct])

    async function fetchData() {
        const response = await axios({
            method: "GET",
            url: "http://localhost:5035/products",
            params: query
        })
        if (response.status === 200) {
            setAttributes(response.data.attributes);
            setProductInformation(response.data.products);
            setBrandList(response.data.brands);
            if (selectedProduct.length === 0)
                setSelectedProduct(selectedProductList);
            setUpdateSelectedProduct(true);
        }
    }

    const UpdateSelectedProduct = () => {
        let productInformationTemp: ProductInformationType[] = [...productInformation];
        for (let i: number = 0; i < selectedProduct.length; i++)
            for (let j: number = 0; j < selectedProduct[i].childProduct.length; j++) {
                let position: [number, number, number] = findIndex(selectedProduct[i].childProduct[j].SID);
                if (position && position[0] >= 0 && position[1] >= 0 && position[2] >= 0) {
                    productInformationTemp[position[0]].productAttributeGroups[position[1]].productAttributeValues[position[2]].SELECTED = true;
                }
            }
        setProductInformation(productInformationTemp);
    }

    const handleChange = (type: string, ID: number, value: string, event: React.ChangeEvent<HTMLInputElement>) => {
        let val: string = event.target.checked ? value : "";
        if (type === 'm') {
            setCheckedM(val);
        }
        else
            setCheckedS(val);
        //Update query
        let querytemp: any = query;
        querytemp[`patb_${type}_${ID}`] = (val === "") ? null : val;
        setQuery(querytemp);
        fetchData();
    }

    const handleChangeBrand = (event: React.ChangeEvent<HTMLInputElement>, SID: string) => {
        let val: string = (event.target.checked) ? SID : "";
        setBrandSID(val);
        let querytemp: any = query;
        querytemp["brand_sid"] = (val === "") ? null : val;
        setQuery(querytemp);
        fetchData();
    }

    const handleChanges = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValueTab(newValue);
    }

    const setCheckBoxChild = (i: number, j: number, k: number, event: React.ChangeEvent<HTMLInputElement>) => {
        let productInformationTemp: ProductInformationType[] = [...productInformation];
        if (productInformationTemp) {
            if (event.target.checked)
                productInformationTemp[i].COUNT_CHECK = ((productInformationTemp && productInformationTemp[i].COUNT_CHECK) ? productInformationTemp[i].COUNT_CHECK : 0) + 1;
            else
                productInformationTemp[i].COUNT_CHECK = ((productInformationTemp[i].COUNT_CHECK) ? productInformationTemp[i].COUNT_CHECK : 0) - 1;
            productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].CHECK = event.target.checked;
            setProductInformation(productInformationTemp);
        }
    }

    const findIndex = (SID: string): [number, number, number] => {
        for (let i: number = 0; i < productInformation.length; i++)
            for (let j: number = 0; j < productInformation[i].productAttributeGroups.length; j++)
                for (let k: number = 0; k < productInformation[i].productAttributeGroups[j].productAttributeValues.length; k++)
                    if (productInformation[i].productAttributeGroups[j].productAttributeValues[k].SID_PRODUCT === SID)
                        return [i, j, k];
        return [-1, -1, -1];
    }

    const deleteSelectedProduct = () => {
        let selectedProductTemp: ProductInfoType[] = [...selectedProduct];
        let productInformationTemp: ProductInformationType[] = [...productInformation];
        for (let i: number = 0; i < selectedProductTemp.length; i++) {
            for (let j: number = 0; j < selectedProductTemp[i].childProduct.length; j++)
                if (selectedProductTemp[i].childProduct[j].CHECK === true) {
                    let position: [number, number, number] = findIndex(selectedProductTemp[i].childProduct[j].SID);
                    if (position && position[0] >= 0 && position[1] >= 0 && position[2] >= 0) {
                        productInformationTemp[position[0]].productAttributeGroups[position[1]].productAttributeValues[position[2]].SELECTED = false;
                        productInformationTemp[position[0]].productAttributeGroups[position[1]].productAttributeValues[position[2]].CHECK = false;
                    }
                    selectedProductTemp[i].COUNT_CHECK -= 1;
                    selectedProductTemp[i].childProduct.splice(j, 1);
                    j -= 1;
                }
            if (selectedProductTemp[i].childProduct.length === 0) {
                selectedProductTemp.splice(i, 1);
                i -= 1;
            }
        }
        setProductInformation(productInformationTemp);
        setSelectedProduct(selectedProductTemp);
    }

    const setCheckBoxTab2 = (i: number, k: number, event: React.ChangeEvent<HTMLInputElement>) => {
        let selectedProductTemp: ProductInfoType[] = [...selectedProduct];
        if (selectedProductTemp) {
            if (event.target.checked) {
                selectedProductTemp[i].COUNT_CHECK = ((selectedProductTemp && selectedProductTemp[i].COUNT_CHECK) ? selectedProductTemp[i].COUNT_CHECK : 0) + 1;
            }
            else {
                selectedProductTemp[i].COUNT_CHECK = ((selectedProductTemp) ? selectedProductTemp[i].COUNT_CHECK : 0) - 1;
            }
            selectedProductTemp[i].childProduct[k].CHECK = event.target.checked;
        }

        setSelectedProduct(selectedProductTemp);
    }

    const handleSelectTab2 = (event: React.ChangeEvent<HTMLInputElement>, i: number) => {
        let selectedProductTemp: ProductInfoType[] = [...selectedProduct];
        let count: number = 0;
        for (let j: number = 0; j < selectedProductTemp[i].childProduct.length; j++) {
            count += 1;
            selectedProductTemp[i].childProduct[j].CHECK = event.target.checked;
        }
        if (event.target.checked)
            selectedProductTemp[i].COUNT_CHECK = count;
        else
            selectedProductTemp[i].COUNT_CHECK = 0;
        setSelectedProduct(selectedProductTemp);
    }

    const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, i: number) => {
        let productInformationTemp: ProductInformationType[] = [...productInformation];
        let count: number = 0;
        for (let j: number = 0; j < productInformationTemp[i].productAttributeGroups.length; j++)
            for (let k: number = 0; k < productInformationTemp[i].productAttributeGroups[j].productAttributeValues.length; k++) {
                count += 1;
                productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].CHECK = event.target.checked;
            }
        if (event.target.checked) {
            productInformationTemp[i].COUNT_CHECK = count;
        }
        else {
            productInformationTemp[i].COUNT_CHECK = 0;
        }
        setProductInformation(productInformationTemp);
    }

    const selectProduct = () => {
        if (Number(discountValue) > 0) {
            let productInformationTemp: ProductInformationType[] = [...productInformation];
            let selectedProductTemp: ProductInfoType[] = [...selectedProduct];
            for (let i: number = 0; i < productInformationTemp.length; i++) {
                for (let j: number = 0; j < productInformationTemp[i].productAttributeGroups.length; j++) {
                    for (let k: number = 0; k < productInformationTemp[i].productAttributeGroups[j].productAttributeValues.length; k++)
                        if (productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].CHECK === true && Boolean(productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].SELECTED) === false) {
                            productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].SELECTED = true;
                            productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].CHECK = false;
                            productInformationTemp[i].COUNT_CHECK -= 1;
                            //Insert to selected product list
                            let index: number = selectedProductTemp.findIndex(ele => ele.SID === productInformationTemp[i].SID);
                            if (index === -1) {
                                selectedProductTemp.push({
                                    SID: productInformationTemp[i].SID,
                                    NAME: productInformationTemp[i].PRODUCT_NAME,
                                    COUNT_CHECK: 0,
                                    childProduct: [{
                                        SID: productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].SID_PRODUCT,
                                        PRODUCT_NAME: `${productInformationTemp[i].PRODUCT_NAME} - ${productInformationTemp[i].productAttributeGroups[j].GROUP_VALUE_VARCHAR}, ${productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].VALUE_VARCHAR}`,
                                        DISCOUNT_VALUE: Number(discountValue)
                                    }]
                                })
                            }
                            else {
                                selectedProductTemp[index].childProduct.push({
                                    SID: productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].SID_PRODUCT,
                                    PRODUCT_NAME: `${productInformationTemp[i].PRODUCT_NAME} - ${productInformationTemp[i].productAttributeGroups[j].GROUP_VALUE_VARCHAR}, ${productInformationTemp[i].productAttributeGroups[j].productAttributeValues[k].VALUE_VARCHAR}`,
                                    DISCOUNT_VALUE: Number(discountValue),
                                })
                            }
                        }
                }
            }
            setSelectedProduct(selectedProductTemp);
            setProductInformation(productInformationTemp);
        }
        else
            alert("Discount value must be greater than 0");
    }

    const handleSave = () => {
        getDataFromModal(selectedProduct);
        setOpenModal(false);
    }

    return (
        <Paper className="paper">
            <div className="title-modal">
                <div className="heading-modal">
                    <Typography variant="h5">Select Product</Typography>
                </div>
                <Button onClick={(e) => setOpenModal(false)}>
                    <Close />
                </Button>
            </div>
            <div className="body-modal">
                <div className="left-panel">
                    <div className="filter-attribute">
                        <Typography variant="subtitle2">Brand</Typography>
                        <div className="list-attributes">
                            {
                                brandList.map(brand => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={brandSID === brand.SID}
                                                onChange={(event) => handleChangeBrand(event, brand.SID)}
                                                name={brand.NAME}
                                                color="primary"
                                            />
                                        }
                                        label={brand.NAME}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    {
                        attributes.map(attribute => {
                            return (
                                <div className="filter-attribute">
                                    <Typography variant="subtitle2">{attribute.attributeInfo.LABEL_TEXT.toUpperCase()}</Typography>
                                    <div className="list-attributes">
                                        {
                                            attribute.attributeValues.map(ele => (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={(attribute.attributeType === 'm') ? (checkedM === ele.toString()) : (checkedS === ele.toString())}
                                                            onChange={(event) => handleChange(attribute.attributeType, attribute.attributeInfo.ID, ele.toString(), event)}
                                                            name={ele.toString()}
                                                            color="primary"
                                                        />
                                                    }
                                                    label={ele}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="right-panel" >
                    <div className="tab-button">
                        <Tabs
                            textColor="primary"
                            indicatorColor="primary"
                            value={valueTab}
                            onChange={handleChanges}

                        >
                            <Tab label={'Products'} />
                            <Tab label="Selected product" />
                        </Tabs>
                        {
                            valueTab === 0 ? (
                                <div>
                                    <TextField
                                        placeholder="Discount(%)"
                                        // onChange={handleChange}
                                        defaultValue="0"
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        id={"%"}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom as any,
                                        }}
                                    />
                                    <Button variant="contained" color="primary" onClick={() => selectProduct()}>Add</Button>
                                </div>
                            ) :
                                (
                                    <Button variant="contained" color="primary" onClick={() => deleteSelectedProduct()}>Delete</Button>
                                )
                        }


                    </div>
                    <div
                        role="tabpanel"
                        hidden={valueTab !== 0}
                        id={`simple-tabpanel-0`}
                        aria-labelledby={`simple-tab-0`}
                        style={{ overflowY: 'auto', height: '80%' }}
                    >
                        {
                            productInformation.map((productInfo, i) => (

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-label="Expand"
                                        aria-controls="additional-actions1-content"
                                        id="additional-actions1-header"
                                    >
                                        <FormControlLabel
                                            aria-label="Acknowledge"
                                            onClick={(event) => event.stopPropagation()}
                                            onFocus={(event) => event.stopPropagation()}
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={productInfo.COUNT_CHECK !== undefined && productInfo.COUNT_CHECK > 0}
                                                    onChange={(event) => handleSelect(event, i)}
                                                />
                                            }
                                            label={productInfo.PRODUCT_NAME}
                                        />
                                    </AccordionSummary>
                                    <AccordionDetails style={{ display: 'block' }}>
                                        <List>
                                            {
                                                productInfo.productAttributeGroups.map((productAttrGroups, j) =>
                                                    productAttrGroups.productAttributeValues.map((productAttrValues, k) => (
                                                        !productAttrValues.SELECTED &&
                                                        <div>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <Checkbox
                                                                        edge="start"
                                                                        checked={Boolean(productAttrValues.CHECK)}
                                                                        tabIndex={-1}
                                                                        disableRipple
                                                                        color="primary"
                                                                        onChange={(event) => setCheckBoxChild(i, j, k, event)}
                                                                    // inputProps={{ 'aria-labelledby': labelId }}
                                                                    />
                                                                </ListItemIcon>
                                                                <ListItemText primary={`${productInfo.PRODUCT_NAME} - ${productAttrGroups.GROUP_VALUE_VARCHAR}, ${productAttrValues.VALUE_VARCHAR}`} />
                                                            </ListItem>
                                                            {(k + 1) * (j + 1) !== productInfo.productAttributeGroups.length * productAttrGroups.productAttributeValues.length
                                                                && <Divider />
                                                            }
                                                        </div>
                                                    )))
                                            }
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        }
                    </div>
                    <div
                        role="tabpanel"
                        hidden={valueTab !== 1}
                        id={`simple-tabpanel-1`}
                        aria-labelledby={`simple-tab-1`}
                        style={{ overflowY: 'auto', height: '80%' }}
                    >
                        {
                            selectedProduct.map((productInfo, i) => (
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-label="Expand"
                                        aria-controls="additional-actions1-content"
                                        id="additional-actions1-header"
                                    >
                                        <FormControlLabel
                                            aria-label="Acknowledge"
                                            onClick={(event) => event.stopPropagation()}
                                            onFocus={(event) => event.stopPropagation()}
                                            control={
                                                <Checkbox
                                                    color="primary"
                                                    checked={productInfo.COUNT_CHECK !== undefined && productInfo.COUNT_CHECK > 0}
                                                    onChange={(event) => handleSelectTab2(event, i)}
                                                />
                                            }
                                            label={productInfo.NAME}
                                        />
                                    </AccordionSummary>
                                    <AccordionDetails style={{ display: 'block' }}>
                                        <List>
                                            {
                                                productInfo.childProduct.map((productAttrValues, k, array) => (
                                                    <div>
                                                        <ListItem>
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={Boolean(productAttrValues.CHECK)}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                    color="primary"
                                                                    onChange={(event) => setCheckBoxTab2(i, k, event)}
                                                                // inputProps={{ 'aria-labelledby': labelId }}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText primary={productAttrValues.PRODUCT_NAME} />
                                                            <ListItemSecondaryAction>
                                                                <Typography variant="body1">{productAttrValues.DISCOUNT_VALUE}%</Typography>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        {k !== array.length - 1
                                                            && <Divider />
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="footer-modal">
                <Button variant="contained" color="primary"
                    onClick={() => handleSave()}
                >Save</Button>
            </div>
        </Paper >
    )
}

export default SelectProductForm;