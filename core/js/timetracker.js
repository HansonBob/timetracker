var timetracker = timetracker || {};
timetracker.queue = new Array();

timetracker.createTracker = function() {
  timetracker.queue = timetracker.getTrackerQueue;

  var newTrack = {
    "id" : timetracker.queue.length,
    "time" : 0,
    "content" : ""
  };

  timetracker.queue[timetracker.queue.length] = newTrack;
};

timetracker.startTracker = function(id) {

};

timetracker.stopTracker = function(id) {
  
};

timetracker.saveTracker = function(id) {
  var timestamp = timetracker.getCurrentTimestamp();
  var content = timetracker.getTrackerContent(id);
  
  var newEntry = {
    "id" : id,
    "timestamp" : timestamp,
    "content" : content
  };

  timetracker.queue.push(newEntry);
};

timetracker.removeTracker = function(id) {
  
};

timetracker.updateTracker = function(id) {
  
};

timetracker.getTrackerQueue = function() {
  if (timetracker.config.savetype === "localStorage") {
    var saveformat = timetracker.config.saveformat;
    var items = localStorage;

    var trackerIndex = saveformat.indexOf("timetracker");
    var idIndex = saveformat.indexOf("%id%");
    var timeIndex = saveformat.indexOf("%time%");
    var contentIndex = saveformat.indexOf("%content%");

    for (var i in localStorage) {
      var checkSavedValue = localStorage[i].substring(trackerIndex, 11);

      if (checkSavedValue==="timetracker") {
        var savedEntry = {
          "id" : localStorage[i].substring(idIndex, 4),
          "time" : localStorage[i].substring(timeIndex, 6),
          "content" : localStorage[i].substring(contentIndex, 9)
        };

        timetracker.queue.push(savedEntry);
      }
    }
  }
};

timetracker.saveTrackerContent = function(id) {

};

timetracker.removeTrackerContent = function(id) {

};

timetracker.getTrackerContent = function(id) {

};

timetracker.getCurrentTimestamp = function() {
  var timestamp = 0;
  var d = new Date();

  timestamp = d.getTime();

  return timestamp;
};

timetracker.getTimestampInSeconds = function(timestamp) {
  if (typeof timestamp!=="undefined") {
    return Math.ceil(timestamp/1000);
  }
}

timetracker.getContainer = function() {
  if (typeof timetracker.config.containerId!=="undefined" && timetracker.config.containerId!=="") {
    return document.getElementById(timetracker.config.containerId);
  }
}