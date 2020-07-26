exports.exec = async (client, message, args) => {
  return message.reply(`🏓 | Pooooooooooooong, \`${client.ws.ping}\`ms`);
};

exports.help = {
  name: "ping",
  description: "Liat ping si sasa bot"
};

exports.conf = {
  aliases: ["pong"],
  cooldown: 5,
  devOnly: false
};
