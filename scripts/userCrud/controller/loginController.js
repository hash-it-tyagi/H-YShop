window.addEventListener("load",registerEvent);

function registerEvent(){
    document.getElementById("search").addEventListener("click",validateLoginForm);
}

//LOGIN VALIDATE FORM:
function validateLoginForm(){
    emptySpan();

    var spanArr = document.getElementsByClassName("blank-field");
    var inputArr = document.getElementsByClassName("input-field");

    if(inputArr[0].value == "" && inputArr[1].value == ""){
        document.getElementById("empty-error").innerText = "Enter required fields to proceed";
    }
    else if(inputArr[0].value == "" && inputArr[1].value != ""){
        spanArr[0].innerText = "Enter Username to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value == ""){
        spanArr[1].innerText = "Enter Password to proceed";
    }
    else{
        let username = inputArr[0].value;
        userOperations.search(callBackForUser,username,true);
    }
}

//CALLBACK:
function callBackForUser(bool,userObject){
    var inputArr = document.getElementsByClassName("input-field");

    if(bool == true){
        adminOperations.search(callBackForAdmin,inputArr[0].value);
    }
    else{
        if(inputArr[1].value == userObject.password){
            let tokenObject = generateToken(userObject.username);
            userObject.token = tokenObject.token;
            userOperations.add(userObject);

            for(let i=0;i<Object.keys(localStorage).length;i++){
                if(Object.keys(localStorage)[i].length == 9 && Object.keys(localStorage)[i][3] == "@"){
        
                    let username = Object.keys(localStorage)[i];
                    localStorage.removeItem(username);
                }
            }
            
            localStorage.setItem(userObject.username,JSON.stringify(tokenObject));
            location.href = "h&yshop.html";
        }
        else{
            document.getElementById("error").innerText = "Username or Password incorrect";
            emptyInput();
        }
    }
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