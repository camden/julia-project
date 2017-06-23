const processRes = (res, err, data) => {
  if (err) {
    res.send(err);
    return;
  }

  if (data === undefined || data === null) {
    res.status(404).send('Not found.');
    return;
  }

  res.json(data);
}

module.exports = {
  processRes
};
