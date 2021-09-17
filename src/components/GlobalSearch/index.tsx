import axios from 'axios';
import { createRef, FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Parser from 'html-react-parser';
import { actions } from '../../containers/App/actions';
import { RootReducerType } from '../../containers/reducer';
import { CustomerInfoType, ProductInformationType } from '../../containers/types';
import { PRISM_URL } from "../../constants/url.constants";
import './style.scss';

const mapStateToProps = (state: RootReducerType) => {
    return {
        config: state.global.config,
    }
}

const mapDispatchToProps = {
    closeGlobalSearch: actions.closeGlobalSearch,
}

const GlobalSearch: FC<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> = ({ config, closeGlobalSearch }) => {
    const { isShowGlobalSearch } = config;
    const [searchTxt, setSearchTxt] = useState('');
    const [products, setProducts] = useState<Array<ProductInformationType>>([]);
    const [customers, setCustomers] = useState<Array<CustomerInfoType>>([]);
    let searchRef: React.RefObject<HTMLInputElement>;
    searchRef = createRef();

    const handleInput = (e: any) => {
        if (e.keyCode === 27) {
            closeGlobalSearch();
        }
    }

    useEffect(() => {
        if (isShowGlobalSearch) {
            window.addEventListener('keydown', handleInput, false);
        } else {
            window.removeEventListener('keydown', handleInput, false);
        }
    }, [isShowGlobalSearch])

    const checkIsClickOptionToggle = (e: any) => {
        if (e.srcElement) {
            if (e.srcElement.className === 'global-search-container') {
                closeGlobalSearch();
            }
        }
    }

    const handleFocus = (ref: React.RefObject<HTMLInputElement>) => {
        if (ref && ref.current) ref.current.style.border = '2px solid #3f51b5';
    }

    const handleBlur = (ref: any) => {
        if (ref && ref.current) ref.current.style.border = '2px solid rgba(0, 0, 0, 0.1)';
    }

    useEffect(() => {
        window.addEventListener('click', checkIsClickOptionToggle, false);

        return () => {
            window.removeEventListener('click', checkIsClickOptionToggle, false);
        }
    }, [])

    const search = async () => {
        if (searchTxt.length > 2) {
            const url = `http://localhost:5035/admin/search?q=${searchTxt}`;
            const response = await axios({
                url,
                method: 'GET',
            });
            const data = await response.data;
            const products = data.products;
            const customers = data.customers;
            setProducts(products);
            setCustomers(customers);
        } else {
            setProducts([]);
            setCustomers([]);
        }
    }

    useEffect(() => {
        if (searchTxt.length > 2) {
            search();
        } else {
            setProducts([]);
            setCustomers([]);
        }
    }, [searchTxt])

    const getSubstring = (text: string) => {
        let afterstring = '';
        let inlineHtml = `<h1>${text}</h1>`;
        const substring = new RegExp(searchTxt, 'gi');
        afterstring = inlineHtml.replace(substring, (match) => `<mark style={{color:'red'}}>${match}</mark>`);
        return afterstring;
    }

    return (
        <div className='global-search-container'>
            <div className='global-search-container__right'>
                <div className='global-search-container__right__search-bar-container'>
                    <div
                        ref={searchRef}
                        className='global-search-container__right__search-bar-container__search-bar'>
                        <i className="fas fa-search"></i>
                        <input
                            onFocus={() => { handleFocus(searchRef) }}
                            onBlur={() => { handleBlur(searchRef) }}
                            placeholder='Enter keyword to search...'
                            value={searchTxt}
                            onChange={(e) => { setSearchTxt(e.target.value) }}
                            type='text' />
                    </div>
                </div>

                {products.length > 0 ?
                    <div className='global-search-container__right__products-container'>
                        <div className='global-search-container__right__products-container__header'>
                            <h1>Products</h1>
                        </div>
                        <div className='global-search-container__right__products-container__products'>
                            {products.map(product =>
                                <div className='global-search-container__right__products-container__products__product'>
                                    <div className='global-search-container__right__products-container__products__product__image'>
                                        <img src={
                                            product.products[0].images[0].PRISM_URL ?
                                                `${PRISM_URL}/images/${product.products[0].images[0].PRISM_URL}` :
                                                `http://localhost:5035/products/image/${product.products[0].images[0].IMAGE_NAME}`
                                        } />
                                    </div>
                                    <div className='global-search-container__right__products-container__products__product__name'>
                                        {Parser(getSubstring(product.PRODUCT_NAME))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    : null}

                {customers.length > 0 ?
                    <div className='global-search-container__right__products-container'>
                        <div className='global-search-container__right__products-container__header'>
                            <h1>People</h1>
                        </div>
                        <div className='global-search-container__right__products-container__products'>
                            {customers.map(customer =>
                                <div className='global-search-container__right__products-container__products__product'>
                                    <div className='global-search-container__right__products-container__products__product__image'>
                                        <img
                                            style={{ borderRadius: '50%' }}
                                            src='https://i.pinimg.com/236x/d4/21/69/d4216952edc39b997f377dec5b94428f.jpg' />
                                    </div>
                                    <div className='global-search-container__right__products-container__products__product__name'>
                                        {Parser(getSubstring(customer.EMAIL))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    : null}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearch);