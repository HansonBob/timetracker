function updateTrackList(trackcontainer) {
  trackcontainer.innerHTML = "";
  timetracker.getTrackerQueue();
  var queue = timetracker.queue;
  var dateSeparator, dataStatusBar = "";
  var dateOddEven = "even";
  var trackOddEven = "odd";
  var dataStatusBarArray = new Array();
  var allDates = new Array();
  var lastEntry = "";
  
  for (var i in queue) {
    (function(i) {
      if (queue[i]!=null
        && dataStatusBar==queue[i].date
        && typeof queue[i].date!="undefined"
      ) {
        dataStatusBarArray[queue[i].date] = i;
      }

      if (queue[i]!=null) {
        dataStatusBar = queue[i].date;
      }
      
      lastEntry = i;
    }(i));
  }

  dataStatusBarArray[dataStatusBar] = lastEntry;

  for (var i in queue) {
    (function(i) {
      if (queue[i]!=null) {
        if (dateSeparator!=queue[i].date && typeof queue[i].date!="undefined") {
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
        var newEditElement = document.createElement("a");

        newTimerElement.setAttribute("class", "timeshow");
        newTimerElement.innerHTML = timetracker.getTimeFromMilliseconds((queue[i].timeend-queue[i].timestart));

        timetracker.showTimer(queue[i].id, newTimerElement, {inactive:newStartElement, active:newStopElement});

        newStartElement.setAttribute("class", "start");
        newStartElement.addEventListener("click", function(){
          if (document.getElementById("dateCheckbox"+queue[i].id).checked==true) {
            document.getElementById("dateCheckbox"+queue[i].id).checked=false;
            allDates[queue[i].date] = allDates[queue[i].date] - timetracker.getTimestampDifference(queue[i].id);
          }

          newStartElement.setAttribute("data-active", "false");
          newStopElement.setAttribute("data-active", "true");
          timetracker.startTracker(queue[i].id, newTimerElement, newStopElement);
        }, true);
        newStartElement.innerHTML = timetracker.t("start");
        newStartElement.setAttribute("title", timetracker.t("start"));
        
        newStopElement.setAttribute("class", "stop");
        newStopElement.addEventListener("click", function(){
          newStartElement.setAttribute("data-active", "true");
          newStopElement.setAttribute("data-active", "false");
          timetracker.stopTracker(queue[i].id, newStopElement);
        }, true);
        newStopElement.innerHTML = timetracker.t("stop");
        newStopElement.setAttribute("title", timetracker.t("stop"));

        newEditElement.setAttribute("class", "edit");
        newEditElement.innerHTML = timetracker.t("Edit");
        newEditElement.setAttribute("title", timetracker.t("edit"));
        newEditElement.setAttribute("class", "btn-default");
        newEditElement.setAttribute("data-state", "edit");

        newEditElement.addEventListener("click", function(){
          if (newEditElement.getAttribute("data-state")=="edit") {
            newStartElement.setAttribute("data-active", "true");
            newStopElement.setAttribute("data-active", "false");
            newEditElement.setAttribute("data-state", "save");

            timetracker.stopTracker(queue[i].id, newStopElement);
            
            for (var k in li.childNodes) {
              if (typeof li.childNodes[k].getAttribute!="undefined"
                && typeof li.childNodes[k].getAttribute("class")!="undefined"
                && li.childNodes[k].getAttribute("class")=="timeshow"
                && document.getElementById("change_time"+queue[i].id)==null
              ) {
                newEditElement.setAttribute("title", timetracker.t("save"));
                newEditElement.innerHTML = timetracker.t("save");
                newStartElement.setAttribute("data-active", "false");

                document.getElementById("cancel" + queue[i].id).setAttribute("class", "btn-default show");

                var newInputTime = document.createElement("input");
                newInputTime.setAttribute("id", "change_time"+queue[i].id);
                newInputTime.setAttribute("class", "edit-input");
                newInputTime.value = timetracker.getTimeFromMilliseconds((queue[i].timeend-queue[i].timestart));

                var newInputDate = document.createElement("input");
                newInputDate.setAttribute("id", "change_date"+queue[i].id);
                newInputDate.setAttribute("class", "edit-input");
                
                var startDate = timetracker.getCurrentDateFromTimestamp(timetracker.queue[queue[i].id].timestart);
                newInputDate.value = startDate;

                li.childNodes[k].innerHTML = "";
                li.childNodes[k].appendChild(newInputTime);
                li.childNodes[k].appendChild(newInputDate);

                var changeDateDatepicker = new Datepicker(
                  newInputDate,
                  timetracker.queue[queue[i].id].timestart,
                  function(e) {
                    newInputDate.setAttribute("value", e.getAttribute("data-days") );
                    newInputDate.value = timetracker.getDateFromDays( e.getAttribute("data-days") );
                    newInputDate.setAttribute("value", newInputDate.value);
                    changeDateDatepicker.hide();
                  },
                  {
                    "months" : months,
                    "days" : daysShort
                  }
                );

                newInputDate.addEventListener("focus", function(e){
                  changeDateDatepicker.show(e);
                }, true);
              }
            }
          } else {
            newEditElement.setAttribute("data-state", "edit");
            newEditElement.setAttribute("title", timetracker.t("edit"));
            newEditElement.innerHTML = timetracker.t("edit");

            for (var k in li.childNodes) {
              if (typeof li.childNodes[k].getAttribute!="undefined"
                && typeof li.childNodes[k].getAttribute("class")!="undefined"
                && li.childNodes[k].getAttribute("class")=="timeshow"
                && document.getElementById("change_time"+queue[i].id)!=null
              ) {
                var newTimeValue = document.getElementById("change_time"+queue[i].id).value;
                var newDateValue = document.getElementById("change_date"+queue[i].id).value;

                document.getElementById("cancel" + queue[i].id).setAttribute("class", "btn-default hide");

                try {
                  newTimeValue = newTimeValue.split(":");

                  var newHours = newTimeValue[0];
                  var newMinutes = newTimeValue[1];
                  var newSeconds = newTimeValue[2];

                  newTimeValue = (parseInt(newHours*60*60) + parseInt(newMinutes*60) + parseInt(newSeconds)) * 1000;

                  li.childNodes[k].innerHTML = timetracker.getTimeFromMilliseconds(newTimeValue);

                  var dateTimestamp = timetracker.getTimestampFromDate(newDateValue);
                  timetracker.queue[queue[i].id].timestart = dateTimestamp;
                  timetracker.queue[queue[i].id].date = timetracker.getTimestampInDays(dateTimestamp);

                  timetracker.queue[queue[i].id].timeend = parseInt(timetracker.queue[queue[i].id].timestart) + parseInt(newTimeValue);
                  
                  timetracker.saveTracker(queue[i].id);

                  updateTrackList(tracks);
                } catch(e) {
                  alert(timetracker.t("an error occured. changes cancelled"));
                }
              }
            }

          }
        }, true);

        var newCancelEditBtn = document.createElement("a");
        newCancelEditBtn.setAttribute("id", "cancel" + queue[i].id);
        newCancelEditBtn.setAttribute("class", "btn-default hide");
        newCancelEditBtn.setAttribute("title", timetracker.t("cancel"));
        newCancelEditBtn.innerHTML = timetracker.t("cancel");

        newCancelEditBtn.addEventListener("click", function(){
          updateTrackList(tracks);
        }, true);

        var contentElement = document.createElement("textarea");
        contentElement.setAttribute("class", "content");
        
        if (queue[i].timestart!=0 && (queue[i].timeend!=0 || queue[i].timeend!=1)) {
          contentElement.setAttribute("data-write", "disabled");
          contentElement.setAttribute("title", timetracker.t("double click to make changes"));
        } else {
          contentElement.setAttribute("data-write", "enabled");
        }

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

        var dateCheckbox = document.createElement("input");
        dateCheckbox.setAttribute("id", "dateCheckbox"+queue[i].id);
        dateCheckbox.setAttribute("class", "checkbox");
        dateCheckbox.setAttribute("type", "checkbox");
        dateCheckbox.setAttribute("name", "checked[]");
        dateCheckbox.setAttribute("value", queue[i].id);
        updateStatusbar(allDates, dateCheckbox);

        li.appendChild(dateCheckbox);

        li.appendChild(contentElement);
        li.appendChild(newStartElement);
        li.appendChild(newStopElement);
        li.appendChild(newEditElement);
        li.appendChild(newCancelEditBtn);
        
        //li.appendChild(newSaveElement);
        li.appendChild(newTimerElement);
        trackcontainer.appendChild(li);

        if (typeof dataStatusBarArray!="undefined"
          && typeof dataStatusBarArray[queue[i].date]!="undefined"
          && dataStatusBarArray[queue[i].date]==i
        ) {
          var cleanedDateString = queue[i].date.toLowerCase();
          cleanedDateString = cleanedDateString.replace(/[^a-z0-9\-\_]/g, "-");       

          var newStatusBar = document.createElement("li");
          newStatusBar.setAttribute("class", "statusbar");
          newStatusBar.setAttribute("id", "statusbar-"+cleanedDateString);
          trackcontainer.appendChild(newStatusBar);
        }
      }
    }(i));
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

  var settingsBtn = document.createElement("div");
  settingsBtn.setAttribute("id", "settings");
  settingsBtn.innerHTML = "<span>" + timetracker.t("settings") + "</span>";

  settingsPopup = document.createElement("div");
  settingsPopup.setAttribute("id", "settingsPopup");
  settingsPopup.setAttribute("class", "hide");

  var settingsPopupClose = document.createElement("div");
  settingsPopupClose.setAttribute("class", "settings-popup-close");
  settingsPopupClose.innerHTML = timetracker.t("close");

  settingsPopupClose.addEventListener("click", function(){
    settingsPopup.setAttribute("class", "hide");
  }, true);

  settingsPopup.appendChild(settingsPopupClose);

  var options = timetracker.getAllChangeableOptions();

  for (var i in options) {
    var newOptionLabel = document.createElement("label");
    var newOptionInput = "input";
    var currentOption = timetracker.getOption(i);

    if (timetracker.configTypes[i].type!="input") {
      newOptionInput = timetracker.configTypes[i].type;

      if (timetracker.configTypes[i].type=="select") {
        newOptionInput = document.createElement(newOptionInput);

        for (var k in timetracker.configTypes[i].values) {
          var option = document.createElement("option");
          option.setAttribute("value", timetracker.configTypes[i].values[k]);
          option.innerHTML = timetracker.t(timetracker.configTypes[i].values[k]);

          if (currentOption[1]==timetracker.configTypes[i].values[k]) {
            option.setAttribute("selected", "selected");
          }

          newOptionInput.appendChild(option);
        }
      }
    } else {
      newOptionInput = document.createElement(newOptionInput);
      newOptionInput.value = currentOption[1];
    }

    newOptionLabel.innerHTML = timetracker.t(i);
    newOptionInput.setAttribute("name", i);

    settingsPopup.appendChild(newOptionLabel);
    settingsPopup.appendChild(newOptionInput);
  }

  settingsPopupSaveBtn = document.createElement("div");
  settingsPopupSaveBtn.innerHTML = timetracker.t("save changes");
  settingsPopupSaveBtn.setAttribute("id", "settingsPopupSaveBtn");
  settingsPopupSaveBtn.setAttribute("class", "btn-default");

  settingsPopupSaveBtn.addEventListener("click", function(){
    var settings = settingsPopup.childNodes;

    for (var i in settings) {
      if (settings[i].nodeName=="INPUT" || settings[i].nodeName=="SELECT" || settings[i].nodeName=="TEXTAREA") {        
        timetracker.setOption(
          settings[i].getAttribute("name"),
          settings[i].value
        );
      }
    }

    var winConfirm = window.confirm(timetracker.t("reload page"));

    if (winConfirm==true) {
      location.reload();
    }
  }, true);
  
  settingsPopup.appendChild(settingsPopupSaveBtn);

  settingsBtn.addEventListener("click", function(){
    var settingsPopup = document.getElementById("settingsPopup");

    if (settingsPopup.getAttribute("class")=="hide") {
      settingsPopup.setAttribute("class", "show");
    } else {
      settingsPopup.setAttribute("class", "hide");
    }
  }, true);

  var form = document.createElement("form");
  form.setAttribute("id", "formTimetracks");
  form.addEventListener("submit", function(e){
    e.preventDefault();
  }, true);

  var tracks = document.createElement("ul");
  tracks.setAttribute("id", "tracks");

  form.appendChild(tracks);

  var dateViewFromLabel = document.createElement("label");
  dateViewFromLabel.innerHTML = timetracker.t('period of time')+":";
  dateViewFromLabel.setAttribute("for", "dateViewFrom");
  dateViewFromLabel.setAttribute("class", "dateViewFromLabel");

  var dateViewFrom = document.createElement("input");
  dateViewFrom.setAttribute("id", "dateViewFrom");

  if (timetracker.getOption("dateFrom")!=null) {
    dateViewFrom.setAttribute("value", timetracker.getDateFromDays( timetracker.getOption("dateFrom")[1] ) );
    dateViewFrom.value = timetracker.getDateFromDays( timetracker.getOption("dateFrom")[1] );
  }

  var dateViewToLabel = document.createElement("label");
  dateViewToLabel.innerHTML = timetracker.t('to')+":";
  dateViewToLabel.setAttribute("for", "dateViewTo");
  dateViewToLabel.setAttribute("class", "dateViewToLabel");

  var dateViewTo = document.createElement("input");
  dateViewTo.setAttribute("id", "dateViewTo");

  if (timetracker.getOption("dateTo")!=null) {
    dateViewTo.setAttribute("value", timetracker.getDateFromDays( timetracker.getOption("dateTo")[1] ) );
    dateViewTo.value = timetracker.getDateFromDays( timetracker.getOption("dateTo")[1] );
  }

  dateView.appendChild(dateViewFromLabel);
  dateView.appendChild(dateViewFrom);
  dateView.appendChild(dateViewToLabel);
  dateView.appendChild(dateViewTo);
  container.appendChild(dateView);
  dateView.appendChild(settingsBtn);
  dateView.appendChild(settingsPopup);
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
    },
    {
      "months" : months,
      "days" : daysShort
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
    },
    {
      "months" : months,
      "days" : daysShort
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
};

function updateStatusbar(allDates, element) {
  element.addEventListener("change" , function(e){
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

        if (document.getElementById("statusbar-"+cleanedDateString)!=null && typeof document.getElementById("statusbar-"+cleanedDateString)!="undefined") {
          document.getElementById("statusbar-"+cleanedDateString).innerHTML = timetracker.getTimeFromMilliseconds(allDates[savedEntry.date]);
        }
      }
    }

  }, true);
}