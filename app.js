/*-----------------------------------------------------------------------------
LSPSFbot
-----------------------------------------------------------------------------*/
// required for chatbot
var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

//required for connection to Azure SQL
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

//required for Naive Bayes classifier
var natural = require('natural');

//NOTE 1: Data about teams, colours and divisions

var ADivision = [
["Francesca Cabrini", "blue and white stripes", "A"], 
["Henry Cavendish", "maroon", "A"],
["Immanuel","navy blue and yellow", "A"],
["Julians", "red and white stripes", "A"],
["Loughborough","blue", "A"],
["Lyndhurst", "green and white hoops", "A"],
["Rosendale A", "lilac", "A"],
["St John and St Clement", "navy blue", "A"],
["St Marys", "red or blue", "A"],
["Sunnyhill A", "blue and yellow", "A"],
["Allen Edwards", "blue and yellow", "B"],
["Clapham Manor","navy blue", "B"],
["Corpus Christi", "green and white hoops", "B"],
["Crawford", "sky blue", "B"],
["Crown Lane", "purple", "B"],
["Elm Wood", "green (?)", "B"],
["Goose Green", "green", "B"],
["Hitherfield", "pale orange", "B"],
["Richard Atkins", "grey", "B"],
["St Bernadettes", "green", "B"],
["Wyvil", "sky blue and white hoops", "B"],
["Camelot", "yellow", "C"],
["Fenstanton", "black", "C"],
["Hill Mead", "white or maroon", "C"],
["Holy Trinity", "maroon", "C"],
["Judith Kerr", "sky blue", "C"],
["Rosendale B", "orange", "C"],
["St Andrews", "green", "C"],
["Streatham Wells", "green", "C"],
["Telferscot", "navy blue and yellow", "C"],
["Woodmansterne", "navy blue", "C"],
["Dunraven","colour not known", "D"],
["Heathbrook", "color not known", "D"],
["Herbert Morrison", "colour not known", "D"],
["Kings Avenue", "black and yellow stripes", "D"],
["Macaulay", "red with blue trim", "D"],
["Oliver Goldsmith", "red or sky blue", "D"],
["St Josephs", "orange", "D"],
["St Leonards", "blue", "D"],
["Sudbourne", "blue and yellow", "D"],
["Sunnyhill B", "red and white", "D"]
];

//comment and uncomment these lines as needed

//NOTE 2: load and use an existing Naive Bayes classifier

//use this block when loading an existing an existing classifier
var classifier;
natural.BayesClassifier.load('classifier.json', null, function(err, loadedClassifier) {
    console.log("load saved classifier");
    classifier = loadedClassifier;
});
// end of block to load an existing classifier


//NOTE 3: create and save a new classifier

