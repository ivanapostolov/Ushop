import React from 'react';
import './AdminView.css';
import CategoryPost from './components/CategoryPost';
import OrdersView from './components/Orders/OrdersView';
import { StateContext } from '../StateProvider';

class AdminView extends React.Component {
    constructor(props) {
        super(props);

        this.state = { view: '' };

        this.switchView = this.switchView.bind(this);

        this.submited = this.submited.bind(this);
    }

    static contextType = StateContext;

    submited() {
        this.setState({ view: '' });
    }

    switchView() {
        const state = this.context[0];

        switch (this.state.view) {
            case "":
                return ''
            case "CategoryPost":
                return <CategoryPost baseUrl={state.baseUrl} token={state.user.accessToken} callback={this.submited} />
            case "Orders":
                return <OrdersView />
            default: break;
        }
    }

    render() {
        return (
            <div className="admin">
                <div className="admin__optionsContainer">
                    <div className="admin__options">
                        <div className="admin__optionsTitle">Menu</div>
                        <button className="admin__option" onClick={e => this.setState({ view: 'Orders' })}>Orders</button>
                        <button className="admin__option active" onClick={e => this.setState({ view: 'CategoryPost' })}>Add Category</button>
                        <button className="admin__option" onClick={e => this.setState({ view: '' })} > Add Product</button>
                    </div>
                </div >
                <div className="admin__formContainer">
                    {this.switchView()}
                </div>
            </div >
        );
    }
}

export default AdminView;