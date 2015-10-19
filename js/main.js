function updateTrackList(trackcontainer) {
  trackcontainer.innerHTML = "";
  timetracker.getTrackerQueue();
  var queue = timetracker.queue;
  
  for (var i in queue) {
    var li = document.createElement("li");
    li.setAttribute("id", queue[i].id);

    var trackControls = "<a class=\"start\" onclick=\"timetracker.startTracker("+queue[i].id+");\">"+timetracker.t("Start")+"</a>";
    trackControls += "<a class=\"stop\" onclick=\"timetracker.stopTracker("+queue[i].id+");\">"+timetracker.t("Stop")+"</a>";
    trackControls += "<a class=\"save\" onclick=\"timetracker.saveTracker("+queue[i].id+");\">"+timetracker.t("Save changes")+"</a>";

    var newTimerElement = document.createElement("div");
    newTimerElement.setAttribute("class", "timeshow");

    timetracker.showTimer(queue[i].id, newTimerElement);

    li.innerHTML = "<div class=\"id\">"+queue[i].id+"</div>";
    li.innerHTML += "<div class=\"timestart\">"+timetracker.getTimestampInSeconds(queue[i].timestart)+"</div>";
    li.innerHTML += "<div class=\"timeend\">"+timetracker.getTimestampInSeconds(queue[i].timeend)+"</div>";
    li.innerHTML += "<div class=\"timediff\">"+timetracker.getTimestampInSeconds(queue[i].timeend-queue[i].timestart)+"</div>";
    li.innerHTML += "<div class=\"timeshow\"></div>";
    
    li.innerHTML += "<div id=\"showtimer"+queue[i].id+"\" class=\"showtimer\">"+timetracker.getTimeFromMilliseconds((queue[i].timeend-queue[i].timestart))+"</div>";
    li.innerHTML += "<textarea onkeyup=\"timetracker.setMessage("+queue[i].id+", this.value);\" class=\"content\">"+queue[i].content+"</textarea>";
    li.innerHTML += "<input type=\"hidden\" name=\"id[]\" value=\""+queue[i].id+"\" />";
    li.innerHTML += "<input type=\"checkbox\" name=\"checked[]\" value=\""+queue[i].id+"\" />";
    li.innerHTML += "<div class=\"controls\">"+trackControls+"</div>";

    li.appendChild(newTimerElement);
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

    if (typeof trackIds=="object" && typeof trackIds.length=="undefined") {
      timetracker.removeTracker(trackIds.value);
    } else {
      for (var i=0; i < trackIds.length; i++) {
        if (trackIds[i].checked==true && typeof trackIds[i].value!="undefined") {
          timetracker.removeTracker(trackIds[i].value);
        }
      };
    }

    updateTrackList(tracks);
  }, true);
};