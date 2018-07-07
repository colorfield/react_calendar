# React Calendar

React Calendar for Drupal 8.

## Dependencies

### React

- [Moment](https://www.npmjs.com/package/react-moment)

## Drupal

- Date or Date Range (core)
- JSON API

## Configuration 

- Create an Event content type
- Enable the Date or Date Range module
- Add a date (Date or Date Range) field to the content type
- Enable 'React Calendar' for the desired content type(s)
 and set the date field that will be used.

## Roadmap

- Set enabled entity types from their field instance definition
- Week start day based on system configuration
- Set locales based on current interface language
- Optionally set colors based on a taxonomy vocabulary (e.g. event type)
- Update events via drag and drop.

## Development

### React

1. cd in _react_calendar/js/src_
2. Install dependencies with `yarn install`.
3. Copy the _constants/.env.example.js_ file to _constants/.env.local.js_ 
and set there your Drupal 8 development site url.
It will be used while debugging React as a standalone app for JSON API requests.
4. Edit _App.js_ or the components.
5. Run `yarn start` to start the React development server 
and test your app outside of Drupal.
6. Run `php build.php` to bundle the dist js and css. 
that are referenced by _react_calendar.libraries.yml_.
