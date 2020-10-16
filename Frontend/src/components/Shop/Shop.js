import React from 'react';
import './Shop.css';
import Product from './components/Product';
import { StateContext } from '../StateProvider';
import Filter from './components/Filter';

class Shop extends React.Component {
    constructor(props) {
        super(props);

        this.state = { products: [], filters: [], toggle: false };

        this.updateProducts = this.updateProducts.bind(this);

        this.requestProducts = this.requestProducts.bind(this);
    }

    static contextType = StateContext;

    componentDidMount() {
        this.requestProducts();
    }

    requestProducts() {
        const conditions = this.context[0].filters.map(e => `${Object.keys(e)[0]}=${Object.values(e)[0]}`);

        let url = 'http://localhost:8000/api/products?';

        /*conditions.forEach(e => {
            url += e + '&';
        });*/

        if (this.state.filters.length > 0) {
            //console.log(this.state.filters);
            this.state.filters.forEach(e => {
                url += `${Object.keys(e)[0]}=${Object.values(e)[0]}`;

                this.state.filters.forEach(el => {
                    if (Object.keys(el)[0] === Object.keys(e)[0]) {
                        url += Object.values(el)[0]
                    }
                });

                url += '&';
                //console.log(e);
            });
        }

        url = url.substring(0, url.length - 1);

        console.log(url);

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            if (!data.error) {
                this.setState({ products: data })
            } else {
                this.setState({ products: [] })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    updateProducts(filter) {
        //console.log(this.state.filters.concat([filter]));
        this.setState({ filters: this.state.filters.concat([filter]) }, () => {
            //console.log(this.state.filters);

            this.requestProducts();
        });
    }

    render() {
        const productsList = this.state.products ? this.state.products.map(e => <Product key={e.id} imageUrl={`${this.context[0].baseUrl}product${e.id}.png`} name={e.name} price={e.price} />) : '';

        return (
            <div className="shop">
                <div className="shop__filters">
                    <button className="filters__toggle" onClick={() => this.setState({ toggle: !this.state.toggle })}>Filters</button>
                    <div className="filters__anchor">
                        <div className={`filters__dropdown ${this.state.toggle ? "" : 'hidden'}`}>
                            <Filter callback={this.updateProducts} title="brand" options={['nike', 'us polo', 'zara', 'h&m', 'teodor']} />
                            <Filter callback={this.updateProducts} title="material" options={['nike', 'us polo', 'zara', 'h&m', 'teodor']} />
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