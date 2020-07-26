const { MessageEmbed } = require("discord.js");
const { launch } = require("puppeteer");

exports.exec = async (client, message, args) => {
  if (!args.length || (args.length && !isNaN(args[0])))
    return message.channel.send("Please input a valid roman number!");
  const msgs = await message.channel.send("Calculating...");
  const response = await this.convertRomanToNumber(args[0], (int, error) => {
    if (error) {
      msgs.delete();
      return message.channel.send(`Error: \`${error.message}\``);
    }
  });
  if (!response) {
    await msgs.delete();
    return message.channel.send(
      `Seems like, \`${args[0]}\` isn't a valid roman numerical.`
    );
  }
  await msgs.delete();
  return message.channel.send(
    new MessageEmbed()
      .setAuthor(
        "Roman Numeral Converter",
        client.user.displayAvatarURL({ dynamic: true, size: 4096 })
      )
      .addField("Roman Numeral", args[0])
      .addField("Decimal Value", response.value)
      .addField("Calculation", `\`\`\`\n${response.calculation}\`\`\``)
      .setColor("YELLOW")
      .setFooter(
        "Calculation from: rapidtables.com",
        "https://www.rapidtables.com/lib/favicon/favicon-32x32.png"
      )
  );
};

exports.help = {
  name: "roman",
  description: "Convert nomer romawi ke angka",
  usage: "{prefix}roman <roman numerical>",
  example: "{prefix}roman MCD"
}

exports.conf = {
  aliases: ["romawi"],
  cooldown: 5,
  devOnly: false
}

exports.convertRomanToNumber = async (roman, callback) => {
  try {
    const browser = await launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--no-sandbox",
        "--headless",
        "--disable-gpu",
        "--window-size=1360x768"
      ]
    });
    const page = await browser.newPage();
    await page.goto(
      "https://www.rapidtables.com/convert/number/roman-numerals-converter.html",
      {
        waitUntil: "domcontentloaded"
      }
    );
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
    );
    callback(2);
    await page.type('input[id="x1"]', roman, { delay: 100 });
    await page.focus('input[id="x1"]');
    await page.keyboard.press("Enter");
    callback(3);
    await page.waitForNavigation();
    await page.waitForFunction('document.querySelector("#x2").value !== ""');
    const element = await page.$("#x2");
    const calculation = await page.$("#txt");
    callback(4);
    const value = await page.evaluate(s => s.value, element);
    const calc = await page.evaluate(s => s.value, calculation);
    callback(5);
    await browser.close();
    return { value, calculation: calc };
  } catch (e) {
    callback(6, e.mesage);
  }
}