import React from 'react';
import { AppRoutes } from './AppRoutes';
import { Helmet } from 'react-helmet';
import { App } from 'antd';
export function MyApp() {
  return (
    <App>
      <Helmet title={'Press-release analyzer'}>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Helmet>
      <AppRoutes />
    </App>
  );
}