import React, { Component } from 'react';
import './App.css';
import CalendarView from "./components/CalendarView";
import api from "./utils/api";

class App extends Component {
  render() {

    // @todo get bundles and date fields.
    const bundles = [{bundle_id:'event', entity_type_id:'node',}];
    const dateFields = [{bundle_id:'event', date_field:'field_date_range',}];
    const defaultView = api.getDataAttributeValue('default-view');

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Calendar</h1>
        </header>
        <p className="App-intro">
          React frontend for the Drupal 8 Calendar module.
        </p>

        <CalendarView bundles={bundles} date_fields={dateFields} default_view={defaultView} />
      </div>
    );
  }
}

export default App;
