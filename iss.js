const request = require('request');

const fetchMyIP = function(callback) {
  
  request(`https://api.ipify.org?format=json`, (error, response, body) => {
    console.log(response.statusCode);
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
     
    const data = JSON.parse(body);
    callback(null, data.ip);
    
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
    console.log(response.statusCode);
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    }
      
    const {lat, lon} = JSON.parse(body);
    callback(null, {lat, lon});
   
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.lat}&lon=${coords.lon}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    }
      
    const response1 = JSON.parse(body).response;
    callback(null, response1);
    
  
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };