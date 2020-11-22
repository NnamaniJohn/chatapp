module.exports = async function (req, res, proceed) {
  try {
    if (!req.session.authenticated) {
      req.addFlash('error', 'You are not loged in' );
      res.redirect('/');
    }else {
      return proceed();
    }

  } catch (error) {
    req.addFlash('error', error.message );
    res.redirect('/');
  }
};
