import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from './events';

class CalendarView extends React.Component {


  render() {
    let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
    return (
      <div>
        <BigCalendar
          events={events}
          views={allViews}
          step={60}
          showMultiDayTimes
          defaultDate={new Date(2018, 7, 3)}
        />
      </div>
    );
  }
}

export default CalendarView;
