'use strict';

import { React, Component } from 'react';
import { Link } from 'react-router';

/*
	Here up top, we're extracting the Link tool from React-Router.

	This allows us to deal with linking different parts of our app or webpage

	together. 

	We can use <a href> tags but this is react's way.
	
*/

require('styles//Navmenu.scss');



/*
	Template for links later.

	{"name":"","web":"/"}

*/


class NavLink extends React.Component {
	render(){
		var links = [['/','Home'],['about','About']];	



		return (

				<div>   {links[1][0]} </div>



			)
	}
}


class NavMenu extends React.Component {
  render() {




    return (
      <div id='something'className="col-md-12 col-lg-12 col-xs-12 col-sm-12">
         <NavLink />
      </div>
    );
  }
}

NavMenu.displayName = 'NavmenuComponent';

// Uncomment properties you need
// NavmenuComponent.propTypes = {};
// NavmenuComponent.defaultProps = {};

export default NavMenu;
