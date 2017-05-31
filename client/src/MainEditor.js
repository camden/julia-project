import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { 
  convertToRaw, 
  convertFromRaw, 
  EditorState 
} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { Link } from 'react-router-dom';

import config from './config.json';
import './main.css';
import getDropdownMarkup from "./getDropdownMarkup";

//TODO refactor
const toolbar = {
  options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
  fontFamily: {
    options: ['Arial', 'Courier']
  },
};

export default class MainEditor extends React.Component {
  constructor(props) {
    super(props);
    const categoryOptions = [
      "Preview New Features (GA)",
      "Preview Early Access",
      "Bug Fixes",
      "Application Integrations",
      "Announcements",
      "Mobile Releases"
    ];
    this.state = {
      contentState: null,
      editorState: EditorState.createEmpty(),
      category: categoryOptions[0],
      authorName: "",
      categoryOptions: categoryOptions,
      titleText: "",
      output: "",
      submitting: false,
      submitted: false,
      newPost: true,
      submissionId: -1,
      loadingData: true
    };

    this.onContentStateChange = this.onContentStateChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onTitleTextChange = this.onTitleTextChange.bind(this);
    this.onAuthorNameChange = this.onAuthorNameChange.bind(this);
    this.onProcessButtonClick = this.onProcessButtonClick.bind(this);
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
  }

  componentDidMount() {
    this.loadDataIfURLParam();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.titleText !== prevState.titleText ||
      this.state.authorName !== prevState.authorName ||
      this.state.category !== prevState.category ||
      this.state.contentState !== prevState.contentState
    ) {
      this.makeOutput();
    }
  }

  loadDataIfURLParam() {
    if (this.props.match.params.subId) {
      const subId = this.props.match.params.subId;

      this.setState({
        loadingData: true,
        newPost: false,
        submissionId: subId
      });

      this.loadDataByPostId(subId);
    } else {
      this.setState({
        loadingData: false,
      });
    }
  }

  loadDataByPostId(subId) {
    fetch(`${config.baseUrl}/submissions/${subId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw err;
        });
      }
      return res.json();
    }).then((submission) => {
      console.log("got", submission);
      this.setState({
        loadingData: false,
        titleText: submission.contentTitle,
        authorName: submission.authorName,
        contentState: submission.rawContentWithoutTitle,
        editorState: EditorState.createWithContent(
          convertFromRaw(
            JSON.parse(submission.rawContentWithoutTitle)
          )
        ),
        category: submission.category
      })
    }).catch((err) => {
      this.setState({
        loadingData: false,
      });
      throw err;
    });
  }

  onContentStateChange(contentState) {
    this.setState({
      contentState
    });
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState
    }, () => {
      this.makeOutput();
    });
  }

  onSelectChange(event) {
    this.setState({
      category: event.target.value
    }, () => {
      this.makeOutput();
    });
  }

  onTitleTextChange(event) {
    this.setState({
      titleText: event.target.value
    }, () => {
      this.makeOutput();
    });
  }

  onAuthorNameChange(event) {
    this.setState({
      authorName: event.target.value
    });
  }

  makeOutput() {
    const bodyText = draftToHtml(this.state.contentState);
    const nextOutput = getDropdownMarkup(this.state.titleText, bodyText);
    this.setState({
      output: nextOutput
    });
  }

  onProcessButtonClick() {
    this.makeOutput();
  }

  submitNewPost() {
    this.setState({
      submitting: true,
      submitted: false
    });

    this.makeOutput();

    this.callSubmissionApi('POST').then((submission) => {
      console.log("New submission: ", submission);
      this.setState({
        submitting: false,
        submitted: true
      });
    });
  }

  // returns a promise with the new/updated submission
  callSubmissionApi(method) {
    return fetch(config.baseUrl + '/submissions', {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category: this.state.category,
        content: this.state.output,
        contentTitle: this.state.titleText,
        rawContentWithoutTitle: JSON.stringify(
          convertToRaw(this.state.editorState.getCurrentContent())
        ),
        authorName: this.state.authorName,
        subId: this.state.submissionId
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

  updatePost() {
    this.setState({
      submitting: true,
      submitted: false
    });
    this.callSubmissionApi('PUT').then((submission) => {
      console.log("updated:", submission);
      this.setState({
        submitting: false,
        submitted: true
      });
    });
  }

  onSubmitButtonClick() {
    if (this.state.newPost) {
      this.submitNewPost();
    } else {
      this.updatePost();
    }
  }

  getSelect() {
    const selectOptions = this.state.categoryOptions.map((title) => {
      return (
        <option key={title} value={title}>{title}</option>
      );
    });

    return (
      <select value={this.state.category} onChange={this.onSelectChange}>
        {selectOptions}
      </select>
    )
  }

  submittedView() {
    return (
      <Link to="/">Return to Homepage</Link>
    );
  }

  getSubmitButtonText() {
    if (this.state.newPost) {
      return "Submit";
    } else {
      return "Update Submission"
    }
  }

  loadingView() {
    if (this.state.loadingData || this.state.submitting) {
      return (
        <div className="loading-container">Loading!</div>
      );
    }
  }

  editorView() {
    const editorState = this.state.editorState;
    return (
      <div className="editor-container">
        <div className="editor-input"><span className="editor-input-label">Your Name:</span> <input type="text" value={this.state.authorName} onChange={this.onAuthorNameChange} /></div>
        <div className="editor-input"><span className="editor-input-label">Content Options:</span> {this.getSelect()}</div>
        <div className="editor-input"><span className="editor-input-label">Dropdown Title:</span> <input type="text" value={this.state.titleText} onChange={this.onTitleTextChange} /></div>
        <Editor
          toolbar={toolbar}
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          onContentStateChange={this.onContentStateChange}
        />
        <button onClick={this.onProcessButtonClick}>Process!</button>
        <hr/>
        <h2>Output:</h2>
        <pre className="output">{this.state.output}</pre>
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
