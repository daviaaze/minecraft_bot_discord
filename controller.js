const { Client } = require('discord.js');
require('dotenv').config();
const AwsController = require('./AwsController');

const client = new Client ({
  disableEveryone: true
});

client.on("ready", () => {
  console.log(`I'm am online and my name is ${client.user.username}`);

  client.user.setPresence({
    status: 'online',
    game: {
      name: "Minecraft",
      type: 'WATCHING',
    }
  })
})
  client.on("message", async message => {
    const prefix = "!";

    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ + /g);
    const cmd = args.shift().toLowerCase();

    if(cmd === "ping") {
      const msg = await message.channel.send(`Pinging...`);
      msg.edit(`Pong\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms\n Api Latency ${Math.round(client.ping)}ms`)
    }
    if(cmd === "start"){
      AwsController.start();
      return message.channel.send("Server is starting");
    }
    if(cmd === "stop"){
      AwsController.stop();
      return message.channel.send("Server is stopping");
    }
    if(cmd === "ip"){
      return message.channel.send("o ip é: minecraft.daviaaze.com");
    }
  })

client.login(process.env.TOKEN);