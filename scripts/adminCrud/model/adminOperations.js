const adminOperations = {
    add(adminObject){
        var username = adminObject.username;
        var promise = firebase.database().ref("/admins/"+username).set(adminObject);
        promise.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(callBack,username){
        var promise = firebase.database().ref("/admins/"+username);

        promise.once('value',(snapshot)=>{
            var adminObject = snapshot.val();

            if(adminObject == null){
                callBack(true,undefined);
            }
            else{
                callBack(false,adminObject);
            }
        });
    },
    searchAdmin(callBack,username,localToken){
        var promise = firebase.database().ref("/admins/"+username);

        promise.once("value",(snapshot)=>{
            var adminObject = snapshot.val();

            if(adminObject == null){
                callBack(true,undefined,undefined);
            }
            else{
                callBack(false,adminObject,localToken);
            }
        });
    }
}