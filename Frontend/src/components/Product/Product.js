import React from 'react';
import './Product.css';
import { StateContext } from '../StateProvider';

class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = { product: {}, color: '', quantity: 1 };

        this.addToBasket = this.addToBasket.bind(this);

        this.selectColor = this.selectColor.bind(this);
    }

    static contextType = StateContext;

    componentDidMount() {
        const url = `${this.context[0].baseUrl}api/product/${this.props.id}`;

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data[0]);
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
                price: this.state.product.price,
                quantity: this.state.quantity
            }
        });
    }

    selectColor(e) {
        this.setState({ color: e.target.value });
    }

    render() {
        const colorOptions = typeof this.state.product.color === 'undefined' ? '' : this.state.product.color.map((e, i) => <option key={i} value={e}>{e}</option>);

        const sizeOptions = typeof this.state.product.size === 'undefined' ? '' : this.state.product.size.map((e, i) => <option key={i} value={e}>{e}</option>);

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
                        <div className="info__multipleChoice">
                            <span>Color</span>
                            <select onChange={this.selectColor} value={this.state.color}>
                                {colorOptions}
                            </select>
                        </div>
                        <div className="info__multipleChoice">
                            <span>Size </span>
                            <select onChange={this.selectColor} value={this.state.color}>
                                {sizeOptions}
                            </select>
                        </div>
                        <div className="addSection">
                            <div className="addSection__amount">
                                <button onClick={() => { this.setState({ quantity: this.state.quantity === 1 ? 1 : this.state.quantity - 1 }) }}>&lt;</button>
                                <span>{this.state.quantity}</span>
                                <button onClick={() => { this.setState({ quantity: this.state.quantity + 1 }) }}>&gt;</button>
                            </div>
                            <button className="add__button" onClick={this.addToBasket}>Add to basket</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Product;