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
   * Returns the JSON API endpoint
   * with optional params like filter, sort, ...
   *
   * @param languagePrefix
   * @param languageId
   * @param params @todo document, provide example
   * @returns {string}
   */
  static getEventsEndpoint(languagePrefix, languageId, params = '') {
    // @todo make use of dateBundle prop
    // @todo iterate through dataSource prop
    const entityType = 'node';
    const bundle = 'event';
    const baseUrlWithLanguagePrefix = languagePrefix ? `${api.getApiBaseUrl()}/${languageId}` : `${api.getApiBaseUrl()}`;
    return `${baseUrlWithLanguagePrefix}/jsonapi/${entityType}/${bundle}${params}`;
  }

  /**
   * Go to the event detail page.
   *
   * @param entity_id
   * @param entity_type_id
   */
  static gotoEventPage(entity_id, entity_type_id = 'node') {
    // @todo path structure is subject to change depending on the entity type id
    window.location.href = `${api.getApiBaseUrl()}/${entity_type_id}/${entity_id}`;
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
    const { languagePrefix, languageId } = this.props;
    const eventsEndpoint = CalendarView.getEventsEndpoint(languagePrefix, languageId);
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
        // Maps JSON API response to the structure expected by BigCalendar.
        jsonApiEvents.data.map(jsonApiEvent => (
            tmpEvents.push(
              {
                // @todo generalize to other entity types
                id: jsonApiEvent.attributes.nid,
                title: jsonApiEvent.attributes.title,
                // @todo set this property from start and end dates
                allDay: false,
                // @todo test existence of fields, values and get
                // their reference from data attributes
                start: new Date(`${jsonApiEvent.attributes.field_datetime_range.value}Z`),
                end: new Date(`${jsonApiEvent.attributes.field_datetime_range.end_value}Z`),
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

    const { defaultView } = this.props;

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
          defaultView={defaultView}
          views={allViews}
          step={60}
          showMultiDayTimes
          selectable={true}
          onSelectEvent={event => CalendarView.gotoEventPage(event.id)}
        />
      </div>
    );
  }
}

export default CalendarView;
