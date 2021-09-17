import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';
import Filter from '../../../../components/Filter';
import { CategoryType, ProductAttributeType, ProductBrandType, ProductInformationType, SelectedFilterType } from '../../../types';
import { RootReducerType } from '../../../reducer';
import { formatter as currencyFormatter } from '../../../../utils/currency.formatter';
import { actions } from '../../../../components/Filter/action';
import { useRouter } from '../../../../hooks/router';
import { useLocation } from 'react-router-dom';
import queryString from 'querystring';
import LoadingBar from '../../../../components/LoadingBar';
import { PRISM_URL } from "../../../../constants/url.constants";

const mapStateToProps = (state: RootReducerType) => {
    return {
        selectedFilters: state.filter.selectedFilters,
    }
}

const mapDispatchToProps = {
    setFilter: actions.setFilter,
    resetFilter: actions.resetFilter,
}

const Products: FC<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> = ({ selectedFilters, setFilter, resetFilter }) => {
    const router = useRouter();
    const search = useLocation().search;
    const location = useLocation();
    const [searchString, setSearchString] = useState('');
    const [foundProducts, setFoundProducts] = useState<Array<ProductInformationType>>([]);
    const [foundProductsCategories, setFoundProductsCategories] = useState<Array<CategoryType>>([]);
    const [foundProductsBrands, setFoundProductsBrands] = useState<Array<ProductBrandType>>([]);
    const [foundProductsSizes, setFoundProductsSizes] = useState<Array<number | string>>([]);
    const [maxPrice, setMaxPrice] = useState<[number, number]>([0, 0]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [attributes, setAttributes] = useState<Array<{ attributeInfo: ProductAttributeType, attributeValues: Array<Date | number | string>, attributeType: 'm' | 's' }>>([]);
    const [isLoadingFoundProducts, setIsLoadingFoundProducts] = useState<boolean>(false);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const [selectedSortField, setSelectedSortField] = useState<string>('default');
    const [isToggleFilters, setIsToggleFilters] = useState<boolean>(false);
    const [percentCompleted, setPercentCompleted] = useState<number>(0);
    const [modalId, setModalId] = useState(-1);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);

    function resize() {
        if (window.innerWidth <= 1000) {
            setIsSmallScreen(true);
        } else {
            setIsSmallScreen(false);
        }
    }

    useEffect(() => {
        resetFilter();
        resize();
        window.addEventListener("resize", resize.bind(this));
        return () => {
            window.removeEventListener("resize", resize.bind(this));
        };
    }, [])

    const checkIsClickOptionToggle = (e: any) => {
        if (e.srcElement
            && e.srcElement.parentElement
            && e.srcElement.parentElement.firstChild && e.srcElement.parentElement.firstChild.className) {
            if (e.srcElement.parentElement.firstChild.className !== 'fas fa-angle-down' && e.srcElement.parentElement.firstChild.className !== 'products-container__header__right__add-btn') {
                setIsOpenAddModal(false);
            }
        } else {
            setIsOpenAddModal(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', checkIsClickOptionToggle, false);

        return () => {
            window.removeEventListener('click', checkIsClickOptionToggle, false);
        }
    }, [])

    useEffect(() => {
        let filters = document.getElementById('filters');
        let filtersToggle = document.getElementById('filters-toggle');
        if (!isSmallScreen) {
            setIsToggleFilters(false);
            if (filters) {
                filters.style.width = '21%';
                filters.style.left = '0%';
            }
        } else {
            if (filters && filtersToggle) {
                filters.style.width = '70%';
                filters.style.left = '-70%';
                filtersToggle.style.left = '0%';
                filtersToggle.style.width = '40px';
                filtersToggle.style.background = 'transparent';
                setIsToggleFilters(false);
            }
        }
    }, [isSmallScreen])

    useEffect(() => {
        setModalId(-1);
        let queryObj = queryString.parse(search);

        if (queryObj.page) {
            const current_page = queryObj.page;
            setPage(parseInt(current_page.toString()));
        }
        if (queryObj['?q'] && queryObj['?q'] !== '*') setSearchString(queryObj['?q'].toString());
        let newPath = '';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        let url = `http://localhost:5035/products/admin-search?${newPath.substring(1, newPath.length - 1)}`;
        const getProducts = async () => {
            setPercentCompleted(0);
            setIsLoadingFoundProducts(true);
            const response = await axios({
                url,
                method: 'GET',
                withCredentials: true,
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setPercentCompleted(percentCompleted);
                },
            });
            const data = await response.data;
            const products = data.products;
            const categories = data.categories;
            const sizes = data.sizes;
            const maxPrice = data.max_price;
            const totalPages = data.total_pages;
            const totalRecords = data.total_records;
            const attributes = data.attributes;
            const brands = data.brands;
            setIsLoadingFoundProducts(false);
            setFoundProducts(products);
            setFoundProductsCategories(categories);
            setFoundProductsSizes(sizes);
            setMaxPrice([0, maxPrice]);
            setTotalPages(totalPages);
            setTotalRecords(totalRecords);
            setAttributes(attributes);
            setFoundProductsBrands(brands);
        };
        getProducts();
        if (queryObj.sort) {
            if (queryObj.sort.toString().split(' ').length > 1) {
                const sortField = queryObj.sort.toString().split(' ')[0];
                const sortOption = queryObj.sort.toString().split(' ')[1];
                setSelectedSortField(`${sortField}_${sortOption}`);
            } else {
                setSelectedSortField(queryObj.sort.toString());
            }
        }
    }, [selectedFilters, selectedSortField, page])


    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        let queryObj = queryString.parse(search);
        let newPath: string;
        newPath = '';
        queryObj.page = value.toString();
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        setPage(value);
        router.push(`products?${newPath.substring(1, newPath.length - 1)}`);
    };

    const sortProducts = (sortField: string, option?: string) => {
        let queryObj = queryString.parse(search);
        let newPath: string;
        newPath = '';
        switch (sortField) {
            case 'price':
                queryObj.sort = `price ${option}`;
                break;
            case 'newest':
                queryObj.sort = `newest`;
                break;
            case 'top_seller':
                queryObj.sort = 'top_seller';
                break;
            default:
                queryObj.sort = 'default';
                break;
        }
        queryObj.page = '1';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        setSelectedSortField(`${sortField}_${option}`);
        router.push(`products?${newPath.substring(1, newPath.length - 1)}`);
        // router.push({
        //     pathname: router.pathname,
        //     query: queryObj,
        // }, undefined, { scroll: false });
    }

    const removeFilter = (filter: SelectedFilterType) => {
        const paramQueryField = filter.filterFieldName;
        const value = filter.filterSetValue;
        let queryObj = queryString.parse(search);
        let queryValue = queryObj[paramQueryField];

        if (queryValue) {
            if (queryValue.toString().includes(' ')) {
                let queryValues: Array<string>;
                queryValues = [];
                queryValue.toString().split(' ').map(value => {
                    if (value !== '') {
                        queryValues.push(value);
                    }
                })
                if (queryValues.includes(value.toString())) {
                    queryValues = queryValues.filter(qValue => qValue !== value.toString());
                    let newQuery: string;
                    newQuery = '';
                    queryValues.map(qValue => {
                        if (queryValues.length === 1) {
                            newQuery = qValue.toString();
                        } else {
                            newQuery += qValue.toString() + ' ';
                        }
                    });
                    if (queryValues.length === 1) {
                        queryObj[paramQueryField] = newQuery;
                    } else {
                        queryObj[paramQueryField] = newQuery.substring(0, newQuery.length - 1);
                    }
                } else {
                    queryObj[paramQueryField] = queryValue.toString() + ' ' + value.toString();
                }
            } else {
                if (queryValue.toString() === value.toString()) {
                    delete queryObj[paramQueryField];
                } else {
                    queryObj[paramQueryField] = queryValue.toString() + ' ' + value.toString();
                }
            }
        } else {
            queryObj[paramQueryField] = value.toString();
        }
        let newPath = '';
        queryObj.page = '1';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        setFilter(filter);
        router.push(`products?${newPath.substring(1, newPath.length - 1)}`);
    }

    const clearAllFilters = () => {
        let queryObj = queryString.parse(search);
        for (let property in queryObj) {
            if (property !== 'page' && property !== '?q') {
                delete queryObj[property];
            }
        }
        resetFilter();
        let newPath = '';
        queryObj.page = '1';
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        router.push(`products?${newPath.substring(1, newPath.length - 1)}`);
    }

    const searchProducts = (e: any) => {
        let queryObj = queryString.parse(search);
        for (let property in queryObj) {
            if (property !== 'page' && property !== '?q') {
                delete queryObj[property];
            }
        }
        resetFilter();
        let newPath = '';
        queryObj.page = '1';
        if (searchString === '') {
            queryObj['?q'] = '*';
        } else {
            queryObj['?q'] = searchString;
        }
        for (const property in queryObj) {
            newPath += `${property}=${queryObj[property]}&`;
        }
        router.push(`/e-commerce/products?${newPath.substring(1, newPath.length - 1)}`);
        e.preventDefault();
    }

    return (
        <div className='products-container'>
            <LoadingBar percentCompleted={percentCompleted} />
            <div className='products-container__header'>
                <div className='products-container__header__left'>
                    <div className='products-container__header__left__input-container'>
                        <form onSubmit={searchProducts}>
                            <input
                                placeholder="Search for product name, long description and long description"
                                value={searchString}
                                onChange={(e) => {
                                    setSearchString(e.target.value);
                                }}
                                type='text' />
                        </form>
                    </div>
                </div>
                <div className='products-container__header__right'>
                    <button
                        className='products-container__header__right__add-btn'
                        style={{
                            background: isOpenAddModal ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                        }}
                        onClick={() => {
                            setIsOpenAddModal(isOpenAddModal => !isOpenAddModal)
                        }}
                    >
                        Action <i className={isOpenAddModal ? "fas fa-angle-up" : "fas fa-angle-down"}></i>
                    </button>
                    {isOpenAddModal ?
                        <div className='products-container__header__right__add-modal'>
                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                    router.push('/e-commerce/products/create-product');
                                }}
                            >Create product</button>

                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                    router.push('/e-commerce/products/import');
                                }}
                            >Import products</button>

                            <button
                                onClick={() => {
                                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                    router.push('/e-commerce/products/bulk-update/step-1');
                                }}
                            >Bulk update</button>
                        </div>
                        : null}
                </div>
            </div>
            <div
                id='filters'
                className='products-container__left'>
                {foundProductsCategories.length > 0 ?
                    <Filter
                        fieldToSet={'SID'}
                        paramQueryField={'category_sid'}
                        fieldsToDisplay={'CATEGORY_NAME'}
                        filterName={"Category"}
                        data={foundProductsCategories}
                        filterType={'SELECT_MANY'}
                    />
                    :
                    null
                }
                {foundProductsBrands.length > 0 ?
                    <Filter
                        fieldToSet={'SID'}
                        paramQueryField={'brand_sid'}
                        fieldsToDisplay={'NAME'}
                        filterName={"Brand"}
                        data={foundProductsBrands}
                        filterType={'SELECT_MANY'}
                    />
                    :
                    null
                }
                {attributes.length > 0 ?
                    attributes.map(attribute =>
                        <Filter
                            filterName={attribute.attributeInfo.LABEL_TEXT}
                            data={attribute.attributeValues}
                            filterType={'SELECT_MANY'}
                            paramQueryField={`patb_${attribute.attributeType}_` + attribute.attributeInfo.ID}
                        />)
                    :
                    null
                }
                {/* {maxPrice.length > 0 ?
            <Filter
                filterName={"Price"}
                unit={"CURRENCY"}
                data={maxPrice}
                filterType={'NUMBER_RANGE'}
                paramQueryFieldNumberFrom={'price_from'}
                paramQueryFieldNumberTo={'price_to'}
                paramQueryField={''}
            />
            :
            null
        } */}
            </div>
            <div
                id='filters-toggle'
                className='products-container__filters-toggle'>
                <i
                    className={isToggleFilters ? "fas fa-times" : "fas fa-sliders-h"}
                    onClick={() => {
                        let filters = document.getElementById('filters');
                        let filtersToggle = document.getElementById('filters-toggle');
                        if (!isToggleFilters) {
                            setIsToggleFilters(true);
                            if (filters) filters.style.left = '0%';
                            if (filtersToggle) {
                                filtersToggle.style.left = '70%';
                                filtersToggle.style.background = 'rgba(0,0,0,0.4)';
                            }
                        } else {
                            setIsToggleFilters(false);
                            if (filters) filters.style.left = '-70%';
                            if (filtersToggle) {
                                filtersToggle.style.left = '0%';
                                filtersToggle.style.width = '40px';
                                filtersToggle.style.background = 'transparent';
                            }
                        }
                    }}>
                </i>
            </div>
            <div className='products-container__right'>
                <div className='products-container__right__top'>
                    <div className='products-container__right__top__results-num-tab'>
                        <div
                            style={{
                                height: selectedFilters.length > 0 ? '50%' : '100%',
                            }}
                            className='products-container__right__top__results-num-tab__text'>
                            {totalRecords} items found for "{queryString.parse(search)['?q']}"
                        </div>
                        {selectedFilters.length > 0 ?
                            <div className='products-container__right__top__results-num-tab__selected-filters'>
                                Filtered By:
                                {selectedFilters.map(filter =>
                                    <Chip
                                        size="small"
                                        label={`${filter.filterName}: ${filter.filterValue}`}
                                        onDelete={() => { removeFilter(filter) }}
                                        variant="default"
                                        deleteIcon={<ClearIcon />}
                                    />
                                )}
                                <a
                                    onClick={() => { clearAllFilters() }}
                                    id='clear-filter-link'>CLEAR ALL</a>
                            </div>
                            : null
                        }
                    </div>
                    <div className='products-container__right__top__sort-tabs'>
                        <div
                            onClick={() => { sortProducts('default') }}
                            className={
                                selectedSortField === 'default' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            Popular
                        </div>
                        <div
                            onClick={() => { sortProducts('top_seller') }}
                            className={
                                selectedSortField === 'top_seller' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            Best selling
                        </div>
                        <div
                            onClick={() => { sortProducts('newest') }}
                            className={
                                selectedSortField === 'newest' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            Newest
                        </div>
                        <div
                            onClick={() => { sortProducts('price', 'asc') }}
                            className={
                                selectedSortField === 'price_asc' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            Low price
                        </div>
                        <div
                            onClick={() => { sortProducts('price', 'desc') }}
                            className={
                                selectedSortField === 'price_desc' ?
                                    'products-container__right__top__sort-tabs__sort-tab products-container__right__top__sort-tabs__sort-tab--selected'
                                    : 'products-container__right__top__sort-tab products-container__right__top__sort-tabs__sort-tab'
                            }>
                            High price
                        </div>
                    </div>
                </div>
                <div className='products-container__right__products'>
                    {
                        !isLoadingFoundProducts ?
                            foundProducts.length > 0 ?
                                <div className='products-table'>
                                    <div className='products-table__headers'>
                                        <div className='products-table__headers__header products-table__headers__header2'>
                                            <h1>Name</h1>
                                        </div>
                                        <div className='products-table__headers__header products-table__headers__header3'>
                                            <h1>Brand</h1>
                                        </div>
                                        <div className='products-table__headers__header products-table__headers__header4'>
                                            <h1>Price</h1>
                                        </div>
                                        <div className='products-table__headers__header products-table__headers__header5'>
                                            <h1>Quantity</h1>
                                        </div>
                                        <div className='products-table__headers__header products-table__headers__header6'>
                                            <h1>Threshold</h1>
                                        </div>
                                        <div className='products-table__headers__header products-table__headers__header7'>
                                        </div>
                                    </div>
                                    {foundProducts.map((productInformation, i) =>
                                        <div className='products-table__row'>
                                            <div className='products-table__row__column products-table__row__column2'>
                                                <div className='products-table__row__column products-table__row__column2__image'>
                                                    <img src={
                                                        productInformation.products[0].images[0].PRISM_URL ?
                                                            `${PRISM_URL}/images/${productInformation.products[0].images[0].PRISM_URL}` :
                                                            `http://localhost:5035/products/image/${productInformation.products[0].images[0].IMAGE_NAME}`
                                                    } />
                                                </div>
                                                <div className='products-table__row__column products-table__row__column2__name'>
                                                    <h1>{productInformation.PRODUCT_NAME}</h1>
                                                </div>
                                            </div>
                                            <div className='products-table__row__column products-table__row__column3'>
                                                <h1>{productInformation.productBrand.NAME}</h1>
                                            </div>
                                            <div className='products-table__row__column products-table__row__column4'>
                                                <h1>{currencyFormatter(productInformation.productPrices.sort((a, b) =>
                                                    new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0].UNIT_PRICE)}</h1>
                                            </div>
                                            <div className='products-table__row__column products-table__row__column5'>
                                                <h1>{productInformation.products.reduce((total, product) => total + product.QTY, 0)}</h1>
                                            </div>
                                            <div className='products-table__row__column products-table__row__column6'>
                                                <h1>{productInformation.THRESHOLD}</h1>
                                            </div>
                                            <div className='products-table__row__column products-table__row__column7'>
                                                <i
                                                    style={{
                                                        background: modalId === i ? 'rgba(0, 0, 0, 0.05)' : 'transparent'
                                                    }}
                                                    onClick={() => {
                                                        if (modalId === i) {
                                                            setModalId(-1);
                                                        } else {
                                                            setModalId(i);
                                                        }
                                                    }}
                                                    className="fas fa-ellipsis-h"></i>
                                                {modalId === i ?
                                                    <div className='products-table__row__column products-table__row__column7__modal'>
                                                        <div
                                                            onClick={() => {
                                                                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                                                router.push(`/e-commerce/products/product/${productInformation.SID}`);
                                                            }}
                                                        ><h1>Edit product</h1></div>
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                                :
                                <div className='products-container__right__products__not-found-container'>
                                    <div className='products-container__right__products__not-found-container__text'>
                                        <h1>Search No Result</h1>
                                        <p>We're sorry. We cannot find any matches for your search term.</p>
                                    </div>
                                    <div className='products-container__right__products__not-found-container__icon'>
                                        <img src='https://image.flaticon.com/icons/png/512/1178/1178479.png' />
                                    </div>
                                </div>
                            : null
                        // <ClipLoader loading={isLoadingFoundProducts} size={25} />
                    }
                </div>
                <div className='products-container__right__pagination'>
                    {totalPages > 1 ?
                        <Pagination
                            count={totalPages}
                            shape="round"
                            page={page}
                            siblingCount={1}
                            boundaryCount={1}
                            onChange={changePage} />
                        : null
                    }
                </div>
            </div>
        </div >
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);