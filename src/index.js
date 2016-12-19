import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';



/*
	Routes

	We import our routes we declared in routes/routes.js
*/

import routes from './routes/routes.js';



// Render the main component into the dom
ReactDOM.render( routes , document.getElementById('app'));
