import React from 'react';
import './Shop.css';
import Product from './components/Product';
import { StateContext } from '../StateProvider';
import Filter from './components/Filter';

class Shop extends React.Component {
    constructor(props) {
        super(props);

        this.state = { categoryid: '', products: [], availableFilters: {}, appliedFilters: {}, toggle: false };

        this.updateProducts = this.updateProducts.bind(this);
    }

    static contextType = StateContext;

    componentDidMount() {
        this.request('products');

        this.request('filters');
    }

    fetch(url, prop) {
        const params = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };

        fetch(url, params).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ [prop]: data.error ? [] : data });
        }).catch(err => {
            console.log(err);
        });
    }

    request(resource) {
        switch (resource) {
            case 'products':
                this.fetch(`${this.context[0].baseUrl}api/products/${btoa(JSON.stringify({ categoryId: this.props.id, filters: this.state.appliedFilters }))}`, 'products');
                break;
            case 'filters':
                this.fetch(`${this.context[0].baseUrl}api/filters/${this.props.id}`, 'availableFilters');
                break;
            default:
                break;
        }
    }

    updateProducts(filter) {
        let update = this.state.appliedFilters;

        if (typeof this.state.appliedFilters[filter.name] === 'undefined') {
            update[filter.name] = [];
        }

        filter.active ? update[filter.name].push(filter.option) : update[filter.name].splice(update[filter.name].indexOf(filter.option), 1);

        if (update[filter.name].length === 0) {
            delete update[filter.name];
        }

        this.setState({ appliedFilters: update }, () => {
            this.request('products');
        });
    }

    render() {
        const filters = Object.keys(this.state.availableFilters).map((e, i) => <Filter key={i} callback={this.updateProducts} name={e} options={this.state.availableFilters[e]} />);

        const productsList = this.state.products ? this.state.products.map(e => <Product key={e.id} id={e.id} imageUrl={`${this.context[0].baseUrl}product${e.id}.png`} name={e.name} price={e.price} />) : '';

        return (
            <div className="shop">
                <div className="shop__filters">
                    <button className="filters__toggle" onClick={() => this.setState({ toggle: !this.state.toggle })}>Filters</button>
                    <div className="filters__anchor">
                        <div className={`filters__dropdown ${this.state.toggle ? "" : 'hidden'}`}>
                            {filters}
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