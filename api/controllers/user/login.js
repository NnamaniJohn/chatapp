module.exports = {


  friendlyName: 'Login',


  description: 'Login user.',


  inputs: {
    email: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },

  },


  exits: {
    success: {
      description: 'Login successful',
      responseType: 'redirect'
    },
    notAUser: {
      statusCode: 404,
      description: 'User not found',
      responseType: 'redirect'
    },
    passwordMismatch: {
      statusCode: 401,
      description: 'Password do not match',
      responseType: 'redirect'
    },
    operationalError: {
      statusCode: 400,
      description: 'The request was formed properly',
      responseType: 'redirect'
    }

  },


  fn: async function (inputs, exits) {
    try {
      const user = await User.findOne({ email: inputs.email });
      if (!user) {
        return exits.notAUser('/', {
          error: `An account belonging to ${inputs.email} was not found`,
        });
      }
      await sails.helpers.passwords
        .checkPassword(inputs.password, user.password)
        .intercept('incorrect', (error) => {
          this.req.addFlash('error', 'Incorrect password');
          exits.passwordMismatch('/', { error: error.message });
        });
      const token = await sails.helpers.generateNewJwtToken(user.email);
      this.req.session.userId = user.id;
      this.req.session.authenticated = true;

      this.req.user = user;

      this.req.addFlash('success', `${user.email} has been logged in`);

      return exits.success('/chat', {
        message: `${user.email} has been logged in`,
        data: user,
        token,
      });
    }
    catch (error) {
      sails.log.error(error);
      if (error.isOperational) {
        this.req.addFlash('error', 'Error logging in user ${inputs.email}');
        return exits.operationalError('/', {
          message: `Error logging in user ${inputs.email}`,
          error: error.raw,
        });
      }
      this.req.addFlash('error', 'Error logging in user ${inputs.email}');
      return exits.error('/', {
        message: `Error logging in user ${inputs.email}`,
        error: error.message,
      });
    }

  }


};
