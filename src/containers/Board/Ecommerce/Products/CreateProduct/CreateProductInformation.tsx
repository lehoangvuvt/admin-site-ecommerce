import React, { createRef, FC, useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from "draft-js-export-html";
import { EditorState, convertToRaw } from "draft-js";
import axios from "axios";
import {
  AttributeSetType,
  CategoryType,
  CreateProductInformationType,
  ProductBrandType,
  ProductInformationType,
} from "../../../../types";
import { actions } from "./actions";
import { connect } from "react-redux";
import Info from "../../../../../components/Tooptip/Info";
import { tooltipContents } from "../../../../../data/tooltip_content";

const mapDispatchToProps = {
  setStep: actions.setStep,
  setProductInformation: actions.setProductInformation,
};

const CreateProductInformation: FC<typeof mapDispatchToProps> = ({
  setStep,
  setProductInformation,
}) => {
  const [productName, setProductName] = useState("");
  const [SKU, setSKU] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [categories, setCategories] = useState<Array<CategoryType>>([]);
  const [selectedCategorySID, setSelectedCategorySID] = useState<string>("");
  const [brands, setBrands] = useState<Array<ProductBrandType>>([]);
  const [selectedBrandSID, setSelectedBrandSID] = useState<string>("");
  const [attributeSets, setAttributeSets] = useState<Array<AttributeSetType>>(
    []
  );
  const [selectedAttributeSetId, setSelectedAttributeSetId] =
    useState<number>(0);
  const [selectedProductGender, setSelectedProductGender] = useState("Male");
  const [shortDescription, setShortDescription] = useState(() =>
    EditorState.createEmpty()
  );
  const [longDescription, setLongDescription] = useState(() =>
    EditorState.createEmpty()
  );
  let productNameRef: React.RefObject<HTMLInputElement>;
  let skuRef: React.RefObject<HTMLInputElement>;
  let categoryRef: React.RefObject<HTMLSelectElement>;
  let brandRef: React.RefObject<HTMLSelectElement>;
  let productGenderRef: React.RefObject<HTMLSelectElement>;
  let priceRef: React.RefObject<HTMLInputElement>;
  let attributeSetRef: React.RefObject<HTMLSelectElement>;
  let taxRef: React.RefObject<HTMLInputElement>;
  productNameRef = createRef();
  skuRef = createRef();
  categoryRef = createRef();
  brandRef = createRef();
  productGenderRef = createRef();
  priceRef = createRef();
  attributeSetRef = createRef();
  taxRef = createRef();

  const getAllCategories = async () => {
    const response = await axios({
      url: `http://localhost:5035/categories`,
      method: "GET",
    });
    const data = response.data;
    setCategories(data.categories);
    setSelectedCategorySID(data.categories ? data.categories[0].SID : []);
  };

  const getAllBrands = async () => {
    const response = await axios({
      url: `http://localhost:5035/products/brands`,
      method: "GET",
    });
    const data = response.data;
    setBrands(data.brands);
    setSelectedBrandSID(data.brands[0].SID);
  };

  const getAllAttributeSets = async () => {
    const response = await axios({
      url: `http://localhost:5035/products/attribute-set`,
      method: "GET",
    });
    const data = response.data;
    setAttributeSets(data.attributeSets);
    setSelectedAttributeSetId(
      data.attributeSets.length > 0 ? data.attributeSets[0].ID : []
    );
  };

  useEffect(() => {
    getAllCategories();
    getAllBrands();
    getAllAttributeSets();
  }, []);

  const handleFocus = (ref: React.RefObject<any>) => {
    if (ref && ref.current) ref.current.style.border = "2px solid #3f51b5";
  };

  const handleBlur = (ref: React.RefObject<any>) => {
    if (ref && ref.current)
      ref.current.style.border = "2px solid rgba(0, 0, 0, 0.1)";
  };

  const createProductInfo = async () => {
    const plainTextLongDes = longDescription.getCurrentContent().getPlainText();
    const plainTextShortDes = shortDescription
      .getCurrentContent()
      .getPlainText();
    const body = {
      DISCOUNT: 0,
      LONG_DESCRIPTION: stateToHTML(longDescription.getCurrentContent()),
      SKU,
      LONG_DESCRIPTION_TEXT: plainTextLongDes,
      PRODUCT_GENDER: selectedProductGender,
      SHORT_DESCRIPTION: stateToHTML(shortDescription.getCurrentContent()),
      SHORT_DESCRIPTION_TEXT: plainTextShortDes,
      PRODUCT_NAME: productName,
      SID_BRAND: selectedBrandSID,
      TAX: tax,
      UNIT_PRICE: productPrice,
    };
    const response = await axios({
      url: `http://localhost:5035/products/product-information/create`,
      method: "POST",
      data: body,
      withCredentials: true,
    });
    const data = response.data;
    let productInformation: ProductInformationType;
    if (data.error) return { error: data.error };
    productInformation = data.productInformation;
    return {
      productInformation,
    };
  };

  const addCategoryForProduct = async (SID_PRODUCT: string) => {
    const body = {
      CATEGORY_ID_ARRAY: [selectedCategorySID],
      SID_PRODUCT,
    };
    const response = await axios({
      url: `http://localhost:5035/products/add-categories`,
      method: "POST",
      data: body,
      withCredentials: true,
    });
    const data = response.data;
    if (data.success.length === 0) return { failed: data.failed };
    return {
      success: data.success,
    };
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let productInformation: ProductInformationType;
    const createProductInfoRes = await createProductInfo();
    if (createProductInfoRes.error) return;
    if (createProductInfoRes && createProductInfoRes.productInformation) {
      productInformation = createProductInfoRes.productInformation;
      const addCategoryForProductRes = await addCategoryForProduct(
        productInformation.SID
      );
      if (addCategoryForProductRes.failed) return;
      const selectedAttributeSet = attributeSets.filter(
        (attributeSet) => attributeSet.ID === selectedAttributeSetId
      )[0];
      setProductInformation(productInformation, selectedAttributeSet);
      setStep(2);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="create-product-container">
      <form onSubmit={handleSubmit}>
        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Product name</p>
            <Info content={tooltipContents.productName} />
          </div>
          <div className="create-product-container__field-container__input">
            <input
              value={productName}
              onFocus={() => {
                handleFocus(productNameRef);
              }}
              onBlur={() => {
                handleBlur(productNameRef);
              }}
              onChange={(e) => {
                setProductName(e.target.value);
              }}
              placeholder="Name of the product"
              ref={productNameRef}
              type="text"
            />
          </div>
          {/* <div className='create-product-container__field-container__error'>
                        <p>Product name cannot be empty </p>
                    </div> */}
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>SKU</p>
            <Info content={tooltipContents.productName} />
          </div>
          <div className="create-product-container__field-container__input">
            <input
              value={SKU}
              onFocus={() => {
                handleFocus(skuRef);
              }}
              onBlur={() => {
                handleBlur(skuRef);
              }}
              onChange={(e) => {
                setSKU(e.target.value);
              }}
              placeholder="Product's SKU"
              ref={skuRef}
              type="text"
            />
          </div>
          {/* <div className='create-product-container__field-container__error'>
                        <p>Product name cannot be empty </p>
                    </div> */}
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Category</p>
          </div>
          <div className="create-product-container__field-container__input">
            <select
              value={selectedCategorySID}
              onChange={(e) => {
                setSelectedCategorySID(e.target.value);
              }}
              ref={categoryRef}
              onFocus={() => {
                handleFocus(categoryRef);
              }}
              onBlur={() => {
                handleBlur(categoryRef);
              }}
            >
              {categories.length > 0
                ? categories.map((category) => (
                  <option value={category.SID} key={category.SID}>
                    {category.CATEGORY_NAME}
                  </option>
                ))
                : null}
            </select>
          </div>
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Brand</p>
          </div>
          <div className="create-product-container__field-container__input">
            <select
              value={selectedBrandSID}
              onChange={(e) => {
                setSelectedBrandSID(e.target.value);
              }}
              onFocus={() => {
                handleFocus(brandRef);
              }}
              onBlur={() => {
                handleBlur(brandRef);
              }}
              ref={brandRef}
            >
              {brands.length > 0
                ? brands.map((brand) => (
                  <option value={brand.SID} key={brand.SID}>
                    {brand.NAME}
                  </option>
                ))
                : null}
            </select>
          </div>
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Product for</p>
          </div>
          <div className="create-product-container__field-container__input">
            <select
              value={selectedProductGender}
              onChange={(e) => {
                setSelectedProductGender(e.target.value);
              }}
              onFocus={() => {
                handleFocus(productGenderRef);
              }}
              onBlur={() => {
                handleBlur(productGenderRef);
              }}
              ref={productGenderRef}
            >
              <option value={"Men"} key={0}>
                Men
              </option>
              <option value={"Women"} key={1}>
                Women
              </option>
              <option value={"Both"} key={2}>
                Both (Men and Women)
              </option>
            </select>
          </div>
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Short description</p>
            <Info content={tooltipContents.shortDescription} />
          </div>
          <div className="create-product-container__field-container__input">
            <Editor
              onFocus={() => {
                const wrapper = document.getElementById("rdw-wrapper-1");
                if (wrapper) wrapper.style.border = "2px solid #3f51b5";
              }}
              onBlur={() => {
                const wrapper = document.getElementById("rdw-wrapper-1");
                if (wrapper)
                  wrapper.style.border = "2px solid rgba(0, 0, 0, 0.1)";
              }}
              wrapperId={1}
              editorState={shortDescription}
              toolbarClassName="toolbarClassName"
              wrapperClassName="short-description-wrapper"
              editorClassName="editorClassName"
              onEditorStateChange={setShortDescription}
              placeholder="Briefly describe about the product"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "history",
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
          <div className="create-product-container__field-container__limit">
            <p>
              {convertToRaw(shortDescription.getCurrentContent())
                .blocks.map(
                  (block) => (!block.text.trim() && "\n") || block.text
                )
                .join("\n").length - 1}
              /12
            </p>
          </div>
          {/* <div className='create-product-container__field-container__error'>
                        <p>Product name cannot be empty </p>
                    </div> */}
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Long description</p>
            <Info content={tooltipContents.longDescription} />
          </div>
          <div className="create-product-container__field-container__input">
            <Editor
              onFocus={() => {
                const wrapper = document.getElementById("rdw-wrapper-2");
                if (wrapper) wrapper.style.border = "2px solid #3f51b5";
              }}
              onBlur={() => {
                const wrapper = document.getElementById("rdw-wrapper-2");
                if (wrapper)
                  wrapper.style.border = "2px solid rgba(0, 0, 0, 0.1)";
              }}
              wrapperId={2}
              editorState={longDescription}
              toolbarClassName="toolbarClassName"
              wrapperClassName="long-description-wrapper"
              editorClassName="editorClassName"
              onEditorStateChange={setLongDescription}
              placeholder="More details about the product"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "history",
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
          <div className="create-product-container__field-container__limit">
            <p>
              {convertToRaw(longDescription.getCurrentContent())
                .blocks.map(
                  (block) => (!block.text.trim() && "\n") || block.text
                )
                .join("\n").length - 1}
              /12
            </p>
          </div>
          {/* <div className='create-product-container__field-container__error'>
                        <p>Product name cannot be empty </p>
                    </div> */}
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Price</p>
          </div>
          <div className="create-product-container__field-container__input">
            <input
              value={productPrice}
              onFocus={() => {
                handleFocus(priceRef);
              }}
              onBlur={() => {
                handleBlur(priceRef);
              }}
              onChange={(e) => {
                if (parseFloat(e.target.value) < 0) return;
                setProductPrice(parseFloat(e.target.value));
              }}
              placeholder="Price of the product"
              ref={priceRef}
              type="number"
            />
          </div>
          {/* <div className='create-product-container__field-container__error'>
                        <p></p>
                    </div> */}
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Tax on product</p>
            <Info content={tooltipContents.tax} />
          </div>
          <div className="create-product-container__field-container__input">
            <input
              value={tax}
              onFocus={() => {
                handleFocus(taxRef);
              }}
              onBlur={() => {
                handleBlur(taxRef);
              }}
              onChange={(e) => {
                if (parseFloat(e.target.value) < 0) return;
                setTax(parseFloat(e.target.value));
              }}
              placeholder="Tax of the product"
              ref={taxRef}
              type="number"
            />
          </div>
          {/* <div className='create-product-container__field-container__error'>
                        <p></p>
                    </div> */}
        </div>

        <div className="create-product-container__field-container">
          <div className="create-product-container__field-container__label">
            <p>Attribute set</p>
            <Info content={tooltipContents.attributeSet} />
          </div>
          <div className="create-product-container__field-container__input">
            <select
              value={selectedAttributeSetId}
              onChange={(e) => {
                setSelectedAttributeSetId(parseInt(e.target.value));
              }}
              onFocus={() => {
                handleFocus(attributeSetRef);
              }}
              onBlur={() => {
                handleBlur(attributeSetRef);
              }}
              ref={attributeSetRef}
            >
              {attributeSets.length > 0
                ? attributeSets.map((attributeSet) => (
                  <option value={attributeSet.ID} key={attributeSet.ID}>
                    {attributeSet.SET_NAME}
                  </option>
                ))
                : null}
            </select>
          </div>
          {selectedAttributeSetId !== 0 ? (
            <div className="create-product-container__field-container__additional-info">
              <p>
                (Attributes in this attribute set:
                {attributeSets.filter(
                  (attributeSet) => attributeSet.ID === selectedAttributeSetId
                ).length > 0
                  ? attributeSets.filter(
                    (attributeSet) =>
                      attributeSet.ID === selectedAttributeSetId
                  )[0].productAttribute1.ATTRIBUTE_NAME
                  : []}
                ,
                {attributeSets.filter(
                  (attributeSet) => attributeSet.ID === selectedAttributeSetId
                ).length > 0
                  ? attributeSets.filter(
                    (attributeSet) =>
                      attributeSet.ID === selectedAttributeSetId
                  )[0].productAttribute2.ATTRIBUTE_NAME
                  : []}
                )
              </p>
            </div>
          ) : null}
        </div>

        <div className="create-product-container__btn-container">
          <button type="submit">Next</button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(CreateProductInformation);
