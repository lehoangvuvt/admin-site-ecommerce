import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from "@material-ui/core";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { CategoryType, ProductInformationType } from "../../../../types";

type ProductCategoriesPropsType = {
    productInformation: ProductInformationType | null,
}

const ProductCategories: FC<ProductCategoriesPropsType> = ({ productInformation }) => {
    const [categories, setCategories] = useState<Array<CategoryType>>([]);
    const [selectedCategorySIDs, setSelectedCategorySIDs] = useState<Array<string>>([]);

    const getAllCategories = async () => {
        const response = await axios({
            url: 'http://localhost:5035/categories',
            method: 'GET',
            withCredentials: true
        })
        const data = response.data;
        setCategories(data.categories);
    }

    useEffect(() => {
        getAllCategories();
    }, [])

    useEffect(() => {
        if (productInformation) {
            productInformation.categoryConnections.map(categoryConnection => {
                setSelectedCategorySIDs(prevSelectedCategorySIDs => [...prevSelectedCategorySIDs, categoryConnection.SID_CATEGORY]);
            })
        }
    }, [productInformation])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const categorySID = event.target.name;
        if (!selectedCategorySIDs.includes(categorySID)) {
            setSelectedCategorySIDs(prevSelectedCategorySIDs => [...prevSelectedCategorySIDs, categorySID]);
        } else {
            setSelectedCategorySIDs(selectedCategorySIDs.filter(selectedCategorySID => selectedCategorySID !== categorySID));
        }
    };

    return (
        <div className='product-details-container__content__body'>
            <form>
                <div className='product-details-container__content__body__product-categories-container'>
                    <FormControl >
                        <FormGroup>
                            {categories.length > 0 ?
                                categories.map(category =>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedCategorySIDs.includes(category.SID)}
                                                onChange={handleChange}
                                                color="primary"
                                                name={category.SID} />}
                                        label={category.CATEGORY_NAME}
                                    />
                                )
                                : null}
                        </FormGroup>
                    </FormControl>
                </div>
                <button type='submit'>Save</button>
            </form>
        </div>
    )
}

export default ProductCategories;