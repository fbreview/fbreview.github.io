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


//Show tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

//=========================== Variable declaration ==============================
var logoutbtn = document.getElementById("btnlogout");
var database  = firebase.database();  // Get a reference to the database service
// This is the new data that is going to be saved in the DB
// Key name is prepended with character_ so it gets saved alphabatically in firebase database. "a_" is reserved for date
var newData = [];
newData = {
    b_product : document.getElementById('add-product'),
    c_cost : document.getElementById('add-cost'),
    d_paid : document.getElementById('add-paid'),
    e_recieved : document.getElementById('add-recieved'),
    f_sellerName : document.getElementById('add-sellername'),
    g_sellerEmail : document.getElementById('add-selleremail'),
    h_amazonLink : document.getElementById('add-amazon'),
    i_refund : document.getElementById('add-refund'),
    j_review : document.getElementById('add-review'),
    k_note : document.getElementById('add-note')
};

var editedData = [];
editedData = {
    a_date : document.getElementById('edit-date'),
    b_product : document.getElementById('edit-product'),
    c_cost : document.getElementById('edit-cost'),
    d_paid : document.getElementById('edit-paid'),
    e_recieved : document.getElementById('edit-recieved'),
    f_sellerName : document.getElementById('edit-sellername'),
    g_sellerEmail : document.getElementById('edit-selleremail'),
    h_amazonLink : document.getElementById('edit-amazon'),
    i_refund : document.getElementById('edit-refund'),
    j_review : document.getElementById('edit-review'),
    k_note : document.getElementById('edit-note')
};
var AddFieldButton = document.getElementById('add-field');
var SubmitNewDataButton = document.getElementById('add-data');
var SubmitEditDataButton = document.getElementById('edit-data-button');
var currentRowKey = '';


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

// ================== Logout event ========================
logoutbtn.addEventListener('click', function(){
    firebase.auth().signOut().then(function() {
        window.location = 'index.html'; //Go back to index.html
    }).catch(function(error) {
        // An error happened.
    });
});

// ===================== Submit new entry =====================
SubmitNewDataButton.addEventListener('click', function(){
    //get the value of each field
    for (var k in newData){
        if (newData.hasOwnProperty(k)) {
            newData[k] = newData[k].value;
        }
    }
    var now     = new Date(),
        minutes = now.getMinutes().toString().length == 1 ? '0'+now.getMinutes() : now.getMinutes(),
        hours   = now.getHours().toString().length == 1 ? '0'+now.getHours() : now.getHours(),
        ampm    = now.getHours() >= 12 ? 'pm' : 'am';
    if (hours > 12) {
        hours = hours - 12;
    }
    newData['a_date'] = now.toLocaleDateString()+" "+hours+":"+minutes+" "+ampm;
    var user = firebase.auth().currentUser;
    var dataref  = database.ref('users/'+user.uid).child('data').push();
    dataref.set(newData);
});

// ===================== Edit the old entry =====================
SubmitEditDataButton.addEventListener('click', function(){
    //get the value of each field
    editedDataArray = {};
    for (var k in editedData){
        if (editedData.hasOwnProperty(k)) {
            editedDataArray[k] = editedData[k].value;
        }
    }
    console.log('------------------------------------');
    console.log(editedDataArray);
    console.log('------------------------------------');
    var updates = {};
    var user = firebase.auth().currentUser;
    updates['users/'+user.uid+"/data/"+currentRowKey] = editedDataArray;
    database.ref().update(updates, function(error) {
        console.log('----------------error--------------------');
        console.log(error);
        console.log('------------------------------------');
        // showAlert('alert-danger', "Cannot update data right now. Please try again later.");
    });
    // showAlert('alert-success', "Successfully updated!");
    $('#EditModal').modal('hide');
});

// ===================== Add new field to form ==================
// AddFieldButton.addEventListener('click', function(){
//     $('#AddmodalBody').append()
// });


