import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import { HomePage } from './containers/HomePage';
import { NotFoundPage } from './containers/NotFound';

// Lazily load routes and code split with webpack
// const LazyCounterPage = React.lazy(() =>
//   import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
// );

// const CounterPage = (props: Record<string, any>) => (
//   <React.Suspense fallback={<h1>Loading...</h1>}>
//     <LazyCounterPage {...props} />
//   </React.Suspense>
// );

export const Routes = () => {
  return (
    <Switch>
      <Route path={routes.HOME} component={HomePage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};
