<img align="right" src="https://media.discordapp.net/attachments/1118593916623650926/1142061837748273212/8fPF3cm.png?width=449&height=449" width=20% height=20%>

# Dencord
A Discord API wrapper for Deno

# This project is still in works
That's right, this will take a *loooong* time to finish because, I'm a student, and this is my side-hustle, so bare with me! For now, you can contribute and make my code better :)

# Example code
Here's an example of how the code looks when using Dencord.
```ts
import * as Discordeno from "https://deno.land/x/dencordts/mods.ts";

const client: Discordeno.Client = new Discordeno.Client("YOUR-BOT-TOKEN",{
    intents: Discordeno.Enums.Intents.ALL
});

client.on("ready",() => {
    console.log("Ready");
});

client.on("messageCreate",async (message: Discordeno.Message) => {
    if (message.content === "!ping") {
        await message.reply("Pong!")
    }
})

client.connect();
```
(As you can see, I took a lot of inspiration from Discord.JS and Eris regarding syntax, I find syntax of those kind of simple so I used them as an inspiration)
