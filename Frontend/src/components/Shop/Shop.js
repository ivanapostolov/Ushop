import React from 'react';
import './Shop.css';
import Product from './components/Product';
import { StateContext } from '../StateProvider';
import Filter from './components/Filter';

class Shop extends React.Component {
    constructor(props) {
        super(props);

        this.state = { categoryid: '', products: [], filters: {}, toggle: false };

        this.updateProducts = this.updateProducts.bind(this);

        this.requestProducts = this.requestProducts.bind(this);
    }

    static contextType = StateContext;

    componentDidMount() {
        this.requestProducts();
    }

    requestProducts() {
        const url = 'http://localhost:8000/api/products';

        const parameters = {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state.filters)
        }

        fetch(url, parameters).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ products: data.error ? [] : data })
        }).catch(err => {
            console.log(err);
        });
    }

    updateProducts(filter) {
        let update = this.state.filters;

        if (typeof this.state.filters[filter.name] === 'undefined') {
            update[filter.name] = [];
        }

        filter.active ? update[filter.name].push(filter.option) : update[filter.name].splice(update[filter.name].indexOf(filter.option), 1);

        if (update[filter.name].length === 0) {
            delete update[filter.name];
        }

        this.setState({ filters: update }, () => {
            this.requestProducts();
        });
    }

    render() {
        const productsList = this.state.products ? this.state.products.map(e => <Product key={e.id} id={e.id} imageUrl={`${this.context[0].baseUrl}product${e.id}.png`} name={e.name} price={e.price} />) : '';

        return (
            <div className="shop">
                <div className="shop__filters">
                    <button className="filters__toggle" onClick={() => this.setState({ toggle: !this.state.toggle })}>Filters</button>
                    <div className="filters__anchor">
                        <div className={`filters__dropdown ${this.state.toggle ? "" : 'hidden'}`}>
                            <Filter callback={this.updateProducts} name="brand" options={['nike', 'us polo', 'zara', 'h&m', 'teodor']} />
                            <Filter callback={this.updateProducts} name="material" options={['silk', 'cutton', 'polyester', 'spandex', 'teodor']} />
                            <Filter callback={this.updateProducts} name="size" options={['L', 'M', 'S', 'XS', 'XL']} />
                        </div>
                    </div>
                </div>
                <div className="shop__productsContainer">
                    {productsList}
                </div>
            </div>
        );
    }
}

export default Shop;