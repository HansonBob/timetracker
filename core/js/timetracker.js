var timetracker = {};
timetracker.queue = new Array();
timetracker.currentTrack = {};

timetracker.startTracker = function(id){

};

timetracker.stopTracker = function(id){
  
};

timetracker.saveTracker = function(id){
  var timestamp = timetracker.getCurrentTimestamp();
  var content = timetracker.getTrackerContent(id);
  
  var newEntry = {
    "id" : id,
    "timestamp" : timestamp,
    "content" : content
  };

  timetracker.queue.push(newEntry);
};

timetracker.removeTracker = function(id){
  
};

timetracker.updateTracker = function(id){
  
};

timetracker.getTracker = function(){

};

timetracker.saveTrackerContent = function(id){

};

timetracker.removeTrackerContent = function(id){

};

timetracker.getTrackerContent = function(id){

};

timetracker.getCurrentTimestamp = function(){
  var timestamp = 0;
  var d = new Date();

  timestamp = d.getTime();

  return timestamp;
};

timetracker.getTimestampInSeconds = function(timestamp){
  if (typeof timestamp!=="undefined") {
    return Math.ceil(timestamp/1000);
  }
}