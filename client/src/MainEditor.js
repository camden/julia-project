import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';

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
        const titleOptions = [
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
            selectValue: titleOptions[0],
            authorName: "",
            titleOptions: titleOptions,
            titleText: "",
            output: "",
            submitting: false,
            submitted: false
        };

        this.onContentStateChange = this.onContentStateChange.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onTitleTextChange = this.onTitleTextChange.bind(this);
        this.onAuthorNameChange = this.onAuthorNameChange.bind(this);
        this.onProcessButtonClick = this.onProcessButtonClick.bind(this);
        this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
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
            selectValue: event.target.value
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

    onSubmitButtonClick() {
        this.setState({
            submitting: true
        });

        fetch(config.baseUrl + '/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: this.state.selectValue,
                content: this.state.output,
                authorName: this.state.authorName
            })
        }).then((res) => {
          if (!res.ok) {
            return res.json().then((err) => {
              throw err;
            });
          }
          return res.json();
        }).then((submission) => {
            console.log("New submission: ", submission);
        }).catch((err) => {
            throw err;
        });
    }

    getSelect() {
        const selectOptions = this.state.titleOptions.map((title) => {
            return (
                <option key={title} value={title}>{title}</option>
            );
        });

        return (
            <select value={this.state.selectValue} onChange={this.onSelectChange}>
                {selectOptions}
            </select>
        )
    }

    render() {
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
                <button onClick={this.onSubmitButtonClick}>Submit!</button>
            </div>
        );
    }
}
