const {
  Client,
  Collection
} = require("discord.js");
const client = new Client();
const PREFIX = "sasa.";
const { TOKEN } = process.env;
const { readdirSync } = require("fs");
const app = require("express")();

app.listen(process.env.PORT);
app.get("/", (req, res) => {
  res.sendStatus(200);
});

client.on("ready", async () => {
  client.commands = new Collection();
  client.aliases = new Collection();
  client.categories = new Collection();
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
    !message.content.startsWith(PREFIX)
  )
    return;
  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/g);
  const cmd = args[0].toLowerCase();
  args.shift();
  const command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (!command) return;
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
