import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  SortableHandle
} from 'react-sortable-hoc';

import { callApi } from '../utils';

const deleteText = 'Delete this Submission';
const confirmationText = 'Click again to delete!';

const DragHandle = SortableHandle(() =>
  <div className='submission-drag-handle'>⌖</div>
);

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
        <div className='submission-drag-area'>
          <DragHandle />
        </div>
        <div className='submission-main'>
          <div className='submission-header'>
            <div className='submission-info'>
              <div className='submission-author'>Author: {sub.authorName}</div>
              <div className='submission-category'>Category: {sub.category}</div>
              <div className='submission-title'>Title: {sub.contentTitle}</div>
              <div className='submission-created-date'>{moment(sub.createdDate).format('MMM. Do, YYYY [at] h:mm A z')}</div>
              <div className='submission-release'>Release: {sub.release ? sub.release.name : '[RELEASE DELETED]'}</div>
            </div>
            <div className='submission-buttons'>
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
            </div>
          </div>
          <pre className='submission-content'>{sub.content}</pre>
        </div>
      </div>
    );
  }
}
