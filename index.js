const { Client, Collection } = require("discord.js");
const client = new Client();
const { TOKEN } = process.env;
const { readdirSync } = require("fs");
const app = require("express")();

app.listen(process.env.PORT);
app.get("/", (req, res) => {
  res.sendStatus(200);
});

client.config = require("./config.json");
client.on("ready", async () => {
  client.commands = new Collection();
  client.aliases = new Collection();
  client.categories = new Collection();
  client.cooldowns = new Collection();
  const categories = readdirSync("./commands");
  for (const category of categories) {
    const cmds = readdirSync(`./commands/${category}`).filter(f =>
      f.endsWith(".js")
    );
    const module = require(`./commands/${category}/module.json`);
    if (!module) {
      throw Error(`Couldn't find module.json in ${category} category.`);
      break;
    }
    for (const f of cmds) {
      module.cmds = [];
      const cmd = require(`./commands/${category}/${f}`);
      if (!cmd.exec) return;
      client.commands.set(cmd.help.name, cmd);
      console.log(`Loaded ${cmd.help.name} command`);
      module.cmds.push(cmd.help.name);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
    }
    client.categories.set(module.name, module);
  }
  console.log(`${client.user.tag} nggeus online aing teh anying.`);
  client.user.setActivity("Made by: Sasa tepung micin", { type: "PLAYING" });
});

client.on("debug", console.info);

client.on("message", async message => {
  if (
    !message.guild ||
    message.author.bot ||
    !message.content.startsWith(client.config.prefix)
  )
    return;
  const args = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args[0].toLowerCase();
  args.shift();
  const command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (
    !command ||
    (command &&
      command.devOnly &&
      !client.config.devs.includes(message.author.id))
  )
    return;
  if (!client.cooldowns.has(command.help.name)) {
    client.cooldowns.set(command.help.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.conf.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Tunggu \`${timeLeft.toFixed(1)}\` detik lagi sebelum make \`${
          command.help.name
        }\` command lagi. Yang sabar kak!`
      );
    }
  }
  try {
    command.exec(client, message, args);
  } catch (e) {
    console.error(`Error while executing ${cmd} command: ${e.stack}`);
  } finally {
    console.info(
      `${message.author.tag} [${message.author.id}] used ${cmd} command!`
    );
  }
  switch (cmd) {
    case "elsot":
      message.channel.send(
        "https://cdn.discordapp.com/attachments/714479623823556628/726371054951596082/d1837b4d1937ac07671277c572dc61cb.png"
      );
      break;
    case "ping":
      message.channel.send(`🏓 | Pooooong!!! \`${client.ws.ping}\`ms`);
      break;

    case "hazmi":
      message.channel.send("ganteng");
      break;
    case "skinker":
      message.channel.send(
        ["air wudhu", "wudhu", "wo2"][Math.floor(Math.random() * 3)] || "woodo"
      );
      break;

    case "owo":
      message.channel.send("owok owok owok");
      break;

    case "fetir":
      message.channel.send(
        ["woakwowk", "kata sapa", "gk"][Math.floor(Math.random() * 3)] ||
          "O aja"
      );
      break;

    case "dwi":
      message.channel.send("bagos");
      break;

    case "sasa":
      message.channel.send("kepo ya akwaokwokw");
      break;

    case "help":
      message.channel.send("kepo banget ama gue akowkaowk");
      break;
  }
});

client.login(TOKEN).catch(e => process.exit(1));
