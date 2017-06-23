import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

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

  formatDate(date) {
    return moment(date).format('MMM Do, YYYY'); 
  }

  listReleases() {
    const releases = this.state.releases.sort((r1, r2) => {
      return r1.prodBeginDate.getTime() - r2.prodBeginDate.getTime();
    }).map((rel) => {
      return (
        <div className='release'>
          <h3>{rel.name} - {rel.type}</h3>
          <h3>Preview Begin Date: {this.formatDate(rel.previewBeginDate)}</h3>
          <h3>Production Begin Date: {this.formatDate(rel.prodBeginDate)}</h3>
          <h4><Link to={`/viewer/${rel.id}`}>View Submissions for this Release</Link></h4>
        </div>
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
          <Link to='new-release' className='button-link'>
            Create New Release
          </Link>
        </div>
        {this.listReleases()}
      </div>
    );
  }
}