//Add a realtime listener
firebase.auth().onAuthStateChanged(function(firebaseUser) {
    if (!firebaseUser) {
        window.location = 'index.html?user=logout'; // If not logged in, User will get pushed back to index.html
    }else{
        var tableHeaderBool = true; 
        var table_header    = [];  
        var table_data      = [];
        var table_rowID     = [];
        var user            = firebase.auth().currentUser;
        if (user != null) {
            var db_ref  = database.ref('users/'+user.uid+"/data");
            db_ref.on('value', function(snapshot) {
                table_data = [];
                snapshot.forEach(function(childSnapshot) {
                    var value = childSnapshot.val();                    
                    var table_row = [];
                    var current_row_index = table_data.length;
                    table_rowID.push(childSnapshot.key);
                    // Create new row 
                    for (var key in value) {
                        if (value.hasOwnProperty(key)) {
                            Capitalkey = capitalizeFirstLetter(key);
                            if (tableHeaderBool) {
                                table_header.push({title: Capitalkey});
                            }
                            switch (Capitalkey) {
                                case "FacebookLink":
                                case "AmazonLink":
                                    table_row.push("<a class='d-inline td-access"+current_row_index+"' href="+value[key]+">"+value[key]+"</a>");
                                    break;
                                case "SellerEmail":
                                    table_row.push("<a class='d-inline td-access"+current_row_index+"' href=mailto:"+value[key]+">"+value[key]+"</a>");
                                    break;
                                default:
                                    table_row.push("<div class='d-inline td-access"+current_row_index+"'>"+value[key]+"</div>");
                                    break;
                            }
                        }
                    }
                    if (tableHeaderBool) {
                        table_header.push({title: "Edit"});
                    }
                    table_row.push("<button class='btn btn-primary' onClick='editmodal(\""+childSnapshot.key+"\","+current_row_index+")'>Edit</button>");    //Add the edit button to the column
                    tableHeaderBool = false;
                    table_data.push(table_row);
                });
                if (table_data.length > 0) {
                    if ( $.fn.dataTable.isDataTable( '#active-table' ) ) {
                        datatable = $('#active-table').DataTable();
    
                        datatable.clear().draw();
                        datatable.rows.add(table_data); // Add new data
                        datatable.columns.adjust().draw(); // Redraw the DataTable
    
                        // $('#active-table').DataTable().fnClearTable().fnAddData(table_data);
    
                    }else{
                        // Add all the data into datatables
                        $('#active-table').DataTable( {
                            columns: table_header,
                            data: table_data,
                            "order": [[ 0, "desc" ]],
                            "createdRow": function( row, data, dataIndex){
                                $(data[3]).text() ==  `No` ? $(row).addClass('text-white bg-danger') : null;  // when paid = No
                                $(data[3]).text() ==  `Not Fully` ? $(row).addClass('bg-warning') : null;   // when paid = Not Fully
                                $(row).attr('id', table_rowID[dataIndex]); // set id as key to data inside firebase DB
                            },
                            "initComplete": function(settings, json) {
                                $('.boxLoading').hide();
                            }
                        } );
                    }
                }else{
                    $(".NoData").show();
                    $('.boxLoading').hide();
                }
            });
        }
    }
});

/* 
   When edit button is clicked, this function will populate the new modal with data
** RowKey : Used to point this data in firebase database
** row_index : Used to point this data in datatables table
*/
function editmodal(RowKey, row_index){
    // var parentRow = elem.closest('tr');
    currentRowKey = RowKey;   // This will be used to search that data in firebase DB
    var rowDATA = []
    //Grab data from current row
    $('.td-access'+row_index).each(function(i, obj){
        rowDATA.push(obj.innerText);
    });
    //Enter that data into the edit data modal
    $(".edit-Modaldata").each(function(i, obj){
        if (obj.nodeName.toLowerCase() === 'select') {
            for (var j = 0; j < obj.options.length; j++) {
                console.log('------------------------------------');
                console.log(obj.options[j].value);
                console.log(rowDATA[i]);
                console.log('------------------------------------');
                if (obj.options[j].value === rowDATA[i]) {
                    obj.selectedIndex = j;
                    break;
                }
            }
        }else{
            obj.value = rowDATA[i];
        }
    });
    $('#EditModal').modal('show');
}

function capitalizeFirstLetter(string) {
    //First remove everything before "_"(underscore)
    string = string.substring(string.indexOf("_")+1, string.length);
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showAlert(classname, errorMessage){
    $("#formAlert").slideUp(400);    // Hide the Alert
    $("#formAlert").addClass(classname).removeClass('alert-danger');
    $("#error-message").html("<strong>Error!</strong>&nbsp;"+errorMessage);
    $("#formAlert").slideDown(400);    // Show the Alert
    //Slide to top of the page to show error message
    $('body,html').animate({
        scrollTop: 0
    }, 400);     
}