/*
var classifier = new natural.BayesClassifier();
classifier.addDocument("When will Allen Edwards play?","WhenFuture");
classifier.addDocument("What date will Camelot play?","WhenFuture");
classifier.addDocument("When is the Clapham Manor game?","WhenFuture");
classifier.addDocument("When is the Corpus Christi match?","WhenFuture");
classifier.addDocument("What time will Crawford play?","WhenFuture");
classifier.addDocument("What time is the Crown Lane game?","WhenFuture");
classifier.addDocument("What time is the Dunraven match?","WhenFuture");
classifier.addDocument("When is Elm Wood playing Fenstanton?","WhenFuture");
classifier.addDocument("What date will Francesca Cabrini play Goose Green?","WhenFuture");
classifier.addDocument("When is Cabrini playing at Dulwich?","WhenFuture");
classifier.addDocument("What date is St Francesca Cabrini playing at Dulwich Sports Ground?","WhenFuture");
classifier.addDocument("Is Heathbrook playing on 28th October?","WhenFuture");
classifier.addDocument("When did Henry Cavendish play?","WhenPast");
classifier.addDocument("What date did Herbert Morrison play?","WhenPast");
classifier.addDocument("When did Hill Mead play Hitherfield?","WhenPast");
classifier.addDocument("What date did Holy Trinity play Immanuel?","WhenPast");
classifier.addDocument("When was the game between Judith Kerr and Julians?","WhenPast");
classifier.addDocument("When was the Julian's v Kings Avenue game?","WhenPast");
classifier.addDocument("When was the King's Avenue and Loughborough match?","WhenPast");
classifier.addDocument("When was the match between Lyndhurst and Oliver Goldsmith?","WhenPast");
classifier.addDocument("When did Richard Atkins play at DSG?","WhenPast");
classifier.addDocument("When was Rosendale A playing at Alleyns?","WhenPast");
classifier.addDocument("What date did Rosendale B play at Alleyn's?","WhenPast");
classifier.addDocument("Did St Andrews play on 28th August?","WhenPast");
classifier.addDocument("Where will St Andrew's play?","WhereFuture");
classifier.addDocument("Which ground will St Bernadettes play at?","WhereFuture");
classifier.addDocument("Where will the St Bernadette's match be?","WhereFuture");
classifier.addDocument("Where will the St Johns game be?","WhereFuture");
classifier.addDocument("Where is St John's playing St Josephs?","WhereFuture");
classifier.addDocument("Where will St Johns and St Clements play St Joseph's?","WhereFuture");
classifier.addDocument("What ground will St John's and St Clement's play St Leonards?","WhereFuture");
classifier.addDocument("Which location is St Leonard's playing St Marys at?","WhereFuture");
classifier.addDocument("What venue will St Mary's play Streatham Wells?","WhereFuture");
classifier.addDocument("Is Sudbourne playing at Rosendale?","WhereFuture");
classifier.addDocument("Where is Sunnyhill A playing on 28th October?","WhereFuture");
classifier.addDocument("Where will Sunnyhill B play on 28th October","WhereFuture");
classifier.addDocument("Where did Telferscot play?","WherePast");
classifier.addDocument("Which ground did Woodmansterne play?","WherePast");
classifier.addDocument("Where was the last Wyvil match?","WherePast");
classifier.addDocument("Where was the last Allen Edwards game?","WherePast");
classifier.addDocument("Where did Camelot play Clapham Manor?","WherePast");
classifier.addDocument("Where did Corpus Christi and Crawford play?","WherePast");
classifier.addDocument("Where was the Crown Lane v Dunraven game?","WherePast");
classifier.addDocument("Where was the Elm Wood and Fenstanton match?","WherePast");
classifier.addDocument("What ground did Francesca Cabrini play Goose Green?","WherePast");
classifier.addDocument("Which venue did Cabrini play St Francesca Cabrini?","WherePast");
classifier.addDocument("Where did Heathbrook play on 28th August?","WherePast");
classifier.addDocument("What location did Henry Cavendish play at on 28th August?","WherePast");
classifier.addDocument("Who will Herbert Morrison play?","WhoFuture");
classifier.addDocument("Who is Hill Mead playing next?","WhoFuture");
classifier.addDocument("Which team is Hitherfield playing?","WhoFuture");
classifier.addDocument("Which team will Holy Trinity play?","WhoFuture");
classifier.addDocument("What is Immanuel’s next match?","WhoFuture");
classifier.addDocument("What is Judith Kerr’s next game?","WhoFuture");
classifier.addDocument("Which school is Julians playing next?","WhoFuture");
classifier.addDocument("Is Julian's playing Kings Avenue?","WhoFuture");
classifier.addDocument("Who will King's Avenue play at Alleyn's?","WhoFuture");
classifier.addDocument("Which team is Loughborough playing at Dulwich?","WhoFuture");
classifier.addDocument("Who will Lyndhurst play on 28th October?","WhoFuture");
classifier.addDocument("Which school is Oliver Goldsmith playing on 28th October?","WhoFuture");
classifier.addDocument("Who did Richard Atkins play?","WhoPast");
classifier.addDocument("Who did Rosendale A play last?","WhoPast");
classifier.addDocument("Which team did Rosendale B play?","WhoPast");
classifier.addDocument("Which team did St Andrews play last?","WhoPast");
classifier.addDocument("Which school did St Andrew's play?","WhoPast");
classifier.addDocument("Which school did St Bernadettes play last?","WhoPast");
classifier.addDocument("Who was St Bernadette's’s last game?","WhoPast");
classifier.addDocument("Who was St Johns’s last match?","WhoPast");
classifier.addDocument("Who did St John's play at Dulwich Sports Ground?","WhoPast");
classifier.addDocument("Which team did St Josephs play at DSG?","WhoPast");
classifier.addDocument("Who did St Johns and St Clements play on 28th August?","WhoPast");
classifier.addDocument("Which team did St Joseph's play on 28th August?","WhoPast");
classifier.addDocument("What was the St John's and St Clement's score?","Score");
classifier.addDocument("Did St Leonards win?","Score");
classifier.addDocument("What was the score between St Leonard's and St Marys?","Score");
classifier.addDocument("What was the result in the St Mary's and Streatham Wells match?","Score");
classifier.addDocument("What was the score in the Sudbourne and Sunnyhill A game?","Score");
classifier.addDocument("Who won in the Sunnyhill B v Telferscot game?","Score");
classifier.addDocument("What was the result in the Woodmansterne vs Wyvil match?","Score");
classifier.addDocument("What was the score in the match between Allen Edwards and Camelot?","Score");
classifier.addDocument("What was the score in the game between Clapham Manor and Corpus Christi?","Score");
classifier.addDocument("What was the result in the game between Crawford and Crown Lane?","Score");
classifier.addDocument("who won the match between Dunraven and Elm Wood?","Score");
classifier.addDocument("Who won between Fenstanton and Francesca Cabrini?","Score");
classifier.addDocument("Which school will Goose Green play at Rosendale?","WhoFuture");
classifier.addDocument("Which school did Cabrini play at Rosendale?","WhoPast");
classifier.addDocument("Have st francesca cabrini and heathbrook played?","WhoPast");
classifier.addDocument("Did henry cavendish play herbert morrison yet?","WhoPast");
classifier.addDocument("Did hill mead play at Dulwich?","WherePast");
classifier.addDocument("Have hitherfield played at Alleyns yet?","WherePast");
classifier.addDocument("Which division does Holy Trinity play in?","DivTeam");
classifier.addDocument("Which league does Immanuel play in?","DivTeam");
classifier.addDocument("What division does Judith Kerr play in?","DivTeam");
classifier.addDocument("What league does Loughborough play in?","DivTeam");
classifier.addDocument("Which division is Lyndhurst in?","DivTeam");
classifier.addDocument("Which league is Oliver Goldsmith in?","DivTeam");
classifier.addDocument("What division is Richard Atkins in?","DivTeam");
classifier.addDocument("What league is Rosendale A in?","DivTeam");
classifier.addDocument("Which teams are in DIVISION A?","DivAllTeams");
classifier.addDocument("Which teams play in DIVISION B?","DivAllTeams");
classifier.addDocument("Which teams are in DIVISION C?","DivAllTeams");
classifier.addDocument("Which teams are in DIVISION D","DivAllTeams");
classifier.addDocument("What teams are in D DIVISION?","DivAllTeams");
classifier.addDocument("What teams play in C DIVISION?","DivAllTeams");
classifier.addDocument("What teams are in B DIVISION?","DivAllTeams");
classifier.addDocument("What teams are in A DIVISION?","DivAllTeams");
classifier.addDocument("What colours does Rosendale B wear?","Colours");
classifier.addDocument("What colour does Streatham Wells play in?","Colours");
classifier.addDocument("What is the Sudbourne strip?","Colours");
classifier.addDocument("What colour is the Sunnyhill A strip","Colours");
classifier.addDocument("What are the team colours of Sunnyhill B?","Colours");
//Start of Week 1 retraining set
classifier.addDocument("When does Oliver Goldsmith play next","WhenFuture");
classifier.addDocument("What was the result between Judith Kerr and Rosendale B","Score");
classifier.addDocument("what colours does oliver goldsmith play in?","Colours");
classifier.addDocument("what is the oliver goldsmith strip?","Colours");
classifier.addDocument("Which league is st marys in?","DivTeam");
classifier.addDocument("Who are wyvil playing this Saturday","WhoFuture");
classifier.addDocument("Where were sunnyhill b playing","WherePast");
//End of Week 1 retraining set
//Start of Week 2 retraining set
classifier.addDocument("What colours does Oliver goldsmith play in?","Colours");
classifier.addDocument("Who will St Josephs play next?","WhoFuture");
classifier.addDocument("Is Goose Green playing on Saturday?","WhoFuture");
classifier.addDocument("Who were sunnyhill b playing against on October 20th","WhoPast");
classifier.addDocument("Who are st josephs playing this Saturday ","WhoFuture");
classifier.addDocument("What was the result between Vauxhall Wyvil and Judith Kerr","Score");
classifier.addDocument("When do Vauxhall Wyvil play next","WhenFuture");
classifier.addDocument("What was the result of Goose Green' game","Score");
classifier.addDocument("What was the score between Wyvil and Judith Kerr","Score");
classifier.addDocument("Did St Joseph's win","Score");
classifier.addDocument("When will Lyndhurst Play sunnyhill a","WhenFuture");
classifier.addDocument("where did judith kerr play on 10th November?","WherePast");
classifier.addDocument("Who are Hillmead playing on Saturday","WhoFuture");
classifier.addDocument("What colour do Elm Wood play in?","Colours");
classifier.addDocument("When will the match be between Henry cavendish and St Julians","WhenFuture");
classifier.addDocument("Where were Henry Cavendish playing on 10/11/2018 ","WherePast");
//End Week 2 retraining set
//Start Week 3 retraining set
classifier.addDocument("When will the match be between camelot and Rosendale b","WhenFuture");
classifier.addDocument("Where will woodmansterne be playing next","WhereFuture");
classifier.addDocument("when is camelot playing rosendale b?","WhenFuture");
classifier.addDocument("Where will holy trinity play next?","WhereFuture");
classifier.addDocument("Who did St Leonards play last?","WhoPast");
classifier.addDocument("who are macaulay playing next?","WhoFuture");
classifier.addDocument("When will sunnyhill b play dunraven?","WhenFuture");
classifier.addDocument("Did corpus Christi win yesterday","Score");
classifier.addDocument("Did woodmansterne win yesterday","Score");
classifier.addDocument("Where were wyvil playing on November 10th","WherePast");
classifier.addDocument("who did heathbrook play yesterday?","WhoPast");
classifier.addDocument("When did Crown Lane last play?","WhenPast");
classifier.addDocument("When do Macaulay next play?","WhenFuture");
classifier.addDocument("Who do st Mary's play next?","WhoFuture");
//End Week 3 retraining set
//Start Week 4 retraining set
classifier.addDocument("Who are Telferscot playing today?","WhoFuture");
classifier.addDocument("Did Streatham Wells beat heathbrook","Score");
classifier.addDocument("When did sunnyhill a play Julians","WhenPast");
classifier.addDocument("Who will dunraven play on Saturday","WhoFuture");
classifier.addDocument("Where I elm Wood play on december 8th ","WhereFuture");
classifier.addDocument("Saint Marys next fixture","WhoFuture");
classifier.addDocument("Where did Camelot and fenstanton play","WherePast");
classifier.addDocument("Did St Andrews win against telferscott","Score");
//End Week 4 Retraining set
//Start Week 5 Retraining set
classifier.addDocument("What colour kit do Julians where? ","Colours");
classifier.addDocument("When did Streatham wells play Francesca Cabrini?","WhenPast");
classifier.addDocument("What was the score between dunraven and sunnyhill b","Score");
classifier.addDocument("Who won between Clapham Manor and Holy trinity","Score");
classifier.addDocument("Did sudbourne beat St Leonards ","Score");
classifier.addDocument("When will f cabrini play rosendale a","WhenFuture");
classifier.addDocument("What was the score between dunraven and o goldsmith","Score");
classifier.addDocument("What was the score between Oliver goldsmiths and St Leonards","Score");
classifier.addDocument("Where will Fenstanton play next?","WhereFuture");
classifier.addDocument("When did Hitherfield play?","WhenPast");
classifier.addDocument("What colours do St Bernadettes play in?","Colours");
classifier.addDocument("What colours does St Bernadettes play in?","Colours");
classifier.addDocument("What was the St Andrews score?","Score");
classifier.addDocument("When do Hitherfield play Allen Edwards?","WhenFuture");
classifier.addDocument("What was the Julians score?","Score");
classifier.addDocument("What was the score when Telferscot played St Andrews?","Score");
classifier.addDocument("What colours does Telferscot play in?","Colours");
//End Week 5 retraining set
//Start Week 6 retraining set
classifier.addDocument("What was the result between francesca cabrini and Henry Cavendish","Score");
classifier.addDocument("Did woodmasterne win against St Andrews","Score");
classifier.addDocument("Where will o goldsmith play Streatham Wells","WhereFuture");
classifier.addDocument("Who won bergen St Joseph\'s and Herbert Morrison","WhoPast");
classifier.addDocument("Did Camelot beat rosendale b","Score");
classifier.addDocument("What was the score between St bernadette\'s and hill mead","Score");
classifier.addDocument("Where did King\'s avenue play Streatham Wells","WherePast");
classifier.addDocument("Where is Allen Edwards playing next?","WhereFuture");
classifier.addDocument("Who is St Johns playing at Rosendale?","WhoFuture");
classifier.addDocument("When did Crawford play at Dulwich","WhenPast");
classifier.addDocument("What was the score between Richard Atkins and Hitherfield","Score");
//end Week 6 retraining set
// Start Week 7 retraining set
classifier.addDocument("Where will the match be between Crown Lane and wyvil","WhereFuture");
classifier.addDocument("Who won out of St Leonards and Oliver goldsmiths","Score");
classifier.addDocument("Where is Henry Cavendish playing Rosendale A?","WhereFuture");
classifier.addDocument("When is Rosendale A playing Henry Cavendish","WhenFuture");
classifier.addDocument("Is St Joseph playing Streatham Wells?","WhoFuture");
classifier.addDocument("When is Woodmansterne playing Telferscot","WhenFuture");
classifier.addDocument("What colours does Woodmansterne play in?","Colours");
classifier.addDocument("Which division is Woodmansterne in?","DivTeam");
classifier.addDocument("When will Macaulay play Sudbourne?","WhenFuture");
classifier.addDocument("Where is Allen Edwards playing Richard Atkins?","WhereFuture");
classifier.addDocument("When is richard Atkins playing Allen Edwards?","WhenFuture");
classifier.addDocument("When is Immanuel playing Corpus Christi?","WhenFuture");
classifier.addDocument("What was the score in the match between sudbourne and dunraven?","Score");
//End Week 7 retraining set

classifier.train();
console.log("after Classifier.train run");

classifier.save('classifier.json', function(err, classifier) {
    console.log("Inside classifier.save");
});

*/
// end of block used when creating and saving a new classifier

// NOTE 4: set up connections to other components

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

