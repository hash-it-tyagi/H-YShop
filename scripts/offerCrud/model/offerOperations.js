const offerOperations = {
    add(offerObject){
        var offerCode = offerObject.offerCode;
        var promise = firebase.database().ref("/offers/"+offerCode).set(offerObject);

        promise.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(callBack,offerCode,bool){
        var promise = firebase.database().ref("/offers/"+offerCode);

        promise.once("value",(snapshot)=>{
            var offerObject = snapshot.val();

            if(offerObject == null){
                if(bool ==  true){
                    callBack(true,undefined);
                }
                else{
                    callBack(true);
                }
            }
            else{
                if(bool ==  true){
                    callBack(false,offerObject);
                }
                else{
                    callBack(false);
                }
            }
        });

    },
    delete(offerCode){
        var promise = firebase.database().ref("/offers/"+offerCode).remove();
        promise.then(()=>console.log("Data is deleted from database")).catch(error=>console.log("Error is: ",error));
    },
    show(callBack){
        var promise = firebase.database().ref("/offers");

        promise.once("value",(snapshot)=>{
            var offerObject = snapshot.val();

            if(offerObject == null){
                callBack(true,undefined);
            }
            else{
                callBack(false,offerObject);
            }
        });
    }
};