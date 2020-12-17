window.addEventListener("load",registerEvent);

function registerEvent(){
    authentication(false);
    document.getElementById("sign-out").addEventListener("click",signOut);
    document.getElementById("search").addEventListener("click",searchOrder);
    loadOrders();
}

                                                //TOKEN CHECK:

//CALLBACK (ADMIN):
function callBackForAdmin(bool,adminObject,localToken){
    if(bool == false){
        let result = compareToken(localToken,adminObject.token);

        if(result == false){
            location.href = "login.html";
        }
    }
}

                                                //SIGN OUT:

//SIGN OUT:
function signOut(){
    for(let i=0;i<Object.keys(localStorage).length;i++){
        if(Object.keys(localStorage)[i].length == 6 && typeof(parseInt(Object.keys(localStorage)[i][5])) == "number"){

            let username = Object.keys(localStorage)[i];
            localStorage.removeItem(username);
            adminOperations.searchAdmin(callBackForSignOut,username,undefined);
        }
    }
}

//CALLBACK (SIGN OUT):
function callBackForSignOut(bool,adminObject,localToken){
    console.log(adminObject);
    if(bool == false){
        delete adminObject.token;
        adminOperations.add(adminObject);

        location.href = "login.html";
    }
}

                                                    //LOAD ORDER:

//LOAD ORDER:
function loadOrders(){
    var path = "/orders";
    orderOperations.search(callBackForLoadOrders,path);
}


//CALLBACK (LOAD ORDER):
function callBackForLoadOrders(bool,orderObject){
    if(bool == true){
        alert("There are no orders placed yet");
    }
    else{
        printRecords(orderObject);
    }
}

//CALLBACK (USER):
function callBackForUser(bool,userObject){
    if(bool == false){
        printUserData(userObject);
    }
}

//CALLBACK (CART):
function callBackForCart(bool,cartObject){
    if(bool == false){
        collectProduct(cartObject);
    }
}

//COLLECT PRODUCT:
function collectProduct(cartObject){
    for(let key in cartObject){
        let productDoc = cartObject[key];
        let productCategory = key;
        for(let newKey in productDoc){
            let product = productDoc[newKey];
            for(let lastKey in product){
                if(lastKey == "productId"){
                    var id = product[lastKey];
                }
                else{
                    var quantity = product[lastKey];
                }
            }
            var path = "/products/";
            orderOperations.search(callBackForProduct,productCategory,id,quantity,path);
        }
    }
}

//CALLBACK (PRODUCT):
function callBackForProduct(bool,productObject,productCategory,productQuantity){
    if(bool == false){
        printProductData(productObject,productCategory,productQuantity);
    }
}

//CALLBACK (AFTER UPDATE STATUS):
function callBackAfterUpdateStatus(bool,orderObject){
    if(bool == true){
        alert("There are no order placed yet");
    }
    else{
        printRecords(orderObject);
    }
}

//CALLBACK (OFFER):
function callBackForOffer(bool,offerObject,priceArr){
    if(bool == true){
        calculateFinalAmount(priceArr,0);
    }
    else{
        calculateFinalAmount(priceArr,offerObject.discountAmount);
    }
}

                                                    //SEARCH ORDER:

//SEARCH ORDER:
function searchOrder(){
    var orderId = document.getElementById("search-field").value;
    var path = "/orders/" + orderId;

    if(orderId == ""){
        alert("Enter Order ID to search");
    }
    else{
        orderOperations.search(callBackForSearchOrder,path);
    }
}

//CALLBACK (SEARCH ORDER):
function callBackForSearchOrder(bool,orderObject){
    if(bool == true){
        alert("Order not found");
        document.getElementById("search-field").value = "";
    }
    else{
        deleteDynamicDiv();
        printOneRecord(orderObject);
        document.getElementById("search-field").value = "";
    }
}

                                                //UTILITIES

//PRINT ONE RECORD:
function printOneRecord(orderObject){
    deleteTbody();

    var tbody = document.getElementById("orders");
    var row = tbody.insertRow(0);

    printCommon(orderObject,row,true);
}

//PRINT RECORDS:
function printRecords(orderObject){
    deleteTbody();

    var tbody = document.getElementById("orders");
    var i = 0;

    for(let [key,value] of Object.entries(orderObject)){
        let row = tbody.insertRow(i);
        let tempObject = value;

        printCommon(tempObject,row,false);
        i++;
    }
}

