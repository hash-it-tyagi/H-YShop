window.addEventListener("load",registerEvents);

function registerEvents(){
    authentication(true);

    document.getElementById("sign-out").addEventListener("click",signOut);

    setTimeout(()=>{
        loadCart(true);
    },4000);

    setTimeout(()=>{
        let tbody = document.getElementById("cart-tbody");
        let tbodyChild = tbody.children[0];
        let tbodyGrandSons = tbodyChild.children.length;
        if(tbodyGrandSons > 1){
            calculateSubTotal();
        }
    },5000);

    document.getElementById("search").addEventListener("click",searchProduct);

    document.getElementById("apply-offer").addEventListener("click",applyOffer);

    document.getElementById("proceed-to-checkout").addEventListener("click",placeOrder);

    setTimeout(()=>{
        var plusButton = document.getElementsByClassName("btn-success");
        var minusButton = document.getElementsByClassName("btn-danger");
        
        for(let button of plusButton){
            button.addEventListener("click",incrementQuantity);
        }
        for(let button of minusButton){
            button.addEventListener("click",decrementQuantity);
        }
    },5000);
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

                                                //LOAD CART:

//LOAD CART:
function loadCart(bool){
    let customerName = document.getElementById("welcome-user").innerText;
    cartOperations.searchCart(callBackForLoadCart,customerName.split(" ")[1],undefined,undefined,true);

    if(bool == false){
        setTimeout(()=>{
            let tbody = document.getElementById("cart-tbody");
            let tbodyChild = tbody.children[0];
            let tbodyGrandSons = tbodyChild.children.length;
            if(tbodyGrandSons > 1){
                calculateSubTotal();
            }
        },3000);
    }
}

//CALLBACK (LOAD CART):
function callBackForLoadCart(bool,cartObject){
    var count = 0;
    for(let key in cartObject){
        count++;
    }
    if(count == 1){
        cartOperations.delete((document.getElementById("welcome-user").innerText).split(" ")[1]);
        var tbody = document.getElementById("cart-tbody");
        var row = document.createElement("tr");
        var column = document.createElement("td");
        column.colSpan = "5";
        var message = document.createElement("h3");
        message.className = "text-center font-italic";
        message.style = "color: red";
        message.innerText = "Your Cart is Empty";

        column.appendChild(message);
        row.appendChild(column);
        tbody.appendChild(row);
        deleteAmount();

        var offerCode = document.getElementById("offer");
        offerCode.removeAttribute("disabled");
        var offerMessage = document.getElementById("offer-message");
        var paymentMode = document.getElementById("payment-mode");
        var paymentButton = document.getElementById("dropdownMenuButton");
        offerCode.value = "";
        offerMessage.innerText = "";
        paymentMode.placeholder = "";
        paymentMode.value = "";
        paymentButton.innerText = "Payment Mode";
    }
    else{
        if(bool == false){
            let i = 0;
            for(let key in cartObject){
                let object = cartObject[key];
                if(key == "customerName"){
                    break;
                }
    
                for(let newKey in object){
                    let newObject = object[newKey];
                    for(let lastKey in newObject){
                        if(lastKey == "quantity"){
                            cartOperations.searchProduct(callBackForProduct,key,newKey,newObject[lastKey],i);
                            i++;
                        }
                    }
                }
            }
        }
        else{
            let tbody = document.getElementById("cart-tbody");
            let row = document.createElement("tr");
            let column = document.createElement("td");
            column.colSpan = "5";
            let message = document.createElement("h3");
            message.className = "text-center font-italic";
            message.style = "color: red";
            message.innerText = "Your Cart is Empty";
    
            column.appendChild(message);
            row.appendChild(column);
            tbody.appendChild(row);
        }
    }
}

//CALLBACK (PRODUCT):
function callBackForProduct(bool,productObject,productCategory,quantity,i){
    if(bool == false){
        dynamicTbody(productCategory,productObject.productId);
        fillDynamicTbody(productObject.productUrl,productObject.productName,productObject.productPrice,productObject.productColor,productCategory,quantity,i);
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

//CALLBACK (SEARCH PRODUCT):
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

//CALLBACK (PRODUCTOBJECT):
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

                                                //DECREMENT QUANTITY:

//DECREMENT QUANTITY:
function decrementQuantity(){
    var customerName = document.getElementById("welcome-user").innerText;
    var arr = this.id.split("-");
    var productCategory = arr[0];
    var productId = arr[1];

    var minusSpan = this.parentElement;
    var minusDiv = minusSpan.parentElement;
    var inputQuantity = minusDiv.children[1];
    var quantity = inputQuantity.value;

    if(quantity == 1){
        inputQuantity.value = quantity;
    }
    else{
        quantity--;
        var quantityObject = {"productId":productId,"quantity":quantity};
        cartOperations.add(quantityObject,customerName.split(" ")[1],productCategory,productId);
        inputQuantity.value = quantity;
        calculateSubTotal();
    }
}

                                                //INCREMENT QUANTITY:

//DECREMENT QUANTITY:
function incrementQuantity(){
    var customerName = document.getElementById("welcome-user").innerText;
    var arr = this.id.split("+");
    var productCategory = arr[0];
    var productId = arr[1];

    var minusSpan = this.parentElement;
    var minusDiv = minusSpan.parentElement;
    var inputQuantity = minusDiv.children[1];
    var quantity = inputQuantity.value;

    if(quantity == 10){
        inputQuantity.value = quantity;
    }
    else{
        quantity++;
        var quantityObject = {"productId":productId,"quantity":quantity};
        cartOperations.add(quantityObject,customerName.split(" ")[1],productCategory,productId);
        inputQuantity.value = quantity;

        calculateSubTotal();
    }
}

                                                    //DELETE CART ITEM:

//DELETE CART ITEM:
function deleteCartItem(productCategory,productId){
    var customerName = document.getElementById("welcome-user").innerText;
    cartOperations.add({},customerName.split(" ")[1],productCategory,productId);
    deleteTbody();
    loadCart(false);

    setTimeout(()=>{
        var plusButton = document.getElementsByClassName("btn-success");
        var minusButton = document.getElementsByClassName("btn-danger");
        
        for(let button of plusButton){
            button.addEventListener("click",incrementQuantity);
        }
        for(let button of minusButton){
            button.addEventListener("click",decrementQuantity);
        }
    },5000);
}

                                                    //APPLY OFFER:

//APPLY OFFER:
function applyOffer(){
    var offerMessage = document.getElementById("offer-message");
    var tbody = document.getElementById("cart-tbody");
    var tbodyChild = tbody.children[0];
    var tbodyGrandSons = tbodyChild.children.length;

    if(tbodyGrandSons == 1){
        offerMessage.style = "color: red";
        offerMessage.innerText = "Your Cart is Empty";
    }
    else{
        let offerCode = document.getElementById("offer").value;
        if(offerCode == ""){
            offerMessage.style = "color: red";
            offerMessage.innerText = "Enter Offer Code to apply";
        }
        else{
            offerOperations.search(callBackForApplyOffer,offerCode,true);
        }
    }
}

//CALLBACK (APPLY OFFER):
function callBackForApplyOffer(bool,offerObject){
    var offerMessage = document.getElementById("offer-message");
    var offerDiscount = document.getElementById("offer-discount");
    if(bool == false){
        let offerCode = document.getElementById("offer");
        offerCode.setAttribute("disabled","");
        offerMessage.style = "color: green";
        offerMessage.innerText = "Offer Code Applied";
        offerDiscount.innerText = "\u20B9" + " " + offerObject.discountAmount;

        let totalAmount = document.getElementById("total-amount");
        let total = totalAmount.innerText.split(" ")[1];
        total = total - parseInt(offerObject.discountAmount);
        totalAmount.innerText = "\u20B9" + " " + total;
    }
    else{
        offerMessage.style = "color: red";
        offerMessage.innerText = "Invalid Offer Code";
    }
}

                                                    //PRODUCT LINK:

//PRODUCT LINK:
function productLink(productCategory,productId){
    for(let key in localStorage){
        let keyArr = key.split("-");
        if(keyArr.length == 2 && typeof(parseInt(keyArr[1])) == "number"){
            localStorage.removeItem(key);
        }
    }
    localStorage.setItem("counter","1");

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

                                                //PAYMENT MODE:

//PAYMENT MODE:
function paymentMode(paymentMode){
    var input = document.getElementById("payment-mode");
    input.value = paymentMode;
}

                                                //PLACE ORDER:

//PLACE ORDER:
function placeOrder(){
    var tbody = document.getElementById("cart-tbody");
    var tbodyChild = tbody.children[0];
    var tbodyGrandSons = tbodyChild.children.length;

    if(tbodyGrandSons == 1){
        let errorMessage = document.getElementById("empty-error");
        errorMessage.parentElement.className = "mt-3 text-center";
        errorMessage.style = "color: red";
        errorMessage.innerText = "Your Cart is Empty";
    }
    else{
        let paymentMode = document.getElementById("payment-mode");

        if(paymentMode.value == ""){
            paymentMode.placeholder = "Enter Payment Mode";
            paymentMode.className = "product-not-found";
        }
        else{
            let path = "/orders";
            orderOperations.search(callBackForPlaceOrder,path);
        }
    }
}

//CALLBACK (PLACE ORDER):
function callBackForPlaceOrder(bool,orderObject){
    var orderArr = [];
    var customerName = document.getElementById("welcome-user").innerText;

    if(bool == false){
        for(let key in orderObject){
            if(orderObject[key].customerName == customerName.split(" ")[1]){
                orderArr.push(orderObject[key].orderId);
                continue;
            }
        }
        if(orderArr.length == 0){
            let emptyOrderObject = new Order();
            let finalOrderObject = fillOrderObject(emptyOrderObject,0);

            orderOperations.add(finalOrderObject);
            cartOperations.searchCart(callBackForCartRef,customerName.split(" ")[1],finalOrderObject.orderId,undefined,true);
        }
        else{
            let lastOrder = orderArr[orderArr.length-1];
            let lastOrderNumber = lastOrder[9];
            let emptyOrderObject = new Order();
            let finalOrderObject = fillOrderObject(emptyOrderObject,lastOrderNumber);
            
            orderOperations.add(finalOrderObject);
            cartOperations.searchCart(callBackForCartRef,customerName.split(" ")[1],finalOrderObject.orderId,undefined,true);
        }
    }
    else{
        let object = new Order();
        let finalObject = fillOrderObject(object,0);

        orderOperations.add(finalObject);
        cartOperations.searchCart(callBackForCartRef,customerName.split(" ")[1],finalObject.orderId,undefined,true);
    }

    swal.fire({
        icon: "success",
        title: "Order Placed",
        text: "Your order has been placed, thank you for using H&Y Shop."
    });

    setTimeout(()=>{
        cartOperations.delete(customerName.split(" ")[1]);
        deleteTbody();
        deleteAmount();
        var offerCode = document.getElementById("offer");
        offerCode.removeAttribute("disabled");
        var offerMessage = document.getElementById("offer-message");
        var paymentMode = document.getElementById("payment-mode");
        var paymentButton = document.getElementById("dropdownMenuButton");
        offerCode.value = "";
        offerMessage.innerText = "";
        paymentMode.placeholder = "";
        paymentMode.value = "";
        paymentButton.innerText = "Payment Mode";

        var tbody = document.getElementById("cart-tbody");
        var row = document.createElement("tr");
        var column = document.createElement("td");
        column.colSpan = "5";
        var message = document.createElement("h3");
        message.className = "text-center font-italic";
        message.style = "color: red";
        message.innerText = "Your Cart is Empty";

        column.appendChild(message);
        row.appendChild(column);
        tbody.appendChild(row);
    },3000);
}

//FILL ORDER OBJECT:
function fillOrderObject(orderObject,lastOrderNumber){
    var customerName = document.getElementById("welcome-user").innerText;
    var offerCode = document.getElementById("offer").value;
    if(offerCode == ""){
        orderObject.offerApplied = "None";
    }
    else{
        orderObject.offerApplied = offerCode;
    }
    var paymentMode = document.getElementById("payment-mode").value;
    var dateObject = new Date();
    var date = dateObject.getDate();
    var month = dateObject.getMonth() + 1;
    var year = dateObject.getFullYear();
    var fullDate = date + "/" + month + "/" + year;

    orderObject.customerName = customerName.split(" ")[1];
    orderObject.orderDate = fullDate
    orderObject.orderId = customerName.split(" ")[1] +  (parseInt(lastOrderNumber) + 1);
    orderObject.orderStatus = "Not Delivered";
    orderObject.paymentMode = paymentMode;

    return orderObject;
}

//CALLBACK (CART REF):
function callBackForCartRef(bool,cartObject,orderId){
    if(bool == false){
        cartOperations.addOrderProducts(orderId,cartObject);
    }
    /*var checkoutButton = document.getElementById("proceed-to-checkout");
    
    checkoutButton.setAttribute("data-toggle","modal");
    checkoutButton.setAttribute("data-target","#centralModalSuccess");
    var modal=checkoutButton.getAttribute("data-target");
    modal.modal('show');*/
}

                                                //UTILITIES:

//DYNAMIC TBODY:
function dynamicTbody(prodCategory,prodId){
    var tbody = document.getElementById("cart-tbody");
    
    var tr = makeTag("tr","","");
    var th = makeTag("th","","");
    th.scope = "row";

    var imageDiv = makeTag("div","p-2","");
    var img = makeTag("img","img-fluid rounded shadow-sm","");
    img.width = "70";
    appendTag(imageDiv,img);

    var detailDiv = makeTag("div","ml-3 d-inline-block align-middle","");
    var productHeading = makeTag("h5","mb-0","");
    var productName = makeTag("a","text-dark d-inline-block","");
    productName.href = `javascript:productLink('`+prodCategory+`','`+prodId+`')`;
    var productCategory = makeTag("span","text-muted font-weight-normal font-italic","");
    appendTag(productHeading,productName);
    appendTag(detailDiv,productHeading);
    appendTag(detailDiv,productCategory);
    appendTag(imageDiv,detailDiv);
    appendTag(th,imageDiv);
    appendTag(tr,th);

    var td1 = makeTag("td","align-middle","");
    var productPrice = makeTag("strong","","");
    appendTag(td1,productPrice);
    appendTag(tr,td1);

    var td2 = makeTag("td","align-middle","");
    var productColor = makeTag("strong","","");
    appendTag(td2,productColor);
    appendTag(tr,td2);

    var td3 = makeTag("td","align-middle text-center","");
    td3.style ="width: 15%";
    var inputDiv = makeTag("div","input-group","");

    var minusSpan = makeTag("span","input-group-btn","");
    var minusButton = makeTag("button","btn btn-danger btn-number","");
    minusButton.id = prodCategory + "-" + prodId;
    var minusIcon = makeTag("i","fas fa-minus","");
    appendTag(minusButton,minusIcon);
    appendTag(minusSpan,minusButton);
    appendTag(inputDiv,minusSpan);

    var inputQuantity = makeTag("input","form-control input-number","");
    inputQuantity.type = "text";
    inputQuantity.min = "1";
    inputQuantity.max = "10";
    inputQuantity.setAttribute("disabled","");
    appendTag(inputDiv,inputQuantity);

    var plusSpan = makeTag("span","input-group-btn","");
    var plusButton = makeTag("button","btn btn-success btn-number","");
    plusButton.id = prodCategory + "+" + prodId;
    var plusIcon = makeTag("i","fas fa-plus","");
    appendTag(plusButton,plusIcon);
    appendTag(plusSpan,plusButton);
    appendTag(inputDiv,plusSpan);

    appendTag(td3,inputDiv);
    appendTag(tr,td3);

    var td4 = makeTag("td","align-middle text-center","");
    var trashLink = makeTag("a","text-dark trash","");
    trashLink.href = `javascript:deleteCartItem('`+prodCategory+`','`+prodId+`')`;
    var trash = makeTag("i","fa fa-trash","");
    appendTag(trashLink,trash);
    appendTag(td4,trashLink);
    appendTag(tr,td4);

    appendTag(tbody,tr);
}

//FILL DYNAMIC TBODY:
function fillDynamicTbody(productUrl,productName,productPrice,productColor,productCategory,productQuantity,i){
    var tbody = document.getElementById("cart-tbody");
    var tr = tbody.children[i];
    var th = tr.children[0];
    var div = th.firstChild;
    var img = div.firstChild;
    img.src = productUrl;

    var div2 = div.children[1];
    var h5 = div2.children[0];
    var name = h5.firstChild;
    name.innerText = productName;

    var category = div2.children[1];
    category.innerText ="Category: " + productCategory;

    var td = tr.children[1];
    var price = td.firstChild;
    price.innerText = "\u20B9" + " " + productPrice;

    var td2 = tr.children[2];
    var color = td2.firstChild;
    color.innerText = productColor;

    var td3 = tr.children[3];
    var inputDiv = td3.firstChild;
    var inputQuantity = inputDiv.children[1];
    inputQuantity.value = productQuantity;
}

//CALCULATE SUB TOTAL:
function calculateSubTotal(){
    var subTotal = 0;
    var tbody = document.getElementById("cart-tbody");
    var subTotalAmount = document.getElementById("subtotal-amount");

    for(let i=0;i<tbody.childElementCount;i++){
        let tr = tbody.children[i];
        let td = tr.children[1];
        let productPrice = td.firstChild.innerText;
        productPrice = productPrice.split(" ")[1];

        let td2 = tr.children[3];
        let div = td2.firstChild;
        let productQuantity = div.children[1].value;

        let total = (productQuantity * productPrice).toFixed(2);
        subTotal += parseFloat(total);
    }
    subTotalAmount.innerText = "\u20B9" + " " + subTotal;
    calculateShippingCharges(subTotal);
}

//CALCULATE SHIPPING CHARGES:
function calculateShippingCharges(subTotal){
    var shippingChargeAmount = document.getElementById("shipping-charge");

    shippingCharge = parseFloat((subTotal * 1/100).toFixed(2));
    shippingChargeAmount.innerText = "\u20B9" + " " + shippingCharge;
    calculateTaxCharges(subTotal,shippingCharge);
}

//CALCULATE TAX CHARGES:
function calculateTaxCharges(subTotal,shippingCharge){
    var taxChargeAmount = document.getElementById("tax-charge");

    taxCharge = parseFloat((subTotal * 7/100).toFixed(2));
    taxChargeAmount.innerText = "\u20B9" + " " + taxCharge;
    calculateFinalTotal(subTotal,shippingCharge,taxCharge);
}

//CALCULATE FINAL TOTAL:
function calculateFinalTotal(subTotal,shippingCharge,taxCharge){
    var totalAmount = document.getElementById("total-amount");

    var total = parseFloat((subTotal + shippingCharge + taxCharge).toFixed(2));
    totalAmount.innerText = "\u20B9" + " " + total;
}

//DELETE TABLE BODY:
function deleteTbody(){
    var tbody = document.getElementById("cart-tbody");

    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
}

//DELETE AMOUNT:
function deleteAmount(){
    var ul = document.querySelector("ul");
    var li = ul.children;
    for(let value of li){
        if(value.children[0].innerText == "Offer Discount"){
            value.children[1].innerText = "\u20B9" + " " + 0;
            continue;
        }
        value.children[1].innerText = "";
    }
}

//MAKE TAG:
function makeTag(tagName,className,id){
    var tag = document.createElement(tagName);
    if(className == "" && id == ""){
        return tag;
    }
    else if(className != "" && id == ""){
        tag.className = className;
        return tag;
    }
    else if(className == "" && id != ""){
        tag.id = id;
        return tag;
    }
    else{
        tag.className = className;
        tag.id = id;
        return tag;
    }
}

//APPEND TAG:
function appendTag(parent,child){
    parent.appendChild(child);
}