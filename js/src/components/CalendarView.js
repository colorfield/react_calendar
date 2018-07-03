import React from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import s from './CalendarView.css';
import moment from 'moment';
import api from '../utils/api.js';


class CalendarView extends React.Component {

  /**
   * Returns the JSON API endpoint
   * with optional params like filter, sort, ...
   *
   * @param params
   * @returns {string}
   */
  static getEventsEndpoint(params = '') {
    return `${api.getApiBaseUrl()}/jsonapi/node/event${params}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      hasError: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    const eventsEndpoint = CalendarView.getEventsEndpoint();
    this.fetchEvents(eventsEndpoint);
  }

  /**
   * Fetches events data.
   *
   * @param endpoint
   */
  fetchEvents(endpoint) {
    this.setState({isLoading: true});
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(jsonApiEvents => {
        let tmpEvents = [];
        jsonApiEvents.data.map(jsonApiEvent => (
            tmpEvents.push(
              {
                id: jsonApiEvent.attributes.nid,
                title: jsonApiEvent.attributes.title,
                // @todo calculate from dates
                allDay: false,
                // @todo test existence of fields and pass their reference from
                // Drupal
                start: new Date(`${jsonApiEvent.attributes.field_date_range.value}Z`),
                end: new Date(`${jsonApiEvent.attributes.field_date_range.end_value}Z`),
              }
            )
          )
        );
        this.setState({events: tmpEvents});
        this.setState({isLoading: false});
      })
      .catch(() => this.setState({hasError: true}));
  }

  render() {

    if (this.state.hasError) {
      return <p>Error while loading events.</p>;
    }

    if (this.state.isLoading) {
      return <p>Loading events...</p>;
    }

    let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

    return (
      <div className={s.container}>
        <BigCalendar
          events={this.state.events}
          views={allViews}
          step={60}
          showMultiDayTimes
          defaultDate={new Date(2018, 6, 3)}
        />
      </div>
    );
  }
}

export default CalendarView;
