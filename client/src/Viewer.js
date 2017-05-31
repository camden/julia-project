import React from 'react';
import { Link } from 'react-router-dom';

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
        <li key={sub.id}>
          <div>Author: {sub.authorName}</div>
          <div>Category: {sub.category}</div>
          <div>Title: {sub.contentTitle}</div>
          <Link to={`/editor/${sub.id}`}>Edit this submission</Link>
          <pre>{sub.content}</pre>
        </li>
      );
    });

    return (
      <ul>
        {subs}
      </ul>
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
          <div>
            <h3>{category}</h3>
            <pre className="output">
              {this.state.submissions.filter((sub) => {
                return sub.category === category;
              }).map((sub) => {
                return (
                  <div>
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
