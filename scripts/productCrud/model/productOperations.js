const productOperations = {
    add(productObject,productCategory){
        var productId = productObject.productId;
        var promise = firebase.database().ref("/products/"+productCategory+"/"+productId).set(productObject);

        promise.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(callBack,productId,productCategory,bool){
        var promise = firebase.database().ref("/products/"+productCategory+"/"+productId);

        promise.once("value",(snapshot)=>{
            var productObject = snapshot.val();

            if(productObject == null){
                if(bool ==  true){
                    callBack(true,undefined);
                }
                else{
                    callBack(true);
                }
            }
            else{
                if(bool ==  true){
                    callBack(false,productObject);
                }
                else{
                    callBack(false);
                }
            }
        });

    },
    delete(productId,productCategory){
        var promise = firebase.database().ref("/products/"+productCategory+"/"+productId).remove();
        promise.then(()=>console.log("Data is deleted from database")).catch(error=>console.log("Error is: ",error));
    },
    show(callBack,productCategory){
        var promise = firebase.database().ref("/products/"+productCategory);

        promise.once("value",(snapshot)=>{
            var productObject = snapshot.val();

            if(productObject == null){
                callBack(true,undefined,productCategory);
            }
            else{
                callBack(false,productObject,productCategory);
            }
        });
    },
    loadCategory(callBack){
        var promise = firebase.database().ref("/categories");

        promise.once("value",(snapshot)=>{
            var categoryObject = snapshot.val();

            if(categoryObject == null){
                callBack(true,undefined);
            }
            else{
                callBack(false,categoryObject);
            }
        });
    }
}
