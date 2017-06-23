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
      return r2.prodBeginDate.getTime() - r1.prodBeginDate.getTime();
    }).map((rel) => {
      return (
        <div className='release'>
          <div className='row'>
            <h3 className='release-item release-name'>{rel.name} &middot; [{rel.type}]</h3>
            <h3 className='release-item'>
              <div className='row info-row'>
                <span className='release-item-title'>Preview Begin Date</span>
              </div>
              <div className='row info-row'>
                {this.formatDate(rel.previewBeginDate)}
              </div>
            </h3>
            <h3 className='release-item'>
              <div className='row info-row'>
                <span className='release-item-title'>Production Begin Date</span>
              </div>
              <div className='row info-row'>
                {this.formatDate(rel.prodBeginDate)}
              </div>
            </h3>
          </div>
          <div className='row release-button-row'>
            <Link to={`/viewer/${rel.id}`} className='release-link'>View Submissions</Link>
            <Link to={`/editor/release/${rel.id}`} className='release-link'>Edit</Link>
          </div>
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
          <Link to='/editor/release' className='button-link section-action-item'>
            Create New Release
          </Link>
        </div>
        {this.listReleases()}
      </div>
    );
  }
}
