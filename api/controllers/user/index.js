module.exports = {


  friendlyName: 'Index',


  description: 'Index user.',


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
      let user = await User.find({});

      var data = [];
      let ids = [];
      if (user) {
        for (var i = 0; i < user.length; i++) {
          let profile = await Profile.findOne({ userId: user[i].id });
          if (!profile) {
            this.req.addFlash('error', `Profile was not found`);
            return exits.notFound('/', {
              error: `Profile was not found`,
            });
          }
          var u = {};
          u.avatar = profile.avatar;
          u.fullname = user[i].lastname + ' ' + user[i].firstname;
          data.push(u);
          ids.push(user[i].id);
        }
      }

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
