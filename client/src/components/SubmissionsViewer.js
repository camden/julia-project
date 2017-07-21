import React from 'react';
import { Link } from 'react-router-dom';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from 'react-sortable-hoc';

import Submission from './Submission';
import { getMockSubmissions, fetchData, callApi } from '../utils';

const SortableSubmission = SortableElement(({subData}) =>
  <div>
    <Submission 
      subData={subData} 
    />
  </div>
);

const SortableSubmissionList = SortableContainer(({submissions}) => {
  return (
    <div>
      {submissions.map((subData, index) => (
        <SortableSubmission key={`submission-${subData.id}`} index={subData.order} subData={subData} />
      ))}
    </div>
  );
});

export default class SubmissionsViewer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      submissions: [],
      release: null,
      loadingData: true
    }
  }

  componentDidMount() {
    this.fetchSubmissions();
  }

  componentDidUpdate(prevProps) {
    let refetch = false;

    // If there is a change in the path itself
    if (
      (prevProps.match && !this.props.match) ||
      (!prevProps.match && this.props.match)
    ) {
      refetch = true;
    } else {
      return;
    }

    // If the release id specifically changed
    if (prevProps.match.params.releaseId !== this.props.match.params.releaseId) {
      refetch = true;
    }

    if (refetch) {
      this.fetchSubmissions();
    }
  }

  fetchSubmissions() {
    if (this.props.mock) {
      this.setState({
        submissions: getMockSubmissions(),
        loadingData: false
      });
      return;
    }

    const releaseId = this.props.match.params.releaseId;
    let url = '/submissions';

    if (releaseId) {
      url = `/releases/${releaseId}/submissions`;
    }

    fetchData(url).then((submissions) => {
      this.setState({
        submissions: submissions
      });
    }).then(() => {
      if (releaseId) {
        fetchData(`/releases/${releaseId}`).then((release) => {
          this.setState({
            release: release,
            loadingData: false
          });
        });
      } else {
        this.setState({
          release: undefined,
          loadingData: false
        });
      }
    });
  }

  syncAllSubmissions() {
    this.state.submissions.forEach((sub) => {
      callApi(`/submissions`, "PUT", Object.assign({}, sub, {
        subId: sub.id
      }));
    });
  }

  loadingView() {
    if (this.state.loadingData) {
      return (
        <div className="loading-container">Loading!</div>
      );
    }
  }

  onSortEndSubmissions({oldIndex: oldOrder, newIndex: newOrder}) {

    // The position of the sub with order oldOrder in array
    const oldIndexPos = this.state.submissions.findIndex((sub) => sub.order === oldOrder);
    const newIndexPos = this.state.submissions.findIndex((sub) => sub.order === newOrder);

    const updatedSubmissions = arrayMove(this.state.submissions.map((sub) => {
      // Copy the object
      return Object.assign({}, sub);
    }), oldIndexPos, newIndexPos);

    for (let i = 0; i < this.state.submissions.length; i++) {
      updatedSubmissions[i].order = this.state.submissions[i].order;
    }

    this.setState({
      submissions: updatedSubmissions
    }, this.syncAllSubmissions);
  }


  getSubmissions() {
    return (
      <div className='submissions-container'>
        <SortableSubmissionList
          submissions={this.state.submissions}
          useDragHandle={true}
          onSortEnd={this.onSortEndSubmissions.bind(this)}
          lockAxis={"y"}
        />
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
    if (this.state.loadingData) {
      return '';
    }

    if (this.state.release) {
      return `Submissions for Release: '${this.state.release.name}'`;
    } else {
      return 'All Submissions';
    }
  }

  getNewSubmissionButton() {
    return (
      <Link to='/editor/submission' className='button-link'>
        Create New Submission
      </Link>
    );
  }

  render() {
    return (
      <div className="viewer">
        <div className='section-header'>
          <h1 className='section-title'>{this.getSectionTitle()}</h1>
        </div>
        {this.loadingView()}
        {this.getAllContent()}
        <hr />
        {this.getSubmissions()}
      </div>
    );
  }

}
