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

				console.log(date.getMinutes());	/* This will show the minutes into the console  */

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

	componentDidMount(){

			/*
				Here we are going to call the data from the open weather api. 

				I am going to call this using straight javascript. 

				There are other methods but straight javascript needs to

				be done, so you guys can see how it's done. 


				...Malik, if you're reading this. 


							I hate you. :|



			
				We'll make the const lon and lat, and have their values

				be whatever is in the localStorage. 

				I should do it by checking the this.state but for some reason,

				it's acting weird. 

			*/

		const lon = localStorage.getItem('localLon');
		const lat = localStorage.getItem('localLat');


		console.log('Here in the componentDidMount()');

		console.log(lon,lat);


		
		/*
			Javascript has had their own version of a http request for a while.

			The annoying thing is that you kinda have to manually set it up...

			Since a lot of people ignore this, thats where the other frameworks

			came up and helped reduce the amount of code. 



			Jquery has AJAX, Angular has its $http module, and React has a couple

			that you have to install through NPM. 



			One thing I have heard is a performance. If you're using another library

			to request your data, then what it's doing is first looking at the methods,

			then it searches through its library for that method. Then configures the

			Http request, then it finally gets the data.


			If we do vanilla (bare-bone, no library/framework) javascript, we reduce 

			the amount of time our code to go through to get the data since we are 

			already configuring the request to our liking.  


			Since this is vanilla Javascript, we're going to be using

			Javascript's XMLHttpRequest API.

		*/


		const xhr = new XMLHttpRequest();
		const api = '9bfc480cf5eba264ab04e7d23c97110b';


		/*
			I am opening up a new request using the XML.

			I  shorten it to xhr, so I don't have to keep typing XMLblahblah for

			every time I need to do something with a http request.


			So what this function below is saying, is...

			xhr.open(GET or POST,'URL',ASYNC);

			GET and POST are something essential to learn about when calling in 

			data from a server. 


			GET is Getting the data, which also leaves your parameters exposed on

			your URL. This is why you're able to send someone a link to a 

			particular location in google maps... The data is being transfered in the 

			URL. 


			POST is different. POST, is your Posting your data. This is useful when

			you're dealing with a CRUD (Create, Remove, Update, Delete) app aka blogs.

			The data will be transfered not through the url, A good example of this is

			Gmail. You can't really link someone to your email just by copy and pasting 

			your current URL. It won't work. 



			The URL portion is the API url. This is where we are using our GET to get our data.

			However, I changed the url to add the longitude and latitude values, giving us the

			local weather data. It's also going to give back the units in the metric system. 


			I'll make a function that converts celisus to farenheit (... Yeah, it's like 3 am,

			I'm not going to take the extra time to spell check that...). 



			The ASYNC part, stands for asynctronization. I suggest you coming up to me on 

			face book and asking me about it, but if you don't have the time.... 


			It keeps your code flowing while keeping tabs on other stuff. 

			Like lets say you're at home, taking care of your kid, Malik. 

			And you want a beer from the fridge, however you cannot get to the fridge. (Starting HTTP request)

			So your ask your wife like "Yo, babe, Can you get me a beer from the fridge?", (Asking for the data)

			And she's like "Yeah sure." because she knows the baby has you pinned.  (Http Status 200 aka ALRIGHT WE'RE IN BUSINESS),

			But during this time, you're texting me and being all like "Yeah, you know Oscar you suck because you're so awesome." (Doing a function while waiting for the data)

			Then she brings you the beer (Data received).


			You're waiting for the beer (Async http get function), but you're still able to text me (Continue code process while waiting for the data).


			You can also expand on this by the use of promises. 

			Promises are like "Hold on, let me check for you real quick" when you're at the store and asking the guy

			if they got that thing in stock. 


			Javascript (RIGHT NOW AS OF 12/18) doesn't have a native Promise api (That I know of), but do check it out.


			



			
		*/
		xhr.open('GET','api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&APPID='+api, true);


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
