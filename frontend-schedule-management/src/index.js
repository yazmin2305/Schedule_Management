import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('ORg4AjUWIQA/Gnt2VVhkQlFadVdJX3xLekx0RWFab19yfldPal1ZVBYiSV9jS31Td0dmWH1bc3BWRmZYWA==');
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <App />
    
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
