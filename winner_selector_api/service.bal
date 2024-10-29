import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/random;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

const TOTAL_SECONDARY_WINNERS = 5;

configurable string mode = "LOCAL";
configurable string csvFilePath = "resources/drawEntries.csv";

configurable string user = "";
configurable string password = "";
configurable string host = "";
configurable int port = 3306;
configurable string database = "apk_draw";

// Incase of an error with database, still continue as the database is not mandatory
final mysql:Client|error dbClient = new(host, user, password, database, port);

// The service-level CORS config applies globally to each `resource`.
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000", "http://localhost","http://localhost:3000/grand-prize"],
        allowCredentials: true,
        allowHeaders: ["X-Username", "Content-Type"],
        allowMethods: ["GET", "POST"]
    }
}
service / on new http:Listener(9090) {

    function init() returns error? {
        log:printInfo("Service started");
    }

    isolated resource function get secondary\-winners( 
            @http:Header {name: "X-Username"} string x_username) returns Participant[]|error {
        string username = check getUsername(x_username);
        string[][] data = check io:fileReadCsv(csvFilePath);

        int firstRowIndex = 0;
        int lastRowIndex = data.length() - 1;

        map<Participant> winnerMap = {};

        while winnerMap.length() < TOTAL_SECONDARY_WINNERS {
            int randomIndex = check random:createIntInRange(firstRowIndex, lastRowIndex);
            string[] participantDetails = data[randomIndex];
            string regId = participantDetails[0];
            if winnerMap.hasKey(regId) {
                continue;
            }
            string name = capitalizeName(data[randomIndex][1]);
            winnerMap[regId] = {regId, name, country: data[randomIndex][2]};
        }
        Participant[] winners = from Participant winner in winnerMap select winner;
        error? persistWinners = persistSecondaryWinners(winners, username, dbClient);
        if persistWinners is error {
            log:printError("Error persisting secondary winners: ", persistWinners);
            // Ignore the error and return the winners as persisting the winners is not mandatory
        }
        return winners;
    }

    isolated resource function post grand\-winner(
            @http:Header {name: "X-Username"} string x_username, @http:Payload Participant[] payload) returns 
            Participant|error {
        string username = check getUsername(x_username);
        string[][] data = check io:fileReadCsv(csvFilePath);
        Participant[] secondaryWinners = payload;
        Participant[]|error secondaryWinnersInDatabase = getSecondaryWinners(dbClient);
        
        if secondaryWinnersInDatabase is error {
            log:printInfo("Error getting secondary winners from database. Hence, using the winners from the payload.");
        } else {
            // If there is an error with the database, use the winners from the request payload
            secondaryWinners = secondaryWinnersInDatabase;
        }

        int firstRowIndex = 0;
        int lastRowIndex = data.length() - 1;

        while true {
            int randomIndex = check random:createIntInRange(firstRowIndex, lastRowIndex);
            string name = capitalizeName(data[randomIndex][1]);
            Participant winner = {regId: data[randomIndex][0], name, country: data[randomIndex][2]};
            final string winnerRegId = winner.regId;
            boolean alreadyWonSecondary = secondaryWinners.some(isolated function(Participant secondaryWinner) returns boolean {
                return secondaryWinner.regId == winnerRegId;
            });
            if !alreadyWonSecondary {
                error? persist = persistGrandWinner(winner, username, dbClient);
                if persist is error {
                    log:printError("Error persisting grand winner: ", persist);
                    // Ignore the error and continue as persisting the winner is not mandatory
                }
                return winner;
            }
        }
    }
}
