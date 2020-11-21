module.exports = {


  friendlyName: 'Index',


  description: 'Index profile.',


  inputs: {
    userId: {
      type: 'number',
      required: true,
    },

  },


  exits: {
    notFound: {
      statusCode: 404,
      description: 'Profile not found',
      responseType: 'redirect'
    },

  },


  fn: async function (inputs, exits) {

    try {
      let user = await User.findOne({ id: inputs.userId });
      let profile = await Profile.findOne({ userId: inputs.userId });
      if (!user) {
        this.req.addFlash('error', `An account was not found`);
        return exits.notFound('/', {
          error: `An account was not found`,
        });
      }
      if (!profile) {
        this.req.addFlash('error', `Profile was not found`);
        return exits.notFound('/', {
          error: `Profile was not found`,
        });
      }
      profile.firstname = user.firstname;
      profile.lastname = user.lastname;
      return this.res.view('pages/profile', { profile });
    } catch (error) {
      this.req.addFlash('error', 'an error occurred');
      return exits.error({
        message: 'an error occurred',
        error: error.message,
      });
    }

  }


};
