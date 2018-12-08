

//AJAX 

//grabs data from client side and pushes to server
function loadToServer() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //resets error message on client side
    document.getElementById("loginErrors").innerHTML = "";
    //Output requirement messages on client side
    if(username == ""){
        document.getElementById("loginErrors").innerHTML += "Username is required<br>";
    }
    if(password == ""){
        document.getElementById("loginErrors").innerHTML += "Password is required<br>";
    }

    // if(username != '' && password != ''){
    //     httpRequest = new XMLHttpRequest();
    //     if (!httpRequest){
    //         alert('Cannot create an XMLHTTP instance');
    //         return false;
    //     }
    //     httpRequest.onreadystatechange = alertContents;
    //     httpRequest.open('POST', '../php/login.php', true);
    //     httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //     httpRequest.send('username=' + username + "&password="+ password);
    //     // console.log(username);
    //     // console.log(password);
    

    // }
}

//outputs response from server
function alertContents() {
    try{
        if(httpRequest.readyState == XMLHttpRequest.DONE) {
            if(httpRequest.status == 200){
                var lines = httpRequest.responseText;
                console.log(lines);
            }
            else{
                alert('There was a problem with the requests');
            }
        }
    }
    catch( e ){
        alert('Caught exception: '+ e.description);
    }
}
//class to store user information
class User{
    constructor(email, username, password1, password2){
        this.email = email;
        this.username = username;
        this.password1 = password1;
        this.password2 = password2;
    }
}

function regToServer(){
    let users = [
        new User(document.getElementById("email").value,
        document.getElementById("regUsername").value,
        document.getElementById("password1").value,
        document.getElementById("password2").value )
    ]
    //resets the requirements on client side
    document.getElementById("errors").innerHTML = '';

    //array to hold errors
    var error = [];

    //Outputs on client side error messages if fields are empty
    if(users[0].email == ""){
        document.getElementById("errors").innerHTML += "Email is required<br>";
        error.push(1); //random value to populate array
    }
    if(users[0].username == ""){
        document.getElementById("errors").innerHTML += "Username is required<br>";
        error.push(2);
    }
    if(users[0].password1 == ""){
        document.getElementById("errors").innerHTML += "Password is required<br>";
        error.push(3);
    }
    if(users[0].password1 !== users[0].password2){
        document.getElementById("errors").innerHTML += "Passwords do not match <br>";
        error.push(4);
    }
    if(error.length == 0){ //if array is populated, doesn't post to server
        //parse user into a string
        var userString = JSON.stringify(users);
        console.log(typeof(userString));
        console.log(userString);
        httpRequest = new XMLHttpRequest();
        if (!httpRequest){
            alert('Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('POST', '../php/register.php', true);
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send('user=' + userString);
        document.getElementById('register').innerHTML = "Account Registered";

    }

