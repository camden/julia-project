import React from 'react';
import { Link } from 'react-router-dom';

import { getMockSubmissions, fetchData } from '../utils';
import config from '../config.json';

export default class SubmissionsViewer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      submissions: [],
      release: null
    }
  }

  componentDidMount() {
    this.fetchSubmissions();
  }

  fetchSubmissions() {
    if (this.props.mock) {
      this.setState({
        submissions: getMockSubmissions()
      });
      return;
    }

    let url = '/submissions';

    if (this.props.match.params.releaseId) {
      const releaseId = this.props.match.params.releaseId;
      url = `/releases/${releaseId}/submissions`;
      fetchData(`/releases/${releaseId}`).then((release) => {
        this.setState({
          release: release
        });
      });
    }

    fetchData(url).then((submissions) => {
      console.log(submissions);
      this.setState({
        submissions: submissions
      });
    });
  }

  getSubmissions() {
    const subs = this.state.submissions.map((sub) => {
      return (
        <div className='submission' key={sub.id}>
          <div className='submission-author'>Author: {sub.authorName}</div>
          <div className='submission-category'>Category: {sub.category}</div>
          <div className='submission-title'>Title: {sub.contentTitle}</div>
          <div className='submission-created-date'>{sub.createdDate}</div>
          <div className='submission-release'>Release: {sub.release.name}</div>
          <Link to={`/editor/${sub.id}`} className='submission-edit-link'>Edit this submission</Link>
          <pre className='submission-content'>{sub.content}</pre>
        </div>
      );
    });

    return (
      <div className='submissions-container'>
        {subs}
      </div>
    )
  }

  getAllContent() {
    const categories = Array.from(
      new Set(
        this.state.submissions.map((sub) => {
          return sub.category;
        })
      )
    );

    const subsByCategory = categories.sort((a, b) => {
      return a.localeCompare(b);
    })
      .map((category) => {
        return (
          <div key={category}>
            <h3>{category}</h3>
            <pre className="output">
              {this.state.submissions.filter((sub) => {
                return sub.category === category;
              }).map((sub) => {
                return (
                  <div key={sub.id}>
                    {sub.content}
                  </div>
                )
              })}
            </pre>
          </div>
        )
      });
    return (
      <div className="all-content-container">
        {subsByCategory}
      </div>
    );
  }

  getSectionTitle() {
    if (this.state.release) {
      return `Submissions for Release: '${this.state.release.name}'`;
    } else {
      return 'All Submissions';
    }
  }

  getNewSubmissionButton() {
    return (	
      <Link to='/editor' className='button-link'>
        Create New Submission
      </Link>
    );
  }

  render() {
    return (
      <div className="viewer">
        <div className='section-header'>
          <h1 className='section-title'>{this.getSectionTitle()}</h1>
          {this.getNewSubmissionButton()}
        </div>
        {this.getAllContent()}
        <hr />
        {this.getSubmissions()}
      </div>
    );
  }

}
