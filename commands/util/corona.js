const { MessageEmbed } = require("discord.js");
const { get } = require("superagent");

exports.exec = async (client, message, args) => {
  if (!args.length) return message.channel.send("Please enter a valid city.");
  const BASE_URL = "https://indonesia-covid-19-api.now.sh/api/";
  const { body: allProvinsi } = await get(`${BASE_URL}/provinsi`);
  const { body: indonesia } = await get(BASE_URL);
  if (!allProvinsi || !indonesia)
    return message.channel.send(
      "The API is currently down. Please try again later."
    );
  if (
    !allProvinsi.data
      .map(p => p.provinsi.toLowerCase())
      .includes(args.join(" ").toLowerCase()) &&
    args[0].toLowerCase() !== "indonesia"
  )
    return message.channel.send(
      `Provinsi dengan nama \`${args.join(" ")}\` tidak tersedia.`
    );
  if (args[0].toLowerCase() === "indonesia") {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor("Indonesia Corona Information")
        .setColor("RED")
        .addField("Confirmed Case", `${indonesia.jumlahKasus} Cases`)
        .addField("Recovered", `${indonesia.sembuh} People`)
        .addField("Death", `${indonesia.meninggal} People`)
        .setFooter(
          `Data from ${BASE_URL}`,
          message.author.displayAvatarURL({
            format: "png",
            size: 4096,
            dynamic: true
          })
        )
    );
  }
  const selectedProvinsi = allProvinsi.data.find(
    p => p.provinsi.toLowerCase() === args.join(" ").toLowerCase()
  );
  if (selectedProvinsi) {
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(`${selectedProvinsi.provinsi} Corona Information`)
        .setColor("RED")
        .addField("Confirmed Case", `${selectedProvinsi.kasusPosi} Cases`)
        .addField("Recovered", `${selectedProvinsi.kasusSemb} People`)
        .addField("Death", `${selectedProvinsi.kasusMeni} People`)
        .setFooter(
          `Data from ${BASE_URL}`,
          message.author.displayAvatarURL({
            format: "png",
            size: 4096,
            dynamic: true
          })
        )
    );
  }
}

exports.help = {
  name: "corona",
  description: "Liat statistik corona di indon",
  usage: "{prefix}corona <provinsi>",
  example: "{prefix}corona Jawa Timur"
}

exports.conf = {
  aliases: ["corontod"],
  cooldown: 5,
  devOnly: false
}