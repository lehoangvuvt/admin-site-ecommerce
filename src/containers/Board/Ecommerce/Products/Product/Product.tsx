import axios from "axios";
import { useEffect, useState } from "react";
import LoadingBar from "../../../../../components/LoadingBar";
import ProductOptions from "./ProductOptions";
import Option from './Option';
import Information from "./Information";
import SubAttribute from "./SubAttribute";
import AddSubAttr from "./AddSubAttr";
import AddOption from "./AddOption";
import ProductCategories from "./ProductCategories";
import { useRouter } from "../../../../../hooks/router";
import { ProductAttributeValueType, ProductInformationType } from "../../../../types";
import { CircularProgress } from "@material-ui/core";

export type OptionType = {
    GROUP_ID: number,
    GROUP_ATTRIBUTE_ID: number,
    GROUP_ATTRIBUTE_NAME: string,
    GROUP_ATTRIBUTE_VALUE: string | number | Date,
    GROUP_ATTRIBUTE_VALUE_TYPE: string,
    PRODUCT_INFORMATION: ProductInformationType,
    groupedProducts: Array<ProductAttributeValueType>
};

const Product = () => {
    const router = useRouter();
    const [isRender, setRender] = useState(false);
    const [percentCompleted, setPercentCompleted] = useState(0);
    const [productInformation, setProductInformation] = useState<ProductInformationType | null>(null);
    const [productByGroupedAttribute, setProductByGroupedAttribute] = useState<Array<OptionType>>([]);
    const [currentTab, setCurrentTab] = useState(1);
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
    const [selectedAttribute, setSelectedAttribute] = useState<ProductAttributeValueType | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getDetails = async () => {
        setRender(false);
        setIsLoading(true);
        let query: any = router.query;
        const SID = query.SID;
        const response = await axios({
            url: `http://localhost:5035/products/product-information/${SID}`,
            method: 'GET',
            withCredentials: true,
            onDownloadProgress: (progressEvent: ProgressEvent) => {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setPercentCompleted(percentCompleted);
            }
        })
        const data = response.data;
        setProductInformation(data.productInformation);
        setProductByGroupedAttribute(data.productByGroupedAttribute);
        setIsLoading(false);
    }

    useEffect(() => {
        getDetails();
    }, [isRender])

    const setTab = (value: number) => {
        setCurrentTab(value);
    }

    const setOption = (option: OptionType) => {
        setSelectedOption(option);
    }

    const setAttribute = (attribute: ProductAttributeValueType) => {
        setSelectedAttribute(attribute);
    }

    const render = (value: boolean) => {
        setRender(value);
    }

    return (
        <div className='product-details-container'>
            <LoadingBar percentCompleted={percentCompleted} />
            {
                !isLoading ?
                    <>
                        <div className='product-details-container__header'>
                            <div className='product-details-container__header__title'>
                                <h1>{productInformation ? productInformation.PRODUCT_NAME : ''}</h1>
                            </div>
                        </div>
                        <div className='product-details-container__tabs'>
                            <div
                                onClick={() => { setCurrentTab(1) }}
                                className={
                                    currentTab === 1 ?
                                        'product-details-container__tabs__tab product-details-container__tabs__tab--active'
                                        :
                                        'product-details-container__tabs__tab'
                                }>
                                <h1>Product Information</h1>
                            </div>

                            <div
                                onClick={() => { setCurrentTab(2) }}
                                className={
                                    currentTab === 2 || currentTab === 21 || currentTab === 211 || currentTab === 212 || currentTab === 22 ?
                                        'product-details-container__tabs__tab product-details-container__tabs__tab--active'
                                        :
                                        'product-details-container__tabs__tab'
                                }>
                                <h1>Product Options</h1>
                            </div>

                            <div
                                onClick={() => { setCurrentTab(3) }}
                                className={
                                    currentTab === 3 ?
                                        'product-details-container__tabs__tab product-details-container__tabs__tab--active'
                                        :
                                        'product-details-container__tabs__tab'
                                }>
                                <h1>Product Categories</h1>
                            </div>
                        </div>
                        {currentTab === 1 ?
                            <div className='product-details-container__content'>
                                <div className='product-details-container__content__header'>
                                    <h1>Product Information</h1>
                                </div>
                                <Information
                                    render={render}
                                    productInformation={productInformation} />
                            </div>
                            :
                            null
                        }

                        {currentTab === 2 ?
                            <div className='product-details-container__content'>
                                <div className='product-details-container__content__header'>
                                    <h1>Product Options</h1>
                                </div>
                                <ProductOptions
                                    setTab={setTab}
                                    setOption={setOption}
                                    productByGroupedAttribute={productByGroupedAttribute} />
                            </div>
                            :
                            null
                        }

                        {currentTab === 21 ?
                            <div className='product-details-container__content'>
                                <div className='product-details-container__content__header'>
                                    <h1>Option Details</h1>
                                </div>
                                <Option
                                    setTab={setTab}
                                    selectedOption={selectedOption}
                                    setAttribute={setAttribute}
                                />
                            </div>
                            :
                            null
                        }


                        {currentTab === 211 ?
                            <div className='product-details-container__content'>
                                <div className='product-details-container__content__header'>
                                    <h1>Add New {selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''}</h1>
                                </div>
                                <AddSubAttr
                                    setTab={setTab}
                                    productInformation={productInformation}
                                    selectedOption={selectedOption} />
                            </div>
                            :
                            null
                        }

                        {currentTab === 212 ?
                            <div className='product-details-container__content'>
                                <div className='product-details-container__content__header'>
                                    <h1>{selectedOption ? selectedOption.groupedProducts[0].productAttribute.LABEL_TEXT : ''} Details</h1>
                                </div>
                                <SubAttribute
                                    render={render}
                                    setTab={setTab}
                                    selectedAttribute={selectedAttribute}
                                />
                            </div>
                            :
                            null
                        }

                        {currentTab === 22 ?
                            <div className='product-details-container__content'>
                                <div className='product-details-container__content__header'>
                                    <h1>Add New Option</h1>
                                </div>
                                <AddOption
                                    productByGroupedAttribute={productByGroupedAttribute}
                                    setTab={setTab} />
                            </div>
                            :
                            null
                        }

                        {currentTab === 3 ?
                            <div className='product-details-container__content'>
                                <div className='product-details-container__content__header'>
                                    <h1>Product Categories</h1>
                                </div>
                                <ProductCategories
                                    productInformation={productInformation}
                                />
                            </div>
                            :
                            null
                        }
                    </>
                    :
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <CircularProgress />
                    </div>
            }
        </div >
    )
}

export default Product;