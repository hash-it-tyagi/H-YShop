function checkRandomNumber(objectCount){
    for(let i=0;i>(-1);i++){
        var randomNumber = Math.floor(Math.random() * (objectCount + 1));
        if(randomNumber == 0){
            continue;
        }
        else{
            break;
        }
    }
    return randomNumber;
}