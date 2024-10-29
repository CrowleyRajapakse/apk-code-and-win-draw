# Participant.
#
# + regId - User Registration ID 
# + name - Name of the participant  
# + country - Country of the participant
public type Participant record {|
    string regId;
    string name;
    string country;
|};

const LOCAL = "LOCAL";
const X_JWT_ASSERTION = "X-JWT-Assertion";
const X_USERNAME = "X-Username";
