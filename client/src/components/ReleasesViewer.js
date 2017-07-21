import React from 'react';
import { Link } from 'react-router-dom';

import Release from './Release';
import { fetchData } from '../utils';

export default class ReleasesViewer extends React.Component {
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

      // Cast the date strings into Dates
      releases.forEach((rel) => {
        rel.previewBeginDate = new Date(rel.previewBeginDate);
        rel.prodBeginDate = new Date(rel.prodBeginDate);
      });

      this.setState({
        releases: releases
      });
    });
  }

  listReleases() {
    const releases = this.state.releases.sort((r1, r2) => {
      return r2.prodBeginDate.getTime() - r1.prodBeginDate.getTime();
    }).map((rel) => {
      return (
        <Release releaseData={rel} />
      );
    });

    return (
      <div className='releases-container'>
        {releases}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className='section-header'>
          <h1 className='section-title'>Releases</h1>
          <Link to='/editor/release' className='button-link section-action-item'>
            Create New Release
          </Link>
        </div>
        {this.listReleases()}
      </div>
    );
  }
}
