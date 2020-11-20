module.exports = async function (req, res, proceed) {
  const { email } = req.allParams();
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.addFlash('error', `${email} does not belong to a user` );
      res.redirect('/');
    } else if (user.emailStatus === 'unconfirmed') {
      req.addFlash('error', 'This account has not been confirmed. Click on the link in the email sent to you to confirm.' );
      res.redirect('/');
    } else {
      return proceed();
    }
  } catch (error) {
    req.addFlash('error', error.message );
    res.redirect('/');
  }
};
