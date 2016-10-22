var timetracker = timetracker || {};

timetracker.config = {
  "savetype" : "localStorage",
  "optionsKey" : "timetracker_options",
  "saveformatKey" : "timetracker_",
  "saveformatContent" : "%id%;%timestart%;%timeend%;%content%;%date%",
  "containerId" : "container",
  "language" : "default",
  "theme" : "default"
};

timetracker.configTypes = {
  "language" : {
    "type" : "select",
    "values" : new Array('default', 'de')
  },
  "theme" : {
    "type" : "select",
    "values" : new Array('default')
  }
}