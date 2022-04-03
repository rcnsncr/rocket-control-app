const fetch = require('node-fetch');

var weather = {};
var rocketList = [];

var setWeather = (data) => {
    weather = data;
}

var getWeather = () => {
    return weather;
}

var fetchWeather = async () =>  {
    try {
        const response = await fetch('http://localhost:5000/weather', { 
            method: 'GET',
            mode: 'cors',
            headers: new fetch.Headers({
                'X-API-Key': 'API_KEY_1',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        })
        .then(response => {return response.json()})
        .then(data => {
            if (data.hasOwnProperty("code") && data.code !== 200) {
                console.log("Weather error!!!");
                console.dir(data.message);
                setWeather(weather);
            } else {
                console.log("Weather ok!!!");
                setWeather(data);
            }
        });
    } catch (error) {
        console.log("error", error);
        setWeather(weather);
    }
    return getWeather();
}

var setRockets = (data) => {
    rocketList = data;
}

var getRockets = () => {
    return rocketList;
}

var fetchRockets = async () =>  {
    try {
        const response = await fetch('http://localhost:5000/rockets', { 
            method: 'GET',
            mode: 'cors',
            headers: new fetch.Headers({
                'X-API-Key': 'API_KEY_1',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
        })
        .then(response => {return response.json()})
        .then(data => {
            if (data.hasOwnProperty("code") && data.code !== 200) {
                console.log("Rockets error!!!");
                console.dir(data.message);
                setRockets(rocketList);
            } else {
                console.log("Rockets ok!!!");
                setRockets(data);
            }
        });
    } catch (error) {
        console.log("error", error);
        setRockets(rocketList);
    }
    return getRockets();
}

const launchRocket = (rocket) => {
    const { id, status } = rocket;
    console.dir(rocket);
    if (status !== "launched") {
      fetchRocketAction(id,'launched','PUT', rocket.port, rocket.host);
    } else {
      alert("rocket " + id + "'s condition is unsuitable");
      console.log("rocket " + id + "'s condition is unsuitable");
    }
}

const deployRocket = (rocket) => {
    const { id, status } = rocket;
    if (status !== "deployed") {
      fetchRocketAction(id,'deployed','PUT', rocket.port, rocket.host);
    } else {
      alert("rocket " + id + "'s condition is unsuitable");
      console.log("rocket " + id + "'s condition is unsuitable");
    }
}

const cancelRocket = (rocket) => {
    const { id, status } = rocket;
    if (status !== "cancelled") {
      fetchRocketAction(id,'launched','DELETE', rocket.port, rocket.host);
    } else {
      alert("rocket " + id + "'s condition is unsuitable");
      console.log("rocket " + id + "'s condition is unsuitable");
    }
}

async function fetchRocketAction(id,action,method, port, host) {
    try {
      const response = await fetch('http://localhost:5000/rocket/'+id+'/status/'+action, { 
        method: method,
        mode: 'cors',
        headers: new fetch.Headers({
          'X-API-Key': 'API_KEY_1',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response.hasOwnProperty("code") && response.code !== 200) {
          alert(response.message);
          console.dir(response.message);
        }
      });
    } catch (error) {
      alert("ERROR: rocket " + id + " / " + error);
      console.log("ERROR: rocket " + id + " / " + error);
    }
}

module.exports = {
    fetchWeather,
    fetchRockets,
    launchRocket,
    deployRocket,
    cancelRocket
}
