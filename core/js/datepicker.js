function Datepicker(element, milliseconds, clickCallback) {
  if (typeof element!="undefined") {
    var date = new Date();
    var startTimestamp = date.getTime();
    var days = new Array();
    var newDivContainer = document.createElement("div");
    var elementParent = element.parentNode;

    if (milliseconds==null) {
      startTimestamp = milliseconds;
    }

    date.setTime(startTimestamp);
    var month = date.getMonth();
    var year = date.getUTCFullYear();
    var day =  date.getDate();
    var dayCounter = 0;
    var tmp = 0;

    date = new Date(year, month, 1);
    while(date.getMonth() === month) {
      (function(tmp) {
        days.push(new Date(date));
        dayCounter++;
        
        var newDivDay = document.createElement("div");
        newDivDay.innerHTML = date.getDate();
        newDivDay.setAttribute("class", "day");
        newDivDay.setAttribute("data-days", Math.floor(date.getTime()/1000/(24*60*60)) );

        if (dayCounter%7==0) {
          newDivDay.setAttribute("class", "day next-row");
        }

        if (day==date.getDate()) {
          newDivDay.setAttribute("class", newDivDay.getAttribute("class")+" active");
        }

        if (typeof clickCallback!="undefined") {
          newDivDay.addEventListener("click", function(){
            clickCallback(newDivDay);
          });
        }

        newDivContainer.appendChild(newDivDay);

        date.setDate(date.getDate() + 1);
      }(tmp));
    }
    
    newDivContainer.setAttribute("class", "datepicker");
    elementParent.appendChild(newDivContainer);

    this.show = function() {
      var oldClass = newDivContainer.getAttribute("class");
      if (oldClass.indexOf("show")==-1) {
        newDivContainer.setAttribute("class", newDivContainer.getAttribute("class")+" show");
      }
    }

    this.hide = function() {
      var oldClass = newDivContainer.getAttribute("class");
      if (oldClass.indexOf("show")!=-1) {
        var checkShow = oldClass.replace(/((\s+|^)show(\s+|$))/, "");
        newDivContainer.setAttribute("class", checkShow);
      }
    }
  }
};