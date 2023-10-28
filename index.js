const { Client, Collection, MessageEmbed } = require("discord.js");
const cfx = require("cfx-api");

const client = new Client({
    intents: 32767,
});
module.exports = client;

const FiveM = require("fivem-server-api")

const options = {
  timeout: 5000, 
}

const server = new FiveM.Server('ServerIP HERE', 'SERVER PORT')


const config = {
  token: "BOT TOKEN",
  prefix: ">"
}

let comps = []



let previousStatus = '';
let previousServerStatus = '';
let previousPlayerCount = -1;

async function updateStatus() {
  try {
    const serverStatus = await server.getServerStatus();
    const playerCount = await server.getPlayers();
    const Maxplayer = await server.getMaxPlayers();

    const status = await cfx.fetchStatus();
    const components = await status.fetchComponents();
    let cmdp = '';

    for (let component of components) {
      let f = component.status ? '🟢' : '🔴';
      let f2 = f.replace(',', '');
      cmdp += `${component.name}: ${f2}\n`;
    }

    if (
      cmdp !== previousStatus ||
      serverStatus !== previousServerStatus ||
      playerCount !== previousPlayerCount
    ) {
      previousStatus = cmdp; 
      previousServerStatus = serverStatus; 
      previousPlayerCount = playerCount; 

      let embed = new MessageEmbed()
        .setTitle(`Server and Cfx.re Status Information`)
        .setDescription(`This is the server and Cfx.re status information!`)
        .addFields(
          {
            name: "Server Status:",
            value: `\`\`\`\nServer Status: ${serverStatus ? '🟢 Online' : '🔴 Offline'}\`\`\` \`\`\`\nPlayer Count: ${playerCount}\`\`\` \`\`\`\nMax Players: ${Maxplayer}\`\`\` \`\`\`\nJoin: connect cfx.re/join/38qb4b\`\`\``
          },
          {
            name: "Cfx.re Status:",
            value: `\`\`\`\n${cmdp}\`\`\``
          }
        );

      const channel = client.channels.cache.get('CHANNEL ID'); 
      if (!channel) return;

      if (!channel.lastMessage) {
        channel.send({ embeds: [embed] });
      } else {
        channel.lastMessage.edit({ embeds: [embed] });
      }
    }
  } catch (error) {
    console.error('Error fetching server and Cfx.re status:', error);
  }
}

const intervalMinutes = 1;
setInterval(updateStatus, intervalMinutes * 60 * 1000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  updateStatus();
})

client.login(config.token)