module.exports = {


  friendlyName: 'Postmessage',


  description: 'Postmessage chat.',


  inputs: {
    id: {
      type: 'number',
    },
    message: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    if (!this.req.isSocket) {
      return this.res.badRequest();
    }

    try {
      let user = await User.findOne({id: inputs.id});
      let msg = await ChatMessage.create({message:inputs.message, createdBy:user.id }).fetch();
      if(!msg.id) {
        throw new Error('Message processing failed!');
      }
      msg.createdBy = user.id;
      ChatMessage.publish([msg.id], msg);

    } catch(err) {
      return this.res.serverError(err);
    }


  }


};
