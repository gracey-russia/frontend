import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { MyApp } from './app/App';
import {BrowserRouter, HashRouter} from 'react-router-dom';
import 'antd/dist/reset.css';
import { ConfigProvider, theme } from 'antd';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
  <React.StrictMode>
    <HashRouter>
      <ConfigProvider theme={{
      token: {
        colorPrimary: '#2E418E',

        // colorBgContainer: '#EDF3FF',
      },
    }}>
            <MyApp />
      </ConfigProvider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
