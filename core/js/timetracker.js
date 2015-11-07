timetracker.queue = new Array();
timetracker.timers = {};

timetracker.createTracker = function() {
  timetracker.getTrackerQueue();

  var newTrack = {
    "id" : timetracker.queue.length,
    "timestart" : 0,
    "timeend" : 0,
    "content" : ""
  };

  timetracker.queue[newTrack["id"]] = newTrack;
  timetracker.saveTracker(newTrack["id"]);
};

timetracker.startTracker = function(id, element) {
  if (timetracker.queue[id].timestart!=0 && timetracker.queue[id].timeend!=0) {
    timetracker.queue[id].timestart = timetracker.getCurrentTimestamp()-(timetracker.queue[id].timeend-timetracker.queue[id].timestart);
  } else {
    timetracker.queue[id].timestart = timetracker.getCurrentTimestamp();
  }

  timetracker.queue[id].timeend = 1;
  if (typeof element!="undefined") {
    timetracker.showTimer(id, element);
  }
  timetracker.saveTracker(id);
};

timetracker.stopTracker = function(id) {
  if (timetracker.queue[id].timeend==0 || timetracker.queue[id].timeend==1) {
    timetracker.queue[id].timeend = timetracker.getCurrentTimestamp();
    timetracker.saveTracker(id);

    if (typeof timetracker.timers[id]!=="undefined") {
      window.clearTimeout(timetracker.timers[id]);
    }
  }
};

timetracker.saveTracker = function(id) {
  var contents = timetracker.queue[id] || {};

  if (timetracker.config.savetype === "localStorage") {
    var contentsString = timetracker.config.saveformatContent;
    
    contentsString = contentsString.replace("%id%", id);
    contentsString = contentsString.replace("%timestart%", contents["timestart"]);
    contentsString = contentsString.replace("%timeend%", contents["timeend"]);
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
    timetracker.queue = timetracker.queue.splice(timetracker.queue[id], 1);
  }
};

timetracker.updateTracker = function(id) {
  
};

timetracker.getTrackerQueue = function() {
  if (timetracker.config.savetype === "localStorage") {
    var saveformatContent = timetracker.config.saveformatContent;
    var items = localStorage;

    var idIndex = saveformatContent.indexOf("%id%");
    var timestartIndex = saveformatContent.indexOf("%timestart%");
    var timeendIndex = saveformatContent.indexOf("%timeend%");
    var contentIndex = saveformatContent.indexOf("%content%");
    var indexesArray = new Array(idIndex, timestartIndex, timeendIndex, contentIndex);
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

          if (indexesArray[k] === timestartIndex) {
            savedEntry["timestart"] = savedArray[k];
          }

          if (indexesArray[k] === timeendIndex) {
            savedEntry["timeend"] = savedArray[k];
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

timetracker.t = function(a, b) {
  var b = b || new Array();
  var timetrackerLang = timetracker.config.language;

  // ToDo get language string and return translation

  return a;
};

timetracker.setMessage = function(id, message) {
  timetracker.queue[id].content = message;
  timetracker.saveTracker(id);
};

timetracker.showTimer = function(id, element) {
  if (timetracker.queue[id].timeend==1 || (timetracker.queue[id].timeend==0 && timetracker.queue[id].timestart!=0)) {
    var currentDiff = timetracker.getCurrentTimestamp()-timetracker.queue[id].timestart;
    var formattedTime = timetracker.getTimeFromMilliseconds(currentDiff);
    
    element.innerHTML = formattedTime;

    timetracker.timers[id] = window.setTimeout(function(){
      timetracker.showTimer(id, element);
    }, 1000);
  }
};

timetracker.getTimeFromMilliseconds = function(milliseconds) {
  var sec_num = milliseconds/1000;
  sec_num = parseInt(sec_num, 10); // don't forget the second param

  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {
    hours   = "0"+hours;
  }
  
  if (minutes < 10) {
    minutes = "0"+minutes;
  }
  
  if (seconds < 10) {
    seconds = "0"+seconds;
  }
  
  return hours+':'+minutes+':'+seconds;
};