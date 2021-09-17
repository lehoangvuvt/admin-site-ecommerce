import { Switch, BrowserRouter, Route, withRouter } from "react-router-dom";
import { FC, useEffect } from "react";
import { connect } from "react-redux";
import Page404 from "../../components/404Page/404Page";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MainDashboard from "../Board/Dashboard/loadable";
import MainProducts from "../Board/Ecommerce/Products/loadable";
import MainAttributes from "../Board/Ecommerce/Attributes/loadable";
import MainAttributeSets from "../Board/Ecommerce/AttributeSets/loadable";
import MainBrands from "../Board/Ecommerce/Brands/loadable";
import MainCategories from "../Board/Ecommerce/Categories/loadable";
import MainProduct from "../Board/Ecommerce/Products/Product/loadable";
import MainCreateProduct from "../Board/Ecommerce/Products/CreateProduct/loadable";
import MainImport from "../Board/Ecommerce/Products/Import/loadable";
import Login from "../Login/loadable";
import CheckLogin from "../../components/CheckLogin";
import MainOrders from "../Board/Ecommerce/Orders/loadable";
import MainOrderDetails from "../Board/Ecommerce/Orders/OrderDetails/loadable";
import MainCreateAttribute from "../Board/Ecommerce/Attributes/CreateAtrribute/loadable";
import MainCreateAttributeSet from "../Board/Ecommerce/AttributeSets/CreateAtrributeSet/loadable";
import MainCreateBrand from "../Board/Ecommerce/Brands/CreateBrand/loadable";
import MainCreateCategory from "../Board/Ecommerce/Categories/CreateCategory/loadable";
import MainCustomers from "../Board/Ecommerce/Customers/loadable";
import MainSegments from "../Board/Ecommerce/Segments/loadable";
import GlobalSearch from "../../components/GlobalSearch";
import MainPromotion from "../Board/Ecommerce/Promotion";
import MainAddPromotion from "../Board/Ecommerce/Promotion/AddPromotion";
import MainCustomerLoyalty from "../Board/Ecommerce/Customers/Loyalty";
import MainOrdersReport from "../Board/Reports/Customers/Orders/loadable";
import MainSegmentsReport from "../Board/Reports/Customers/Segments/loadable";
import MainSegmentDetailsReport from "../Board/Reports/Customers/Segments/loadable2";
import MainProductsSelect from "../Board/Ecommerce/Products/BulkUpdate/loadable1";
import MainUpdate from "../Board/Ecommerce/Products/BulkUpdate/loadable2";
import { RootReducerType } from "../reducer";
import moment from "moment";
import "moment/locale/vi";
import "../../webfonts/all.css";
import MainBestsellersReport from "../Board/Reports/Product/Bestsellers";
import MainLowStockReport from "../Board/Reports/Product/LowStock";
import MainProductViewsReport from "../Board/Reports/Product/PoductView";
import MainOrderedProducts from "../Board/Reports/Product/OrderedProduct";
import MainAccountsReport from "../Board/Reports/Customers/Accounts/loadable";
import MainActiveRecommendation from "../Board/Settings/MailSettings/Recommend_active";
import Roles from "../Board/Permissions/Roles";
import Resources from "../Board/Permissions/Resources";
import MainReportSales from "../Board/Reports/Sales";
import MainProductInCart from "../Board/Reports/Marketing/ProductInCart";
import MainCoupon from "../Board/Ecommerce/Customers/Coupon";
import MainAddCouponForm from '../Board/Ecommerce/Customers/Coupon/AddCouponForm'
import MainSearchTerm from "../Board/Reports/Marketing/SearchTerm";
import MainOrderDetail from "../Board/Reports/Product/OrderDetail";
import MailSettings from "../Board/Settings/MailSettings/loadable";
import MailSettingDetails from "../Board/Settings/MailSettings/MailSettingDetails/loadable";
import MainTemplateDetails from "../Board/Settings/MailSettings/MailSettingDetails/TemplateDetails/loadable";
import { actions } from '../../containers/Login/actions';
import SenderMailConfig from "../Board/Settings/MailSettings/SenderMailConfig/loadable";
import MainShippingMethods from "../Board/Ecommerce/ShippingMethods/loadable";
import MainCreateMethod from "../Board/Ecommerce/ShippingMethods/CreateMethod/loadable";
import MainMethodDetails from "../Board/Ecommerce/ShippingMethods/MethodDetails/loadable";
import MainStore from '../Board/Ecommerce/Store'

const mapStateToProps = (state: RootReducerType) => {
  return {
    isShowGlobalSearch: state.global.config.isShowGlobalSearch,
  };
};

const mapDispatchToProps = {
  setUserInfomation: actions.setUserInfomation,
};

