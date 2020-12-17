window.addEventListener("load",registerEvents);

function registerEvents(){
    authentication(false);
    document.getElementById("sign-out").addEventListener("click",signOut);
    document.getElementById("add").addEventListener("click",addProduct);
    document.getElementById("update").addEventListener("click",updateProduct);
    document.getElementById("delete").addEventListener("click",callDeleteProduct);
    document.getElementById("search").addEventListener("click",searchProduct);
    document.getElementById("show").addEventListener("click",callShowProduct);
    document.getElementById("sort").addEventListener("click",sortProduct);
    document.getElementById("delete-all").addEventListener("click",deleteAllProduct);
    loadCategory();
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

                                            //CALLING FUNCTION:

function callDeleteProduct(){
    if(document.getElementById("dynamic-label")){
        deleteProduct(undefined,undefined,false);
    }
    else{
        deleteProduct(undefined,undefined,true);
    }
}

function callShowProduct(){
    showProduct(true,undefined);
}

                                            //LOAD CATEGORY:

//LOAD CATEGORY:
function loadCategory(){
    productOperations.loadCategory(callBackForLoadCategory);
}

//CALLBACK (LOAD CATEGORY):
function callBackForLoadCategory(bool,categoryObject){
    if(bool == true){
        alert("There are no categories, kindly add one in database");
    }
    else{
        let categoryArr = [];
        let searchCategory = document.getElementById("search-category");
        let selectCategory = document.getElementById("select-category");
        let showCategory = document.getElementById("show-category");

        categoryArr.push(searchCategory);
        categoryArr.push(selectCategory);
        categoryArr.push(showCategory);

        for(let i=0;i<=2;i++){
            for(let value of categoryObject){
                if(value == undefined){
                    continue;
                }
                let option = document.createElement("option");
                option.innerText = value;
                categoryArr[i].appendChild(option);
            }
        }
    }
}

                                            //VALIDATE FORM:

//VALIDATE FORM:
function validateForm(bool,decision){
    deleteTbody();
    deleteLabel();
    setSearch();
    emptySpan();
    setShow();
    setSort();

    var spanArr=document.getElementsByClassName("blank-field");
    var inputArr=document.getElementsByClassName("input-field");
    var productId = inputArr[0].value;
    var productCategory = inputArr[6].value;
    
    if(inputArr[0].value == "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != "" && inputArr[6].value!= "")
    {
        spanArr[0].innerText = "Enter Product ID to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value == "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != "" && inputArr[6].value!= "")
    {
        spanArr[1].innerText = "Enter Product Name to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value == "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != "" && inputArr[6].value!= "")
    {
        spanArr[2].innerText = "Enter Product Description to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value == "" && inputArr[4].value != "" && inputArr[5].value != "" && inputArr[6].value!= "")
    {
        spanArr[3].innerText = "Enter Product Price to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value == "" && inputArr[5].value != "" && inputArr[6].value!= "")
    {
        spanArr[4].innerText = "Enter Product Url to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value == "" && inputArr[6].value!= "")
    {
        spanArr[5].innerText = "Enter Product Color to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != "" && inputArr[6].value== "Select Category")
    {
        spanArr[6].innerText = "Select Category to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "" && inputArr[5].value != "" &&  inputArr[6].value!= "")
    {
        if(bool == true && decision == 0){
            productOperations.search(callBackForAddProduct,productId,productCategory,false);
        }
        else if(bool == false && decision == 1){
            productOperations.search(callBackForUpdateProduct,productId,productCategory,false);
        }
        else{
            productObject();
            alert("Product Updated");
            inputArr[0].removeAttribute("disabled");
            emptyInput();
        }
    }
    else{
        document.getElementById("empty-error").innerText = "Enter required fields to proceed";
    }
}

                                            //PRODUCT OBJECT CREATION:

//PRODUCT OBJECT CREATION:
function productObject(){
    var productCategory = document.getElementsByClassName("input-field")[6].value;
    var productObject = new Product();
    for(let key in productObject){
        productObject[key] = document.getElementById(key).value;
    }

    productOperations.add(productObject,productCategory);
}

                                                    //ADD PRODUCT:

//ADD PRODUCT:
function addProduct(){
    validateForm(true,0);
}

//CALLBACK (ADD PRODUCT):
function callBackForAddProduct(bool){
    if(bool == true){
        productObject();
        alert("Product Added");

        emptyInput();
    }
    else{
        let span = document.getElementsByClassName("blank-field")[0];
        span.innerText = "Product ID already taken";
    }
}

                                            //UPDATE PRODUCT:

//UPDATE PRODUCT:
function updateProduct(){
    deleteTbody();
    deleteLabel();
    setSearch();
    emptySpan();
    setShow();
    setSort();

    var inputArr = document.getElementsByClassName("input-field");

    if(inputArr[0].disabled){
        validateForm(false,2);
    }
    else{
        validateForm(false,1);
    }
}

//CALLBACK (UPDATE PRODUCT):
function callBackForUpdateProduct(bool){
    if(bool == true){
        alert("Invalid Product ID");
    }
    else{
        productObject();
        alert("Product Updated");

        emptyInput();
    }
}

                                            //DELETE PRODUCT:

//DELETE PRODUCT:
function deleteProduct(productId,productCategory,bool){
    setSearch();
    emptySpan();
    setShow();
    setSort();

    var inputArr = document.getElementsByClassName("input-field");

    if(bool == true){
        let productId = inputArr[0].value;
        let productCategory = inputArr[6].value;

        if(productId == "" && productCategory == "Select Category"){
            alert("Enter Product ID and Category to delete");
        }
        else if(productId != "" && productCategory == "Select Category"){
            alert("Select Product Category to Delete")
        }
        else if(productId == "" && productCategory != "Select Category"){
            alert("Enter Product ID to delete");
        }
        else{
            productOperations.search(callBackForDeleteProduct,productId,productCategory,false);
            deleteTbody();
            inputArr[0].removeAttribute("disabled");
        }
    }
    else if(bool == "false"){
        productOperations.delete(productId,productCategory);
        alert("Product Deleted Successfully!!!");
        
        deleteTbody();
        deleteLabel();
        emptyInput();
        inputArr[0].removeAttribute("disabled");
    }
    else{
        let tbody = document.getElementById("products");
        let checkboxArr = [];
        let label = document.getElementById("dynamic-label").innerText;
        
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let checkbox = tr.lastElementChild.children[1];
        
            if(checkbox.checked == true){
                checkboxArr.push(tr.children[2].innerText);
            }
        }
        
        if(checkboxArr.length == 0){
            alert("Select Records to delete");
        }
        else{
            for(let i=0;i<checkboxArr.length;i++){
                productOperations.delete(checkboxArr[i],label);
            }
            alert("Products Deleted Successfully");

            deleteTbody();
            deleteLabel();
            showProduct(false,label);
        }
    }
}

//CALLBACK (DELETE PRODUCT):
function callBackForDeleteProduct(bool){
    if(bool == true){
        alert("Invalid Product Id or Category");

        emptyInput();
    }
    else{
        let inputArr = document.getElementsByClassName("input-field");
        productOperations.delete(inputArr[0].value,inputArr[6].value);
        alert("Product Deleted Successfully!!!");
        
        emptyInput();
    }
}

                                           //SEARCH PRODUCT:

//SEARCH PRODUCT:
function searchProduct(){
    deleteTbody();
    deleteLabel();
    emptyInput();
    emptySpan();
    setShow();
    setSort();

    var productId = document.getElementById("search-field").value;
    var productCategory = document.getElementById("search-category").value;

    if(productId == "" && productCategory == "Select Category"){
        alert("Enter Product ID and Category to search");
    }
    else if(productId != "" && productCategory == "Select Category"){
        alert("Select Product Category to search");
    }
    else if(productId == "" && productCategory != "Select Category"){
        alert("Enter Product ID to search");
    }
    else{
        productOperations.search(callBackForSearchProduct,productId,productCategory,true);
    }
}

//CALLBACK (SEARCH PRODUCT):
function callBackForSearchProduct(bool,productObject){
    if(bool == true){
        alert("Product not found");

        setSearch();
    }
    else{
        let productCategory = document.getElementById("search-category").value;
        printOneRecord(productObject,productCategory);
    }
}

                                           //SHOW PRODUCT:

//SHOW PRODUCT:
function showProduct(bool,oldProductCategory){
    deleteTbody();
    deleteLabel();
    emptyInput();
    setSearch();
    emptySpan();
    setSort();

    var productCategory = document.getElementById("show-category").value;
    
    if(bool == true){
        if(productCategory == "Select Category"){
            alert("Select Product Category to show");
        }
        else{
            productOperations.show(callBackForShowProduct,productCategory);
        }
    }
    else{
        productOperations.show(callBackForShowProduct,oldProductCategory);
    }
}

//CALLBACK (SHOW PRODUCT):
function callBackForShowProduct(bool,productObject,productCategory){
    if(bool == true){
        alert("There is no product in this category");
        setShow();
    }
    else{
        printRecords(productObject,productCategory);
    }
}

                                           //SORT PRODUCT:

//SORT PRODUCT:
function sortProduct(){
    emptyInput();
    setSearch();
    emptySpan();
    setShow();

    if(document.getElementById("dynamic-label")){
        let tbody = document.getElementById("products");
        let sortCategory = document.getElementById("sort-category");
        let objectArr = [];

        for(let i=0;i<tbody.childElementCount;i++){
            let object = new dummyProduct();
            objectArr.push(object);
        }
        
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let j=0;
            for(let[key,value] of Object.entries(objectArr[i])){
                objectArr[i][key] = tr.children[j].innerText;
                j++;
            }
        }

        if(sortCategory.value == "Sort By"){
            alert("Select Sort By to sort");
        }
        else if(sortCategory.value == "Price: Low to High"){
            objectArr.sort((a,b)=>a["productPrice"]-b["productPrice"]);

            let label = document.getElementById("dynamic-label").innerText;

            deleteTbody();
            deleteLabel();
            printRecords(objectArr,label);
            setSort();
        }
        else{
            objectArr.sort((a,b)=>b["productPrice"]-a["productPrice"]);

            let label = document.getElementById("dynamic-label").innerText;

            deleteTbody();
            deleteLabel();
            printRecords(objectArr,label);
            setSort();
        }
    }
    else{
        alert("First Show the Product Category to sort");
    }
}

                                          //DELETE ALL PRODUCT:

//DELETE ALL PRODUCT:
function deleteAllProduct(){
    emptyInput();
    setSearch();
    emptySpan();
    setSort();
    setShow();

    if(document.getElementById("dynamic-label")){
        let label = document.getElementById("dynamic-label").innerText;

        productOperations.delete("",label);
        alert("Product Category is deleted");

        deleteLabel();
    }
    else{
        alert("First Show the Product Category to delete");
    }
    deleteTbody();
}

                                         //UTILITIES:

//EDIT PRODUCT:
function editProduct(id,name,description,price,url,color,productCategory,bool){
    var inputArr = document.getElementsByClassName("input-field");
    inputArr[0].setAttribute("disabled","");
    for(let i=0;i<arguments.length-2;i++){
        inputArr[i].value = arguments[i];
    }
    inputArr[6] = "Select Category";

    if(bool == "false"){
        deleteTbody();
        let dummyObject = new dummyProduct();

        for(let key in dummyObject){
            dummyObject[key] = document.getElementById(key).value;
        }
        
        printOneRecord(dummyObject,productCategory);
    }
}

//PRINT ONE RECORD:
function printOneRecord(productObject,productCategory){
    var tbody= document.getElementById("products");
    var row=tbody.insertRow(0);
    var i=0;
    
    for(let [key,value] of Object.entries(productObject)){
        let cell=row.insertCell(i);
        cell.innerHTML=value;
        i++;
    }

    let operationCell= row.insertCell(i);
    operationCell.innerHTML= `<a href="javascript:editProduct('`+productObject.productId+`','`+productObject.productName+`','`+productObject.productDescription+`','`+productObject.productPrice+`','`+productObject.productUrl+`','`+productObject.productColor+`','`+undefined+`','`+true+`')"><i class="fas fa-edit fa-lg"></i></a>
    <a href="javascript:deleteProduct('`+productObject.productId+`','`+productCategory+`','`+false+`')"><i class="fas fa-trash fa-lg"></i></a>`;
    
    setSearch();
    deleteLabel();
}

//PRINT RECORDS:
function printRecords(productObject,productCategory){
    var div = document.getElementById("dynamic-div");
    var tbody = document.getElementById("products");
    var i = 0;

    for(let [key,value] of Object.entries(productObject)){
        let row = tbody.insertRow(i);
        let j = 0;
        let tempObject = value;

        for(let [newKey,newValue] of Object.entries(tempObject)){
            let cell=row.insertCell(j);
            cell.innerHTML=newValue;
            j++;
        }
        let operationCell=row.insertCell(j);

        operationCell.innerHTML= `<a href="javascript:editProduct('`+tempObject.productId+`','`+tempObject.productName+`','`+tempObject.productDescription+`','`+tempObject.productPrice+`','`+tempObject.productUrl+`','`+tempObject.productColor+`','`+productCategory+`','`+false+`')"><i class="fas fa-edit fa-lg"></i></a>
        <input type="checkbox" class="dynamic-checkbox">`;

        i++;
    }
    var label = document.createElement("label");
    label.innerText = productCategory;
    label.id = "dynamic-label";
    div.appendChild(label);
   
    setShow();
}

//SET SEARCH:
function setSearch(){
    var search = document.getElementById("search-field");
    var searchCategory = document.getElementById("search-category");

    search.value = "";
    searchCategory.value = "Select Category";
}

//SET SHOW:
function setShow(){
    var showCategory = document.getElementById("show-category");
    showCategory.value = "Select Category";
}

//SET SORT:
function setSort(){
    var sortCategory = document.getElementById("sort-category");
    sortCategory.value = "Sort By";
}

//EMPTY INPUT:
function emptyInput(){
    var inputArr = document.getElementsByClassName("input-field");

    for(let i=0;i<inputArr.length-1;i++){
        inputArr[i].value = "";
    }
    inputArr[6].value = "Select Category"
}

//EMPTY SPAN:
function emptySpan(){
    var spanArr = document.getElementsByClassName("blank-field");
    var span = document.getElementById("empty-error");

    span.innerText = "";
    for(let i=0;i<spanArr.length;i++){
        spanArr[i].innerText = "";
    }
}

//DELETE TABLE BODY:
function deleteTbody(){
    var tbody = document.getElementById("products");

    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
}

//DELETE DYNAMIC LABEL:
function deleteLabel(){
    var div = document.getElementById("dynamic-div");
    var label = document.getElementById("dynamic-label");

    if(label){
        div.removeChild(label);
    }
}