const getMockSubmissions = function() {
  return [
    {
      id: 1,
      authorName: "Camden",
      titleText: "best new feature",
      category: "Announcements",
      content: "content!"
    }
  ]
}

module.exports = {
  getMockSubmissions
};
