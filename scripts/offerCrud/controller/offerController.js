window.addEventListener("load",registerEvents);

function registerEvents(){
    authentication(false);
    document.getElementById("sign-out").addEventListener("click",signOut);
    document.getElementById("add").addEventListener("click",addOffer);
    document.getElementById("update").addEventListener("click",updateOffer);
    document.getElementById("delete").addEventListener("click",callDeleteOffer);
    document.getElementById("search").addEventListener("click",searchOffer);
    document.getElementById("show").addEventListener("click",showOffer);
    document.getElementById("delete-all").addEventListener("click",deleteAllOffer);
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

function callDeleteOffer(){
    checkDisabled();

    var tbody = document.getElementById("offers");
    var offerCode = document.getElementsByClassName("input-field")[2].value;

    if(tbody.childElementCount == 0){
        deleteOffer(undefined,true);
    }
    else{
        let tr = tbody.firstChild;
        let td = tr.children[5];

        if(td.children[1].type == "checkbox"){
            deleteOffer(undefined,false);
        }
        else{
            if(offerCode == ""){
                alert("Enter Offer Code to delete");
            }
            else{
                deleteOffer(undefined,true);
                deleteTbody();
            }
        }
    }
}

                                            //VALIDATE FORM:

//VALIDATE FORM:
function validateForm(bool,decision){
    deleteTbody();
    emptySpan();
    emptySearch();
    checkDisabled();

    var spanArr=document.getElementsByClassName("blank-field");
    var inputArr=document.getElementsByClassName("input-field");
    var offerCode = inputArr[2].value;
    
    if(inputArr[0].value == "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "")
    {
        spanArr[0].innerText = "Enter Offer Name to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value == "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "")
    {
        spanArr[1].innerText = "Enter Offer Description to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value == "" && inputArr[3].value != "" && inputArr[4].value != "")
    {
        spanArr[2].innerText = "Enter Offer Code to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value == "" && inputArr[4].value != "")
    {
        spanArr[3].innerText = "Enter Discount Amount to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value == "")
    {
        spanArr[4].innerText = "Enter Offer Url to proceed";
    }
    else if(inputArr[0].value != "" &&  inputArr[1].value != "" && inputArr[2].value != "" && inputArr[3].value != "" && inputArr[4].value != "")
    {
        if(bool == true && decision == 0){
            offerOperations.search(callBackForAddOffer,offerCode,false);
        }
        else if(bool == false && decision == 1){
            offerOperations.search(callBackForUpdateOffer,offerCode,false);
        }
        else{
            offerObject();
            alert("Offer Updated");
            checkDisabled();
            emptyInput();
        }
    }
    else{
        document.getElementById("empty-error").innerText = "Enter required fields to proceed";
    }
}

                                            //OFFER OBJECT CREATION:

//OFFER OBJECT CREATION:
function offerObject(){
    var offerObject = new Offer();
    
    for(let key in offerObject){
        offerObject[key] = document.getElementById(key).value;
    }

    
    offerOperations.add(offerObject);
}

                                                //ADD OFFER:

//ADD OFFER:
function addOffer(){
    validateForm(true,0);
}

//CALLBACK (ADD OFFER):
function callBackForAddOffer(bool){
    if(bool == true){
        offerObject();
        alert("Offer Added");

        emptyInput();
    }
    else{
        let span = document.getElementsByClassName("blank-field")[2];
        span.innerText = "Offer Code already taken";
    }
}

                                            //UPDATE OFFER:

//UPDATE OFFER:
function updateOffer(){
    deleteTbody();
    emptySpan();
    emptySearch();

    var inputArr = document.getElementsByClassName("input-field");

    if(inputArr[2].disabled){
        validateForm(false,2);
    }
    else{
        validateForm(false,1);
    }
}

//CALLBACK (UPDATE OFFER):
function callBackForUpdateOffer(bool){
    if(bool == true){
        alert("Invalid Offer Code");
    }
    else{
        offerObject();
        alert("Offer Updated");

        emptyInput();
    }
}

                                            //DELETE OFFER:

//DELETE OFFER:
function deleteOffer(offerCode,bool){
    emptySpan();
    emptySearch();

    var inputArr = document.getElementsByClassName("input-field");

    if(bool == true){
        let offerCode = inputArr[2].value;

        if(offerCode == ""){
            alert("Enter Offer Code to delete");
        }
        else{
            offerOperations.search(callBackForDeleteOffer,offerCode,false);
        }
    }
    else if(bool == "false"){
        offerOperations.delete(offerCode);
        alert("Offer Deleted Successfully!!!");
        
        deleteTbody();
        emptyInput();
        checkDisabled();
    }
    else{
        let tbody = document.getElementById("offers");
        let checkboxArr = [];
    
        for(let i=0;i<tbody.childElementCount;i++){
            let tr = tbody.children[i];
            let checkbox = tr.lastElementChild.children[1];
        
            if(checkbox.checked == true){
                checkboxArr.push(tr.children[1].innerText);
            }
        }
        
        if(checkboxArr.length == 0){
            alert("Select Records to delete");
        }
        else{
            for(let i=0;i<checkboxArr.length;i++){
                offerOperations.delete(checkboxArr[i]);
            }
            alert("Offers Deleted Successfully");

            deleteTbody();
            showOffer();
        }
    }
}

//CALLBACK (DELETE OFFER):
function callBackForDeleteOffer(bool){
    if(bool == true){
        alert("Invalid Offer Code");

        emptyInput();
    }
    else{
        let offerCode = document.getElementsByClassName("input-field")[2].value;
        offerOperations.delete(offerCode);
        alert("Offer Deleted Successfully!!!");
        
        emptyInput();
    }
}

                                           //SEARCH OFFER:

//SEARCH OFFER:
function searchOffer(){
    deleteTbody();
    emptyInput();
    emptySpan();

    var offerCode = document.getElementById("search-field").value;

    if(offerCode == ""){
        alert("Enter Offer Code to search");
    }
    else{
        offerOperations.search(callBackForSearchOffer,offerCode,true);
    }
}

//CALLBACK (SEARCH OFFER):
function callBackForSearchOffer(bool,offerObject){
    if(bool == true){
        alert("Offer not found");

        emptySearch();
    }
    else{
        printOneRecord(offerObject);
    }
}

                                           //SHOW OFFER:

//SHOW OFFER:
function showOffer(){
    deleteTbody();
    emptyInput();
    emptySearch();
    emptySpan();
    checkDisabled();
    
    offerOperations.show(callBackForShowOffer);
}

//CALLBACK (SHOW OFFER):
function callBackForShowOffer(bool,offerObject){
    if(bool == true){
        alert("There are no offers in the database");
    }
    else{
        printRecords(offerObject);
    }
}

                                          //DELETE ALL OFFER:

//DELETE ALL OFFER:
function deleteAllOffer(){
    emptyInput();
    emptySearch();
    emptySpan();
    checkDisabled();

    var tbody = document.getElementById("offers");

    if(tbody.childElementCount > 1){
        offerOperations.delete("");
        alert("All Offers deleted");
    }
    else{
        alert("First Show the Offers to delete");
    }

    deleteTbody();
}

                                         //UTILITIES:

//EDIT OFFER:
function editOffer(name,description,code,discountAmount,url,bool){
    var inputArr = document.getElementsByClassName("input-field");
    inputArr[2].setAttribute("disabled","");

    for(let i=0;i<arguments.length-1;i++){
        inputArr[i].value = arguments[i];
    }

    if(bool == "false"){
        deleteTbody();                
        let dummyObject = new dummyOffer();

        for(let key in dummyObject){
            dummyObject[key] = document.getElementById(key).value;
        }
        
        printOneRecord(dummyObject);
    }
}

//PRINT ONE RECORD:
function printOneRecord(offerObject){
    var tbody= document.getElementById("offers");
    var row=tbody.insertRow(0);
    var i=0;
    
    for(let [key,value] of Object.entries(offerObject)){
        let cell=row.insertCell(i);
        cell.innerHTML=value;
        i++;
    }

    var operationCell= row.insertCell(i);
    operationCell.innerHTML= `<a href="javascript:editOffer('`+offerObject.offerName+`','`+offerObject.offerDescription+`','`+offerObject.offerCode+`','`+offerObject.discountAmount+`','`+offerObject.offerUrl+`', '`+true+`')"><i class="fas fa-edit fa-lg"></i></a>
    <a href="javascript:deleteOffer('`+offerObject.offerCode+`','`+false+`')"><i class="fas fa-trash fa-lg"></i></a>`;
    
    emptySearch();
}

//PRINT RECORDS:
function printRecords(offerObject){
    var tbody = document.getElementById("offers");
    var i = 0;

    for(let [key,value] of Object.entries(offerObject)){
        let row = tbody.insertRow(i);
        let j = 0;
        let tempObject = value;

        for(let [newKey,newValue] of Object.entries(tempObject)){
            let cell=row.insertCell(j);
            cell.innerHTML=newValue;
            j++;
        }

        let operationCell=row.insertCell(j);
        operationCell.innerHTML= `<a href="javascript:editOffer('`+tempObject.offerName+`','`+tempObject.offerDescription+`','`+tempObject.offerCode+`','`+tempObject.discountAmount+`','`+tempObject.offerUrl+`','`+false+`')"><i class="fas fa-edit fa-lg"></i></a>
        <input type="checkbox" class="dynamic-checkbox" />`;

        i++;
    }
}

//EMPTY INPUT:
function emptyInput(){
    var inputArr = document.getElementsByClassName("input-field");

    for(let i=0;i<inputArr.length;i++){
        inputArr[i].value = "";
    }
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

//EMPTY SEARCH:
function emptySearch(){
    var search = document.getElementById("search-field");
    search.value = "";
}

//DELETE TABLE BODY:
function deleteTbody(){
    var tbody = document.getElementById("offers");

    while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
}

//CHECK CHECKBOX DISABLED:
function checkDisabled(){
    var disabledInput = document.getElementsByClassName("input-field")[2];

    if(disabledInput.disabled == true){
        disabledInput.removeAttribute("disabled","");
    }
}