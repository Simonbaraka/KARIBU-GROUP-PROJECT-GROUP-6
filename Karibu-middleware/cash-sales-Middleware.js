const userdetails = (req, res, next) => {
  let user = JSON.parse(req.get('user-details'));

  if (!user) {
    res.status(500).JSON({ message: 'Success' });
  }
};
