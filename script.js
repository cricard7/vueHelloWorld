//use the Autocomplete plugin

Vue.use(VAutocomplete);


// global component define before the Vue instance below



Vue.component('global-component', {
	template: '<div class="component">My global component</div>'

})


// global components that are nested and send info to eachother


Vue.component('med-list', {
	template: '<div class="component"><h5>Med List</h5><med-list-item v-for="med in meds" :med = "med" :key="med.ID"></med-list-item></div>',
	props: ['meds']
})


Vue.component('med-list-item',{
	template: '<div class="component">ID: {{med.ID}} TITLE: {{med.title}} STATUS: {{med.status}} CRITERIA: {{med.criteria}} <ul> <li v-for="ds in med.DSG">{{ds}} </li> </ul> <br> <img :src=med.img> <br> <ul> <p> seach terms </p> <li v-for="st in med.searchTerms">{{st}} </li> </ul></div>',
  props: ['med']
})

// local component definition that is referenced in the Components property of myApp below.

var localComponent = {
	template: '<div class="component" @click="addClick"> a local component. randomID: {{ID}} <br>Clicks: {{clicks}}<global-component></global-component> </div>',
	// data in a component looks a bit different than in a new Vue. Data is a function that returns an object containing the properties that can then be referenced in the template
	data: function () {

		return {

			ID: Math.random(),
			clicks: 0

		}

	},
	methods: {
		addClick: function () {

			this.clicks += 1;
		}
	}
}

// a local component with props that are passed into it

var localPropComp = {
	template: '<div class="component"><h2>{{title}}</h2></div>',
	props: ['title']
	// the props key tells view the name of the props to expect which are passed into the HTML template when calling the component

}



var myApp = new Vue({

	el: '#vueApp',
	data: {
		msg: "hello!",
		items: [
			'thing one',
			'thing two',
			'thing three'
		],
		multiItems: [
			{
				name: 'iron',
				cost: 45

			},
			{
				name: 'gold',
				cost: 655
			},
			{
				name: 'platinum',
				cost: 500000
			}

		],
		testURL: "https://www.lynda.com/MyPlaylist/Watch/11647436/594471?autoplay=true",
		textEntry: 'default text',
		selected: ["Three"],
		dynItems: ["four", "five", "sixseven"],
		selectedDynItems: [],
		loopObjArray: [
			{
				name: "one",
				type: "blue"
			},
			{
				name: "two",
				type: "green"
			},
			{
				name: "three",
				type: "red"
			}
		],
		eventMsg: "Hi, waiting for click",
		inputEvent: "",
		isHot: true,
		scrAge: 0,
		scrHt: 0,
		scrWt: 0,
		scr: 0,
		sex: "",
		AUC: 0,
		//watchers
		gifSearch: "",
		gifs: [],
		// populated from the created lifecycle hook by ajax call
		medInfo: []
	},

	// created lifecycle hook gets called automatically (as do the other lifecycle hooks)

	created: function () {

		console.log("created called");
		//load json from local file someMeds.txt

		$.getJSON("someMeds.txt")
			.done(function (data) {
				
				myApp.medInfo = data;
				myApp.addSearchTerms(data);
				
			})
			.fail(function () {

				//console.log("something when wrong");
			})
			.always(function () {
				// console.log("This is always run")
			});


	},

	// this is how you define methods

	methods: {
		greeting: function (name, event) {
			this.eventMsg = "ClickED";
			console.log(event);
			console.log(name);
		},
		
		addSearchTerms: function(data){
			
			data.forEach(function (item){
				
				//create new prop called searchTerms
				item.searchTerms = [];
				//append dsg array to it
				Array.prototype.push.apply(item.searchTerms, item.DSG);
				//append status to it
				item.searchTerms.push(item.status);
				//append title
				
				//append id
				
			})
			
			console.log(data);
		}
	},

	// this is how you define computed properties

	computed: {

		CrClABW: function () {

			if (this.sex === "male") {
				var CrClABW = ((this.scrAge) * 1.23 * this.scrWt) / this.scr

			}

			if (this.sex === "female") {
				var CrClABW = ((this.scrAge) * 1.04 * this.scrWt) / this.scr
			}

			return CrClABW;
		},

		CrClIBW: function () {

			if (this.sex === "male") {
				var CrClIBW = ((this.scrAge) * 1.23 * this.idealWt) / this.scr

			}

			if (this.sex === "female") {
				var CrClIBW = ((this.scrAge) * 1.04 * this.idealWt) / this.scr
			}

			return CrClIBW;
		},

		carboIBW: function () {

			return ((this.CrClIBW + 25) * this.AUC)

		},
		carboABW: function () {

			return ((this.CrClABW + 25) * this.AUC)

		},

		idealWt: function () {

			if (this.sex === "male") {
				var ibw = 50 + (0.91 * (this.scrHt - 152.4))

			}

			if (this.sex === "female") {
				var ibw = 45.5 + (0.91 * (this.scrHt - 152.4))
			}

			return ibw;
		}

	},

	// watch can be used to watch the values of properties and run code each time the value changes. The key in watch should be the same name as properties in data that we want to watch. In this case watch the value of gifSearch and can use the value to perform an AJAX call to giffyAPI
	// if you type for "cats" then an api call will be made
	watch: {

		gifSearch: function (newValue) {
			// newValue is the current value of gifSeach which can be tested

			if (newValue === "cats") {
				var urlStart = "http://api.giphy.com/v1/gifs/search?q=";
				var urlTerm = "cats";
				var urlEnd = "&api_key=5eef3fae736c4009a3ac22311187cd3f";


				var url = urlStart + urlTerm + urlEnd;


				//ajax call
				var giphyAJAXCall = new XMLHttpRequest();
				giphyAJAXCall.open('GET', url);
				giphyAJAXCall.send();

				giphyAJAXCall.addEventListener('load', function (data) {

					//do something with the data
					var gifData = data.target.response;

					console.log(gifData);


					var response = JSON.parse(gifData);
					var imageURLs = response.data;

					// loop through all URLs and add them to gif property

					imageURLs.forEach(function (image) {
						var src = image.images.fixed_height.url;

						myApp.gifs.push(src);

					})


				});

			} else if (newValue !== "cats") {

				myApp.gifs = []

			}

		}

	},

	// local components defined before myApp vue instance
	components: {
		'local-component': localComponent,
		'prop-component': localPropComp
	}

})
