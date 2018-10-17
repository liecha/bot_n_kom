var restify = require('restify');
var builder = require('botbuilder');
var https = require('https');

// Setup the Restify Server - HTTP Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

/* 
// LOCAL - Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
*/

// REMOTE - Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "3270b9e3-aac1-46cd-99f1-1221f36f84cd",
    appPassword: "xubmuNF766:;bcQFKOR22{)"
});


// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create your bot with a function to receive messages from the user
// Create bot and default message handler
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... We sell shirts. Say 'show shirts' to see our products.");
});

// Add dialog to return list of shirts available
bot.dialog('showShirts', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Classic White T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Classic Gray T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
            ])
    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });

/*
//Main dialogue
var bot = new builder.UniversalBot(connector, [
    function (session) {
        const card = new builder.ThumbnailCard(session)
            .title('Hej!')
            .subtitle('Välkommen till Norrköpings Kommuns artificiella hjälpreda.')
            .text('Vad önskar du få hjälp med?')
            .images(getSampleCardImages(session))
            .buttons([
                builder.CardAction.imBack(session, "Byta lösenord till Heroma", "Byta lösenord till Heroma"),
                builder.CardAction.imBack(session, "Information kring GDPR", "Information kring GDPR"),
                builder.CardAction.imBack(session, "Nå mail hemifrån", "Nå mail hemifrån")
            ]);
        const myMessage = new builder.Message(session).addAttachment(card);
        session.endConversation(myMessage);
    }
]);

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
        builder.CardImage.create(session, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5k4Z6yIQA-NcX0sWdQCkgvI_kgHv7nAUqjBL6oAOMlPtRDb9now')
    ];
}

// Insert a avatar picture for the user
function getSampleCardImagesUser(session) {
    return [
        builder.CardImage.create(session, 'https://cdn1.vectorstock.com/i/1000x1000/01/85/comic-chat-bubble-vector-19580185.jpg')
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
            builder.CardAction.imBack(session, "Jag är chef eller lönerapportör", "JA"),
            builder.CardAction.imBack(session, "Jag är inte chef eller lönerapportör", "NEJ"),
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
*/