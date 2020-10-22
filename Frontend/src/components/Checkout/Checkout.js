import React from 'react';
import './Checkout.css';
import { useStateValue } from '../StateProvider';
import CheckoutProduct from './CheckoutProduct';

function Checkout() {
    const [{ basket }] = useStateValue();

    const total = Math.round(basket.reduce((a, b) => a += Math.round(b.quantity * b.price * 100) / 100, 0) * 100) / 100;

    return (
        <div className="checkout">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {basket?.map((item, index) => (
                        <CheckoutProduct
                            key={index}
                            id={item.id}
                            name={item.name}
                            imageUrl={item.imageUrl}
                            price={item.price}
                            quantity={item.quantity}
                        />
                    ))}
                </tbody>
            </table>

            <h1 class="checkout__total">
                Total: ${total}
            </h1>
        </div>
    );
}

export default Checkout;