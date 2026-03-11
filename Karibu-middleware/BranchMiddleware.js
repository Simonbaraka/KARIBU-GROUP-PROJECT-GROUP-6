function authorizeBranch(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: no user found',
      });
    }

    // Directors can access any branch
    if (req.user.role === 'Director') {
      return next();
    }

    // ✅ Skip branch check if there's no body (GET, DELETE requests)
    if (!req.body || !req.body.Branch) {
      return next();
    }

    const userBranch = req.user.branch;
    const requestBranch = req.body.Branch;

    if (userBranch !== requestBranch) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You cannot modify another branch's data",
      });
    }

    next();
  } catch (error) {
    console.error('ERROR ', error);
    res.status(500).json({
      success: false,
      message: 'Branch authorization failed',
    });
  }
}

module.exports = { authorizeBranch };
