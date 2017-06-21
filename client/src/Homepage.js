import React from 'react';
import ReleaseViewer from './ReleaseViewer';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Releases</h1>
        <ReleaseViewer />
      </div>
    );
  }
}
