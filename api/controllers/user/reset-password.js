module.exports = {


  friendlyName: 'Reset password',


  description: '',


  inputs: {
    password: {
      description: 'The new, unencrypted password.',
      example: 'myfancypassword',
      required: true,
    },
    token: {
      description:
        'The password token that was in the forgot-password endpoint',
      example: 'gwa8gs8hgw9h2g9hg29',
      required: true,
    },

  },


  exits: {
    success: {
      description:
        'Password successfully updated, and requesting user agent automatically logged in',
      responseType: 'redirect'
    },
    invalidToken: {
      statusCode: 401,
      description:
        'The provided password token is invalid, expired, or has already been used.',
      responseType: 'redirect'
    },

  },


  fn: async function (inputs, exits) {
    if (!inputs.token) {
      this.req.addFlash('error', 'Your reset token is either invalid or expired1');
      return exits.invalidToken('/', {
        error: 'Your reset token is either invalid or expired1',
      });
    }
    var user = await User.findOne({ passwordResetToken: inputs.token });
    if (!user || user.passwordResetTokenExpiresAt <= Date.now()) {
      this.req.addFlash('error', 'Your reset token is either invalid or expired2');
      return exits.invalidToken('/', {
        error: 'Your reset token is either invalid or expired2',
      });
    }
    const hashedPassword = await sails.helpers.passwords.hashPassword(
      inputs.password
    );

    await User.updateOne({ id: user.id }).set({
      password: hashedPassword,
      passwordResetToken: '',
      passwordResetTokenExpiresAt: 0,
    });

    const token = await sails.helpers.generateNewJwtToken(user.email);
    this.req.user = user;
    this.req.addFlash('success', `Password reset successful. ${user.email} has been logged in`);
    return exits.success('/', {
      message: `Password reset successful. ${user.email} has been logged in`,
      data: user,
      token,
    });

  }


};