//private storage is registered here
var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);
bot.set('storage', tableStorage);

// NOTE 5: create bot to receive messages from user and create default message handler

var bot = new builder.UniversalBot(connector, function (session, args) { 
    var utterance = session.message.text;
    var turnDateTime = new Date();
    var luisIntent = "No luisIntent (dm1)";
    var luisIntentScore = 0;
    var luisFirstSchool = "first school not used";        
    var luisFirstSchoolScore = 0;
    var luisSecondSchool = 'No Second School';
    var luisSecondSchoolScore = 0;
    var luisLocation = "No Location";
    var luisLocationScore = 0;
    var luisDateOfMatch = "1980-01-01";
    var bayes = classifier.getClassifications(utterance);
    var bayesIntent = bayes[0].label;
    var bayesScore = bayes[0].value;
    var responseNbIntent = bayesIntent;
    var responseNbIntentScore = bayesScore;;
    var sqlSchool1Name = firstSchool;
    var sqlSchool2Name = "No SQL School 2 Name";
    var sqlLocation = "No SQL Location";
    var sqlDateOfMatch = "1980-01-01";
    var responseDialog =  "No responseDialog set";
    var dateRecordWritten = new Date();
    var firstSchool = "no firstSchool (dm1)";
    responseDialog = ("Sorry I don\'t understand this " + "'" + utterance + "' (dm1)");

    session.send(responseDialog);
    
    writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
        luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
        responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
        responseDialog, dateRecordWritten); 
});

//NOTE 6: set up the connection to Microsoft LUIS NLP

var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';
const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;
var recognizerLUIS = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizerLUIS);

// NOTE 7: create generic intents

bot.dialog('GreetingDialog',
    (session) => {
        session.send("Welcome! You have reached the LSPSF fixtures and results chatbot  \n The chatbot is still learning and might sometimes give incorrect answers.  \n  Visit www.lpsfl.com for definitive information");
        //session.send("The chatbot is now working in test mode with real fixtures and results!  \n To test the chatbot type a test question such as: 'Where will TestTeamFour play?'  \n  Type 'Help bot' to see other test questions");
        session.send("The bot answers questions about  \n -fixtures  \n -results  \n -divisions  \n -team colours  \n  Type 'Help bot' to see some test questions");
        session.endDialog();
    }
).triggerAction({
    matches: 'Greeting'
});

bot.dialog('Help',
    (session) => {
        session.send("The LSPSFbot will answer questions such as:  \n   \n - Did TestTeamOne play at Rosendale?  \n - What was the TestTeamTwo score?  \n - Who will TestTeamThree play?  \n - Where will TestTeamFour play next?   \n - What colours does Sudbourne play in?  \n - Which league is rosendale A in? ");
        session.send("");
        session.endDialog();
    }
).triggerAction({
    matches: 'Help'
});

bot.dialog('CancelDialog',
    (session) => {
        session.send('You reached the Cancel intent FROM LSPSF. You said \'%s\'.', session.message.text);
        session.endDialog();
    }
).triggerAction({
    matches: 'Cancel'
});

//NOTE 8: create fixture and result intents

//There is one code block for each intent
var todaysDate = new Date();
bot.dialog('WhereFuture',[
    function (session, args) {
        var selectedIntent = 'WhereFuture';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var onSuccess, param2, queryType, storedProcedure;
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools = parseSchools(session, args);

//NOTE 9: parse data returned from MS LUIS to capture entities in the utterance
//NOTE 10: raise an error if the name of a school is not found

        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wa0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            if(schools.hasOwnProperty("firstSchool")){        
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
                luisFirstSchoolScore = schools.firstSchoolScore;
            };
            var locations = parseLocation(session, args);
            var dates = parseDate(session, args);

//NOTE 11: assign second entity to var param2 based on entities present in utterance

            if(schools.hasOwnProperty("secondSchool")){
                param2 = schools.secondSchool;
                luisSecondSchool = schools.secondSchool;
                luisSecondSchoolScore = schools.secondSchoolScore;
            } else if(locations.hasOwnProperty("firstLocation")){
                param2 = locations.firstLocation;
                luisLocation = locations.firstLocation;
                luisLocationScore = locations.firstLocationScore;
            } else if ((dates.hasOwnProperty('futureDate')) && (dates.hasOwnProperty('pastDate'))) {
                if ((selectedIntent == 'WhereFuture') || (selectedIntent == "WhenFuture")|| (selectedIntent == 'WhoFuture')) {
                    param2 = dates.futureDate;
                    luisDateOfMatch = param2;  
                } else if ((selectedIntent == 'WherePast') || (selectedIntent == "WhenPast")|| (selectedIntent == 'WhoPast')||(selectedIntent=='Score')) {
                    param2 = dates.pastDate;
                    luisDateOfMatch = param2;
                } 
            } else if (dates.hasOwnProperty('firstDate')) {
                param2 = dates.firstDate;
                luisDateOfMatch = param2;   
            } else {
                // param2 default is today's date
                param2 = new Date();            
            };

//NOTE 12: evaluate which stored procedure to use to fill the missing slots

            var constructedSP = constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate );
            storedProcedure = constructedSP.sp;

//NOTE 13: select response template based on stored procedure type

            if (storedProcedure == 'SchoolSchoolFuture'){
                //Test: Where will TestTeamThree play TestTeamFour?
                queryType = 'SSF'; 
                onSuccess = function(location, DateOfMatch){
                    if ((location == null)||(DateOfMatch == null)) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wa1)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {

//NOTE 15: fill missing slots in template and send to user

                        responseDialog = (firstSchool + " is playing " + param2 + " at " + location + " on " + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " (wa2)");
                        sqlSchool2Name = param2;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);

//NOTE 16: write log data to database

                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                }; 

//NOTE 14: retrieve data from database

                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);
            } else if (storedProcedure == 'SchoolLocationFuture') {
                //Return first game (if any) from today's date          
                //Test: Will TestTeamThree play at Dulwich?
                queryType = 'SLF';  
                onSuccess = function(secondSchool, DateOfMatch){
                    if (DateOfMatch == null) {
                        responseDialog =  "The bot thinks this match has not been scheduled yet (wa3)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    } else {  
                        responseDialog = ('Yes, ' + firstSchool + " is playing " + " at " + param2 + " on " + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " against " + secondSchool  + " (wa4)");
                        console.log("Date of match: " + DateOfMatch);
                        sqlSchool2Name = secondSchool;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                   
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);                           
            } else if (storedProcedure == 'SchoolDateFuture'){
                //Test: Where will TestTeamFour play on 1st December?
                queryType = 'SDF';
                onSuccess = function(secondSchool, location){
                    if (location == null) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wa5)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + ' is playing on ' + param2 + ' at ' + location + " against " + secondSchool + " (wa6)");
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location; 
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else if (storedProcedure == 'NextMatch') {
                //Test: Where will TestTeamThree play?
                queryType = 'NM';
                onSuccess = function(firstSchool, secondSchool,location, DateOfMatch){
                    if ((firstSchool==null)||(secondSchool==null)||(location == null)||(DateOfMatch==null)) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wa7)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    } else {
                        responseDialog = ('The next game for ' + firstSchool + ' is against ' + secondSchool + ' at ' + location + ' on ' + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " (wa8)");    
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                    
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else {
                responseDialog = "I am sorry the bot can't understand that question (wa9)";
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);                
            }
        }
    }
]).triggerAction({
    matches: 'WhereFuture'
});

bot.dialog('WhenFuture',[
    function (session, args) {
        var selectedIntent = 'WhenFuture';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var onSuccess, param2, queryType, storedProcedure;            
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wb0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            //parse the data returned from the NLP to capture entities present in the utterance
            if(schools.hasOwnProperty("firstSchool")){        
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
                luisFirstSchoolScore = schools.firstSchoolScore;
            };
            var locations = parseLocation(session, args);
            var dates = parseDate(session, args);
            if(schools.hasOwnProperty("secondSchool")){
                param2 = schools.secondSchool;
                luisSecondSchool = schools.secondSchool;
                luisSecondSchoolScore = schools.secondSchoolScore;
            } else if(locations.hasOwnProperty("firstLocation")){
                param2 = locations.firstLocation;
                luisLocation = locations.firstLocation;
                luisLocationScore = locations.firstLocationScore;
            } else if ((dates.hasOwnProperty('futureDate'))&& (dates.hasOwnProperty('pastDate'))) {
                if ((selectedIntent == 'WhereFuture') || (selectedIntent == "WhenFuture")|| (selectedIntent == 'WhoFuture')) {
                    param2 = dates.futureDate;
                    luisDateOfMatch = param2;  
                    console.log("param2 in WhereFuture (futureDate selected: " + param2); 
                } else if ((selectedIntent == 'WherePast') || (selectedIntent == "WhenPast")|| (selectedIntent == 'WhoPast')||(selectedIntent=='Score')) {
                    param2 = dates.pastDate;
                    luisDateOfMatch = param2;
                } 
            } else if (dates.hasOwnProperty('firstDate')) {
                param2 = dates.firstDate;
                luisDateOfMatch = param2;   
            } else {
                // param2 default is today's date
                param2 = new Date();            
            };
            var constructedSP = constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate );
            storedProcedure = constructedSP.sp;
            if (storedProcedure == 'SchoolSchoolFuture'){
            //Test: When will TestTeamThree play TestTeamFour?
                queryType = 'SSF'; 
                onSuccess = function(location, DateOfMatch){ 
                    if ((location == null)||(DateOfMatch == null)) {                   
                        responseDialog = "The bot thinks this match has not been scheduled yet (wb1)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + " is playing " + param2 + " at " + location + " on " + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " (wb2)");
                        sqlSchool2Name = param2;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                }; 
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);
            } else if (storedProcedure == 'SchoolLocationFuture') {
                //Test: When will TestTeamFour play at Dulwich?
                queryType = 'SLF';  
                onSuccess = function(secondSchool, DateOfMatch){
                    if (DateOfMatch == null) {
                        responseDialog =  "The bot thinks this match has not been scheduled yet (wb3)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    } else { 
                        responseDialog = (firstSchool + " is playing at " + param2 + " on " + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " against " + secondSchool  + " (wb4)");
                        sqlSchool2Name = secondSchool;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                   
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);                           
            } else if (storedProcedure == 'SchoolDateFuture'){           
                //Test: Will TestTeamThree play on 1st December?
                queryType = 'SDF';
                onSuccess = function(secondSchool, location){
                    if (location == null) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wb5)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + ' is playing on ' + formatDate(param2) + ' at ' + location + " against " + secondSchool + " (wb6)");
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location; 
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else if (storedProcedure == 'NextMatch') {
                //Test: When will TestTeamThree play?
                queryType = 'NM';
                onSuccess = function(firstSchool, secondSchool,location, DateOfMatch){
                    if ((firstSchool==null)||(secondSchool==null)||(location == null)||(DateOfMatch==null)) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wb7)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    } else {
                        responseDialog = ('The next game is ' + firstSchool + ' against ' + secondSchool + ' at ' + location + ' on ' + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " (wb8)");    
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                    
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else {
                responseDialog = "I am sorry the bot can't understand that question (wb9)";
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);                
            }
        }
    }
]).triggerAction({
    matches: 'WhenFuture'
});

