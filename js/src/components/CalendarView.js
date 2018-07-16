import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import s from './CalendarView.css';
import api from '../utils/api.js';

class CalendarView extends React.Component {

  static propTypes = {
    dataSource: PropTypes.arrayOf(PropTypes.shape({
      entity_type_id: PropTypes.string.isRequired,
      bundle_id: PropTypes.string.isRequired,
      date_field_name: PropTypes.string.isRequired,
    }).isRequired),
    defaultView: PropTypes.string.isRequired,
    languagePrefix: PropTypes.bool.isRequired,
    languageId: PropTypes.string.isRequired,
  };

  /**
   * Callback of onSelectEvent.
   *
   * Go if the event detail page.
   *
   * @param entity_id
   * @param entity_type_id
   */
  static gotoEventPage(entity_id, entity_type_id = 'node') {
    // @todo path structure is subject to change depending on the entity type id.
    // @todo set language in path if languagePrefix set to true.
    window.location.href = `${api.getApiBaseUrl()}/${entity_type_id}/${entity_id}`;
  }

  constructor(props) {
    super(props);
    // Init to current date.
    const date = new Date();
    this.state = {
      dayView: date.getDay(),
      monthView: date.getMonth(),
      yearView: date.getFullYear(),
      events: [],
      hasError: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchEvents();
  }

  /**
   * Fetches events data.
   *
   * @param endpoint
   */
  fetchEvents() {
    const endpoint = this.getEventsEndpoint();
    // @todo get field from data attributes.
    const dateField = 'field_datetime_range';
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
        // Filter events with no date.
        const filteredEvents = jsonApiEvents.data.filter((event) =>
          event.attributes[dateField] != null
        );
        // Map JSON API response to the structure expected by BigCalendar.
        let bigCalendarEvents = [];
        filteredEvents.map(event => (
          bigCalendarEvents.push(
              {
                // @todo generalize to other entity types
                id: event.attributes.nid,
                title: event.attributes.title,
                // @todo set this property from start and end dates
                allDay: false,
                // @todo test existence of fields, values and get
                // their reference from data attributes
                start: new Date(`${event.attributes[dateField].value}Z`),
                end: new Date(`${event.attributes[dateField].end_value}Z`),
              }
            )
          )
        );
        this.setState({events: bigCalendarEvents});
        this.setState({isLoading: false});
      })
      .catch(() => this.setState({hasError: true}));
  }

  /**
   * Returns the JSON API endpoint
   * with optional params like filter, sort, ...
   *
   * @returns {string}
   */
  getEventsEndpoint() {
    const { languagePrefix, languageId } = this.props;
    // @todo make use of dateBundle prop
    // @todo iterate through dataSource prop
    // @todo get events for current time span (month, week, ...) and callback on view change
    const entityType = 'node';
    const bundle = 'event';

    // @todo get field from data attributes.
    const dateField = 'field_datetime_range';
    const monthWithPadding = ("0" + (this.state.monthView + 1)).slice(-2);
    const viewedDate = `${this.state.yearView}-${monthWithPadding}-01T00:00:00`;
    const params = `filter[date-filter][condition][path]=${dateField}&filter[date-filter][condition][operator]=%3E%3D&filter[date-filter][condition][value]=${viewedDate}`;
    const baseUrlWithLanguagePrefix = languagePrefix ? `${api.getApiBaseUrl()}/${languageId}` : `${api.getApiBaseUrl()}`;
    return `${baseUrlWithLanguagePrefix}/jsonapi/${entityType}/${bundle}?${params}`;
  }

  /**
   * Callback of onNavigate.
   *
   * @param date
   * @param view
   */
  onNavigate(date, view) {
    this.setState({
      yearView: date.getFullYear(),
      monthView: date.getMonth(),
      dayView: date.getDay()
    // Set fetchEvents as a callback, so we wait for states.
    }, this.fetchEvents);
  }

  render() {

    const { defaultView } = this.props;

    // @todo localize
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
          date={new Date(this.state.yearView, this.state.monthView, this.state.dayView)}
          events={this.state.events}
          defaultView={defaultView}
          views={allViews}
          step={60}
          showMultiDayTimes
          selectable={true}
          onSelectEvent={event => CalendarView.gotoEventPage(event.id)}
          onNavigate={(date, view) => this.onNavigate(date, view)}
        />
      </div>
    );
  }
}

export default CalendarView;
