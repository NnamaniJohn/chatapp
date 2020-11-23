module.exports = {


  friendlyName: 'Message',


  description: 'Message chat.',


  inputs: {

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
      let msgs = await ChatMessage.find({});
      if (msgs) {
        for (var i = 0; i < msgs.length; i++) {
          let user = await User.findOne({ id: msgs[i].createdBy });
          if (!user) {
            this.req.addFlash('error', `User was not found`);
            return exits.notFound('/', {
              error: `User was not found`,
            });
          }
          let profile = await Profile.findOne({ userId: msgs[i].createdBy });
          if (!profile) {
            this.req.addFlash('error', `Profile was not found`);
            return exits.notFound('/', {
              error: `Profile was not found`,
            });
          }
          msgs[i].avatar = profile.avatar;
          msgs[i].createdBy = user.lastname + ' ' + user.firstname;
        }
      }

      return exits.success(msgs);
    } catch (error) {
      this.req.addFlash('error', 'an error occurred');
      return exits.error({
        message: 'an error occurred',
        error: error.message,
      });
    }

  }


};
