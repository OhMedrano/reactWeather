'use strict'

require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import { Link } from 'react-router';
import http from 'http';
import axios from 'axios';


class MadeList extends React.Component {
	render() {
		
		var listArray = [{'name':'Home','key':'/'},{'name':'About','key':'about'}];
		var listList = listArray.map(function(num){
						return (
							<Link id='singList'
							className='col-md-4 col-lg-4 col-xs-12 col-sm-12'to={num.key}>{num.name}</Link>
							)
					})

		return (
			<div id='listMain'className='col-md-12 col-lg-12 col-sm-12 col-xs-12'> 
				{listList}
			</div>
		)
	}
}




class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		
		this.state = {
			value: '',
			localLat:'',
			localLon:''
		};

	}

	
	handleChange(e){
		this.setState({value: e.target.value});
		console.log('This handle change has happened');
	}
	

	componentWillMount(){
		let lon;
		let lat;
		var self = this;

		let date = new Date(); 
		/*

			Doing a couple of things here.


			First, we're checking if the browser supports localStorage, 

			most do, but some turn it off. 

			If it does accept localStorage, then we're going to check if

			the key localLat is in its storage banks.




		*/

		if(localStorage){
			if(localStorage.getItem('localLat')){
				
				/*
					If we find the key called localLat, then we'll update the values

					with the one in the localStorage. 

					But what if the location data is old? 

				*/

				console.log(date.getMinutes());	

				if(date.getMinutes()%10 === 0 ){
					console.log('updated the location');

					if(window.navigator && window.navigator.geolocation){
						window.navigator.geolocation.getCurrentPosition(function(position){
							console.log('updating the location right now');
							
							localStorage.setItem('localLat',parseFloat(position.coords.latitude).toFixed(2));
							localStorage.setItem('localLon',parseFloat(position.coords.longitude).toFixed(2));
						

							lon = localStorage.getItem('localLon');
							lat = localStorage.getItem('localLat');

					
							setInterval(function(){
								self.setState({
									localLat: lat,
									localLon: lon
								}).bind(self);

								},1000);


							});
						}

				} else {
					console.log('didn"t update');

					lon = localStorage.getItem('localLon');
					lat = localStorage.getItem('localLat');

					
					setInterval(function(){
							self.setState({
								localLat: lat,
								localLon: lon
							}).bind(self);

						},1000);
				}


				console.log('Got the local storage data!');
			} else {
				if(window.navigator && window.navigator.geolocation){
					window.navigator.geolocation.getCurrentPosition(function(position){
						console.log(position);
						
						localStorage.setItem('localLat',parseFloat(position.coords.latitude).toFixed(2));
						localStorage.setItem('localLon',parseFloat(position.coords.longitude).toFixed(2));



						localStorage.setItem('lastDate',new Date());
						

						lon = parseFloat(position.coords.longitude).toFixed(2);
						lat = parseFloat(position.coords.latitude).toFixed(2);

						/*
							This area below is a trouble spot.

							If I used this.setState({}), it won't work

							but if I use self.setState({}), it works.


							Gotta research this later. 
							
						*/

						setInterval(function(){
							self.setState({
								localLat: lat,
								localLon: lon
							}).bind(self);

						},1000);

					})
				}
			}
		} 
	}


	render(){
		const value = this.state.value;
		const locLat = this.state.localLat;
		return(

			<fieldset>
				<legend>Enter something here </legend>
				<input 
					value={value}
					onChange={this.handleChange} />

				{locLat}
				{this.state.value}

			</fieldset>
			)
	}
}


AppComponent.defaultProps = {
};

export default AppComponent;
