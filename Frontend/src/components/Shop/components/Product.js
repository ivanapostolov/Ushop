import React from 'react';
import './Product.css';

class Product extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="product">
                <div className="product__wrapper" style={{ backgroundImage: `url(${this.props.imageUrl})` }}>
                    <img className="product__image" src={this.props.imageUrl} />
                    <button className="product__buttonAdd">+</button>
                </div>
                <div className="product__name">
                    {this.props.name}
                </div>
                <div className="product__price">
                    ${this.props.price}
                </div>
            </div>
        );
    }
}

export default Product;