function authentication(callBool){
    var bool = true;
    for(let i=0;i<Object.keys(localStorage).length;i++){
        if(callBool == true){
            if(Object.keys(localStorage)[i].length == 9 && Object.keys(localStorage)[i][3] == "@"){

                bool = false;
                let userString = localStorage.getItem(Object.keys(localStorage)[i]);
                let userObject = JSON.parse(userString);
                
                cartOperations.searchUser(callBackForUser,userObject.username,userObject.token);
            }
        }
        else{
            if(Object.keys(localStorage)[i].length == 6 && typeof(parseInt(Object.keys(localStorage)[i][5])) == "number"){
    
                bool = false;
                let adminString = localStorage.getItem(Object.keys(localStorage)[i]);
                let adminObject = JSON.parse(adminString);
                
                adminOperations.searchAdmin(callBackForAdmin,adminObject.username,adminObject.token);
            }
        }
        if(i == Object.keys(localStorage).length-1 && bool == true){
            location.href = "login.html";
        }
    }
}