import React from 'react';
import './Checkout.css';
import { useStateValue } from '../StateProvider';
import CheckoutProduct from './CheckoutProduct';

function Checkout() {
    const [{ basket }] = useStateValue();

    const total = Math.round(basket.reduce((a, b) => a += Math.round(b.quantity * b.price * 100) / 100, 0) * 100) / 100;

    return (
        <div className="checkout">
            <div className="checkoutProducts">
                {basket?.map((item, index) => (
                    <CheckoutProduct
                        key={index}
                        id={item.id}
                        name={item.name}
                        imageUrl={item.imageUrl}
                        price={item.price}
                        quantity={item.quantity}
                        variation={item.variation}
                    />
                ))}
            </div>

            {basket.length > 0 ? <h1 class="checkout__total">Total: <span>${total}</span></h1> : <h1>Basket is empty</h1>}
        </div>
    );
}

export default Checkout;