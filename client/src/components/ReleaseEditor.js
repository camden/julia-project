import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import config from '../config.json';
import utils from '../utils';

export default class ReleaseEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      submissions: [],
      type: "minor",
      // TODO set default dates
      previewBeginDate: moment(),
      prodBeginDate: moment(),
      submitting: false,
      submitted: false,
      newRelease: true,
      releaseId: -1,
      loadingData: true
    };

    this.handlePreviewDatePickerChange = this.handlePreviewDatePickerChange.bind(this);
    this.handleProdDatePickerChange = this.handleProdDatePickerChange.bind(this);
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onTypeSelectChange = this.onTypeSelectChange.bind(this);
  }

  componentDidMount() {
    this.loadDataIfURLParam();
  }

  loadDataIfURLParam() {
    if (this.props.match.params.relId) {
      const relId = this.props.match.params.relId;

      this.setState({
        loadingData: true,
        newRelease: false,
        releaseId: relId
      });

      this.loadDataByRelease(relId);
    } else {
      this.setState({
        loadingData: false,
      });
    }
  }

  loadDataByRelease(relId) {
    utils.fetchData(`/releases/${relId}`).then((release) => {
      this.setState({
        loadingData: false,
        name: release.name,
        type: release.type,
        previewBeginDate: release.previewBeginDate,
        prodBeginDate: release.prodBeginDate
      })
    }).catch((err) => {
      this.setState({
        loadingData: false,
      });
      throw err;
    });
  }

  submitNewRelease() {
    this.setState({
      submitting: true,
      submitted: false
    });

    this.callReleaseApi('POST').then((release) => {
      console.log("New release: ", release);
      this.setState({
        submitting: false,
        submitted: true
      });
    });
  }

  // returns a promise with the new/updated submission
  callReleaseApi(method) {
    return fetch(config.baseUrl + '/releases', {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        type: this.state.type,
        previewBeginDate: this.state.previewBeginDate,
        prodBeginDate: this.state.prodBeginDate,
        releaseId: this.state.releaseId
      })
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw err;
        });
      }
      return res.json();
    }).catch((err) => {
      throw err;
    });
  }

  updateRelease() {
    this.setState({
      submitting: true,
      submitted: false
    });
    this.callReleaseApi('PUT').then((release) => {
      console.log("updated:", release);
      this.setState({
        submitting: false,
        submitted: true
      });
    });
  }

  onSubmitButtonClick() {
    if (this.state.newRelease) {
      this.submitNewRelease();
    } else {
      this.updateRelease();
    }
  }

  submittedView() {
    return (
      <Link to="/">Return to Homepage</Link>
    );
  }

  onNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  onTypeSelectChange(event) {
    this.setState({
      type: event.target.value
    });
  }

  getSubmitButtonText() {
    if (this.state.newRelease) {
      return "Submit";
    } else {
      return "Update Release"
    }
  }

  loadingView() {
    if (this.state.loadingData || this.state.submitting) {
      return (
        <div className="loading-container">Loading!</div>
      );
    }
  }

  handlePreviewDatePickerChange(newDate) {
    this.setState({
      previewBeginDate: newDate
    });
  }

  handleProdDatePickerChange(newDate) {
    this.setState({
      prodBeginDate: newDate
    });
  }

  getTypeSelect() {
    return (
      <select value={this.state.type} onChange={this.onTypeSelectChange}>
        <option value='minor'>Minor</option>
        <option value='major'>Major</option>
      </select>
    )
  }

  editorView() {
    const editorState = this.state.editorState;
    return (
      <div className="editor-container">
        <div className="editor-input">
          <span className="editor-input-label">Release Name:</span> <input type="text" value={this.state.name} onChange={this.onNameChange} />
      </div>
        <div className="editor-input">
          <span className="editor-input-label">Type:</span> {this.getTypeSelect()}
        </div>
        <div className="editor-input">
          <span className="editor-input-label">Preview Begin Date:</span>
          <DatePicker selected={this.state.previewBeginDate} onChange={this.handlePreviewDatePickerChange} />
        </div>
        <div className="editor-input">
          <span className="editor-input-label">Prod Begin Date:</span>
          <DatePicker selected={this.state.prodBeginDate} onChange={this.handleProdDatePickerChange} />
        </div>
        <button onClick={this.onSubmitButtonClick}>{this.getSubmitButtonText()}</button>
      </div>
    );
  }

  getMainView() {
    if (this.state.submitted) {
    // TODO: route to "/submitted" route
      return this.submittedView();
    } else {
      return this.editorView();
    }
  }

  render() {
    return (
      <div>
        {this.loadingView()}
        {this.getMainView()}
      </div>
    )
  }
}
