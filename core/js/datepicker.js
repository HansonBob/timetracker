function Datepicker(element, milliseconds, clickCallback) {
  if (typeof element!="undefined") {
    var date = new Date();
    var startTimestamp = date.getTime();
    var dayToday = Math.floor(startTimestamp/1000/(24*60*60));
    var days = new Array();
    var newDivOverlay = document.createElement("div");
    var newDivContainer = document.createElement("div");
    var newDivDates = document.createElement("div");
    var newDivLabel = document.createElement("div");
    var newDivSwitchDate = document.createElement("div");
    var newDivSwitchDatePrev = document.createElement("div");
    var newDivSwitchDateNext = document.createElement("div");
    var elementParent = element.parentNode;

    if (milliseconds==null || milliseconds=="undefined") {
      startTimestamp = milliseconds;
    }

    date.setTime(startTimestamp);
    var month = date.getMonth();
    var monthLabel = month;
    var year = date.getUTCFullYear();
    var day =  date.getDate();
    var dayCounter = 0;

    newDivSwitchDate.setAttribute("class", "date-switch");
    newDivSwitchDatePrev.setAttribute("class", "date-prev");
    newDivSwitchDateNext.setAttribute("class", "date-next");
    newDivDates.setAttribute("class", "days");

    newDivSwitchDatePrev.innerHTML = '-';
    newDivSwitchDateNext.innerHTML = '+';

    newDivSwitchDate.appendChild(newDivSwitchDatePrev);
    newDivSwitchDate.appendChild(newDivSwitchDateNext);
    newDivContainer.appendChild(newDivSwitchDate);
    newDivContainer.appendChild(newDivLabel);

    function init(year, month) {
      dayCounter = 0;

      if (typeof months!="undefined") {
        monthLabel = t(months[month]);
      }

      newDivLabel.innerHTML = monthLabel+" "+year;

      date = new Date(year, month, 1);
      while(date.getMonth() === month) {
        days.push(new Date(date));
        dayCounter++;

        newDivDates.appendChild( createDay(date, dayCounter, clickCallback) );

        date.setDate(date.getDate() + 1);
      }
    }

    init(year, month);

    newDivContainer.appendChild(newDivDates);
    
    newDivSwitchDatePrev.addEventListener("click", function(){
      if (month>0) {
        month--;
      } else {
        month = 11;
        year--;
      }

      newDivDates.innerHTML = "";
      newDivLabel.innerHTML = "";
      init(year, month);
    }, true);

    newDivSwitchDateNext.addEventListener("click", function(){
      if (month<11) {
        month++;
      } else {
        month = 0;
        year++;
      }
      newDivDates.innerHTML = "";
      newDivLabel.innerHTML = "";
      init(year, month);
    }, true);

    newDivOverlay.setAttribute("class", "datepicker-overlay");

    var winHeight = window.innerHeight;

    newDivOverlay.setAttribute("style", "height:"+winHeight+"px;");
    newDivOverlay.addEventListener("click", function(){
      hide();
    }, true);

    newDivContainer.setAttribute("class", "datepicker");
    elementParent.appendChild(newDivOverlay);
    elementParent.appendChild(newDivContainer);

    function show(e) {
      var oldClassOverlay = newDivContainer.getAttribute("class");
      if (oldClassOverlay.indexOf("show")==-1) {
        newDivOverlay.setAttribute("class", newDivOverlay.getAttribute("class")+" show");
      }

      var oldClass = newDivContainer.getAttribute("class");
      if (oldClass.indexOf("show")==-1) {
        if (typeof e!="undefined" && e!=null) {
          newDivContainer.setAttribute("style", "left:"+(e.target.offsetLeft)+"px;");
        }

        newDivContainer.setAttribute("class", newDivContainer.getAttribute("class")+" show");
      }
    }

    this.show = show;

    function hide(e) {
      var oldClassOverlay= newDivOverlay.getAttribute("class");
      var checkShowOverlay = oldClassOverlay.replace(/((\s+|^)show(\s+|$))/, "");
      if (oldClassOverlay.indexOf("show")!=-1) {
        newDivOverlay.setAttribute("class", checkShowOverlay);
      }

      var oldClass = newDivContainer.getAttribute("class");
      if (oldClass.indexOf("show")!=-1) {
        var checkShow = oldClass.replace(/((\s+|^)show(\s+|$))/, "");
        newDivContainer.setAttribute("class", checkShow);
      }
    }

    this.hide = hide;

    function createDay(date, counter, callback) {
      var newDivDay = document.createElement("div");
      var dayTimestamp = (Math.floor(date.getTime()/1000/(24*60*60))+1);
      newDivDay.innerHTML = date.getDate();
      newDivDay.setAttribute("class", "day");
      newDivDay.setAttribute("data-days", dayTimestamp);

      if (counter%7==0) {
        newDivDay.setAttribute("class", "day next-row");
      }

      if (dayToday==dayTimestamp) {
        newDivDay.setAttribute("class", newDivDay.getAttribute("class")+" active");
      }

      if (typeof callback!="undefined") {
        newDivDay.addEventListener("click", function(){
          callback(newDivDay);
        });
      }

      return newDivDay;
    }

    function t(a, b) {
      var b = b || new Array();

      if (typeof months[a]!="undefined") {
        return months[a];
      }

      return a;
    }

    this.t = t;
  }
};