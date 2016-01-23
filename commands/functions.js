deleteMessage500 = (msg) => {
    bot.deleteMessage(msg, {
      wait: 5000
  }, (err) => {
      if (err) {
        console.log(err);
    }
  });
};

module.exports = {
    deleteMessage500: deleteMessage500
};
