const orderOperations = {
    add(orderObject){
        var orderId = orderObject.orderId;
        var promise = firebase.database().ref("/orders/"+orderId).set(orderObject);
        promise.then(()=>console.log("Data is added into database")).catch(error=>console.log("Error is: ",error));
    },
    search(...argv){
        if(argv.length == 5){
            var fullPath = argv[argv.length-1] + argv[1] + "/" + argv[2];
            var promise = firebase.database().ref(fullPath);
        }
        else{
            var promise = firebase.database().ref(argv[argv.length-1]);
        }

        promise.once("value",(snapshot)=>{
            var object = snapshot.val();

            if(object == null){
                if(argv.length == 2){
                    argv[0](true,undefined);
                }
                else if(argv.length == 3){
                    argv[0](true,undefined,argv[1]);
                }
                else{
                    argv[0](true,undefined,undefined,undefined);
                }
            }
            else{
                if(argv.length == 2){
                    argv[0](false,object);
                }
                else if(argv.length == 3){
                    argv[0](false,object,argv[1]);
                }
                else{
                    argv[0](false,object,argv[1],argv[3]);
                }
            }
        });
    }
};