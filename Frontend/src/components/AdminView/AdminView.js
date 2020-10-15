import React, { useState, setState } from 'react';
import './AdminView.css';
import { useStateValue } from '../StateProvider';
import CategoryPost from './components/CategoryPost';

function AdminView() {
    const [state, dispatch] = useStateValue();

    const [view, setView] = useState('');

    const submited = () => {
        setView('');
    }

    const switchComponent = () => {
        switch (view) {
            case "":
                return ''
            case "CategoryPost":
                return <CategoryPost baseUrl={state.baseUrl} token={state.user.accessToken} callback={submited} />
            default: break;
        }
    }

    return (
        <div className="admin">
            <div className="admin__optionsContainer">
                <div className="admin__options">
                    <div className="admin__optionsTitle">Menu</div>
                    <button className="admin__option active" onClick={e => setView('CategoryPost')}>Add Category</button>
                    <button className="admin__option" onClick={e => setView('')} > Add Product</button>
                </div>
            </div >
            <div className="admin__formContainer">
                {switchComponent()}
            </div>
        </div >
    );
}

export default AdminView;