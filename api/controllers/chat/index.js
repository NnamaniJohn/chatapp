module.exports = {


  friendlyName: 'Index',


  description: 'Index chat.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    return this.res.view('pages/chatroom');

  }


};
