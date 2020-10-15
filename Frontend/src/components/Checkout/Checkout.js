import React from 'react';
import './Checkout.css';
import { useStateValue } from '../StateProvider';
import CheckoutProduct from './CheckoutProduct';

function Checkout() {
    const [{ basket }] = useStateValue();

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
                            amount="4"
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Checkout;