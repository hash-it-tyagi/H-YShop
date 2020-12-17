window.addEventListener("load",registerEvent);

function registerEvent(){
    document.getElementById("change").addEventListener("click",changePassword);
}

//CHANGE PASSWORD:
function changePassword(){
    emptySpan();

    var spanArr = document.getElementsByClassName("blank-field");
    var inputArr = document.getElementsByClassName("input-field");

    if(inputArr[0].value == "" && inputArr[1].value != "" && inputArr[2].value != ""){
        spanArr[0].innerText = "Enter Username to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value == "" && inputArr[2].value != ""){
        spanArr[1].innerText = "Enter New Password to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value != "" && inputArr[2].value == ""){
        spanArr[2].innerText = "Enter Password to proceed";
    }
    else if(inputArr[0].value != "" && inputArr[1].value != "" && inputArr[2].value != ""){
        if(inputArr[1].value == inputArr[2].value){
            let username = inputArr[0].value;
            userOperations.search(callBackForChangePassword,username,true);
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
function callBackForChangePassword(bool,userObject){
    if(bool == true){
        document.getElementById("error").innerText = "Invalid Username";
        emptyInput();
    }
    else{
        let newPassword = document.getElementsByClassName("input-field")[1].value;
        userObject.password = newPassword;

        userOperations.add(userObject);
        alert("Password changed successfully");
        emptyInput();
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