bot.dialog('WhoFuture',[
    function (session, args) {
        var selectedIntent = 'WhoFuture';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var onSuccess, param2, queryType, storedProcedure;
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wc0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            if(schools.hasOwnProperty("firstSchool")){        
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
                luisFirstSchoolScore = schools.firstSchoolScore;
            };
            var locations = parseLocation(session, args);
            var dates = parseDate(session, args);
            if(schools.hasOwnProperty("secondSchool")){
                param2 = schools.secondSchool;
                luisSecondSchool = schools.secondSchool;
                luisSecondSchoolScore = schools.secondSchoolScore;
            } else if(locations.hasOwnProperty("firstLocation")){
                param2 = locations.firstLocation;
                luisLocation = locations.firstLocation;
                luisLocationScore = locations.firstLocationScore;
            } else if ((dates.hasOwnProperty('futureDate'))&& (dates.hasOwnProperty('pastDate'))) {
                if ((selectedIntent == 'WhereFuture') || (selectedIntent == "WhenFuture")|| (selectedIntent == 'WhoFuture')) {
                    param2 = dates.futureDate;
                    luisDateOfMatch = param2;  
                } else if ((selectedIntent == 'WherePast') || (selectedIntent == "WhenPast")|| (selectedIntent == 'WhoPast')||(selectedIntent=='Score')) {
                    param2 = dates.pastDate;
                    luisDateOfMatch = param2;
                } 
            } else if (dates.hasOwnProperty('firstDate')) {
                param2 = dates.firstDate;
                luisDateOfMatch = param2;   
            } else {
                // param2 default is today's date
                param2 = new Date();            
            };          
            var constructedSP = constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate );
            storedProcedure = constructedSP.sp;
            if (storedProcedure == 'SchoolSchoolFuture'){
            //Test: Is TestTeamThree playing TestTeamFour?
                queryType = 'SSF'; 
                onSuccess = function(location, DateOfMatch){ 
                    if ((location == null)||(DateOfMatch == null)) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wc1)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + " is playing " + param2 + " at " + location + " on " + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " (wc2)");
                        sqlSchool2Name = param2;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                }; 
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);
            } else if (storedProcedure == 'SchoolLocationFuture') {
                //Test: Who will TestTeamThree play at Dulwich?
                queryType = 'SLF';  
                onSuccess = function(secondSchool, DateOfMatch){
                    if (DateOfMatch == null) {
                        responseDialog =  "The bot thinks this match has not been scheduled yet (wc3)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    } else {  
                        responseDialog = (firstSchool + " is playing " + " at " + param2 + " on " + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " against " + secondSchool  + " (wc4)");
                        console.log("Date of match: " + DateOfMatch);
                        sqlSchool2Name = secondSchool;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                   
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);                           
            } else if (storedProcedure == 'SchoolDateFuture'){           
                //Test: Who will TestTeamFour play on 1st December?
                queryType = 'SDF';
                onSuccess = function(secondSchool, location){
                    if (location == null) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wc5)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + ' is playing on ' + param2 + ' at ' + location + " against " + secondSchool + " (wc6)");
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location; 
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else if (storedProcedure == 'NextMatch') {
                //Test: Who will TestTeamThree play?
                queryType = 'NM';
                onSuccess = function(firstSchool, secondSchool,location, DateOfMatch){
    /*                
                    if (firstSchool==null) {
                        responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);    
                    }  else if ((secondSchool==null)||(location == null)||(DateOfMatch==null)) {
    */
                        if ((secondSchool==null)||(location == null)||(DateOfMatch==null)) {
                        responseDialog = "The bot thinks this match has not been scheduled yet (wc7)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    } else {
                        responseDialog = ('The next game for ' + firstSchool + ' is against ' + secondSchool + ' at ' + location + ' on ' + formatDate(DateOfMatch) + " at " + formatTime(DateOfMatch) + " (wc8)");    
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                    
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else {
                responseDialog = "I am sorry the bot can't understand that question (wc9)";
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);                
            }
        }
    }
]).triggerAction({
    matches: 'WhoFuture'
});

