way.lib.getDate = function (_args) {
  var _args = way.lib.getArgs('getDate', _args);
  var date_year = way.start.getFullYear();
  var date_month = way.start.getMonth()+1;
  date_month = (date_month < 10) ? `0${date_month}`: date_month;
  var date_day = way.start.getDate();
  date_day = (date_day < 10) ? `0${date_day}`: date_day;
  var date_hours = way.start.getHours();
  date_hours = (date_hours < 10) ? `0${date_hours}`: date_hours;
  var date_minutes = way.start.getMinutes();
  date_minutes = (date_minutes < 10) ? `0${date_minutes}`: date_minutes;
  var date_seconds = way.start.getSeconds();
  date_seconds = (date_seconds < 10) ? `0${date_seconds}`: date_seconds;
  way.lib.var({
    key: _args.pipe,
    value: `${date_year}-${date_month}-${date_day}---${date_hours}:${date_minutes}:${date_seconds}`
  });
}

