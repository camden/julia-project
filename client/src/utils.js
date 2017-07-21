import moment from 'moment';

import config from './config.json';

const getMockSubmissions = function() {
  return [
    {
      id: 1,
      order: 1,
      authorName: "Camden",
      contentTitle: "other title",
      category: "Announcements",
      content: "content!",
      createdDate: moment().format("ddd, hA")
    },
    {
      id: 2,
      order: 2, 
      authorName: "Julia",
      contentTitle: "best new feature",
      category: "General Info",
      content: "<madcap>content goes here</madcap>"
    },
    {
      id: 3,
      order: 12,
      authorName: "Camden",
      contentTitle: "cam is great",
      category: "Announcements",
      content: "content!",
      createdDate: moment().format("ddd, hA")
    }
  ]
}

const callApi = function(url, method, body) {
  return fetch(config.baseUrl + url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
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

const fetchData = function(apiUrl) {
  const url = config.baseUrl + apiUrl;
  return fetch(url, {
    method: 'GET'
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        throw err;
      });
    }
    return res.json();
  });
}

const formatDate = function(date) {
  return moment(date).format('MMM Do, YYYY');
}


module.exports = {
  getMockSubmissions,
  fetchData,
  callApi,
  formatDate
};
