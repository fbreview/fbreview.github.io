// Initialize Firebase
var config = {
    apiKey: "AIzaSyD4Km5Qn83--tP7laJ5kN4Ea0OE1yr97Ls",
    authDomain: "fb-review.firebaseapp.com",
    databaseURL: "https://fb-review.firebaseio.com",
    projectId: "fb-review",
    storageBucket: "fb-review.appspot.com",
    messagingSenderId: "363032018748"
};
firebase.initializeApp(config);
//============== Database ==================
// Get a reference to the database service
var database = firebase.database();

//=========================== Variable declaration ==============================
var logoutbtn = document.getElementById("btnlogout");
// This is the new data that is going to be saved in the DB
var newData = [];
newData = {
    product : document.getElementById('add-product'),
    cost : document.getElementById('add-cost'),
    paid : document.getElementById('add-paid'),
    paypal : document.getElementById('add-paypal'),
    facebook : document.getElementById('add-facebook'),
    selleremail : document.getElementById('add-selleremail'),
    amazonLink : document.getElementById('add-amazon'),
    refund : document.getElementById('add-refund'),
    review : document.getElementById('add-review')
};
var AddFieldButton = document.getElementById('add-field');
var SubmitDataButton = document.getElementById('add-data');

//=========== GET parameter, Firstname of user ===============
function getUrlParams( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );
    return ( prop && prop in params ) ? params[ prop ] : params;
}
var firstname = getUrlParams('user');
document.getElementById('welcome-user').innerHTML = "Welcome "+firstname;

// ============= Logout event ====================
logoutbtn.addEventListener('click', function(){
    firebase.auth().signOut().then(function() {
        window.location = 'index.html'; //Go back to index.html
    }).catch(function(error) {
        // An error happened.
    });
});

// =================== Submit new entry ===================
SubmitDataButton.addEventListener('click', function(){
    //get the value of each field
    for (var k in newData){
        if (newData.hasOwnProperty(k)) {
            newData[k] = newData[k].value;
        }
    }
    var now = new Date();
    newData['date'] = now.toLocaleDateString();
    var user = firebase.auth().currentUser;
    var dataref  = database.ref('users/'+user.uid).child('data').push();
    dataref.set(newData);
});

// ===================== Add new field to form ==================
// AddFieldButton.addEventListener('click', function(){
//     $('#AddmodalBody').append()
// });

// var user_email = '';


//Add a realtime listener
firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (!firebaseUser) {
        window.location = 'index.html?user=logout'; // If not logged in, User will get pushed back to index.html
    }else{
        var tableHeader = true;
        var user = firebase.auth().currentUser;
        if (user != null) {
            var db_ref  = database.ref('users/'+user.uid+"/data").orderByChild('date');
            db_ref.on('value', function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    value = childSnapshot.val();
                    //Add table header
                    if (tableHeader) {
                        $('#active-th').empty();
                        for (var key in value) {
                            if (value.hasOwnProperty(key)) {
                                key = capitalizeFirstLetter(key);
                                $('#active-th').append("<th data-title="+key+">"+key+"</th>");
                            }
                        }
                        tableHeader = false;
                    }
                    // Create new row 
                    var tablerow = $('#active-tbody-tr').clone();
                    tablerow.removeClass('d-none');
                    for (var key in value) {
                        if (value.hasOwnProperty(key)) {
                            Capitalkey = capitalizeFirstLetter(key);
                            //Add date to table row
                            tablerow.append("<td data-title="+Capitalkey+">"+value[key]+"</td>");
                        }
                    }
                    $('#active-tbody').append(tablerow);
                });
            });
          }
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showError(errorMessage){
    $("#formAlert").slideUp(400);    // Hide the Alert
    $("#error-message").html("<strong>Error!</strong>&nbsp;"+errorMessage);
    $("#formAlert").slideDown(400);    // Show the Alert
    //Slide to top of the page to show error message
    $('body,html').animate({
        scrollTop: 0
    }, 400);     
}

function writeUserData(userId, name, email, imageUrl) {
    database.ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture : imageUrl
    });
}