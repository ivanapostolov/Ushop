import React from 'react';
import './Product.css';
import { useStateValue } from '../StateProvider';

function Product({ id, name, imageUrl, price, amount }) {
    const [{ basket }, dispatch] = useStateValue();

    const addToBasket = () => {
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id: id,
                name: name,
                imageUrl: imageUrl,
                price: price
            }
        });
    }

    return (
        <div className="product">
            <div className="product-info">
                <p className="product-name">{name}</p>
                <p className="product-price">${price}</p>
            </div>
            <div className="product-image-wrapper" style={{ backgroundImage: `url(${imageUrl})` }}>
                <img
                    className="product-image-content"
                    src={imageUrl}
                    alt="Product"
                />
            </div>
            <button className="product-button" onClick={addToBasket}>Add to basket</button>
        </div>
    );
}

export default Product;