window.addEventListener("load",registerEvents);

function registerEvents(){
    if(document.getElementById("sign-out")){
        authentication(true);
        document.getElementById("sign-out").addEventListener("click",signOut);
    }

    loadOffer();
    loadCategory();

    if(document.getElementById("search")){
        document.getElementById("search").addEventListener("click",searchProduct);
    }

    var viewButtons = document.getElementsByClassName("button-view");
    for(let button of viewButtons){
        button.addEventListener("click",viewProduct);
    }

    var cartButtons = document.getElementsByClassName("button-cart");
    for(let button of cartButtons){
        button.addEventListener("click",addToCart);
    }
}

                                                //TOKEN CHECK:

//CALLBACK (USER):
function callBackForUser(bool,userObject,localToken){
    if(bool == false){
        let result = compareToken(localToken,userObject.token);
        let welcome = document.getElementById("welcome-user");
        let username = userObject.username;
        welcome.innerText = "Welcome: " + username;

        if(result == false){
            location.href = "login.html";
        }
    }
}

                                                //LOAD OFFER:

//LOAD OFFER:
function loadOffer(){
    cartOperations.loadOffer(callBackForLoadOffer);
}

//CALLBACK (LOAD OFFER):
function callBackForLoadOffer(bool,offerObject){
    if(bool == false){
        let offerDiv1 = document.getElementById("offer-div-1");
        let offerDiv2 = document.getElementById("offer-div-2");
        let offerDiv3 = document.getElementById("offer-div-3");
        let i = 0;

        for(let key in offerObject){
            let object = offerObject[key];
            if(i == 0){
                offerDiv1.children[0].src = object.offerUrl;
            }
            else if(i == 1){
                offerDiv2.children[0].src = object.offerUrl;
            }
            else{
                offerDiv3.children[0].src = object.offerUrl;
            }
            i++;
        }
    }
}

                                                //LOAD CATEGORY:

// LOAD CATEGORY:
function loadCategory(){
    productOperations.loadCategory(callBackForLoadCategory);
}

//CALLBACK (LOAD CATEGORY):
function callBackForLoadCategory(bool,categoryObject){
    var arr = [];
    if(bool == false){
        for(let value of categoryObject){
            cartOperations.search(callBackForProductCount,value,arr);
        }
    }
    setTimeout(()=>{
        for(let i=0;i<arr.length;i++){
            let result = checkRandomNumber(arr[i].objectCount);
            
            cartOperations.search(callBackForProductFill,arr[i].productCategory,result,i)
        }
    },4000);
}

//CALLBACK (PRODUCT COUNT):
function callBackForProductCount(bool,productObject,productCategory,arr){
    if(bool == false){
        var objectCount = Object.keys(productObject).length;
        var object = {"productCategory":productCategory,"objectCount":objectCount};
        arr.push(object);
    }
}

//CALLBACK (PRODUCT FILL):
function callBackForProductFill(bool,productObject,productCategory,i){
    var productUrl = document.getElementsByClassName("product-url");
    var productName = document.getElementsByClassName("product-name");
    var viewButton = document.getElementsByClassName("button-view");
    var cartButton = document.getElementsByClassName("button-cart");
    if(bool == false){
        productUrl[i].src = productObject.productUrl;
        productName[i].innerText = productObject.productName;
        viewButton[i].id = productCategory + "-" + productObject.productId;

        if(document.getElementsByClassName("button-cart").length > 0){
            cartButton[i].id=``+viewButton[i].id+``;
        }
    }
}

                                                //SEARCH PRODUCT:

//SEARCH PRODUCT:
function searchProduct(){
    for(let key in localStorage){
        let keyArr = key.split("-");
        if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
            localStorage.removeItem(key);
        }
    }
    localStorage.setItem("counter","1");

    var productName = document.getElementById("search-field");

    if(productName.value == ""){
        productName.placeholder = "Enter Product Name";
        productName.className = "form-control mr-sm-2 product-not-found";
    }
    else{
        productOperations.loadCategory(callBackForSearchProductCategory);
    }
}

