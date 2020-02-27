const request = require('request-promise');
const cheerio = require('cheerio');
const discord = require('discord.js');
const client = new discord.Client();

client.login('NjE1NzQzNjkzOTE5MzU0OTAy.XWSeEg.spkdQFWqM6-NgWUGMEmAazemlQo');

client.once('ready', async () => {
    const page = await request('https://feedback.minecraft.net/hc/en-us/sections/360002267532-Snapshot-Information-and-Changelogs', {transform: body => cheerio.load(body)}).catch(console.error);
    // console.log(page);

    const latestVersion = page('.article-list-item').eq(0).children().eq(0).text();
    const url = `https://feedback.minecraft.net${page('.article-list-item').eq(0).children().eq(0).attr('href')}`;

    if (true) {
        // await ChangelogManager.create(latestVersion);
        const note = await request(url, {transform: body => cheerio.load(body)}).catch(console.error);
        console.log(note);
        const article = note('.article-body').text();
        const message = new discord.RichEmbed()
            .setTitle(latestVersion)
            .setThumbnail('https://icesword8492-omnipotent-bot-3.glitch.me/api/v1/resources/image/mojang.png')
            .setTimestamp(new Date())
            .setAuthor('Mojang')
            .setURL(url)
            .setColor(0xdb1f29)
            .addField(':notepad_spiral: Note', `${article.substring(0, 996)}...`);
        client.channels.get('324001647657222146').send(message); // JEF(他クラン招待可)/雑談
    }
});