bot.dialog('WherePast',[
    function (session, args) {
        var selectedIntent = 'WherePast';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var onSuccess, param2, queryType, storedProcedure;
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wd0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            if(schools.hasOwnProperty("firstSchool")){        
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
                luisFirstSchoolScore = schools.firstSchoolScore;
            };
            var locations = parseLocation(session, args);
            var dates = parseDate(session, args);
            if(schools.hasOwnProperty("secondSchool")){
                param2 = schools.secondSchool;
                luisSecondSchool = schools.secondSchool;
                luisSecondSchoolScore = schools.secondSchoolScore;
            } else if(locations.hasOwnProperty("firstLocation")){
                param2 = locations.firstLocation;
                luisLocation = locations.firstLocation;
                luisLocationScore = locations.firstLocationScore;
            } else if ((dates.hasOwnProperty('futureDate'))&& (dates.hasOwnProperty('pastDate'))) {
                console.log("Inside dates.hasOwnProperty");
                if ((selectedIntent == 'WhereFuture') || (selectedIntent == "WhenFuture")|| (selectedIntent == 'WhoFuture')) {
                    param2 = dates.futureDate;
                    luisDateOfMatch = param2;  
                } else if ((selectedIntent == 'WherePast') || (selectedIntent == "WhenPast")|| (selectedIntent == 'WhoPast')||(selectedIntent=='Score')) {
                    param2 = dates.pastDate;
                    luisDateOfMatch = param2;
                } 
            } else if (dates.hasOwnProperty('firstDate')) {
                param2 = dates.firstDate;
                luisDateOfMatch = param2;   
            } else {
                // param2 default is today's date
                param2 = new Date();            
            };     
            var constructedSP = constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate );
            storedProcedure = constructedSP.sp;
            if (storedProcedure == 'SchoolSchoolPast'){   
            //Test: Where did TestTeamOne play TestTeamTwo?
                queryType = 'SSP'; 
                onSuccess = function(location, DateOfMatch){ 
                    if ((location == null)||(DateOfMatch == null)) {
                        responseDialog = "The bot thinks this match has not been played yet (wd1)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + " played " + param2 + " at " + location + " on " + formatDate(DateOfMatch)  + " (wd2)");
                        sqlSchool2Name = param2;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                }; 
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);
            } else if (storedProcedure == 'SchoolLocationPast') {
                //Return first game (if any) from today's date          
                //Test: Did TestTeamOne play at Rosendale?
                queryType = 'SLP';  
                onSuccess = function(secondSchool, DateOfMatch){
                    if (DateOfMatch == null) {
                        responseDialog =  "The bot thinks this match has not been played yet (wd3)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    } else { 
                        responseDialog = (firstSchool + " played at " + param2 + " on " + formatDate(DateOfMatch) + " against " + secondSchool  + " (wd4)");
                        console.log("first school: " + firstSchool);
                        sqlSchool2Name = secondSchool;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                   
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);               
            } else if (storedProcedure == 'SchoolDatePast'){
                //Test: Where did TestTeamTwo play on 1st August?
                queryType = 'SDP';
                onSuccess = function(secondSchool, location){
                    if (location == null) {
                        responseDialog = "The bot thinks this match has not been played yet (wd5)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + ' played ' + secondSchool + ' at ' + location + " on " + param2 + " (wd6)");
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location; 
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else if (storedProcedure == 'LastMatch') {
                //Test: Where did TestTeamOne play?
                queryType = 'LM';
                onSuccess = function(firstSchool, secondSchool,location, DateOfMatch){
                    if ((firstSchool==null)||(secondSchool==null)||(location == null)||(DateOfMatch==null)) {
                        responseDialog = "The bot thinks this match has not been played yet (wd7)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    } else {
                        responseDialog = (firstSchool + ' played against ' + secondSchool + ' at ' + location + ' on ' + formatDate(DateOfMatch) + " (wd8)");    
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                    
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else {
                responseDialog = "I am sorry the bot can't understand that question (wd9)";
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);                
            }
        }
    }
]).triggerAction({
    matches: 'WherePast'
});

bot.dialog('WhenPast',[
    function (session, args) {
        var selectedIntent = 'WhenPast';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var onSuccess, param2, queryType, storedProcedure;
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (we0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            if(schools.hasOwnProperty("firstSchool")){        
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
                luisFirstSchoolScore = schools.firstSchoolScore;
            };
            var locations = parseLocation(session, args);
            var dates = parseDate(session, args);    
            if(schools.hasOwnProperty("secondSchool")){
                param2 = schools.secondSchool;
                luisSecondSchool = schools.secondSchool;
                luisSecondSchoolScore = schools.secondSchoolScore;
            } else if(locations.hasOwnProperty("firstLocation")){
                param2 = locations.firstLocation;
                luisLocation = locations.firstLocation;
                luisLocationScore = locations.firstLocationScore;
            } else if ((dates.hasOwnProperty('futureDate'))&& (dates.hasOwnProperty('pastDate'))) {
                if ((selectedIntent == 'WhereFuture') || (selectedIntent == "WhenFuture")|| (selectedIntent == 'WhoFuture')) {
                    param2 = dates.futureDate;
                    luisDateOfMatch = param2;  
                } else if ((selectedIntent == 'WherePast') || (selectedIntent == "WhenPast")|| (selectedIntent == 'WhoPast')||(selectedIntent=='Score')) {
                    param2 = dates.pastDate;
                    luisDateOfMatch = param2;
                } 
            } else if (dates.hasOwnProperty('firstDate')) {
                param2 = dates.firstDate;
                luisDateOfMatch = param2;   
            } else {
                // param2 default is today's date
                param2 = new Date();            
            };
            var constructedSP = constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate );
            storedProcedure = constructedSP.sp;
            if (storedProcedure == 'SchoolSchoolPast'){   
            //Test: When did TestTeamOne play TestTeamTwo?
                queryType = 'SSP'; 
                onSuccess = function(location, DateOfMatch){
                    if ((location == null)||(DateOfMatch == null)) {
                        responseDialog = "The bot thinks this match has not been played yet (we1)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + " played " + param2 + " at " + location + " on " + formatDate(DateOfMatch)  + " (we2)");
                        sqlSchool2Name = param2;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                }; 
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);
            } else if (storedProcedure == 'SchoolLocationPast') {
                //Return first game (if any) from today's date          
                //Test:When did TestTeamTwo play at Rosendale?
                queryType = 'SLP';  
                onSuccess = function(secondSchool, DateOfMatch){
                    if (DateOfMatch == null) {
                        responseDialog =  "The bot thinks this match has not been played yet (we3)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    } else {  
                        responseDialog = (firstSchool + " played at " + param2 + " on " + formatDate(DateOfMatch) + " against " + secondSchool  + " (we4)");
                        sqlSchool2Name = secondSchool;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                   
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);               
            } else if (storedProcedure == 'SchoolDatePast'){
                //Test: Did TestTeamOne play on 1st August?
                queryType = 'SDP';
                onSuccess = function(secondSchool, location){
                    if (location == null) {
                        responseDialog = "The bot thinks this match has not been played yet (we5)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + ' played ' + secondSchool + ' at ' + location + " on " + param2 + " (we6)");
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location; 
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else if (storedProcedure == 'LastMatch') {
                //Test: When did TestTeamTwo play?
                queryType = 'LM';
                onSuccess = function(firstSchool, secondSchool,location, DateOfMatch){
                    if ((firstSchool==null)||(secondSchool==null)||(location == null)||(DateOfMatch==null)) {
                        responseDialog = "The bot thinks this match has not been played yet (we7)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    } else {
                        responseDialog = ('The last game for ' + firstSchool + ' was against ' + secondSchool + ' at ' + location + ' on ' + formatDate(DateOfMatch) + " (we8)");    
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                    
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else {
                responseDialog = "I am sorry the bot can't understand that question (we9)";
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);                
            }
        }
    }
]).triggerAction({
    matches: 'WhenPast'
});

bot.dialog('WhoPast',[
    function (session, args) {
       var selectedIntent = 'WhoPast';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var onSuccess, param2, queryType, storedProcedure;   
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wf0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            if(schools.hasOwnProperty("firstSchool")){        
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
                luisFirstSchoolScore = schools.firstSchoolScore;
            };
            var locations = parseLocation(session, args);
            var dates = parseDate(session, args);
            if(schools.hasOwnProperty("secondSchool")){
                param2 = schools.secondSchool;
                luisSecondSchool = schools.secondSchool;
                luisSecondSchoolScore = schools.secondSchoolScore;
            } else if(locations.hasOwnProperty("firstLocation")){
                param2 = locations.firstLocation;
                luisLocation = locations.firstLocation;
                luisLocationScore = locations.firstLocationScore;
            } else if ((dates.hasOwnProperty('futureDate'))&& (dates.hasOwnProperty('pastDate'))) {
                if ((selectedIntent == 'WhereFuture') || (selectedIntent == "WhenFuture")|| (selectedIntent == 'WhoFuture')) {
                    param2 = dates.futureDate;
                    luisDateOfMatch = param2;  
                } else if ((selectedIntent == 'WherePast') || (selectedIntent == "WhenPast")|| (selectedIntent == 'WhoPast')||(selectedIntent=='Score')) {
                    param2 = dates.pastDate;
                    luisDateOfMatch = param2;
                } 
            } else if (dates.hasOwnProperty('firstDate')) {
                param2 = dates.firstDate;
                luisDateOfMatch = param2;   
            } else {
                // param2 default is today's date
                param2 = new Date();            
            };
            var constructedSP = constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate );
            storedProcedure = constructedSP.sp;
            if (storedProcedure == 'SchoolSchoolPast'){   
            //Test: Did TestTeamOne play TestTeamTwo?
                queryType = 'SSP'; 
                onSuccess = function(location, DateOfMatch){ 
                    if ((location == null)||(DateOfMatch == null)) {
                        responseDialog = "The bot thinks this match has not been played yet (wf1)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + " played " + param2 + " at " + location + " on " + formatDate(DateOfMatch)  + " (wf2)");
                        sqlSchool2Name = param2;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                }; 
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);
            } else if (storedProcedure == 'SchoolLocationPast') {
                //Return first game (if any) from today's date          
                //Test:Who did TestTeamOne play at Rosendale?
                queryType = 'SLP';  
                onSuccess = function(secondSchool, DateOfMatch){
                    if (DateOfMatch == null) {
                        responseDialog =  "The bot thinks this match has not been played yet (wf3)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    } else {  
                        responseDialog = (firstSchool + " played at " + param2 + " on " + formatDate(DateOfMatch) + " against " + secondSchool  + " (wf4)");
                        console.log("first school: " + firstSchool);
                        sqlSchool2Name = secondSchool;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                   
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure);               
            } else if (storedProcedure == 'SchoolDatePast'){
                //Test: Who did TestTeamTwo play on 1st August?
                queryType = 'SDP';
                onSuccess = function(secondSchool, location){
                    if (location == null) {
                        responseDialog = "The bot thinks this match has not been played yet (wf5)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        responseDialog = (firstSchool + ' played ' + secondSchool + ' at ' + location + " on " + param2 + " (wf6)");
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location; 
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else if (storedProcedure == 'LastMatch') {
                //Test: Who did TestTeamOne play?
                queryType = 'LM';
                onSuccess = function(firstSchool, secondSchool,location, DateOfMatch){
                    if ((firstSchool==null)||(secondSchool==null)||(location == null)||(DateOfMatch==null)) {
                        responseDialog = "The bot thinks this match has not been played yet (wf7)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    } else {
                        responseDialog = ('The last game for ' + firstSchool + ' was against ' + secondSchool + ' at ' + location + ' on ' + formatDate(DateOfMatch) + " (wf8)");    
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                    
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else {
                responseDialog = "I am sorry the bot can't understand that question (wf9)";
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);                
            }
        }
    }
]).triggerAction({
    matches: 'WhoPast'
});

bot.dialog('Score',[
    function (session, args) {
        var selectedIntent = 'Score';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var onSuccess, param2, queryType, storedProcedure;          
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wg0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            if(schools.hasOwnProperty("firstSchool")){        
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
                luisFirstSchoolScore = schools.firstSchoolScore;
            };
            var locations = parseLocation(session, args);
            var dates = parseDate(session, args);   
            if(schools.hasOwnProperty("secondSchool")){
                param2 = schools.secondSchool;
                luisSecondSchool = schools.secondSchool;
                luisSecondSchoolScore = schools.secondSchoolScore;
            } else if(locations.hasOwnProperty("firstLocation")){
                param2 = locations.firstLocation;
                luisLocation = locations.firstLocation;
                luisLocationScore = locations.firstLocationScore;
            } else if ((dates.hasOwnProperty('futureDate'))&& (dates.hasOwnProperty('pastDate'))) {
                if ((selectedIntent == 'WhereFuture') || (selectedIntent == "WhenFuture")|| (selectedIntent == 'WhoFuture')) {
                    param2 = dates.futureDate;
                    luisDateOfMatch = param2;  
                } else if ((selectedIntent == 'WherePast') || (selectedIntent == "WhenPast")|| (selectedIntent == 'WhoPast')||(selectedIntent=='Score')) {
                    param2 = dates.pastDate;
                    luisDateOfMatch = param2;
                } 
            } else if (dates.hasOwnProperty('firstDate')) {
                param2 = dates.firstDate;
                luisDateOfMatch = param2;   
            } else {
                // param2 default is today's date
                param2 = new Date(); 
                console.log("param2 = new Date()" + param2);          
            };
            var constructedSP = constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate );
            storedProcedure = constructedSP.sp;
            if (storedProcedure == 'SchoolSchoolPast'){   
            //Test: What was the score between TestTeamOne and TestTeamTwo?
                queryType = 'SSS';           
                onSuccess = function(location, DateOfMatch, firstSchool, firstSchoolScore, secondSchool,secondSchoolScore ){ 
                    if ((location == null)||(DateOfMatch == null)) {
                        responseDialog = "The bot thinks this match has not been played yet (ss1)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                   
                    } else {
                        //responseDialog = (firstSchool + " played " + param2 + " at " + location + " on " + formatDate(DateOfMatch)  + " (wp2)");
                        responseDialog = ("The result was " + firstSchool + " " + firstSchoolScore + " " + secondSchool + " " + secondSchoolScore  + " (ss2)");
                        sqlSchool2Name = param2;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);
                    }
                };
                //change the name of the storedProcedure in this special case of the Score intent
                storedProcedure = "SchoolSchoolScore";
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else if (storedProcedure == 'LastMatch') {
                //Test: What was the TestTeamOne score?
                queryType = 'LMS';
                onSuccess = function(firstSchool,firstSchoolScore, secondSchool,secondSchoolScore, location, DateOfMatch){            
                    if ((firstSchool==null)||(secondSchool==null)||(location == null)||(DateOfMatch==null)) {
                        console.log("SS3 first school: " + firstSchool);
                        responseDialog = "The bot thinks this match has not been played yet (ss3)";
                        session.send(responseDialog);
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    } else {
                        //responseDialog = ('The last game for ' + firstSchool + ' was against ' + secondSchool + ' at ' + location + ' on ' + formatDate(DateOfMatch) + " (wp8)");    
                        responseDialog = ("The result was " + firstSchool + " " + firstSchoolScore + " " + secondSchool + " " + secondSchoolScore  + " (ss4)");    
                        sqlSchool2Name = secondSchool;
                        sqlLocation = location;
                        sqlDateOfMatch = DateOfMatch;
                        session.send(responseDialog);                    
                        writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                            luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                            responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                            responseDialog, dateRecordWritten);                    
                    }
                };
                //change the name of the storedProcedure in this special case of the Score intent
                storedProcedure = "LastMatchScore";
                getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure); 
            } else {
                responseDialog = "I am sorry the bot can't understand that question (ss5)";
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);                
            }
        }
    }
]).triggerAction({
    matches: 'Score'
});

bot.dialog('Colours',[
    function (session, args) {
         // variables required for this intent        
        //var firstSchool, schools,schoolIndex, schoolColour, division;
        var schoolIndex, schoolColour, division;
        // These following variables are added because they are using in logging the responses
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wh0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            var schoolPresent = false;
            if(schools.hasOwnProperty("firstSchool")){
                firstSchool = schools.firstSchool;
                luisFirstSchool = firstSchool;
            }
            var i = 0;
            for (i; i<ADivision.length; i++) {
                if (ADivision[i][0] == firstSchool) {                
                    schoolPresent=true;
                    schoolIndex = i;
                    break;
                }
            }    
            if (schoolPresent) {
                schoolColour = (ADivision[schoolIndex][1]);
                division = (ADivision[schoolIndex][2]);
                console.log("schoolColour: " + schoolColour);
                responseDialog = (firstSchool + " plays in the " + division + " Division and the colours are " +  schoolColour);           
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);      
            }
            }
    }
]).triggerAction({
    matches: 'Colours'
});

bot.dialog('DivTeam',[
    function (session, args) {
        // variables required for this intent        
        var schoolIndex, schoolColour, division;
        //var firstSchool, schools,schoolIndex, schoolColour, division;
        // The following variables are added because they are using in logging the responses
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
        var firstSchool;
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var schools =    parseSchools(session, args);
        // raise an error if the name of a school is not found
        if(schools.firstSchool == "firstSchool not found") {
            responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B (wh0)";
            session.send(responseDialog);
            writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                responseDialog, dateRecordWritten);      
        } else {
            var schoolPresent = false;
            schools = parseSchools(session, args);
            if(schools.hasOwnProperty("firstSchool")){
                firstSchool = schools.firstSchool;
            }
            var i = 0;
            for (i; i<ADivision.length; i++) {
                if (ADivision[i][0] == firstSchool) {                
                    schoolPresent=true;
                    schoolIndex = i;
                    break;
                }
            }    
            if (schoolPresent) {
                schoolColour = (ADivision[schoolIndex][1]);
                division = (ADivision[schoolIndex][2]);
                console.log("DivSchool: " + schoolColour);
                responseDialog = (firstSchool + " plays in the " + division + " Division and the colours are " +  schoolColour);           
                session.send(responseDialog);
                writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
                    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
                    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
                    responseDialog, dateRecordWritten);      
            }
        }
    }
]).triggerAction({
    matches: 'DivTeam'
});


//School entities are returned by LUIS in a random order
//It is necessary to sort the returned schools by score in order to select the highest scoring entity
//LUIS may return more than one prediction for an entity
//For example, school Sudbourne might be predicted as either school Sudbourne or school Rosendale with different scores
//It is necessary to only select the highest scoring prediction for an entity and skip the other predictions
//Otherwise you could end up with firstSchool and secondSchool both being the same entity
function parseSchools(session, args) {
    // variables required for this intent        
    var firstSchool, firstSchoolScore, firstSchoolEntity, secondSchool, secondSchoolScore, secondSchoolEntity, tempSchool;

// These variables are added because they are using in logging the responses
//      var selectedIntent = 'Colours';
        var utterance = session.message.text;
        var turnDateTime = new Date();
        var luisIntent = args.intent.intent.toString();
        var luisIntentScore = args.intent.score.toString();
        var luisFirstSchool = "first school not used";        
        var luisFirstSchoolScore = 0;
        var luisSecondSchool = 'No Second School';
        var luisSecondSchoolScore = 0;
        var luisLocation = "No Location";
        var luisLocationScore = 0;
        var luisDateOfMatch = "1980-01-01";
        var bayes = classifier.getClassifications(utterance);
        var bayesIntent = bayes[0].label;
        var bayesScore = bayes[0].value;
        var responseNbIntent = bayesIntent;
        var responseNbIntentScore = bayesScore;;
        var sqlSchool1Name = firstSchool;
        var sqlSchool2Name = "No SQL School 2 Name";
        var sqlLocation = "No SQL Location";
        var sqlDateOfMatch = "1980-01-01";
        var responseDialog =  "No responseDialog set";
        var dateRecordWritten = new Date();
//      var onSuccess, firstSchool, param2, queryType, storedProcedure;

    var parsedSchools = new Object();
    var isSchool = function(entity) {
        return entity.type.startsWith("school");
    }; 
    var schools = args.intent.entities.filter(entity => isSchool(entity));
    // If there are at least two school entities then sort the school entities
    // and select the top and second top scoring entities
    if(schools.length > 1) {   
        function compare(x, y) {
            return y[1] - x[1];
        }
        schools.sort(compare);
        firstSchool = schools[0].type.toString(); 
        firstSchoolScore = schools[0].score.toString();
        firstSchoolEntity = schools[0].entity.toString();             
        for (var i = 1; i < schools.length; i++) {
            tempSchool = schools[i].entity.toString();
            if (firstSchoolEntity == tempSchool) {
                continue;
            } else {
                secondSchool = schools[i].type.toString();
                secondSchoolScore = schools[i].score.toString();
                secondSchool = secondSchool.substring(7, secondSchool.length);
                parsedSchools.secondSchool          = secondSchool;
                parsedSchools.secondSchoolScore     = secondSchoolScore;
                break;
            }
        }
    } else if (schools.length == 1) {
        firstSchool = firstSchool = schools[0].type.toString();
        firstSchoolScore = schools[0].score.toString();                                
    } else {
        //responseDialog = "Please enter the name of at least one school.  \n If you are asking about Rosendale or Sunnyhill  \n please resend your message and specify the A or the B team  \n e.g. Rosendale B";
        //session.send(responseDialog);
        //LUIS entity is "school XXX". This is truncated below. So additional spaces are added to firstSchool here
        firstSchool = "1234567firstSchool not found"; 
        //writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore, luisFirstSchool, luisFirstSchoolScore, 
        //    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, 
        //    responseNbIntent, responseNbIntentScore, sqlSchool1Name, sqlSchool2Name, sqlLocation, sqlDateOfMatch, 
        //    responseDialog, dateRecordWritten);     
    }
//    if(firstSchool.toString()){
    if(firstSchool){
        firstSchool = firstSchool.substring(7, firstSchool.length);
        parsedSchools.firstSchool           = firstSchool;
        console.log("parsedSchools.firstSchool: " + parsedSchools.firstSchool);
        parsedSchools.firstSchoolScore      = firstSchoolScore;
    }
    return parsedSchools;
};

//Luis may return more than one location entity and they will be in no particular order
//the code currently assumes 0-2 location entities returned and selects the highest scoring prediction
 //parseLocation could be improved using an array sort like parseSchools
function parseLocation(session, args) {
   var firstLocation, firstLocationScore;
   var parsedLocation = new Object();
   var isLocation = function(entity) {
      return entity.type.startsWith("location");
    }; 
    var locations = args.intent.entities.filter(entity => isLocation(entity));
    if(locations.length > 1) {
        if(locations[1].score >= locations[0].score) {
            firstLocation = locations[1].type.toString();
            firstLocationScore = locations[1].score.toString();
            firstLocation = firstLocation.substring(9, firstLocation.length);
            parsedLocation.firstLocation = firstLocation;
            parsedLocation.firstLocationScore = firstLocationScore; 
        } 
    } else if (locations.length == 1) {
            firstLocation = locations[0].type.toString();
            firstLocationScore = locations[0].score.toString();
            firstLocation = firstLocation.substring(9, firstLocation.length);
            parsedLocation.firstLocation = firstLocation;
            parsedLocation.firstLocationScore = firstLocationScore; 
    } 
    return parsedLocation;       
 };  
 
//for a date such as 20th October Luis will return two values in relation to today's date
//e.g. 2018-10-2017 and 2018-10-2018
//this code captures the past date of the future date depending on today's date  
// other code decides whether to use the past date or the future date depending on whether
//the intent is a past or a future intent
//https://stackoverflow.com/questions/44356557/convert-luis-datetime-v2-to-js-date
function parseDate(session, args) {
   var firstDate, firstDateValue, secondDateValue;
   var parsedDate = new Object();
   var isDate = function(entity) {
      return entity.type.startsWith("builtin.datetimeV2.date");
    }; 
    var dates = args.intent.entities.filter(entity => isDate(entity));
    if (dates.length == 0) {
    } else if(dates[0].resolution.values[0].value.toString()){
        firstDate = dates[0].resolution.values[0].value.toString();
        parsedDate.firstDate = firstDate;
        firstDateValue = dates[0].resolution.values[0].value.toString();

        if (dates[0].resolution.values[1]){
            secondDateValue = dates[0].resolution.values[1].value.toString();
            if (new Date(firstDateValue) < new Date(secondDateValue)) {
                parsedDate.pastDate = firstDateValue;
                parsedDate.futureDate = secondDateValue;
            } else {
                parsedDate.pastDate = secondDateValue;
                parsedDate.futureDate = firstDateValue;
            }           
       }
    }
    return parsedDate;
};

//Decide which Stored Procedure to use
function constructSP(session, args, selectedIntent, schools, locations, dates, todaysDate) {
    var firstSchool, secondSchool, firstLocation, DateOfMatch;
    var constructedSP = new Object();
    if(schools.hasOwnProperty("firstSchool")){        
            firstSchool = schools.firstSchool;
        };
        if(schools.hasOwnProperty("secondSchool")){        
            secondSchool = schools.secondSchool;
        };
        if(locations.hasOwnProperty("firstLocation")){
            firstLocation = locations.firstLocation;
        };
        
        if (dates.hasOwnProperty('firstDate')) {
            DateOfMatch = dates.firstDate;
        };    
        if (locations.hasOwnProperty('firstLocation')){
            if ((selectedIntent == 'WhereFuture') || (selectedIntent == 'WhoFuture') || (selectedIntent == 'WhenFuture')) {
                constructedSP.sp = 'SchoolLocationFuture';
            } else if ((selectedIntent == 'WherePast') || (selectedIntent == 'WhoPast') || (selectedIntent == 'WhenPast') ||(selectedIntent == 'Score')) {
                constructedSP.sp = "SchoolLocationPast";
            }
        } else if (dates.hasOwnProperty('firstDate')){
            if ((selectedIntent == 'WhereFuture') || (selectedIntent == 'WhoFuture') || (selectedIntent == 'WhenFuture')) {
                constructedSP.sp = 'SchoolDateFuture';
            } else if ((selectedIntent == 'WherePast') || (selectedIntent == 'WhoPast') || (selectedIntent =='WhenPast')||(selectedIntent == 'Score')) {
                constructedSP.sp = "SchoolDatePast";
            }
        } else if (schools.hasOwnProperty('secondSchool')) {
            if ((selectedIntent == 'WhereFuture') || (selectedIntent == 'WhoFuture') || (selectedIntent == 'WhenFuture')) {
                constructedSP.sp = 'SchoolSchoolFuture';
            } else if ((selectedIntent == 'WherePast') || (selectedIntent == 'WhoPast') || (selectedIntent == 'WhenPast')||(selectedIntent =='Score')) {
                constructedSP.sp = "SchoolSchoolPast";
            }
        } else if (schools.hasOwnProperty('firstSchool')){
            if ((selectedIntent == 'WhereFuture') || (selectedIntent == 'WhoFuture') || (selectedIntent == 'WhenFuture')) {
                constructedSP.sp = 'NextMatch';
            } else if ((selectedIntent == 'WherePast') || (selectedIntent =='WhoPast') || (selectedIntent == 'WhenPast')||(selectedIntent == 'Score')) {
                constructedSP.sp = "LastMatch";
            }
        } else {
            constructedSP.sp = "NONE";
        }
        return constructedSP; 
};

//Decide which additional database query parameter to use along with firstSchool
function getData(onSuccess, firstSchool, param2, queryType, todaysDate, storedProcedure) {
    var localStoredProcedure = storedProcedure;
    var DateOfMatch;
    var location;
    var School1NameOUT;
    if      (queryType == 'SSF') {
            var secondSchool = param2;
    } else if (queryType == 'SLF') {
            location = param2;
    } else if (queryType == 'SDF') {
            DateOfMatch = param2;
    } else if (queryType == 'NM'){
            DateOfMatch = param2;
    } else if (queryType == 'SSP') {
            secondSchool = param2;
    } else if (queryType == 'SLP'){
            location = param2;
    } else if (queryType == 'SDP') {
            DateOfMatch = param2;
    } else if (queryType == 'LM'){
            DateOfMatch = param2;
    } else if (queryType == 'SSS'){
            secondSchool = param2;
    } else if (queryType == 'LMS'){
            DateOfMatch = param2;
    }
    var config = {userName: 'lspsfAdmin',password: '********', server: 'LSPSF.database.windows.net',
        options: {database: 'LSPSF', encrypt: true
        }
    }; 
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {console.log('Error connecting: ' + err);
        }
        else {
            queryDatabase();
        }
    });
    function queryDatabase() { 
        var request = new Request(localStoredProcedure, function(err, rowCount, rows) { 
            if (err) {console.log("Database query error: " + err);
            }
        connection.close();
        });
        if (queryType == 'SSF') { 
            request.addParameter('School1Name', TYPES.VarChar , firstSchool);
            request.addParameter('School2Name', TYPES.VarChar , secondSchool);
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('DateOfMatch', TYPES.DateTime);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName == "Location") {
                    location = value;
                } else if (paramName == "DateOfMatch") {
                     DateOfMatch = value;
                     onSuccess(location, DateOfMatch);
                } 
            });
        } else if (queryType == 'SLF'){
            //firstSchool in the code may correspond to secondSchool in the database
            //it is necessary to test firstSchool and secondSchool
            //in order to avoid both the parameters return with the same value
            request.addParameter('School1Name', TYPES.VarChar , firstSchool);
            request.addParameter('Location', TYPES.VarChar, location);    
            request.addOutputParameter('School2Name', TYPES.VarChar);        
            request.addOutputParameter('DateOfMatch', TYPES.DateTime);
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName == "School2Name") {
                   secondSchool = value;
                   console.log("secondSchool "+ secondSchool);
                } else if (paramName == "DateOfMatch") {
                    DateOfMatch = value;
                } else if (paramName == "School1NameOUT") {
                   School1NameOUT = value;
                   if (firstSchool == secondSchool) {
                       secondSchool = School1NameOUT;
                   }
                    onSuccess(secondSchool, DateOfMatch);
                } 
              });  
        } else if (queryType == 'SDF') {
             //firstSchool in the code may correspond to secondSchool in the database
            //it is necessary to test firstSchool and secondSchool
            //in order to avoid both the parameters return with the same value
            request.addParameter('School1Name', TYPES.VarChar , firstSchool);
            // from https://stackoverflow.com/questions/37307955/how-to-convert-node-js-date-to-sql-server-compatible-datetime
            request.addParameter('DateOfMatch', TYPES.DateTime , new Date('"' + DateOfMatch + '"'));
            request.addOutputParameter('School2Name', TYPES.VarChar);
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName == "School2Name") {
                   secondSchool = value;
                } else if (paramName == "Location") {
                    location = value;
                } else if (paramName == "School1NameOUT") {
                   School1NameOUT = value;
                   if (firstSchool == secondSchool) {
                       secondSchool = School1NameOUT;
                   }                    
                onSuccess(secondSchool, location);
                } 
            });           
        } else if (queryType == 'NM') {
            request.addParameter('School1NameIN', TYPES.VarChar , firstSchool);
            request.addParameter('DateOfMatchIN', TYPES.DateTime , new Date('"' + DateOfMatch + '"'));
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.addOutputParameter('School2Name', TYPES.VarChar);
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('DateOfMatchOUT', TYPES.DateTime);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName =='School1NameOUT'){
                    firstSchool = value;
                } else if (paramName == "School2Name") {
                    secondSchool = value;
                } else if (paramName == "Location") {
                     location = value;
                } else if (paramName == "DateOfMatchOUT") {
                     var DateOfMatch = value;
                     onSuccess(firstSchool,secondSchool,location,DateOfMatch);
                }
           });  
        } else if (queryType == 'SSP') {
            console.log("firstSchool in SSP: " + firstSchool);
            console.log("secondSchool in SSP: " + secondSchool); 
            request.addParameter('School1Name', TYPES.VarChar , firstSchool);
            request.addParameter('School2Name', TYPES.VarChar , secondSchool);
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('DateOfMatch', TYPES.DateTime);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName == "Location") {
                    location = value;
                    console.log("location in SSP: " + location);
                } else if (paramName == "DateOfMatch") {
                     var DateOfMatch = value;
                     console.log("DateOfMatch in SSP: " + DateOfMatch);
                     onSuccess(location, DateOfMatch);
                } 
            });
        } else if (queryType == 'SLP'){
            //firstSchool in the code may correspond to secondSchool in the database
            //it is necessary to test firstSchool and secondSchool
            //in order to avoid both the parameters return with the same value
            request.addParameter('School1Name', TYPES.VarChar , firstSchool);
            request.addParameter('Location', TYPES.VarChar, location);    
            request.addOutputParameter('School2Name', TYPES.VarChar);        
            request.addOutputParameter('DateOfMatch', TYPES.DateTime);
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName == "School2Name") {
                   secondSchool = value;
                } else if (paramName == "DateOfMatch") {
                    DateOfMatch = value;
                } else if (paramName == "School1NameOUT") {
                   School1NameOUT = value;
                   if (firstSchool == secondSchool) {
                       secondSchool = School1NameOUT;
                   }
                   onSuccess(secondSchool, DateOfMatch);
                } 
              });  
        } else if (queryType == 'SDP') {
            //firstSchool in the code may correspond to secondSchool in the database
            //it is necessary to test firstSchool and secondSchool
            //in order to avoid both the parameters return with the same value
            request.addParameter('School1Name', TYPES.VarChar , firstSchool);
            // from https://stackoverflow.com/questions/37307955/how-to-convert-node-js-date-to-sql-server-compatible-datetime
            request.addParameter('DateOfMatch', TYPES.DateTime , new Date('"' + DateOfMatch + '"'));
            request.addOutputParameter('School2Name', TYPES.VarChar);
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName == "School2Name") {
                   secondSchool = value;
                } else if (paramName == "Location") {
                    location = value; 
                } else if (paramName == "School1NameOUT") {
                   School1NameOUT = value;
                   if (firstSchool == secondSchool) {
                       secondSchool = School1NameOUT;
                   }            
                onSuccess(secondSchool, location);
                } 
            });
        } else if (queryType == 'LM') {
            request.addParameter('School1NameIN', TYPES.VarChar , firstSchool);
            request.addParameter('DateOfMatchIN', TYPES.DateTime , new Date('"' + DateOfMatch + '"'));
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.addOutputParameter('School2Name', TYPES.VarChar);
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('DateOfMatchOUT', TYPES.DateTime);
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName =='School1NameOUT'){
                    firstSchool = value;
                } else if (paramName == "School2Name") {
                    secondSchool = value;
                } else if (paramName == "Location") {
                     location = value;
                } else if (paramName == "DateOfMatchOUT") {
                     DateOfMatch = value;
                     onSuccess(firstSchool,secondSchool,location,DateOfMatch);
                }
           });              
        } else if (queryType == 'SSS') {
            request.addParameter('School1Name', TYPES.VarChar , firstSchool);
            request.addParameter('School2Name', TYPES.VarChar , secondSchool);
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('DateOfMatch', TYPES.DateTime);
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.addOutputParameter('School1Score', TYPES.TinyInt);
            request.addOutputParameter('School2NameOUT', TYPES.VarChar ); 
            request.addOutputParameter('School2Score', TYPES.TinyInt);  
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName == "Location") {
                    location = value;
                } else if (paramName == "DateOfMatch") {
                     DateOfMatch = value;
                } else if (paramName == "School1NameOUT") {
                     firstSchool = value;
                } else if (paramName == "School1Score") {
                     firstSchoolScore = value;
                } else if (paramName == "School2NameOUT") {
                     secondSchool = value;
                } else if (paramName == "School2Score") {
                     secondSchoolScore = value;
                     onSuccess(location, DateOfMatch, firstSchool, firstSchoolScore, secondSchool, secondSchoolScore);
                } 
            });             
        } else if (queryType == 'LMS') {
            request.addParameter('School1NameIN', TYPES.VarChar , firstSchool);
            request.addParameter('DateOfMatchIN', TYPES.DateTime , new Date('"' + DateOfMatch + '"'));
            request.addOutputParameter('School1NameOUT', TYPES.VarChar);
            request.addOutputParameter('School1Score', TYPES.TinyInt);           
            request.addOutputParameter('School2Name', TYPES.VarChar);
            request.addOutputParameter('School2Score', TYPES.TinyInt);             
            request.addOutputParameter('Location', TYPES.VarChar);
            request.addOutputParameter('DateOfMatchOUT', TYPES.DateTime);
            
            request.on('returnValue', function(paramName, value, metadata) {
                if (paramName =='School1NameOUT'){
                    // value of firstSchool is correct here
                    firstSchool = value;
                    // value of firstSchool is null here
                } else if (paramName == "School1Score") {
                     firstSchoolScore = value;
                     console.log("firstSchoolScore: " + firstSchoolScore);
                } else if (paramName == "School2Name") {
                    secondSchool = value;
                    console.log("secondSchool: " + secondSchool);
                } else if (paramName == "School2Score") {
                     secondSchoolScore = value;
                     console.log("secondSchoolScore: " + secondSchoolScore);
                } else if (paramName == "Location") {
                     location = value;
                     console.log("location: " + location);
                } else if (paramName == "DateOfMatchOUT") {
                     //var DateOfMatch = value;
                     DateOfMatch = value;
                     console.log("DateOfMatchOUT: " + DateOfMatch);
                     onSuccess(firstSchool,firstSchoolScore, secondSchool,secondSchoolScore, location, DateOfMatch);
                }
           });              
        }else {
          console.log("ParamName is not 'School', 'Location' or 'DateOfMatch"); 
        };     
    connection.callProcedure(request);
    }
}

