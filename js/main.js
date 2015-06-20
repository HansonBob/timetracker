function updateTrackList(trackcontainer) {
  timetracker.getTrackerQueue()
  var queue = timetracker.queue;

  for (var i in queue) {
    var li = document.createElement("li");
    li.innerHTML = "<div class=\"id\">"+queue[i].id+"</div>";
    li.innerHTML += "<div class=\"time\">"+queue[i].time+"</div>";
    li.innerHTML += "<div class=\"content\">"+queue[i].content+"</div>";

    trackcontainer.appendChild(li);
  }
}

window.onload = function() {
  var container = timetracker.getContainer();
  var tracks = document.createElement("ul");
  tracks.setAttribute("id", "tracks");
  container.appendChild(tracks);

  
  updateTrackList(tracks);

  var newMenu = document.createElement("ul");
  newMenu.innerHTML = newMenu.innerHTML + "<li id=\"create\">+ create</li>";
  newMenu.innerHTML = newMenu.innerHTML + "<li id=\"delete\">- delete</li>";
  container.appendChild(newMenu);

  var createTrack = document.getElementById("create");
  createTrack.addEventListener("click", function() {
    timetracker.createTracker();
    updateTrackList(tracks);
  }, true);

  var deleteTrack = document.getElementById("delete");
  deleteTrack.addEventListener("click", function() {
    timetracker.removeTracker();
  }, true);
};