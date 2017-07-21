import React from 'react';
import { Link } from 'react-router-dom';
import { callApi } from '../utils';

const deleteText = 'Delete this Submission';
const confirmationText = 'Click here again to delete!';
export default class Submission extends React.Component {

  static get propTypes() {
    return {
      subData: React.PropTypes.object
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      deleting: false
    };

    this.deleteButtonPress = this.deleteButtonPress.bind(this);
    this.deleteButtonLeave = this.deleteButtonLeave.bind(this);
  }

  deleteButtonLeave() {
    this.setState({
      deleting: false
    });
  }

  deleteButtonPress() {
    if (this.state.deleting) {
      return callApi(`/submissions/${this.props.subData.id}`, 'DELETE').then(() => {
        window.location.reload();
      });
    }

    this.setState({
      deleting: true
    })
  }

  render() {
    const sub = this.props.subData;

    // TODO the delete button can easily be refactored into a separate component
    return (
      <div className='submission' key={sub.id}>
        <div className='submission-author'>Author: {sub.authorName}</div>
        <div className='submission-category'>Category: {sub.category}</div>
        <div className='submission-title'>Title: {sub.contentTitle}</div>
        <div className='submission-created-date'>{sub.createdDate}</div>
        <div className='submission-release'>Release: {sub.release ? sub.release.name : '[RELEASE DELETED]'}</div>
        <Link to={`/editor/submission/${sub.id}`} className='release-link'>Edit this submission</Link>
        <div
          onClick={this.deleteButtonPress}
          onMouseLeave={this.deleteButtonLeave}
          className='release-link warning'
        >
          {
            this.state.deleting ?
              confirmationText
              :
              deleteText
          }

        </div>
        <pre className='submission-content'>{sub.content}</pre>
      </div>
    );
  }
}
