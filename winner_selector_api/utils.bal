import ballerina/log;
import ballerina/sql;
import ballerina/lang.regexp;
import ballerinax/mysql;

isolated function getUsername(string username) returns string|error {
    return username;
}

isolated function getSecondaryWinners(mysql:Client|error mysqlClient) returns Participant[]|error {
    if mysqlClient is error {
        log:printError("Database client is not initialized", mysqlClient);
        return error("Database client is not initialized");
    } 
    sql:ParameterizedQuery query = `SELECT winners FROM secondary_winners ORDER BY timestamp DESC LIMIT 1`;
    json|error winnersJson = mysqlClient->queryRow(query);
    if winnersJson is error {
        log:printError("Error getting secondary winners from the database: ", winnersJson);
        return error("Error getting secondary winners");
    }
    Participant[] winners = check winnersJson.cloneWithType();
    return winners;
}

isolated function persistSecondaryWinners(Participant[] winners, string username, mysql:Client|error mysqlClient) returns error? {
    if mysqlClient is error {
        log:printError("Database client is not initialized", mysqlClient);
        return error("Database client is not initialized");
    } 
    sql:ParameterizedQuery query = `INSERT INTO secondary_winners (username, winners) VALUES (${username}, 
        ${winners.toJsonString()});`;
    sql:ExecutionResult|error addSecondaryWinners = mysqlClient->execute(query);
    if addSecondaryWinners is error {
        log:printError("Error adding secondary winners: ", addSecondaryWinners);
        return error("Error adding secondary winners");
    }
}

isolated function persistGrandWinner(Participant winner, string username, mysql:Client|error mysqlClient) returns error? {
    if mysqlClient is error {
        log:printError("Database client is not initialized", mysqlClient);
        return error("Database client is not initialized");
    } 
    sql:ParameterizedQuery query = `INSERT INTO grand_winner (username, winner) VALUES (${username}, 
        ${winner.toJsonString()});`;
    sql:ExecutionResult|error addGrandWinner = mysqlClient->execute(query);
    if addGrandWinner is error {
        log:printError("Error adding grand winner: ", addGrandWinner);
        return error("Error adding grand winner");
    }
}

isolated function uppercaseFirstLetter(string word) returns string {
    if word.length() == 0 {
        return word;
    }
    string firstLetter = word.substring(0, 1);
    return firstLetter.toUpperAscii() + word.substring(1);
}

isolated function capitalizeName(string name) returns string {
    string[] words = regexp:split(re ` `, name.toLowerAscii());
    string capitalizedName = from string word in words select uppercaseFirstLetter(word) + " ";
    return capitalizedName.trim();
}
