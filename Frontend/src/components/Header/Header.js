import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider';

function Header() {
    const [state] = useStateValue();

    const toggleMenu = () => {
        let x = document.getElementById("header");
        if (x.className === "header") {
            x.className += " responsive";
        } else {
            x.className = "header";
        }
    }

    return (
        <nav id="header" className="header">
            <div className="header__links">
                <Link to="/">Home</Link>
                <Link to="/checkout">Basket ({state.basket?.length})</Link>
                {
                    state.user ? <Link to="/sign-in">Logout</Link> : <Link to="/sign-in">Sign in</Link>
                }
            </div>
            <div className="header__search">
                <input type="text" placeholder="Search..." />
                <button className="header__menuButton" onClick={toggleMenu}>Menu</button>
            </div>
        </nav>
    );
}

export default Header;