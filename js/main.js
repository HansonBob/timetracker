function updateTrackList(trackcontainer) {
  trackcontainer.innerHTML = "";
  timetracker.getTrackerQueue();
  var queue = timetracker.queue;
  
  for (var i in queue) {
    var li = document.createElement("li");
    li.innerHTML = "<div class=\"id\">"+queue[i].id+"</div>";
    li.innerHTML += "<div class=\"time\">"+queue[i].time+"</div>";
    li.innerHTML += "<div class=\"content\">"+queue[i].content+"</div>";
    li.innerHTML += "<input type=\"hidden\" name=\"id[]\" value=\""+queue[i].id+"\" />";
    li.innerHTML += "<input type=\"checkbox\" name=\"checked[]\" value=\""+queue[i].id+"\" />";

    trackcontainer.appendChild(li);
  }
}

window.onload = function() {
  var container = timetracker.getContainer();

  var form = document.createElement("form");
  form.setAttribute("id", "formTimetracks");
  container.appendChild(form);

  var tracks = document.createElement("ul");
  tracks.setAttribute("id", "tracks");
  form.appendChild(tracks);

  
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
    var trackIds = document.getElementById("formTimetracks").elements["checked[]"];
    for (var i=0; i < trackIds.length; i++) {
      if (trackIds[i].checked==true && typeof trackIds[i].value!="undefined") {
        timetracker.removeTracker(trackIds[i].value);
      }
    };

    updateTrackList(tracks);
  }, true);
};