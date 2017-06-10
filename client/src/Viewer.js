import React from 'react';
import { Link } from 'react-router-dom';

import { getMockSubmissions } from './utils';
import config from './config.json';

export default class Viewer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      submissions: []
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
    const url = config.baseUrl + '/submissions';
    // const url = 'https://jsonplaceholder.typicode.com/posts';
    fetch(url, {
      method: 'GET'
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((err) => {
          throw err;
        });
      }
      return res.json();
    }).then((submissions) => {
      this.setState({
        submissions: submissions
      });
    }).catch((err) => {
      throw err;
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
      <div>
        {subsByCategory}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.getAllContent()}
        <hr />
        {this.getSubmissions()}
      </div>
    );
  }

}
