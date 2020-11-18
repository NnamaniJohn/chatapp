module.exports = {


  friendlyName: 'Register',


  description: 'Register user.',


  inputs: {
    firstname: {
      type: 'string',
      required: true,
    },
    lastname: {
      type: 'string',
      required: true,
    },
    username: {
      type: 'string',
      required: true,
      unique: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6,
    },

  },


  exits: {
    success: {
      statusCode: 201,
      description: 'New user created successfully',
    },
    alreadyInUse: {
      statusCode: 400,
      description: 'Username or Email already in use',
    },
    error: {
      description: 'An error occured please try again later.',
    },

  },


  fn: async function (inputs, exits) {

    try {
      const newEmailAddress = inputs.email.toLowerCase();
      const token = await sails.helpers.strings.random('url-friendly');

      let newUser = await User.create({
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        username: inputs.username,
        email: newEmailAddress,
        password: inputs.password,
        emailProofToken: token,
        emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
      }).fetch();

      const confirmLink = `${sails.config.custom.baseUrl}/user/confirm?token=${token}`;
      const email = {
        to: newUser.email,
        subject: 'Confirm Your account',
        template: 'emails/confirm',
        context: {
          name: newUser.fullName,
          confirmLink: confirmLink,
        },
      };
      await sails.helpers.sendMail(email);

      return exits.success({
        message: `An account has been created for ${newUser.email} successfully. Check your email to verify`,
      });

    }
    catch (error) {
      if (error.code === 'E_UNIQUE') {
        return exits.alreadyInUse({
          message: 'Oops :) an error occurred',
          error: 'This username or email address already exits',
        });
      }
      return exits.error({
        message: 'Oops :) an error occurred',
        error: error.message,
      });
    }

  }


};
