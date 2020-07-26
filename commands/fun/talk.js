const { launch } = require("puppeteer");

exports.exec = async (client, message, args) => {
  if (!args.length) return message.channel.send("Mau ngomong opo?");
  const callback = await message.channel.send("Fetching data... (1 of 5)");
  const response = await this.getResponse(args.join(" "), (int, err) => {
    if (err) {
      callback.delete();
      return message.channel.send(`Error: \`${err.message}\``);
    }
    callback.edit(`Fetching data... (${int} of 5)`);
  });
  callback.delete().then(_ => message.channel.send(response || "mati kak :("));
};

exports.help = {
  name: "talk",
  description: "Ngobrol sama bod sasa",
  usage: "{prefix}talk <text>",
  example: "{prefix}talk Hi there!"
};

exports.conf = {
  aliases: ["chat", "ngobrol"],
  cooldown: 5
};

exports.getResponse = async (text, callback) => {
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
    await page.goto("https://www.cleverbot.com/", {
      waitUntil: "domcontentloaded"
    });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
    );
    callback(2);
    await page.evaluate(() => {
      document.querySelector("#noteb input[type=submit]").click();
    });
    await page.type('input[name="stimulus"]', text, { delay: 100 });
    await page.focus('input[name="stimulus"]');
    await page.keyboard.press("Enter");
    const selector = "#line1";
    callback(3);
    await page.waitForSelector("#line1");
    const element = await page.$("#line1 span");
    await page.waitFor(10000);
    callback(4);
    const value = await page.evaluate(s => s.innerText, element);
    callback(5);
    await browser.close();
    return value;
  } catch (e) {
    console.log(e);
    callback(6, e.message);
  }
};
