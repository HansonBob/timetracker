var timetracker = timetracker || {};
timetracker.queue = new Array();

timetracker.createTracker = function() {
  timetracker.getTrackerQueue();

  var newTrack = {
    "id" : timetracker.queue.length,
    "time" : 0,
    "content" : ""
  };

  timetracker.queue[newTrack["id"]] = newTrack;
  timetracker.saveTracker(newTrack["id"]);
};

timetracker.startTracker = function(id) {

};

timetracker.stopTracker = function(id) {
  
};

timetracker.saveTracker = function(id) {
  var contents = timetracker.queue[id] || {};

  if (timetracker.config.savetype === "localStorage") {
    var contentsString = timetracker.config.saveformatContent;
    
    contentsString = contentsString.replace("%id%", id);
    contentsString = contentsString.replace("%time%", contents["time"]);
    contentsString = contentsString.replace("%content%", contents["content"]);

    localStorage.setItem(
      timetracker.config.saveformatKey+""+id,
      contentsString
    );
  }
};

timetracker.removeTracker = function(id) {
  if (timetracker.config.savetype === "localStorage") {
    localStorage.removeItem(timetracker.config.saveformatKey+""+id);
  }

  if (typeof timetracker.queue[id]!="undefined") {
    delete(timetracker.queue[id]);
  }
};

timetracker.updateTracker = function(id) {
  
};

timetracker.getTrackerQueue = function() {
  if (timetracker.config.savetype === "localStorage") {
    var saveformatContent = timetracker.config.saveformatContent;
    var items = localStorage;

    var idIndex = saveformatContent.indexOf("%id%");
    var timeIndex = saveformatContent.indexOf("%time%");
    var contentIndex = saveformatContent.indexOf("%content%");
    var indexesArray = new Array(idIndex, timeIndex, contentIndex);
    indexesArray.sort(function(a, b) {
      return parseInt(a) - parseInt(b);
    });

    for (var i in localStorage) {
      var checkSavedKey = i.indexOf(timetracker.config.saveformatKey);

      if (checkSavedKey!=-1) {
        var savedArray = localStorage[i].split(";");
        var savedEntry = {};

        for (var k=0; k<indexesArray.length; k++) {
          if (indexesArray[k] === idIndex) {
            savedEntry["id"] = savedArray[k];
          }

          if (indexesArray[k] === timeIndex) {
            savedEntry["time"] = savedArray[k];
          }

          if (indexesArray[k] === contentIndex) {
            savedEntry["content"] = savedArray[k];
          }
        }

        timetracker.queue[savedEntry["id"]] = savedEntry;
      }
    }
  }
};

timetracker.removeTrackerContent = function(id) {

};

timetracker.getTrackerContent = function(id) {
  if (typeof timetracker.queue[id]!="undefined") {
    return timetracker.queue[id];
  }
  return false;
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
