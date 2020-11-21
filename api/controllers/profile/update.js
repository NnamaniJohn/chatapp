module.exports = {


  friendlyName: 'Update',


  description: 'Update profile.',


  inputs: {
    profileId: {
      type: 'number',
      required: true,
    },
    firstname: {
      type: 'string',
    },
    lastname: {
      type: 'string',
    },
    location: {
      type: 'string',
    },
    bio: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },

  },


  exits: {
    success: {
      description: 'Login successful',
      responseType: 'redirect'
    },
    notFound: {
      statusCode: 404,
      description: 'Profile not found',
      responseType: 'redirect'
    },

  },


  fn: async function (inputs, exits) {

    try {
      let profile = await Profile.updateOne({ id: inputs.profileId }).set({
        bio: inputs.bio,
        location: inputs.location,
        avatar: inputs.avatar,
      });
      if (!profile) {
        this.req.addFlash('error', `Profile was not found`);
        return exits.notFound('/', {
          error: `Profile was not found`,
        });
      }
      let user = await User.updateOne({ id: profile.userId }).set({
        firstname: inputs.firstname,
        lastname: inputs.lastname,
      });
      if (!user) {
        this.req.addFlash('error', `An account was not found`);
        return exits.notFound('/', {
          error: `An account was not found`,
        });
      }

      this.req.addFlash('success', 'profile updated');

      return exits.success('/profile/' + user.id, {
        message: 'profile updated',
      });
    } catch (error) {
      this.req.addFlash('error', 'an error occurred');
      return exits.error({
        message: 'an error occurred',
        error: error.message,
      });
    }

  }


};