const App: FC<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> = ({
  isShowGlobalSearch,
  setUserInfomation
}) => {
  const GlobalSearchComponent = isShowGlobalSearch ? <GlobalSearch /> : null;

  useEffect(() => {
    moment.locale("vi");
  }, []);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      console.log(user);
      setUserInfomation(user);
    }
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <CheckLogin />
        </Route>
        <Route exact path={["/dashboard", "/"]}>
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainDashboard />
        </Route>

        <Route exact path="/login">
          <Login />
        </Route>

        <Route exact path="/e-commerce/products">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainProducts />
        </Route>

        <Route exact path="/e-commerce/products/product/:SID">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainProduct />
        </Route>

        <Route exact path="/e-commerce/attributes">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainAttributes />
        </Route>

        <Route exact path="/e-commerce/attribute-sets">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainAttributeSets />
        </Route>

        <Route exact path="/e-commerce/brands">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainBrands />
        </Route>

        <Route exact path="/e-commerce/categories">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCategories />
        </Route>

        <Route path="/e-commerce/products/create-product">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCreateProduct />
        </Route>

        <Route path="/e-commerce/products/import">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainImport />
        </Route>

        <Route path="/e-commerce/store">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainStore/>
        </Route>

        <Route path='/e-commerce/products/bulk-update/step-1'>
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainProductsSelect />
        </Route>

        <Route path='/e-commerce/products/bulk-update/step-2'>
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainUpdate />
        </Route>

        <Route path="/e-commerce/attributes/create-attribute">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCreateAttribute />
        </Route>

        <Route path="/e-commerce/attributes/create-attribute-set">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCreateAttributeSet />
        </Route>

        <Route path="/e-commerce/brands/create-brand">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCreateBrand />
        </Route>

        <Route path="/e-commerce/categories/create-category">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCreateCategory />
        </Route>

        <Route exact path="/e-commerce/orders">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainOrders />
        </Route>

        <Route path="/e-commerce/orders/order/:sid">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainOrderDetails />
        </Route>

        <Route exact path="/e-commerce/customers">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCustomers />
        </Route>

        <Route exact path="/e-commerce/customers/coupon">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCoupon />
        </Route>

        <Route exact path="/e-commerce/customers/coupon/add">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainAddCouponForm />
        </Route>

        <Route exact path="/e-commerce/segments">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainSegments />
        </Route>

        <Route exact path="/e-commerce/promotion">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainPromotion />
        </Route>

        <Route exact path="/e-commerce/promotion/add-promotion">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainAddPromotion />
        </Route>
        <Route exact path="/e-commerce/promotion/edit">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainAddPromotion />
        </Route>

        <Route exact path="/e-commerce/customers/loyalty">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCustomerLoyalty />
        </Route>

        <Route exact path="/e-commerce/shipping-methods">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainShippingMethods />
        </Route>

        <Route exact path="/e-commerce/shipping-methods/create-new">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainCreateMethod />
        </Route>

        <Route exact path="/e-commerce/shipping-methods/:id">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainMethodDetails />
        </Route>

        <Route exact path="/reports/orders">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainOrdersReport />
        </Route>

        <Route exact path="/reports/segments">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainSegmentsReport />
        </Route>

        <Route exact path="/reports/segments/details">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainSegmentDetailsReport />
        </Route>

        <Route exact path="/reports/accounts">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainAccountsReport />
        </Route>

        <Route exact path="/reports/bestsellers">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainBestsellersReport />
        </Route>

        <Route exact path="/reports/OrderDetail">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainOrderDetail />
        </Route>

        <Route exact path="/reports/lowStock">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainLowStockReport />
        </Route>

        <Route exact path="/reports/productViews">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainProductViewsReport />
        </Route>

        <Route exact path="/reports/orderedProducts">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainOrderedProducts />
        </Route>

        <Route exact path="/settings/activeRecommend">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainActiveRecommendation />
        </Route>


        <Route exact path="/reports/marketing">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainProductInCart />
        </Route>

        <Route exact path="/reports/searchterm">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainSearchTerm />
        </Route>

        <Route exact path="/reports/sales">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainReportSales />
        </Route>

        <Route exact path="/permissions/roles">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <Roles />
        </Route>

        <Route exact path="/permissions/resources">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <Resources />
        </Route>

        <Route exact path="/settings/mail-settings">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MailSettings />
        </Route>

        <Route exact path="/settings/mail-settings/:id">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MailSettingDetails />
        </Route>

        <Route exact path="/settings/mail-settings/:id/templates/:id">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <MainTemplateDetails />
        </Route>

        <Route exact path="/settings/sender-mail-config">
          <Header />
          <Sidebar />
          {GlobalSearchComponent}
          <SenderMailConfig />
        </Route>

        <Route component={Page404} />
      </Switch>
    </BrowserRouter>
  );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
