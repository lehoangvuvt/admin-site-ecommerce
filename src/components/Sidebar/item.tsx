import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { actions } from "../../containers/App/actions";
import { RootReducerType } from "../../containers/reducer";
import { NavigationItemType } from "../../containers/types";
import { useRouter } from "../../hooks/router";

const mapStateToProsp = (state: RootReducerType) => {
    return {
        collapsed: state.global.config.collapsed,
    }
}

const mapDispatchToProps = {
    openSideBar: actions.openSideBar,
}

const Item: FC<NavigationItemType & ReturnType<typeof mapStateToProsp> & typeof mapDispatchToProps> = ({ items, title, url, badge, icon, collapsed, openSideBar }) => {
    const [isHidden, setIsHidden] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (collapsed) {
            const btn = document.getElementById(`btn-${title}`);
            if (btn) {
                const parentElement = btn.parentElement;
                const childElement = document.getElementById(`${title}`);
                if (parentElement) parentElement.style.maxHeight = '45px';
                if (childElement) childElement.style.maxHeight = '45px';
                setIsHidden(true);
            }
        }
    }, [collapsed])

    const toggleMenu = () => {
        openSideBar();
        if (url === '/') {
            if (document.getElementById(`btn-${title}`)) {
                const btn = document.getElementById(`btn-${title}`);

                if (btn) {
                    const parentElement = btn.parentElement;
                    const childElement = document.getElementById(`${title}`);
                    if (isHidden) {
                        if (parentElement) parentElement.style.maxHeight = 'none';
                        if (childElement) childElement.style.maxHeight = 'none';
                        setIsHidden(false);
                    } else {
                        if (parentElement) parentElement.style.maxHeight = '45px';
                        if (childElement) childElement.style.maxHeight = '45px';
                        setIsHidden(true);
                    }
                }
            }
        } else {
            router.push(url);
        }
    }

    const getStyle = () => {
        if (router.pathname.split('/')[1] === title.toLowerCase()) {
            return 'item item--active';
        } else {
            if (!url.includes('e-commerce/products')
                && !url.includes('e-commerce/orders')
                && !url.includes('e-commerce/customers')
                && !url.includes('reports/customers')
                && !url.includes('e-commerce/shipping-methods')
            ) {
                if (url !== '/' && (router.pathname === url || router.pathname.includes(title.toLowerCase()))) return 'item item--active';
            } else {

                if (router.pathname.includes('e-commerce/products') || (router.pathname.includes('create-product'))) {
                    if (url.includes('products')) {
                        return 'item item--active';
                    } else {
                        return 'item';
                    }
                }

                if (router.pathname.includes('e-commerce/shipping-methods')) {
                    if (url.includes('shipping-methods')) {
                        return 'item item--active';
                    } else {
                        return 'item';
                    }
                }

                if (router.pathname.includes('e-commerce/orders')) {
                    if (url.includes('orders')) {
                        return 'item item--active';
                    } else {
                        return 'item';
                    }
                }

                if (router.pathname.includes('e-commerce/customers')) {
                    if (url.includes('e-commerce/customers')) {
                        return 'item item--active';
                    } else {
                        return 'item';
                    }
                }

                if (router.pathname.includes('e-commerce/customers')) {
                    if (url.includes('e-commerce/customers')) {
                        return 'item item--active';
                    } else {
                        return 'item';
                    }
                }

                if (router.pathname.includes('reports/customers')) {
                    if (url.includes('reports/customers')) {
                        return 'item item--active';
                    } else {
                        return 'item';
                    }
                }

                // if (router.pathname.includes('permissions/roles')) {
                //     if (url.includes('permissions/roles')) {
                //         return 'item item--active';
                //     } else {
                //         return 'item';
                //     }
                // }
            }
            return 'item';
        }
    }

    return (
        <button
            className={getStyle()}
            onClick={() => { toggleMenu() }}
            id={`btn-${title}`}>
            <div className='logo'>
                {icon}
            </div>
            <div className='title'>
                <p>{title}</p>
            </div>
            <div className='icon'>
                {items.length > 0 ?
                    <i onClick={() => { toggleMenu() }}
                        className={isHidden ? "fas fa-angle-up" : "fas fa-angle-down"}></i>
                    : null
                }
            </div>
        </button >
    )
}

export default connect(mapStateToProsp, mapDispatchToProps)(Item);