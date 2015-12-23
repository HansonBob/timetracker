function updateTrackList(trackcontainer) {
  trackcontainer.innerHTML = "";
  timetracker.getTrackerQueue();
  var queue = timetracker.queue;
  var dateSeparator = "";
  var dateOddEven = "even";
  var trackOddEven = "odd";
  
  for (var i in queue) {
    (function(i) {
      if (dateSeparator!=queue[i].date && typeof queue[i].date!="undefined") {
        dateSeparator = queue[i].date;

        var liSep = document.createElement("li");
        liSep.setAttribute("class", "date-separator "+dateOddEven);
        liSep.innerHTML = queue[i].date;
        trackcontainer.appendChild(liSep);

        if (dateOddEven=="odd") {
          dateOddEven = "even";
        } else {
          dateOddEven = "odd";
        }
      }

      if (trackOddEven=="odd") {
        trackOddEven="even";
      } else {
        trackOddEven="odd";
      }

      var li = document.createElement("li");
      li.setAttribute("id", queue[i].id);
      li.setAttribute("class", trackOddEven);
      li.innerHTML = "";

      var newTimerElement = document.createElement("div");
      newTimerElement.setAttribute("class", "timeshow");
      newTimerElement.innerHTML = timetracker.getTimeFromMilliseconds((queue[i].timeend-queue[i].timestart));

      timetracker.showTimer(queue[i].id, newTimerElement);

      var newStartElement = document.createElement("a");
      newStartElement.setAttribute("class", "start");
      newStartElement.addEventListener("click", function(){
        timetracker.startTracker(queue[i].id, newTimerElement);
      }, true);
      newStartElement.innerHTML = timetracker.t("Start");

      var newStopElement = document.createElement("a");
      newStopElement.setAttribute("class", "stop");
      newStopElement.addEventListener("click", function(){
        timetracker.stopTracker(queue[i].id);
      }, true);
      newStopElement.innerHTML = timetracker.t("Stop");

      /*
      var newSaveElement = document.createElement("a");
      newSaveElement.setAttribute("class", "save");
      newSaveElement.addEventListener("click", function(){
        timetracker.saveTracker(queue[i].id);
      }, true);
      newSaveElement.innerHTML = timetracker.t("Save changes");
      */

      li.innerHTML += "<div class=\"id\">"+queue[i].id+"</div>";
      li.innerHTML += "<div class=\"timestart\">"+timetracker.getTimestampInSeconds(queue[i].timestart)+"</div>";
      li.innerHTML += "<div class=\"timeend\">"+timetracker.getTimestampInSeconds(queue[i].timeend)+"</div>";
      li.innerHTML += "<div class=\"timediff\">"+timetracker.getTimestampInSeconds(queue[i].timeend-queue[i].timestart)+"</div>";

      li.innerHTML += "<textarea onkeyup=\"timetracker.setMessage("+queue[i].id+", this.value);\" class=\"content\">"+queue[i].content+"</textarea>";
      li.innerHTML += "<input type=\"hidden\" name=\"id[]\" value=\""+queue[i].id+"\" />";
      li.innerHTML += "<input class=\"checkbox\" type=\"checkbox\" name=\"checked[]\" value=\""+queue[i].id+"\" />";

      li.appendChild(newStartElement);
      li.appendChild(newStopElement);
      //li.appendChild(newSaveElement);
      li.appendChild(newTimerElement);
      trackcontainer.appendChild(li);
    }(i));
  }
}

window.onload = function() {
  var theme = "default";
  if (typeof timetracker.config.theme!="undefined" && timetracker.config.theme!="") {
    theme = timetracker.config.theme;
  }

  var themeString = "themes/" + theme + "/" + theme +".css";
  var newStyleLink = document.createElement("link");
  newStyleLink.setAttribute("href", themeString);
  newStyleLink.setAttribute("type", "text/css");
  newStyleLink.setAttribute("rel", "stylesheet");
  document.head.appendChild(newStyleLink);

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