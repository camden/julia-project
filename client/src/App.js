import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import SubmissionsViewer from './SubmissionsViewer';
import SubmissionEditor from './SubmissionEditor';
import ReleaseEditor from './ReleaseEditor';
import Homepage from './Homepage';

import './main.css';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='app'>
          <Route exact path="/" component={Homepage}/>
          <Route path="/viewer" component={SubmissionsViewer}/>
          <Route path="/viewer-mock" render={() => <SubmissionsViewer mock={true}></SubmissionsViewer>} />
          <Route path="/new-release" component={ReleaseEditor} />
          <Route path="/editor/:subId?" component={SubmissionEditor}/>
        </div>
      </Router>
    );
  }
}
