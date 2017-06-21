import React from 'react';
import { Link } from 'react-router-dom';

import { fetchData } from './utils';

export default class ReleaseViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      releases: []
    };
  }

  componentDidMount() {
    this.fetchReleases();
  }

  fetchReleases() {
    fetchData('/releases').then((releases) => {
      this.setState({
        releases: releases
      });
    });
  }

  listReleases() {
    const releases = this.state.releases.sort((r1, r2) => {
      return r1.prodBeginDate.getTime() - r2.prodBeginDate.getTime();
    }).map((rel) => {
      return (
        <div>
          <h3>{rel.name}</h3>
        </div>
      );
    });

    return (
      <div>
        {releases}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.listReleases()}
        <Link to='new-release'>Create New Release</Link>
      </div>
    );
  }
}
