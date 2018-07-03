import React, { Component } from 'react';
import './App.css';
import CalendarView from "./components/CalendarView";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Calendar</h1>
        </header>
        <p className="App-intro">
          React frontend for the Drupal 8 Calendar module.
        </p>
        <CalendarView/>
      </div>
    );
  }
}

export default App;
