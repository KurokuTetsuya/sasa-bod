const { get } = require("superagent");
const { Canvas, blur } = require("canvas-constructor");

exports.exec = async (client, message, args) => {
  if (
        !args.length ||
        !message.mentions.members.size ||
        message.mentions.members.size < 2
      )
        return message.channel.send("Please mention at least 2 users!");
      const msg = await message.channel.send("Generating image...");
      const firstUser = message.mentions.members.first();
      const secondUser = message.mentions.members.array()[1];
      const { body: firstAvatar } = await get(
        firstUser.user.displayAvatarURL({ format: "png", size: 4096 })
      );
      const { body: secondAvatar } = await get(
        secondUser.user.displayAvatarURL({ format: "png", size: 4096 })
      );
      const { body: heart } = await get(
        "https://media.discordapp.net/attachments/714666844002451476/726784746717446194/heart_PNG51337.png?width=481&height=481"
      );
      const { body: background } = await get(
        "https://media.discordapp.net/attachments/714666844002451476/726789472359809094/68747470733a2f2f692e6962622e636f2f5844584a566b382f342e6a7067.png"
      );
      const createCanvas = () => {
        return new Canvas(500, 250)
          .addImage(background, 0, 0, 500, 250)
          .process(ctx => blur(ctx, 10))
          .addRoundImage(firstAvatar, 50, 70, 100, 100, 50, true)
          .addImage(heart, 200, 50, 100, 100)
          .addRoundImage(secondAvatar, 350, 70, 100, 100, 50, true)
          .setTextAlign("center")
          .setStroke("white")
          .setTextFont("10pt Impact")
          .setLineWidth(3)
          .addStrokeText(
            `${firstUser.user.username} & ${secondUser.user.username} is making love! Kalian masih jomblo?`,
            250,
            200
          )
          .addText(
            `${firstUser.user.username} & ${secondUser.user.username} is making love! Kalian masih jomblo?`,
            250,
            200
          )
          .toBufferAsync();
      };
      return msg.delete().then(async m =>
        m.channel.send(
          `Have a good relationship 🥰, ${firstUser.user.toString()} and ${secondUser.user.toString()}`,
          {
            files: [
              { attachment: await createCanvas(), name: "relationship.png" }
            ]
          }
        )
      );
}

exports.help = {
  name: "ship",
  description: "Jodohin orang",
  usage: "{prefix}ship <@orang pertama> <@orang kedua>",
  example: "{prefix}ship @rein @rein"
};

exports.conf = {
  aliases: ["jodohin"],
  cooldown: 5
};