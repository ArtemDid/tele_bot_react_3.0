import React from 'react';
import { Provider } from 'react-redux'
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Registration from './components/Registration'
import Authorization from './components/Authorization';
import ShowUsers from './components/ShowUsers';
import store from './store/store';
import ShowPage from './components/ShowPage';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Authorization} />
                    <Route path="/showpage" component={ShowPage} />
                    <Route path="/showusers" component={ShowUsers} />
                    <Route path="/registration" component={Registration} />
                </Switch>
            </BrowserRouter>
        </Provider>
    );
}

export default App;