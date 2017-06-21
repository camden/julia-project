import React from 'react';

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
    const releases = this.state.releases.map((rel) => {
      return (
        <div>
          <h3>{rel.name}</h3>
        </div>
      )
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
        <h1>Releases</h1>
        {this.listReleases()}
      </div>
    );
  }
}
