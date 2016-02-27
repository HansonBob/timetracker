function updateTrackList(trackcontainer) {
  trackcontainer.innerHTML = "";
  timetracker.getTrackerQueue();
  var queue = timetracker.queue;
  var dateSeparator, dataStatusBar = "";
  var dateOddEven = "even";
  var trackOddEven = "odd";
  
  for (var i in queue) {
    (function(i) {
      if (queue[i]!=null) {
        if (dateSeparator!=queue[i].date && typeof queue[i].date!="undefined") {
          if (typeof queue[(i-1)]!="undefined" && queue[(i-1)]!=null) {
            var cleanedDateString = queue[(i-1)].date.toLowerCase();
            cleanedDateString = cleanedDateString.replace(/[^a-z0-9\-\_]/g, "-");       

            var newStatusBar = document.createElement("li");
            newStatusBar.setAttribute("class", "statusbar");
            newStatusBar.setAttribute("id", "statusbar-"+cleanedDateString);
            trackcontainer.appendChild(newStatusBar);
          }

          dateSeparator = queue[i].date;

          var liSep = document.createElement("li");
          liSep.setAttribute("class", "date-separator "+dateOddEven);
          liSep.innerHTML = timetracker.getCompleteDateFromDays(queue[i].date);
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

        timetracker.showTimer(queue[i].id, newTimerElement, {inactive:newStartElement, active:newStopElement});

        newStartElement.setAttribute("class", "start");
        newStartElement.addEventListener("click", function(){
          newStartElement.setAttribute("data-active", "false");
          newStopElement.setAttribute("data-active", "true");
          timetracker.startTracker(queue[i].id, newTimerElement, newStopElement);
        }, true);
        newStartElement.innerHTML = timetracker.t("Start");
        newStartElement.setAttribute("title", timetracker.t("Start"));
        
        newStopElement.setAttribute("class", "stop");
        newStopElement.addEventListener("click", function(){
          newStartElement.setAttribute("data-active", "true");
          newStopElement.setAttribute("data-active", "false");
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
      }
    }(i));
  }

  var lastEntry = (queue.length-1);

  if (typeof queue[lastEntry]!="undefined" && queue[lastEntry]!=null) {
    var cleanedDateString = queue[lastEntry].date.toLowerCase();
    cleanedDateString = cleanedDateString.replace(/[^a-z0-9\-\_]/g, "-");       

    var newStatusBar = document.createElement("li");
    newStatusBar.setAttribute("class", "statusbar");
    newStatusBar.setAttribute("id", "statusbar-"+cleanedDateString);
    trackcontainer.appendChild(newStatusBar); 
  }

  if (typeof queue!="undefined" && queue.length==0) {
    trackcontainer.innerHTML = '<li>'+timetracker.t('no entries found')+'</li>';
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

  themeString = "themes/" + theme + "/" + theme +"-datepicker.css";
  newStyleLink = document.createElement("link");
  newStyleLink.setAttribute("href", themeString);
  newStyleLink.setAttribute("type", "text/css");
  newStyleLink.setAttribute("rel", "stylesheet");
  document.head.appendChild(newStyleLink);

  var container = timetracker.getContainer();

  var dateView = document.createElement("form");
  dateView.setAttribute("class", "menu");

  var form = document.createElement("form");
  form.setAttribute("id", "formTimetracks");

  var tracks = document.createElement("ul");
  tracks.setAttribute("id", "tracks");

  form.appendChild(tracks);

  var dateViewFrom = document.createElement("input");
  if (timetracker.getOption("dateFrom")!=null) {
    dateViewFrom.setAttribute("value", timetracker.getDateFromDays( timetracker.getOption("dateFrom")[1] ) );
    dateViewFrom.value = timetracker.getDateFromDays( timetracker.getOption("dateFrom")[1] );
  }

  var dateViewTo = document.createElement("input");
  if (timetracker.getOption("dateTo")!=null) {
    dateViewTo.setAttribute("value", timetracker.getDateFromDays( timetracker.getOption("dateTo")[1] ) );
    dateViewTo.value = timetracker.getDateFromDays( timetracker.getOption("dateTo")[1] );
  }

  dateView.appendChild(dateViewFrom);
  dateView.appendChild(dateViewTo);
  container.appendChild(dateView);
  container.appendChild(form);

  var savedDateFrom = timetracker.getOption("dateFrom");
  if (savedDateFrom!=null) {
    savedDateFrom = savedDateFrom[1];
  }

  var datepickerFrom = new Datepicker(
    dateViewFrom,
    timetracker.getDaysInTimestamp( savedDateFrom ),
    function(e) {
      dateViewFrom.setAttribute("value", e.getAttribute("data-days") );
      dateViewFrom.value = timetracker.getDateFromDays( e.getAttribute("data-days") );
      datepickerFrom.hide();
      timetracker.setOption("dateFrom", e.getAttribute("data-days"));
      updateTrackList(tracks);
    }
  );

  var savedDateTo = timetracker.getOption("dateTo");
  if (savedDateTo!=null) {
    savedDateTo = savedDateTo[1];
  }

  var datepickerTo = new Datepicker(
    dateViewTo,
    timetracker.getDaysInTimestamp( savedDateTo ),
    function(e) {
      dateViewTo.setAttribute("value", e.getAttribute("data-days") );
      dateViewTo.value = timetracker.getDateFromDays( e.getAttribute("data-days") );
      datepickerTo.hide();
      timetracker.setOption("dateTo", e.getAttribute("data-days"));
      updateTrackList(tracks);
    }
  );

  updateTrackList(tracks);

  dateViewFrom.addEventListener("keyup", function(){
    dateViewFrom.setAttribute("value", dateViewFrom.value);
    var dateViewFromInDays = timetracker.getTimestampFromDate(dateViewFrom.getAttribute("value"));
    dateViewFromInDays = timetracker.getTimestampInDays(dateViewFromInDays);

    timetracker.setOption("dateFrom", dateViewFromInDays);
    updateTrackList(tracks);
  }, true);

  dateViewFrom.addEventListener("focus", function(e){
    datepickerFrom.show(e);
  }, true);

  dateViewTo.addEventListener("keyup", function(){
    dateViewTo.setAttribute("value", dateViewTo.value);
    var dateViewToInDays = timetracker.getTimestampFromDate(dateViewTo.getAttribute("value"));
    dateViewToInDays = timetracker.getTimestampInDays(dateViewToInDays);

    timetracker.setOption("dateTo", dateViewToInDays);
    updateTrackList(tracks);
  }, true);

  dateViewTo.addEventListener("focus", function(e){
    datepickerTo.show(e);
  }, true);

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

  var allInputs = document.getElementsByTagName("input");
  var allDates = new Array();
  for(var i=0; i<allInputs.length; i++) {
    if (typeof allInputs[i].getAttribute("class")!="undefined" && allInputs[i].getAttribute("class")=="checkbox") {

      allInputs[i].addEventListener("change" , function(e){
        //var localStorageIdKey = timetracker.config.saveformatKey;
        //var storagedEntry = localStorage.getItem(localStorageIdKey+allInputs[i].value);
        var savedEntry = timetracker.getTrackerContent(this.value);

        if (typeof allDates[savedEntry.date]=="undefined" || allDates[savedEntry.date]==null) {
          allDates[savedEntry.date] = 0;
        }

        if (typeof allDates[savedEntry.date]!="undefined" && allDates[savedEntry.date]!=null) {
          if (timetracker.getTimestampDifference(this.value)!=null) {
            if (this.checked==true) {
              allDates[savedEntry.date] = allDates[savedEntry.date] + timetracker.getTimestampDifference(this.value);
            } else {
              allDates[savedEntry.date] = allDates[savedEntry.date] - timetracker.getTimestampDifference(this.value);
            }

            var cleanedDateString = savedEntry.date.toLowerCase();
            cleanedDateString = cleanedDateString.replace(/[^a-z0-9\-\_]/g, "-"); 

            if (typeof document.getElementById("statusbar-"+cleanedDateString)!="undefined") {
              document.getElementById("statusbar-"+cleanedDateString).innerHTML = timetracker.getTimeFromMilliseconds(allDates[savedEntry.date]);

              if (document.getElementById("statusbar-"+cleanedDateString).innerHTML=="0") {
                document.getElementById("statusbar-"+cleanedDateString).innerHTML = "";
              }
            }
          }
        }
      }, true);
    }
  }
};