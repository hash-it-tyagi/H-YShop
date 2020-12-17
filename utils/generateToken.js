function generateToken(username){
    var tokenNumber = Math.floor(Math.random()*1000000);
    var tokenObject = {"username":username,"token":tokenNumber};

    return tokenObject;
}