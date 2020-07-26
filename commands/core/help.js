const { MessageEmbed } = require("discord.js");

exports.exec = async (client, message, args) => {
  if (!args.length) {
    const embed = new MessageEmbed()
      .setAuthor(`${client.user.username}'s Commands List`)
      .setColor("RANDOM")
      .setDescription(
        `Hi, namaku \`${client.user.username}\`! Senang bertemu denganmu, **${message.author.username}**! Dibawah ini adalah list command di bot ini, jika kamu tidak mengerti cara menggunakannya, silahkan ketik perintah seperti ini: \`${client.config.prefix}help [nama command]\``
      )
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
      .setTimestamp()
      .setFooter(
        `• Message For: ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true, size: 4096 })
      );
    for (const category of client.categories.array()) {
      if (category.hide && !client.config.devs.includes(message.author.id))
        break;
      embed.addField(
        category.name,
        category.cmds.map(c => `\`${c}\``).join(", ")
      );
    }
    return message.channel.send(embed);
  } else {
    const cmd =
      client.commands.get(args[0]) ||
      client.commands.get(client.aliases.get(args[0]));
    if (!cmd)
      return message.channel.send(
        `Sepertinya aku tidak memiliki command dengan nama \`${args[0]}\`...`
      );
    const usage = cmd.help.usage
      ? `Don't know how to use this command? Easy, just use \`${cmd.help.usage}\``.replace(new RegExp("{prefix}"), client.config.prefix)
      : "No usage provided for this command.";
    const example = cmd.help.example
      ? `Still don't know? Okay, here the example: \`${cmd.help.example}\``.replace(new RegExp("{prefix}"), client.config.prefix)
      : "No example provided for this command.";
    const description = cmd.help.description
      ? cmd.help.description
      : "No description provided for this command.";
    const alias =
      cmd.conf.aliases.length === 0
        ? "No alias provided for this command."
        : `You can use this command with: ${cmd.conf.aliases
            .map(a => `\`${a}\``)
            .join(", ")}`;
    const cooldown = cmd.conf.cooldown
      ? `You just need wait \`${cmd.conf.cooldown}\` second(s) after using this command!`
      : "No cooldown provided, You're free!";
    const embed = new MessageEmbed()
      .setAuthor("📁 Advanced Help Command")
      .setDescription(
        `
\`[]\` Means Optional
\`<>\` Means Required
${
  cmd.conf.devOnly && !client.config.devs.includes(message.author.id)
    ? "\nSorry, but this command is developer only. How can you found this command?"
    : ""
}
\`\`\`${description}\`\`\`
            `
      )
      .setColor("RANDOM")
      .addField("Aliases", alias)
      .addField("Cooldown", cooldown)
      .addField("Usage", usage)
      .addField("Example", example);
    return message.channel.send(embed);
  }
};

exports.help = {
  name: "help",
  description: "Liat cmd list atau liat cara pake command",
  usage: "{prefix}help [nama command]",
  example: "{prefix}help talk"
};

exports.conf = {
  aliases: ["cmd", "h"],
  cooldown: 5,
  devOnly: false
};
