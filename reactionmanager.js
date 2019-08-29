import RecruitManager from "./dbman/recruit.js";

export default class ReactionManager {
    static async registerEvents (client, config) {
        await client.on("raw", async raw => {
            if (raw.t === "MESSAGE_REACTION_ADD") {
                let guild = client.guilds.get(raw.d.guild_id);
                await (async (reaction, user) => {
                    if (user.id === config.CLIENT_ID || !await RecruitManager.exists({messageId: `= '${reaction.message.id}'`})) {}
                    else if (reaction.emoji.name === "⏏") {
                        let record = await RecruitManager.getData("messageId count", {messageId: `= '${reaction.message.id}'`});
                        await RecruitManager.update(reaction.message.id, --record.count);
                        await reaction.message.edit(reaction.message.content.substring(0, reaction.message.content.lastIndexOf("@") + 1) + record.count);
                        if (record.count <= 0) {
                            await reaction.message.clearReactions();
                            await RecruitManager.delete(record.messageId);
                            await reaction.message.edit("募集終了");
                        }
                    } else if (reaction.emoji.name === "✖") {
                        reaction.message.mentions.users.forEach(async mentioned_user => {
                            if (mentioned_user.id === user.id) {
                                await reaction.message.clearReactions();
                                await RecruitManager.delete(reaction.message.id);
                                await reaction.message.edit("募集終了");
                            }
                        });
                    }
                })({
                    emoji: raw.d.emoji,
                    message: await guild.channels.get(raw.d.channel_id).fetchMessage(raw.d.message_id)
                },
                await client.fetchUser(raw.d.user_id));
            } else if (raw.t === "MESSAGE_REACTION_REMOVE") {
                let guild = client.guilds.get(raw.d.guild_id);
                await (async (reaction, user) => {
                    if (user.id === config.CLIENT_ID || !await RecruitManager.exists({messageId: `= '${reaction.message.id}'`})) {}
                    else if (reaction.emoji.name === "⏏") {
                        let record = await RecruitManager.getData("messageId count", {messageId: `= '${reaction.message.id}'`});
                        await RecruitManager.update(reaction.message.id, ++record.count);
                        await reaction.message.edit(reaction.message.content.substring(0, reaction.message.content.lastIndexOf("@") + 1) + record.count);
                    }
                })({
                    emoji: raw.d.emoji,
                    message: await guild.channels.get(raw.d.channel_id).fetchMessage(raw.d.message_id)
                },
                await client.fetchUser(raw.d.user_id));
            }
        });
    }
}