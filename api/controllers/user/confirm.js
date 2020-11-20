module.exports = {


  friendlyName: 'Confirm',


  description: 'Confirm user.',


  inputs: {
    token: {
      type: 'string',
      description: 'The confirmation token from the email.',
      example: '4-32fad81jdaf$329',
    },

  },


  exits: {
    success: {
      description: 'Email address confirmed and requesting user logged in.',
      responseType: 'redirect'
    },
    invalidOrExpiredToken: {
      statusCode: 400,
      description:
        'The provided token is expired, invalid, or already used up.',
      responseType: 'redirect'
    },

  },


  fn: async function (inputs, exits) {

    if (!inputs.token) {
      this.req.addFlash('error', 'The provided token is expired, invalid, or already used up.');
      return exits.invalidOrExpiredToken('/', {
        error: 'The provided token is expired, invalid, or already used up.',
      });
    }

    var user = await User.findOne({ emailProofToken: inputs.token });
    if (!user || user.emailProofTokenExpiresAt <= Date.now()) {
      this.req.addFlash('error', 'The provided token is expired, invalid, or already used up.');
      return exits.invalidOrExpiredToken('/', {
        error: 'The provided token is expired, invalid, or already used up.',
      });
    }

    if (user.emailStatus === 'unconfirmed') {
      await User.updateOne({ id: user.id }).set({
        emailStatus: 'confirmed',
        emailProofToken: '',
        emailProofTokenExpiresAt: 0,
      });
      this.req.addFlash('success', 'Your account has been confirmed');
      return exits.success('/', {
        message: 'Your account has been confirmed',
      });
    }

  }


};
