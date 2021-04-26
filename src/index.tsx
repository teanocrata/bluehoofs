import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './containers/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import '@rmwc/chip/styles';
import '@rmwc/top-app-bar/styles';
import '@rmwc/snackbar/styles';
import '@rmwc/icon-button/styles';
import '@rmwc/button/styles';
import '@rmwc/list/styles';
import '@rmwc/fab/styles';
import '@rmwc/typography/styles';
import '@rmwc/card/styles';
import '@rmwc/drawer/styles';
import '@rmwc/avatar/styles';

import { RMWCProvider } from '@rmwc/provider';

ReactDOM.render(
	<RMWCProvider>
		<App />
	</RMWCProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
