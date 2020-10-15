import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import Header from '../Header/Header';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import Checkout from '../Checkout/Checkout';
import SignForm from '../SignForm/SignForm';
import AdminView from '../AdminView/AdminView';
import Shop from '../Shop/Shop';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path='/checkout'>
            <Header />
            <Checkout />
            <Footer />
          </Route>
          <Route path="/sign-in">
            <SignForm />
            <Footer />
          </Route>
          <Route path="/admin">
            <AdminView />
          </Route>
          <Route path="/shop">
            <Header />
            <Shop />
            <Footer />
          </Route>
          <Route path="/product/:id">
            <Header />
            <Shop />
            <Footer />
          </Route>
          <Route path="/">
            <Header />
            <Home />
            <Footer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
