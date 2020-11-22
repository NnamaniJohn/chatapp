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

      var data = [];
      let ids = [];
      if (msgs) {
        for (var i = 0; i < msgs.length; i++) {
          let user = await User.findOne({ id: msgs[i].userId });
          if (!user) {
            this.req.addFlash('error', `User was not found`);
            return exits.notFound('/', {
              error: `User was not found`,
            });
          }
          let profile = await Profile.findOne({ userId: msgs[i].userId });
          if (!profile) {
            this.req.addFlash('error', `Profile was not found`);
            return exits.notFound('/', {
              error: `Profile was not found`,
            });
          }
          var u = {};
          u.avatar = profile.avatar;
          u.createdBy = user.lastname + ' ' + user.firstname;
          u.message = msgs[i].message;
          data.push(u);
          ids.push(msgs[i].id);
        }
      }
      ChatMessage.subscribe(ids);

      return exits.success(data);
    } catch (error) {
      this.req.addFlash('error', 'an error occurred');
      return exits.error({
        message: 'an error occurred',
        error: error.message,
      });
    }

  }


};
