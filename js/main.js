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
      var newStartElement = document.createElement("a");
      var newStopElement = document.createElement("a");

      newTimerElement.setAttribute("class", "timeshow");
      newTimerElement.innerHTML = timetracker.getTimeFromMilliseconds((queue[i].timeend-queue[i].timestart));

      timetracker.showTimer(queue[i].id, newTimerElement, newStopElement);

      newStartElement.setAttribute("class", "start");
      newStartElement.addEventListener("click", function(){
        timetracker.startTracker(queue[i].id, newTimerElement, newStopElement);
      }, true);
      newStartElement.innerHTML = timetracker.t("Start");
      newStartElement.setAttribute("title", timetracker.t("Start"));
      
      newStopElement.setAttribute("class", "stop");
      newStopElement.addEventListener("click", function(){
        timetracker.stopTracker(queue[i].id, newStopElement);
      }, true);
      newStopElement.innerHTML = timetracker.t("Stop");
      newStopElement.setAttribute("title", timetracker.t("Stop"));

      var contentElement = document.createElement("textarea");
      contentElement.setAttribute("class", "content");
      
      if (queue[i].timestart!=0 && (queue[i].timeend!=0 || queue[i].timeend!=1)) {
        contentElement.setAttribute("data-write", "disabled");
      } else {
        contentElement.setAttribute("data-write", "enabled");
      }

      contentElement.setAttribute("title", timetracker.t("double click to make changes"));
      contentElement.innerHTML = queue[i].content;

      contentElement.addEventListener("dblclick", function() {
        if (typeof contentElement.getAttribute("data-write")=="undefined" || contentElement.getAttribute("data-write")!="disabled") {
          contentElement.setAttribute("data-write", "disabled");
        } else {
          contentElement.setAttribute("data-write", "enabled");
        }
      }, true);

      contentElement.addEventListener("keyup", function() {
        if (typeof contentElement.getAttribute("data-write")!="undefined" && contentElement.getAttribute("data-write")=="enabled") {
          timetracker.setMessage(queue[i].id, contentElement.value);
        }
      }, true);

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

      li.innerHTML += "<input type=\"hidden\" name=\"id[]\" value=\""+queue[i].id+"\" />";
      li.innerHTML += "<input class=\"checkbox\" type=\"checkbox\" name=\"checked[]\" value=\""+queue[i].id+"\" />";

      li.appendChild(contentElement);
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
  newMenu.innerHTML = newMenu.innerHTML + "<li title=\"" + timetracker.t("create") + "\" id=\"create\">" + timetracker.t("create") + "</li>";
  newMenu.innerHTML = newMenu.innerHTML + "<li title=\"" + timetracker.t("delete") + "\" id=\"delete\">" + timetracker.t("delete") + "</li>";
  newMenu.setAttribute("class", "menu");
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