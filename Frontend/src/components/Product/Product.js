import React from 'react';
import './Product.css';
import { StateContext } from '../StateProvider';

class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = { product: {}, color: '' };

        this.addToBasket = this.addToBasket.bind(this);

        this.selectColor = this.selectColor.bind(this);
    }

    static contextType = StateContext;

    componentDidMount() {
        const url = `${this.context[0].baseUrl}api/product/${this.props.id}`;

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            this.setState({ product: data[0] })
        }).catch(err => {
            console.log(err);
        });
    }

    addToBasket() {
        const dispatch = this.context[1];

        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id: this.props.id,
                name: this.state.product.name,
                imageUrl: `${this.context[0].baseUrl}product${this.props.id}.png`,
                price: this.state.product.price
            }
        });
    }

    selectColor(e) {
        this.setState({ color: e.target.value });
    }

    render() {
        return (
            <div className="productView">
                <div className="productView__layout">
                    <div className="layout__wrapper" style={{ backgroundImage: `url(${this.context[0].baseUrl}product${this.props.id}.png)` }}>
                        <img className="layout__image" src={`${this.context[0].baseUrl}product${this.props.id}.png`} />
                    </div>
                    <div className="layout__info">
                        <div className="info__title">
                            {this.state.product.name}
                        </div>
                        <div className="info__price">
                            ${this.state.product.price} {this.state.color}
                        </div>
                        <select onChange={this.selectColor} value={this.state.color}>
                            <option value="Black">Black</option>
                            <option value="Grey">Grey</option>
                            <option value="Red">Red</option>
                        </select>
                        <button className="add__button" onClick={this.addToBasket}>Add to basket</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Product;