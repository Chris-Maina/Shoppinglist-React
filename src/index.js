import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NavRoutes from './components/routes';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<NavRoutes/>, document.getElementById('root'));
registerServiceWorker();
