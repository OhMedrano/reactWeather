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

	
					We'll want to update that right? 

					So we'll use the "date" variable declared above at 

					line 59, and compare the minutes. 



				*/

				console.log(date.getMinutes());	

				/*
					If the minutes are divisible by 10 is what this

					if statement is declaring. 

				*/
				if(date.getMinutes()%10 === 0 ){
					console.log('updated the location');

						/*
							Next we're going to check if the browser 

							supports geolocation, if it does then we'll update it.



							NOTE: Planning to clean this up. Too much repeatable code.

							Can make a simple function for this. 

						*/

					if(window.navigator && window.navigator.geolocation){
						window.navigator.geolocation.getCurrentPosition(function(position){
							console.log('updating the location right now');
							
							/*
								If geolocation is active,

								then we'll get the location date which is now stored in the 

								variable called "position". 


								If you console.log(position), you'll see all the data it contains. 



							*/

							localStorage.setItem('localLat',parseFloat(position.coords.latitude).toFixed(2));
							localStorage.setItem('localLon',parseFloat(position.coords.longitude).toFixed(2));
							
							/*
								Here we are storing the position coordinate data,

								particularly the latitude and longitude. 


								However, you can see I added a parseFloat() on there,.

								The reason for that is, when you're calling that data, 

								it will be coming back into a string. 


								That's cool and all, but I want to manipulate it before 

								it gets stored into the localStorage. 


								Hence the parseFloat. It changes the data from a string to

								a floating point number aka a number with a decimal point. 

								From there, added the toFixed() method, so that way instead of

								getting something like 12.3456789. I can call in the toFixed(2), 

								and transform the data to 12.34 . 


								This distinction is vital for the usage of the openweather API, 

								it only accepts values up to the hundredth's (hundredths?) place. 




							*/

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

					/*
						If the minutes weren't disivible by 10, 

						then we'll just use the value in the localStorage.

					*/

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

				/*

					This part is the same as above except 

					this is what triggers when it doesn't find anything

					in localStorage's databank.


					NOTE: I will be planning to refactor this and change this into 

					function that I can call. 

				*/

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

	compoentDidMount(){

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
