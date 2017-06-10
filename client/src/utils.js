import moment from 'moment';

const getMockSubmissions = function() {
  return [
    {
      id: 1,
      authorName: "Camden",
      contentTitle: "best new feature",
      category: "Announcements",
      content: "content!",
      createdDate: moment().format("ddd, hA")
    },
    {
      id: 2,
      authorName: "Julia",
      contentTitle: "best new feature",
      category: "General Info",
      content: "<madcap>content goes here</madcap>"
    }
  ]
}

module.exports = {
  getMockSubmissions
};
