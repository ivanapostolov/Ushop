import React from 'react';
import './Shop.css';
import Product from './components/Product';
import { StateContext } from '../StateProvider';

class Shop extends React.Component {
    constructor(props) {
        super(props);

        this.state = { products: [] };
    }

    static contextType = StateContext;

    componentDidMount() {
        this.requestProducts();
    }

    requestProducts() {
        const conditions = this.context[0].filters.map(e => `${Object.keys(e)[0]}=${Object.values(e)[0]}`);

        let url = 'http://localhost:8000/api/products?';

        console.log(url);

        conditions.forEach(e => {
            url += e;
        });

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            console.log(data);
            this.setState({ products: data })
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const productsList = this.state.products.map(e => <Product key={e.id} imageUrl={`${this.context[0].baseUrl}product${e.id}.png`} name={e.name} price={e.price} />)
        return (
            <div className="shop">
                <div className="shop__filter">
                    <div className="filter__list">
                        <div className="filter__button">Color</div>
                        <div className="filter__button">Size</div>
                        <div className="filter__button">Brand</div>
                        <div className="filter__button">Gender</div>
                        <div className="filter__button">Material</div>
                        <div className="filter__button">Color</div>
                        <div className="filter__button">Size</div>
                        <div className="filter__button">Brand</div>
                        <div className="filter__button">Gender</div>
                        <div className="filter__button">Material</div>
                    </div>
                    <div className="filter__options">
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
                        </div>
                        <div className="filter__option">
                            <input type="checkbox" name="male" text="Male" />
                            <laber for="male">Male</laber>
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