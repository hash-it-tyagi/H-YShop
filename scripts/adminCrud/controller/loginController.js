function callBackForAdmin(bool,adminObject){
    if(bool == true){
        document.getElementById("error").innerText = "Username or Password incorrect";
        emptyInput();
    }
    else{
        let inputArr = document.getElementsByClassName("input-field");
        if(inputArr[1].value == adminObject.password){
            let tokenObject = generateToken(adminObject.username);
            adminObject.token = tokenObject.token;
            adminOperations.add(adminObject);
            for(let i=0;i<Object.keys(localStorage).length;i++){
                if(Object.keys(localStorage)[i].length == 6 && typeof(parseInt(Object.keys(localStorage)[i][5])) == "number"){
        
                    let username = Object.keys(localStorage)[i];
                    localStorage.removeItem(username);
                }
            }
            
            localStorage.setItem(adminObject.username,JSON.stringify(tokenObject));
            location.href = "admindashboard.html";
        }
        else{
            document.getElementById("error").innerText = "Username or Password incorrect";
            emptyInput();
        }
    }
}