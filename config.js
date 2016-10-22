var timetracker = timetracker || {};

timetracker["version"] = "0.45";

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
  },
  "project_on_github" : {
    "type" : "link",
    "href" : "https://github.com/HansonBob/timetracker",
    "text" : "check for updates",
    "target" : "_blank"
  }
}