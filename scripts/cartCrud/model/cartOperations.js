const cartOperations = {
    add(...argv){
        if(argv.length == 1){
            let username = argv[0].customerName;
            var promise = firebase.database().ref("/carts/" + username).set(argv[0]);
        }
        else{
            var promise = firebase.database().ref("/carts/" + argv[1] + "/" + argv[2] + "/" + argv[3]).set(argv[0]);
        }

        promise.then(data=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    addOrderProducts(orderId,cartObject){
        var promise = firebase.database().ref("/cartRef/" + orderId).set(cartObject);
    },
    searchCart(callBack,customerName,productCategory,productId,bool){
        if(bool == true){
            var promise = firebase.database().ref("/carts/" + customerName);
        }
        else{
            var promise = firebase.database().ref("/carts/" + customerName + "/" + productCategory + "/" + productId);
        }

        promise.once("value",(snapshot)=>{
            var cartObject = snapshot.val();

            if(cartObject == null){
                callBack(true,undefined,productCategory,productId);
            }
            else{
                callBack(false,cartObject,productCategory,productId);
            }
        });
    },
    search(...argv){
        if(argv.length == 3){
            var promise = firebase.database().ref("/products/"+argv[1]);
        }
        else{
            var promise = firebase.database().ref("/products/"+argv[1]+"/"+argv[2]);
        }

        promise.once("value",(snapshot)=>{
            var productObject = snapshot.val();

            if(argv.length == 3){
                if(productObject == null){
                    argv[0](true,undefined,undefined,undefined);
                }
                else{
                    argv[0](false,productObject,argv[1],argv[2]);
                }
            }
            else{
                if(productObject == null){
                    argv[0](true,undefined,undefined,undefined);
                }
                else{
                    argv[0](false,productObject,argv[1],argv[3]);
                }
            }
        });
    },
    loadOffer(callBack){
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
    },
    searchUser(callBack,username,localToken){
        var promise = firebase.database().ref("/users/"+username);

        promise.once("value",(snapshot)=>{
            var userObject = snapshot.val();

            if(userObject == null){
                callBack(true,undefined,undefined);
            }
            else{
                callBack(false,userObject,localToken);
            }
        });
    },
    searchProduct(...argv){
        if(argv.length == 5){
            var promise = firebase.database().ref("/products/" + argv[1] + "/" + argv[2]);
        }
        else{
            var promise = firebase.data().ref("/products");
        }

        promise.once("value",(snapshot)=>{
            var productObject = snapshot.val();

            if(argv.length == 5){
                if(productObject == null){
                    argv[0](true,undefined,undefined,undefined,undefined);
                }
                else{
                    argv[0](false,productObject,argv[1],argv[3],argv[4]);
                }
            }
            else{
                if(productObject == null){
                    argv[0](true,undefined);
                }
                else{
                    argv[0](false,productObject);
                }
            }
        });
    },
    delete(customerName){
        var promise = firebase.database().ref("/carts/" + customerName).set({});

        promise.then(data=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    }
};