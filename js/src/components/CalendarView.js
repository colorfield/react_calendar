import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import s from './CalendarView.css';
import api from '../utils/api.js';

class CalendarView extends React.Component {

  static propTypes = {
    bundleConfiguration: PropTypes.arrayOf(PropTypes.shape({
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
      dayView: 1,
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
   * Fetches events data by endpoint.
   */
  fetchEventsByEndpoint(endpoint) {

  }

  /**
   * Fetches events data for all endpoints.
   */
  fetchEvents() {
    const endpoint = this.getJsonApiEndpoints();
    // @todo get field from endpoint index.
    const dateField = 'field_datetime_range';
    // @todo iterate through endpoints
    fetch(endpoint[0])
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
                id: event.attributes.drupal_internal__nid,
                title: event.attributes.title,
                // @todo set this property from start and end dates
                allDay: false,
                // Convert date with timezone if any.
                // @todo handle datetime range and datetime
                start: moment(event.attributes[dateField].value, 'YYYY-MM-DDTHH:mm:ssZ').toDate(),
                end: moment(event.attributes[dateField].end_value, 'YYYY-MM-DDTHH:mm:ssZ').toDate(),
              }
            )
          )
        );
        this.setState({events: bigCalendarEvents, isLoading: false});
      })
      .catch(() => this.setState({hasError: true}));
  }

  /**
   * Returns the JSON API endpoints for each configured bundle,
   * indexed by field instance.
   *
   * @returns {array}
   */
  getJsonApiEndpoints() {
    const { bundleConfiguration, languagePrefix, languageId } = this.props;
    let result = [];
    bundleConfiguration.forEach(bundleConfig => {
      const entityType = bundleConfig.entity_type_id;
      const bundle = bundleConfig.bundle_id;
      const dateField = bundleConfig.date_field_name;

      const monthWithPadding = ("0" + (this.state.monthView + 1)).slice(-2);
      const viewedMonth = `${this.state.yearView}-${monthWithPadding}`;
      const params = `filter[date-filter][condition][path]=${dateField}&filter[date-filter][condition][operator]=STARTS_WITH&filter[date-filter][condition][value]=${viewedMonth}`;
      const baseUrlWithLanguagePrefix = languagePrefix ? `${api.getApiBaseUrl()}/${languageId}` : `${api.getApiBaseUrl()}`;
      result.push(`${baseUrlWithLanguagePrefix}/jsonapi/${entityType}/${bundle}?${params}`);
    });
    return result;
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
      isLoading: true
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

    // Disable week, work week, day, agenda
    // @todo needs 'back' and 'next' handlers and Drupal configuration
    // @todo needs timezone support #2
    // @todo review https://github.com/intljusticemission/react-big-calendar/issues/867
    // let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
    let allViews = ['month'];
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

    return (
      <div className={s.container}>
        <BigCalendar
          date={new Date(this.state.yearView, this.state.monthView, this.state.dayView)}
          events={this.state.events}
          defaultView={defaultView}
          views={allViews}
          popup
          selectable={true}
          onSelectEvent={event => CalendarView.gotoEventPage(event.id)}
          onNavigate={(date, view) => this.onNavigate(date, view)}
        />
      </div>
    );
  }
}

export default CalendarView;
