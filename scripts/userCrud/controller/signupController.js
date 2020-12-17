window.addEventListener("load",registerEvent);

function registerEvent(){
    document.getElementById("add").addEventListener("click",validateSignUpForm);
}

//SIGN UP VALIDATE FORM:
function validateSignUpForm(){
    emptySpan();
    
    var spanArr = document.getElementsByClassName("blank-field");
    var inputArr = document.getElementsByClassName("input-field");
    
    if(inputArr[0].value == "" && inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != ""){
        spanArr[0].innerText = "Enter Username to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value == "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != ""){
        spanArr[1].innerText = "Enter Email ID to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value != "" && inputArr[2].value == "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != ""){
        spanArr[2].innerText = "Enter Phone number to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value == "" && inputArr[4].value != "" && inputArr[5].value != ""){
        spanArr[3].innerText = "Enter Address to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value == "" && inputArr[5].value != ""){
        spanArr[4].innerText = "Enter Password to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value == ""){
        spanArr[5].innerText = "Enter Password to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != ""){
        if(inputArr[4].value == inputArr[5].value){
            let resultArr = checkRegex(inputArr);

            if(resultArr[0] == true && resultArr[1] == true && resultArr[2] == true && resultArr[3] == true){
                let username = inputArr[0].value;
                userOperations.search(callBackForUsername,username,false);
            }

            for(let i=0;i<resultArr.length;i++){
                if(resultArr[i] == false){
                    if(i == 0){
                        spanArr[i].innerText="Eg: tes@12345";
                    }
                    else if(i == 1){
                        spanArr[i].innerText="Eg: example@gmail.com";
                    }
                    else if(i == 2){
                        spanArr[i].innerText="Eg: +91-0123456789";
                    }
                    else if(i == 3){
                        spanArr[i].innerText="Eg: example example,Delhi-110009";
                    }
                }
            }
        }
        else{
            document.getElementById("error").innerText = "Password does not matched";
        }
    }
    else{
        document.getElementById("empty-error").innerText = "Enter required fields to proceed";
    }
}

//CALLBACK:
function callBackForUsername(bool){
    if(bool == true){
        addUser();
    }
    else{
        document.getElementById("empty-error").innerText = "Username already taken";
        emptyInput();
    }
}

//USER OBJECT CREATION:
function addUser(){
    var userObject = new User();
    for(let key in userObject){
        userObject[key] = document.getElementById(key).value;
    }
    
    userOperations.add(userObject);
    alert("Account Created Successfully")
    emptyInput();
}

                                                    //UTILITIES:

//EMPTY INPUT:
function emptyInput(){
    var inputArr = document.getElementsByClassName("input-field");

    for(let i=0;i<inputArr.length;i++){
        inputArr[i].value = "";
    }
}

//EMPTY SPAN:
function emptySpan(){
    var error = document.getElementById("error");
    var emptyError = document.getElementById("empty-error");
    var spanArr = document.getElementsByClassName("blank-field");

    error.innerText = "";
    emptyError.innerText = "";
    for(let i=0;i<spanArr.length;i++){
        spanArr[i].innerText = "";
    }
}