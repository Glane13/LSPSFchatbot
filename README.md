# LSPSFchatbot
Football league chatbot developed for Master's degree dissertation
March 2019

Key technologies:

JavaScript

JavaScript tedious library (for connections to Azure SQL)

JavaScript natural library (for Naive Bayes classifier)

Microsoft Cognitive Services - LUIS language understanding (Cloud service)

Microsoft Azure SQL Server using Stored Procedures (Cloud service)

Twilio Programmable SMS (Cloud service)

I wrote a fully functioning beta chatbot as part of the dissertation for my Master’s Degree in Web Science and Big Data at the University of Liverpool. I was awarded the degree with distinction in June 2019.

The dissertation had an academic objective which was to evaluate different retraining strategies for a chatbot (see the end for details). The chatbot was developed to harvest real-world performance data under different chatbot retraining regimes in order to establish whether targeted retraining regimes performed better than a random baseline. 

The chatbot itself answered Who-, Where-, When- questions about fixtures and results in a children's’ football league.

It is important to point out that this was not a software engineering degree. The primary objective of the application was to harvest and analyse user data. The dissertation highlighted a number of areas of software coding that could have been improved if the primary focus had been on software development techniques and code quality. 

The chatbot was hosted on Microsoft Azure using SMS messages for questions and responses. The beta chatbot was used by 14 real-world research participants over an 8 week period. I also wrote two JavaScript utility applications to process the data harvested from the chatbot usage. 

The chatbot implemented the following features:

Integration with:
• Microsoft Cognitive Services LUIS language understanding
• Twilio for two-way interaction with the chatbot via SMS
• Microsoft Azure SQL server as a data store for fixtures and results, and to log information about operation of the chatbot.

A Naive Bayes classifier for Intent and Entity predictions that were compared to the predictions provided by Microsoft LUIS

Complex business logic to:
• Trigger a relevant Intent (e.g. WhoFuture) and then identify missing slot(s) that need filling
• Implement JavaScript callback function
• Construct SQL stored procedure based on the required information (e.g. the score between two teams)
• Retrieve the required information from Azure SQL
• Construct the response to the user as the target of the callback function
• Send the response to the user
• Log all activities at a fine level of detail

A number of challenges needed to be overcome including:
    • Different date-time and other data formats in different elements of the overall architecture
    • Comprehensive test scripts for regression testing
    • Technical limitations of the Microsoft LUIS service

tl;dr

This section describes the academic goal of the research.

Classification systems such as Naive Bayes and Microsoft LUIS return a confidence score with their predictions. The classification with highest confidence score is the top-scoring Intent or Entity.

Chatbots do not answer all questions correctly. Often this is because the natural language understanding component has misclassified the Intent or one or more Entities.

The chatbot needs to be retrained with the correct Intent and/or Entities labelled.

Say that you don’t have time to review, label and retrain all incorrect responses. Say you only have time to retrain 50% of them. What is the optimal retraining strategy?

Is it better to retrain:
    • a random selection of 50% of the incorrect responses?
    • the top 50% of incorrect responses for which the confidence score is highest but which is anyway wrong (i.e. the chatbot was confident that the response was correct but it was actually incorrect)?
    • the top 50% of incorrect response for which the confidence score was lowest and which were wrong (i.e. the chatbot was not confident about the response and it was indeed wrong)?

This question has been researched in other areas of information science but not specifically in regard to chatbots. 