//PRINT COMMON:
function printCommon(orderObject,row,bool){
    var i = 0;
    var state = true;

    for(let [key,value] of Object.entries(orderObject)){
        let cell = row.insertCell(i);

        if(i == 4){
            let td1 = document.createElement("td");

            td1.innerHTML = value;
            cell.appendChild(td1);
            
            if(value == "Not Delivered"){
                let td2 = document.createElement("td");
                td2.innerHTML = `<input type="checkbox">`;
                cell.appendChild(td2);
            }
            i++;

            continue;
        }
        cell.innerText = value;
        i++;
    }

    if(bool == false){
        state = false;
    }

    let operationCell = row.insertCell(i);
    operationCell.innerHTML= `<a href="javascript:viewOrder('`+orderObject.customerName+`','`+orderObject.offerApplied+`','`+orderObject.orderDate+`','`+orderObject.orderId+`','`+orderObject.orderStatus+`','`+orderObject.paymentMode+`')"><i class="fas fa-eye fa-lg"></i></a>
    <a href="javascript:editOrder('`+orderObject.customerName+`','`+orderObject.offerApplied+`','`+orderObject.orderDate+`','`+orderObject.orderId+`','`+orderObject.orderStatus+`','`+orderObject.paymentMode+`','`+state+`')"><i class="fas fa-edit fa-lg"></i></a>`;
}

//VIEW ORDER:
function viewOrder(customerName,offerApplied,orderDate,orderId,orderStatus,paymentMode){
    deleteTbody();
    deleteHr();
    deleteDynamicDiv();

    var priceArr = [];
    var orderObject = new Order();
    var i=0;

    for(let key in orderObject){
        orderObject[key] = arguments[i];
        i++;
    }

    if(orderStatus == "Delivered"){
        printOneRecord(orderObject);
        printUserTable(customerName);
    }
    else{
        printOneRecord(orderObject);
        printUserTable(customerName);
        printProductTable(orderId);

        setTimeout(()=>{
            var tbody = document.getElementById("product-tbody");
            for(let i=0;i<tbody.childElementCount;i++){
                let row=tbody.children[i];
                let price = row.children[4].innerText;
                let quantity=row.children[6].innerText;
                
                priceArr.push(price*quantity);
            }
            var path = "/offers/" + offerApplied;
            orderOperations.search(callBackForOffer,priceArr,path);
        },4000);
    }
}

//CALCULATE FINAL AMOUNT:
function calculateFinalAmount(priceArr,discountAmount){
    var tbody = document.getElementById("product-tbody");
    var tr = makeTag("tr","","");
    var finalAmount = calculateTotalAmount(priceArr);

    for(let i=0;i<4;i++){
        if(i == 0){
            var td = makeTag("td","","");
            td.colSpan = "4";
            appendTag(tr,td);
            continue;
        }
        else if(i == 1){
            var td = makeTag("td","","");
            td.innerText = "Total: " + finalAmount;
            appendTag(tr,td);
        }
        else if(i == 2){
            var td = makeTag("td","","");
            td.innerText = "Discount Amount: " + discountAmount;
            appendTag(tr,td);
        }
        else{
            var td = makeTag("td","","");
            td.innerText = "Final Amount: " + (finalAmount - discountAmount);
            appendTag(tr,td);
        }
    }
    
    appendTag(tbody,tr);
}

//CALCULATE TOTAL AMOUNT:
function calculateTotalAmount(priceArr){
    var sum = 0;
    for(i = 0;i<priceArr.length;i++){
        sum = sum + priceArr[i];
    }
    //arr.reduce((acc=0,ele)=>acc+=ele);
    return sum;
}

//PRINT USER TABLE:
function printUserTable(customerName){
    var div=document.getElementById("dynamic-div");
    var hr = makeTag("hr","","dynamic-hr");
    appendTag(div,hr);

    var dynamicDiv = makeTag("div","","new-dynamic-div");
    var userTable = makeTag("table","table table-bordered","userDetails");
    var thead = makeTag("thead","thead-dark","");
    var tr1 = makeTag("tr","","");
    var th = makeTag("th","","");

    th.colSpan = "4";
    th.innerText = "User Details";
    th.style.textAlign = "center";
    appendTag(tr1,th);

    var tr2 = makeTag("tr","","");
    var arr = ["Address","Email Id","Phone Number","Username"];
    for(let i=0;i<arr.length;i++){
        let th = document.createElement("th");
        th.innerText = arr[i];
        tr2.appendChild(th);
    }

    appendTag(thead,tr1);
    appendTag(thead,tr2);
    appendTag(userTable,thead);
    appendTag(dynamicDiv,userTable);
    appendTag(div,dynamicDiv);

    var path = "/users/" + customerName;
    orderOperations.search(callBackForUser,path);
}

