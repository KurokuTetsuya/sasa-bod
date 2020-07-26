const { MessageEmbed, UserFlags, Util } = require("discord.js");

exports.exec = async (client, message, args) => {
  const allFlags = Object.entries(UserFlags.FLAGS)
        .filter(f => !["SYSTEM", "TEAM_USER"].includes(f[0]))
        .map(f =>
          this.toTitleCase(
            f[0]
              .replace(new RegExp("_", "gi"), " ")
              .replace(new RegExp("House", "gi"), "Hypesquad")
          )
        );
      if (
        !args.length ||
        !allFlags
          .map(f => f.toLowerCase())
          .includes(args.join(" ").toLowerCase())
      )
        return message.channel.send(
          `Invalid types, valid ones are: ${allFlags
            .map(x => `\`${x}\``)
            .join(", ")}`
        );
      const selectedFlag = args
        .join(" ")
        .replace(/ +/g, "_")
        .replace(new RegExp("Hypesquad", "gi"), "House")
        .toUpperCase();
      const users = message.guild.members.cache.filter(
        m => m.user.flags && m.user.flags.has(selectedFlag)
      );
      if (!users.size)
        return message.channel.send(
          `There is no user that have \`${this.toTitleCase(
            args.join(" ")
          )}\` badge.`
        );
      const embed = new MessageEmbed()
        .setAuthor(`Users with ${this.toTitleCase(args.join(" "))} badge`)
        .setColor("RANDOM")
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }));
      if (users.size < 11) {
        return message.channel.send(
          embed
            .setDescription(
              users
                .sort((a, b) => a.user.username.localeCompare(b.user.username))
                .map(
                  ({ user, id }) =>
                    `${Util.escapeMarkdown(user.tag)} \`[${id}]\``
                )
                .join("\n")
            )
            .setFooter(
              `• Message for ${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true, size: 4096 })
            )
        );
      } else {
        let index = 0;
        const userList = this.chunk(
          users
            .sort((a, b) => a.user.username.localeCompare(b.user.username))
            .map(
              ({ user, id }) => `${Util.escapeMarkdown(user.tag)} \`[${id}]\``
            ),
          10
        );
        embed.setDescription(userList[index].join("\n"));
        embed.setFooter(`• Page ${index + 1} of ${userList.length}`);
        const msg = await message.channel.send(embed);
        await msg.react("⬅");
        await msg.react("🔴");
        await msg.react("➡");
        awaitReactions();
        async function awaitReactions() {
          const filter = (rect, usr) =>
            ["⬅", "🔴", "➡"].includes(rect.emoji.name) &&
            usr.id === message.author.id;
          msg
            .createReactionCollector(filter, { time: 30000, max: 1 })
            .on("collect", col => {
              if (col.emoji.name === "🔴") return msg.delete();
              if (col.emoji.name === "⬅") index--;
              if (col.emoji.name === "➡") index++;
              index =
                ((index % userList.length) + userList.length) % userList.length;
              embed.setDescription(userList[index].join("\n"));
              embed.setFooter(`• Page ${index + 1} of ${userList.length}`);
              msg.edit(embed);
              return awaitReactions();
            });
        }
      }
}

exports.help = {
  name: "userbadge",
  description: "Liat user list yang punya badge tertentu",
  usage: "{prefix}userbadge <badge>",
  example: "{prefix}userbadge Verified Developer"
};

exports.conf = {
  aliases: ["ubadge"],
  cooldown: 5
};

exports.toTitleCase = string => {
  let sentence = string.toLowerCase().split(" ");
  for (var i = 0; i < sentence.length; i++) {
    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
  }
  return sentence.join(" ");
};

exports.chunk = (array, chunkSize) => {
  const temp = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    temp.push(array.slice(i, i + chunkSize));
  }
  return temp;
};
