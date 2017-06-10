import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Viewer from './Viewer';
import MainEditor from './MainEditor';
import Homepage from './Homepage';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Homepage}/>
          <Route path="/viewer" component={Viewer}/>
          <Route path="/viewer-mock" render={() => <Viewer mock={true}></Viewer>} />
          <Route path="/editor/:subId?" component={MainEditor}/>
        </div>
      </Router>
    );
  }
}
