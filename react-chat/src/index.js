import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "mobx-react";
import Store from "./store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider {...Store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>
);
