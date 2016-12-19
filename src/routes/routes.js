import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory} from 'react-router';



/*
		Components

*/

import Main from '../components/Main.js';

var routes = ( 
		<Router history={browserHistory}>
			<Route path='/' component={Main} />

		</Router>


	);

export default routes;