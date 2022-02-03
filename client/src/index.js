import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { UserContextWrapper } from "./components/contexts/UserContext";
import { FormContextWrapper } from "./components/contexts/FormContext";
import { EditContextWrapper } from "./components/contexts/EditContext";


ReactDOM.render((
<UserContextWrapper>
    <FormContextWrapper>
        
        <EditContextWrapper>
            <BrowserRouter basename="/">
                <App />
            </BrowserRouter>      
        </EditContextWrapper>

    </FormContextWrapper>
</UserContextWrapper>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
