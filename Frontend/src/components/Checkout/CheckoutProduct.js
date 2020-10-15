import React from 'react';
import './CheckoutProduct.css'
import { useStateValue } from '../StateProvider'

function CheckoutProduct({ id, name, imageUrl, price, amount }) {
    const [state, dispatch] = useStateValue();

    const removeFromBasket = () => {
        dispatch({
            type: "REMOVE_FROM_BASKET",
            id: id,
        });
    }

    return (
        <tr className="checkout-row">
            <td>
                <button className="checkout-product-button" onClick={removeFromBasket}>Remove</button>
            </td>
            <td>
                <div className="checkout-product-image-wrapper" style={{ backgroundImage: `url(${imageUrl})` }}>
                    <img
                        className="checkout-product-image-content"
                        src={imageUrl}
                        alt="Product"
                    />
                </div>
            </td>
            <td>
                <div className="checkout-product-name">{name}</div>
            </td>
            <td>
                <div className="checkout-product-price">${price}</div>
            </td>
            <td>{amount}</td>
            <td>50</td>
        </tr>
    );
}

export default CheckoutProduct