//PRINT PRODUCT TABLE:
function printProductTable(orderId){
    var dynamicDiv = document.getElementById("new-dynamic-div");
    var productTable = makeTag("table","table table-bordered","productDetails");
    var tbody = makeTag("tbody","","product-tbody");
    var thead = makeTag("thead","thead-dark","");
    var tr1 = makeTag("tr","","");
    var th = makeTag("th","","");

    th.colSpan = "7";
    th.innerText = "Product Details";
    th.style.textAlign = "center";
    appendTag(tr1,th);

    var tr2 = makeTag("tr","","");
    var arr = ["Product Category","Product Color","Product Id","Product Name","Product Price","Product URL","Quantity"];
    for(let i=0;i<arr.length;i++){
        let th = document.createElement("th");
        th.innerText = arr[i];
        tr2.appendChild(th);
    }

    appendTag(productTable,tbody);
    appendTag(thead,tr1);
    appendTag(thead,tr2);
    appendTag(productTable,thead);
    appendTag(dynamicDiv,productTable);

    var path = "/cartRef/" + orderId;
    orderOperations.search(callBackForCart,path);
}

//PRINT USER DATA:
function printUserData(userObject){
    var table = document.getElementById("userDetails");
    var tbody = makeTag("tbody","","");
    var tr = makeTag("tr","","");

    for(let key in userObject){
        if(key == "token"){
            continue;
        }
        if(key == "password"){
            continue;
        }
        let td = makeTag("td","","");
        td.innerText = userObject[key];
        appendTag(tr,td);
    }

    appendTag(tbody,tr);
    appendTag(table,tbody);
}

//PRINT PRODUCT DATA:
function printProductData(productObject,productCategory,productQuantity){
    var table = document.getElementById("productDetails");
    var tbody = document.getElementById("product-tbody");
    var tr = makeTag("tr","","");
    var td = makeTag("td","","");
    td.innerText = productCategory;

    appendTag(tr,td);

    for(let key in productObject){
        if(key == "productDescription"){
            continue;
        }
        if(key == "productUrl"){
            let td2 = makeTag("td","","");
            td2.style.padding = "0%";
            let img = makeTag("img","","");
            img.style.width = "250px";
            img.style.height = "150px"
            img.src = productObject[key];
            appendTag(td2,img);
            appendTag(tr,td2);
            continue;
        }
        let td1 = makeTag("td","","");
        td1.innerText = productObject[key];
        appendTag(tr,td1);
    }
    var td = makeTag("td","","");
    td.innerText = productQuantity;
    appendTag(tr,td);

    appendTag(tbody,tr);
    appendTag(table,tbody);
}

//EDIT ORDER:
function editOrder(customerName,offerApplied,orderDate,orderId,orderStatus,paymentMode,bool){
    var tbody = document.getElementById("orders");

    if(bool == "true"){
        let tr = tbody.firstChild;

        let orderObject = checkOrderStatus(arguments,tr);
        if(orderObject == undefined){
            alert("There is no change in the state of Order Status");
        }
        else{
            orderOperations.add(orderObject);
            cartOperations.addOrderProducts(orderId,{});
            printOneRecord(orderObject);
        }
    }
    else{
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let newOrderId = tr.children[3].innerText;
    
            if(newOrderId == orderId){
                let orderObject = checkOrderStatus(arguments,tr);
                if(orderObject == undefined){
                    alert("There is no change in the state of Order Status");
                }
                else{
                    orderOperations.add(orderObject);
                    cartOperations.addOrderProducts(orderId,{});
                    let path = "/orders";
                    orderOperations.search(callBackAfterUpdateStatus,path);
                }
            }
        }
    }
}

//CHECK ORDER STATUS:
function checkOrderStatus(arguments,tr){
    var newOrderStatus = tr.children[4];
    var td = newOrderStatus.children[1];
    var checkbox = td.firstChild;

    if(checkbox.checked == true){
        let statusText = newOrderStatus.children[0].innerText;

        if(statusText == "Delivered"){
            arguments[4] = "Not Delivered";
        }
        else{
            arguments[4] = "Delivered";
        }

        let orderObject = new Order();
        let i = 0;
        for(let key in orderObject){
            orderObject[key] = arguments[i];
            i++;
        }
        return orderObject;
    }
    return undefined;
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

//DELETE TBODY:
function deleteTbody(){
    var tbody = document.getElementById("orders");

    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
}

//DELETE DYNAMIC DIV:
function deleteDynamicDiv(){
    if(document.getElementById("new-dynamic-div")){
        document.getElementById("new-dynamic-div").remove();
    }
}

//REMOVE HORIZONTAL LINE:
function deleteHr(){
    var div = document.getElementById("dynamic-div");
    var hr = document.getElementById("dynamic-hr");

    if(document.getElementById("dynamic-hr")){
        div.removeChild(hr);
    }
}