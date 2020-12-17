window.addEventListener("load",registerEvents);

function registerEvents(){
    authentication(true);
    var bool = true;
    for(let key in localStorage){
        let keyArr = key.split("-");
        if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
            bool = false;
        }
    }
    if(bool == true){
        let container = document.getElementsByClassName("container")[1];
        for(let i=0;i<3;i++){
            container.removeChild(container.children[0]);
        }
        let messageDiv = document.createElement("div");
        let message = document.createElement("h3");
        messageDiv.className = "shadow p-1 mb-5 bg-white rounded";
        messageDiv.style = "margin-top: 5%;";
        message.className = "text-center text-dark";
        message.style = "margin-top: 5%; margin-bottom: 5%";
        message.innerText = "No product have been searched yet";
        messageDiv.appendChild(message);
        container.appendChild(messageDiv);
    }
    else{
        printProduct();
        (document.querySelectorAll(".col-md-6")[1].lastElementChild).addEventListener("click",addToCart2);
    }

    document.getElementById("sign-out").addEventListener("click",signOut);
    document.getElementById("search").addEventListener("click",searchProduct);
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

                                                    //PRINT PRODUCT:

//PRINT PRODUCT:
function printProduct(){
    var productArr = [];
    for(let key in localStorage){
        let keyArr = key.split("-");
        if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
            let stringObject = localStorage.getItem(key);
            let object = JSON.parse(stringObject);
            object.productCategory = keyArr[0]
            productArr.push(object);
        }
    }
    var count = productArr.length;
    var randomNumber = checkRandomNumber(count);
    var productObject = productArr[randomNumber-1];
    
    for(let key in productObject){
        if(key == "productUrl"){
            document.getElementById(key).src = productObject[key];
            continue;
        }
        if(key == "productId"){
            continue;
        }
        if(key == "productPrice"){
            document.getElementById(key).innerText = "\u20B9" + " " + productObject[key];
            continue;
        }
        document.getElementById(key).innerText = productObject[key];
    }
    var productId = productObject.productId;
    var cart = document.getElementById("add-to-cart");
    cart.id = productId;
    productArr.splice((randomNumber-1),1);
    printRelatedProduct(productArr);
}

                                                //PRINT RELATED PRODUCT:

//PRINT RELATED PRODUCT:
function printRelatedProduct(productArr){
    var count = productArr.length;
    var section = document.querySelectorAll("section")[1];
    var image = document.querySelectorAll(".product-url");
    var name = document.querySelectorAll(".product-name");
    var price = document.querySelectorAll(".product-price");

    if(count == 0){
        let hr = document.querySelector("hr");
        let parent = section.parentElement;
        parent.removeChild(hr);
        parent.removeChild(section);
    }
    else if(count == 4){
        let i = 0;
        
        for(let value of productArr){
            image[i].src = value.productUrl;
            name[i].innerText = value.productName;
            name[i].id = value.productCategory + "-" + productId;
            price[i].innerText = "\u20B9" + " " + value.productPrice;
            i++;
        }
    }
    else if(count > 4){
        for(let i=0;i<4;i++){
            let newCount = productArr.length;
            let randomNumber = checkRandomNumber(newCount);
            let productObject = productArr[randomNumber-1];
            
            for(let key in productObject){
                if(key == "productUrl"){
                    image[i].src = productObject[key];
                    continue;
                }
                if(key == "productName"){
                    name[i].innerText = productObject[key];
                    name[i].id = productObject["productCategory"] + "-" + productObject["productId"];
                    continue;
                }
                if(key == "productPrice"){
                    price[i].innerText = "\u20B9" + " " + productObject[key];
                    continue;
                }
            }
            productArr.splice((randomNumber-1),1);
        }
    }
    else{
        let row = section.children[1];
        let newCount = 4 - count;
        for(let i=1;i<=newCount;i++){
            let div = row.children[0];
            row.removeChild(div);
        }

        let lastImage = document.querySelectorAll(".product-url");
        let lastName = document.querySelectorAll(".product-name");
        let lastPrice = document.querySelectorAll(".product-price");

        for(let i=0;i<count;i++){
            lastImage[i].src = productArr[i].productUrl;
            lastName[i].innerText = productArr[i].productName;
            lastName[i].id = productArr[i].productCategory + "-" + productArr[i].productId;
            lastPrice[i].innerText = "\u20B9" + " " + productArr[i].productPrice;
        }
    }
}

                                                    //ADD TO CART

//ADD TO CART:
function addToCart2(){
    var productId = document.querySelectorAll(".col-md-6")[1].lastElementChild.id;
    var productCategory = document.querySelectorAll(".col-md-6")[1].children[1].innerText;
    var customerName = document.getElementById("welcome-user").innerText;

    cartOperations.searchCart(callBackForCart2,customerName.split(" ")[1],productCategory,productId,true);
}

//CALLBACK (CART 2):
function callBackForCart2(bool,cartObject,productCategory,productId){
    if(bool == false){
        let customerName = cartObject.customerName;
        cartOperations.searchCart(callBackForAddCart2,customerName,productCategory,productId,false);
    }
    else{
        let customerName = document.getElementById("welcome-user").innerText;
        let customerObject = {"customerName":customerName.split(" ")[1]};
        cartOperations.add(customerObject);

        let productObject = {"productId":productId,"quantity":1};
        cartOperations.add(productObject,customerName.split(" ")[1],productCategory,productId);
    }
}

//CALLBACK (ADD CART 2):
function callBackForAddCart2(bool,cartObject,productCategory,productId){
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

                                                    //PRODUCT LINK:

//PRODUCT LINK:
function productLink(number){
    console.log(number);
    var name = document.querySelectorAll(".product-name");

    for(let key in localStorage){
        let keyArr = key.split("-");
        if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
            localStorage.removeItem(key);
        }
    }
    localStorage.setItem("counter","1");

    if(number == 4){
        var productArr = (name[name.length-1].id).split("-");
    }
    else if(number == 3){
        var productArr = (name[name.length-2].id).split("-");
    }
    else if(number == 2){
        var productArr = (name[name.length-3].id).split("-");
    }
    else{
        var productArr = (name[name.length-4].id).split("-");
    }
    let productCategory = productArr[0];
    let productId = productArr[1];
    cartOperations.search(callBackForProductLink,productCategory,productId,productId);
}

//CALLBACK (PRODUCT LINK):
function callBackForProductLink(bool,productObject,productCategory,productId){
    if(bool == false){
        let counter = localStorage.getItem("counter");
        localStorage.setItem(productCategory + "-" + productId,JSON.stringify(productObject));
        counter++;
        localStorage.setItem("counter",counter);
        location.href = "portfolio.html";
    }
}