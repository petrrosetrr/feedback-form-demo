import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import 'the-new-css-reset/css/reset.css';
import 'semantic-ui-css/semantic.min.css'
import './index.scss';

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);
