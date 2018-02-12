var logoutbtn = document.getElementById("btnlogout");
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

//Logout event
logoutbtn.addEventListener('click', function(){
    firebase.auth().signOut().then(function() {
        window.location = 'index.html'; //Go back to index.html
    }).catch(function(error) {
        // An error happened.
    });
})

var user_email = '';

//============== Database ==================
// Get a reference to the database service
var database = firebase.database();
//Add a realtime listener
firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (!firebaseUser) {
        window.location = 'index.html'; //If not logged in, User will get pushed back to index.html
    }else{
        var user = firebase.auth().currentUser;
        console.log('------------------------------------');
        console.log(user.email);
        console.log('------------------------------------');
        if (user != null) {
            var get  = database.ref('users/'+user.uid);
            get.on('value', function(snapshot) {
               $('#username').html(snapshot.val().displayName); 
            });

            // console.log('------------------------------------');
            // console.log(user);
            // console.log('------------------------------------');
            // user_email = user.email;
            // photoUrl = user.photoURL;
            // emailVerified = user.emailVerified;
            // uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
            //                  // this value to authenticate with your backend server, if
            //                  // you have one. Use User.getToken() instead.
            // console.log('------------------------------------');
            // console.log(user.getToken());
            // console.log('------------------------------------');
          }
    }
});



function writeUserData(userId, name, email, imageUrl) {
    database.ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture : imageUrl
    });
}