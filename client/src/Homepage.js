import React from 'react';
import { Link } from 'react-router-dom';

export default class App extends React.Component {
  render() {
    return (
      <ul>
        <li><Link to='/viewer'>View All Submissions</Link></li>
        <li><Link to='/editor'>New Submission</Link></li>
      </ul>
    );
  }
}
