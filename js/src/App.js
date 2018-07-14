import React, { Component } from 'react';
import './App.css';
import CalendarView from "./components/CalendarView";
import api from "./utils/api";

class App extends Component {
  render() {

    /**
     * "data": [{
     *   "entity_type_id": "node",
     *   "bundle_id": "event",
     *   "date_field_name": "field_date_range"
     * }]
     * @type {string}
     */
    const dataSource = api.getDataAttributeValue('data-source');
    const defaultView = api.getDataAttributeValue('default-view');

    return (
      <div className="App">
        {api.isDevEnvironment() ? (
          <div>
            <header className="App-header">
              <h1 className="App-title">React Calendar</h1>
            </header>
            <p className="App-intro">
            React progressive decoupling for Drupal 8 based on JSON API.
            </p>
          </div>
        ) : (
          <span />
        )}
        <CalendarView dataSource={dataSource.data} defaultView={defaultView} />
      </div>
    );
  }
}

export default App;
