function checkRegex(inputArr){
    var username = new RegExp("^([a-zA-z]{3})+@([a-zA-Z0-9]{5})$");
    var emailId = new RegExp("^[A-Za-z0-9]+@[a-z]+.[a-z]{2,}$");
    var phoneNumber = new RegExp("^[+91-]+[0-9]{10}$");
    var address = new RegExp("^([a-zA-z]{5,15})+[ ]([a-zA-Z]{5,10})+[,]([a-zA-Z]{3,15})+[-]([0-9]{6})$");
    var patternArr = [
        {"username":username},
        {"email":emailId},
        {"phoneNumber":phoneNumber},
        {"address":address},
    ];
    var resultArr = [];

    for(let i=0;i<4;i++){
        let type=inputArr[i].value;
        
        for(let value of patternArr){
            if(Object.keys(value)[0] == inputArr[i].id){
                let regex = value[Object.keys(value)[0]];
                
                if(regex.test(type)){
                    resultArr.push(true);
                }
                else{
                    resultArr.push(false);
                }
            }
        }
    }
    return resultArr;
}