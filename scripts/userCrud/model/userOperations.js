const userOperations = {
    add(userObject){
        var username = userObject.username;
        var promise = firebase.database().ref("/users/"+username).set(userObject);
        promise.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(callBack,username,bool){
        var promise = firebase.database().ref("/users/"+username);

        promise.once("value",(snapshot)=>{
            var userObject = snapshot.val();

            if(userObject == null){
                if(bool == true){
                    callBack(true,undefined);
                }
                else{
                    callBack(true);
                }
            }
            else{
                if(bool == true){
                    callBack(false,userObject);
                }
                else{
                    callBack(false);
                }
            }
        });
    }
}