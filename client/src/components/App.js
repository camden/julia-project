import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import SubmissionsViewer from './SubmissionsViewer';
import SubmissionEditor from './SubmissionEditor';
import ReleaseEditor from './ReleaseEditor';
import Homepage from './Homepage';
import Toolbar from './Toolbar';
import ToolbarItem from './ToolbarItem';

import '../main.css';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Toolbar>
            <ToolbarItem title='Home' linksTo='/' />
            <ToolbarItem title='All Submissions' linksTo='/viewer' />
            <ToolbarItem title='New Release' linksTo='/new-release' />
            <ToolbarItem title='New Submission' linksTo='/editor' />
          </Toolbar>
          <div className='app'>
            <div className='content'>
              <Route exact path="/" component={Homepage}/>
              <Route path="/viewer/:releaseId?" component={SubmissionsViewer}/>
              <Route path="/viewer-mock" render={() => <SubmissionsViewer mock={true}></SubmissionsViewer>} />
              <Route path="/new-release" component={ReleaseEditor} />
              <Route path="/editor/:subId?" component={SubmissionEditor}/>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