function writeResponse(utterance, turnDateTime, luisIntent, luisIntentScore,luisFirstSchool, luisFirstSchoolScore, 
    luisSecondSchool, luisSecondSchoolScore, luisLocation, luisLocationScore, luisDateOfMatch, responseNbIntent, responseNbIntentScore,
    sqlSchool1Name, sqlSchool2Name,sqlLocation, sqlDateOfMatch, responseDialog, dateRecordWritten ){
     var config = {userName: 'lspsfAdmin',password: 'Zivio12!', server: 'LSPSF.database.windows.net',
        options: {database: 'LSPSF', encrypt: true}
    }; 
    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {console.log('Error connecting: ' + err);
        }
        else {
            writeToDatabase();
        }
    });
    function writeToDatabase() { 
        var request = new Request('ResponseSP', function(err, rowCount, rows) { 
            if (err) {console.log("Database query error: " + err);
            }
        connection.close();
        });
     request.addParameter('utterance', TYPES.VarChar , utterance);
     request.addParameter('turnDateTime', TYPES.DateTime , turnDateTime);
     request.addParameter('luisIntent', TYPES.VarChar , luisIntent );
     request.addParameter('luisIntentScore', TYPES.Real , luisIntentScore );
     request.addParameter('luisSchool1Name', TYPES.VarChar , luisFirstSchool);
     request.addParameter('luisSchool1Score', TYPES.Real , luisFirstSchoolScore);
     request.addParameter('luisSchool2Name', TYPES.VarChar , luisSecondSchool);
     request.addParameter('luisSchool2Score', TYPES.Real , luisSecondSchoolScore);
     request.addParameter('luisLocation', TYPES.VarChar , luisLocation);
     request.addParameter('luisLocationScore', TYPES.Real , luisLocationScore);
     request.addParameter('luisDateOfMatch', TYPES.DateTime , new Date('"' + luisDateOfMatch + '"'));    
     request.addParameter('nbIntent', TYPES.VarChar , responseNbIntent);    
     request.addParameter('nbIntentScore', TYPES.Real , responseNbIntentScore);                   
     request.addParameter('sqlSchool1Name', TYPES.VarChar , sqlSchool1Name);
     request.addParameter('sqlSchool2Name', TYPES.VarChar , sqlSchool2Name);
     request.addParameter('sqlLocation', TYPES.VarChar , sqlLocation);
     request.addParameter('sqlDateOfMatch', TYPES.DateTime , new Date('"' + sqlDateOfMatch + '"'));
     request.addParameter('responseDialog', TYPES.Text , responseDialog);         
     request.addParameter('dateRecordWritten', TYPES.DateTime , new Date('"' + dateRecordWritten + '"'));
        connection.callProcedure(request);
    }
};

function formatDate(date){
    console.log("Date in formatDate is: " + date.toString);
    if (date instanceof Date) {
        var formattedDate = (date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear());
    } else {
        console.log("Non-date variable passed to formatDate()");
        formattedDate = date;
    }
     return formattedDate;
}

function formatTime(time){
    var minutes = time.getMinutes();
    if (minutes < 10){
        minutes = "0" + minutes;
    }
    var formattedTime = (time.getHours() + ":" + minutes );
    return formattedTime;
};