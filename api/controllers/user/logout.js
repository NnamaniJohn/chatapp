module.exports = {


  friendlyName: 'Logout',


  description: 'Logout user.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    this.req.session.userId = null;
    this.req.session.authenticated = false;
    this.res.redirect('/');

  }


};
