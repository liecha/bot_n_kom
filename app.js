var restify = require('restify');
var builder = require('botbuilder');
var https = require('https');

// Setup the Restify Server - HTTP Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// REMOTE - Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "3270b9e3-aac1-46cd-99f1-1221f36f84cd",
    appPassword: "xubmuNF766:;bcQFKOR22{)"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

//Main dialogue
var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector, [
    function (session) {
        const card = new builder.ThumbnailCard(session)
            .title('Hej!')
            .subtitle('Välkommen till Norrköpings Kommuns artificiella hjälpreda.')
            .text('Vad önskar du få hjälp med?')
            .images(getSampleCardImages(session))
            .buttons([
                builder.CardAction.imBack(session, "Jag vill byta lösenord till Heroma.", "Byta lösenord till Heroma"),
                builder.CardAction.imBack(session, "Jag vill få information kring GDPR.", "Information kring GDPR"),
                builder.CardAction.imBack(session, "Jag vill nå min mail hemifrån.", "Nå mail hemifrån")
            ]);
        const myMessage = new builder.Message(session).addAttachment(card);
        session.endConversation(myMessage);
    }
]).set('storage', inMemoryStorage); // Register in memory storage

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

// Insert a avatar picture for the bot
function getSampleCardImages(session) {
    return [
        builder.CardImage.create(session, 'https://www.iconsdb.com/icons/preview/orange/chat-xxl.png')
    ];
}

// Change password in Heroma
bot.dialog('changePassword', (session) => {
    const card = new builder.ThumbnailCard(session)
        .title(' ')
        .subtitle('För att kunna hjälpa dig ytterligare behöver jag veta om du är chef eller lönerapportör.')
        .text('Är du chef eller lönerapportör?')
        .images(getSampleCardImages(session))
        .buttons([
            builder.CardAction.imBack(session, "Jag är chef eller lönerapportör.", "JA"),
            builder.CardAction.imBack(session, "Jag är inte chef eller lönerapportör.", "NEJ"),
        ]);
        const myMessage = new builder.Message(session).addAttachment(card);
        session.endConversation(myMessage);
}).triggerAction( { matches: /lösenord/ } );

bot.dialog('Ja', (session) => {
    const card = new builder.ThumbnailCard(session)
        .title(' ')
        .subtitle('För att få ett nytt lösenord till Heroma som chef/lönerapportör behöver du kontakta LK-data.')
        .text('LK-data: 013 - 20 69 69')
        .images(getSampleCardImages(session))
    const myMessage = new builder.Message(session).addAttachment(card);
    session.endConversation(myMessage);
}).triggerAction( { matches: /Jag är chef/ } );

bot.dialog('Nej', (session) => {
    const card = new builder.ThumbnailCard(session)
        .title(' ')
        .subtitle('För att få ett nytt lösenord till Heroma behöver du kontakta din lönerapportör.')
        .images(getSampleCardImages(session))
    const myMessage = new builder.Message(session).addAttachment(card);
    session.endConversation(myMessage);
}).triggerAction( { matches: /Jag är inte/ } );

// Get information about GDPR
bot.dialog('infoAboutGdpr', (session) => {
    const card = new builder.ThumbnailCard(session)
    .title(' ')
    .subtitle('Tyck på knappen "Info GDPR" nedan för att få mer information om GDPR. Läs exempelvis om vem som är ansvarig för GDPR eller vem som är dataskyddsombud.')
    .images(getSampleCardImages(session))
    .buttons([
        builder.CardAction.openUrl(session, "http://www.norrkoping.se/dataskyddsforordningen---gdpr.html", "Info GDPR"),
    ]);
    const myMessage = new builder.Message(session).addAttachment(card);
    session.endConversation(myMessage);
}).triggerAction( { matches: /GDPR/ } );

// Want to reach mail box from home
bot.dialog('reachMailFromHome', (session) => {
    const card = new builder.ThumbnailCard(session)
        .title(' ')
        .subtitle('Tyck på knappen "Webmail" nedan för att nå mailen hemifrån. Logga in med ditt användarid och tillhörande lösenord.')
        .images(getSampleCardImages(session))
        .buttons([
            builder.CardAction.openUrl(session, "https://epost.norrkoping.se/", "Webmail"),
        ]);
        const myMessage = new builder.Message(session).addAttachment(card);
        session.endConversation(myMessage);
}).triggerAction( { matches: /mail hemifrån/ } );