import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import api from "./utils/api";
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById(api.getAppContainerId()));
registerServiceWorker();
