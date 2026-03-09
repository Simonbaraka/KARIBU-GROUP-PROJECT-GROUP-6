function authorizeBranch(req, res, next) {
  try {
    const userBranch = req.user.branch; // from JWT
    const requestBranch = req.body.Branch;

    if (userBranch !== requestBranch) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You cannot modify another branch's data",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Branch authorization failed',
    });
  }
}

module.exports = { authorizeBranch };