//CALLBACK (SEARCH CATEGORY):
function callBackForSearchProductCategory(bool,categoryObject){
    var productName = document.getElementById("search-field");
    if(bool == false){
        for(let value of categoryObject){
            cartOperations.search(callBackForProductObject,value,productName.value);
        }
        setTimeout(()=>{
            for(let key in localStorage){
                
                if(key == "counter" && localStorage[key] == "1"){
                    productName.value = "";
                    productName.placeholder = "Product Not Found";
                    productName.className = "form-control mr-sm-2 product-not-found";
                    break;
                }
                else{
                    productName.value = "";
                    productName.placeholder = "Search";
                    productName.className = "form-control mr-sm-2 product-found";
                }
            }
            if(parseInt(localStorage.getItem("counter")) > 1){
                location.href="portfolio.html";
            }
        },4000);
    }
}

//CALLBACK (PRODUCT OBJECT):
function callBackForProductObject(bool,productObject,productCategory,productName){
    if(bool == false){
        for(let value in productObject){
            let object = productObject[value];
            
            if(object.productName == productName){
                let counter = localStorage.getItem("counter");
                localStorage.setItem(productCategory + "-" + counter,JSON.stringify(object));
                counter++;
                localStorage.setItem("counter",counter); 
            }
        }
    }
}

                                                //SIGN OUT:

//SIGN OUT:
function signOut(){
    for(let i=0;i<Object.keys(localStorage).length;i++){
        if(Object.keys(localStorage)[i].length == 9 && Object.keys(localStorage)[i][3] == "@"){

            let username = Object.keys(localStorage)[i];
            localStorage.removeItem(username);
            cartOperations.searchUser(callBackForSignOut,username,undefined);
        }
    }
}

//CALLBACK (SIGN OUT):
function callBackForSignOut(bool,userObject,localToken){
    if(bool == false){
        delete userObject.token;
        userOperations.add(userObject);

        for(let key in localStorage){
            let keyArr = key.split("-");
            if(key == "counter"){
                localStorage.removeItem(key);
            }
            if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
                localStorage.removeItem(key);
            }
        }

        location.href = "index.html";
    }
}

                                                //VIEW PRODUCT:

//VIEW PRODUCT:
function viewProduct(){
    var buttonId = this.id;
    var arr = buttonId.split("-");
    var productCategory = arr[0];
    var productId = arr[1];
    var modalCartButton = document.getElementsByClassName("modal-cart-button")[0];
    modalCartButton.id = buttonId;

    productOperations.search(callBackForViewProduct,productId,productCategory,true);
}

//CALLBACK (VIEW PRODUCT);
function callBackForViewProduct(bool,productObject){
    var productUrl = document.getElementById("productUrl");
    var productName = document.getElementById("productName");
    var productPrice = document.getElementById("productPrice");
    var productColor = document.getElementById("productColor");
    var productDescription = document.getElementById("productDescription");

    if(bool == false){
        productUrl.src = productObject.productUrl;
        productName.innerText = productObject.productName;
        productPrice.innerText = "Product Price: " + "\u20B9" + " " + productObject.productPrice;
        productColor.innerText = "Product Color: " + productObject.productColor;
        productDescription.innerText = productObject.productDescription;
    }
}

                                                    //ADD TO CART:

//ADD TO CART:
function addToCart(){
    var buttonId = this.id;
    var arr = buttonId.split("-");
    var productCategory = arr[0];
    var productId = arr[1];
    var customerName = document.getElementById("welcome-user").innerText;

    cartOperations.searchCart(callBackForCart,customerName.split(" ")[1],productCategory,productId,true);
}

//CALLBACK (CART):
function callBackForCart(bool,cartObject,productCategory,productId){
    if(bool == false){
        let customerName = cartObject.customerName;
        cartOperations.searchCart(callBackForAddCart,customerName,productCategory,productId,false);
    }
    else{
        let customerName = document.getElementById("welcome-user").innerText;
        let customerObject = {"customerName":customerName.split(" ")[1]};
        cartOperations.add(customerObject);

        let productObject = {"productId":productId,"quantity":1};
        cartOperations.add(productObject,customerName.split(" ")[1],productCategory,productId);
    }
}

//CALLBACK (ADD CART):
function callBackForAddCart(bool,cartObject,productCategory,productId){
    if(bool == false){
        let customerName = document.getElementById("welcome-user").innerText;
        cartObject.quantity++;
        cartOperations.add(cartObject,customerName.split(" ")[1],productCategory,productId);
    }
    else{
        let customerName = document.getElementById("welcome-user").innerText;
        let productObject = {"productId":productId,"quantity":1};
        cartOperations.add(productObject,customerName.split(" ")[1],productCategory,productId);
    }
}