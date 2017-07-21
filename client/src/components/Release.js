import React from 'react';
import { Link } from 'react-router-dom';
import { callApi, formatDate } from '../utils';

const deleteText = 'Delete this Release';
const confirmationText = 'Click again to delete!';
export default class Release extends React.Component {

  static get propTypes() {
    return {
      releaseData: React.PropTypes.object
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
      return callApi(`/releases/${this.props.releaseData.id}`, 'DELETE').then(() => {
        window.location.reload();
      });
    }

    this.setState({
      deleting: true
    })
  }

  render() {
    const rel = this.props.releaseData;

    return (
      <div className='release'>
        <div className='row'>
          <h3 className='release-item release-name'>
            {rel.name}
            <span className='release-type'>({rel.type})</span>
          </h3>
          <h3 className='release-item'>
            <div className='row info-row'>
              <span className='release-item-title'>Preview Begin Date</span>
            </div>
            <div className='row info-row'>
              {formatDate(rel.previewBeginDate)}
            </div>
          </h3>
          <h3 className='release-item'>
            <div className='row info-row'>
              <span className='release-item-title'>Production Begin Date</span>
            </div>
            <div className='row info-row'>
              {formatDate(rel.prodBeginDate)}
            </div>
          </h3>
        </div>
        <div className='row release-button-row'>
          <Link to={`/viewer/${rel.id}`} className='release-link'>View Submissions</Link>
          <Link to={`/editor/release/${rel.id}`} className='release-link'>Edit</Link>
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
    );
  }
}
