<?php
echo '<table border="1">';
$file = fopen("info.txt", "r") or die("Unable to open file!");
while (!feof($file)){   
    $data = fgets($file); 
    echo "<tr><td>" . str_replace('|','</td><td>',$data) . '</td></tr>';
}
echo '</table>';
fclose($file);

// Check if the form is submitted 
if ( isset( $_POST['submit'] ) ) { // retrieve the form data by using the element's name attributes value as key 
    $paid           = $_POST['paid-form']; 
    $paypal         = $_POST['paypal-form'];
    $Fb_link        = $_POST['facebook-form'];
    $seller_email   = $_POST['email-form'];
    $amazon_link    = $_POST['amazon-form'];
    $refund_type    = $_POST['refund-form'];
    $review         = $_POST['review-form'];

    echo '<h3>Form POST Method</h3>'; echo 'Your name is ' . $lastname . ' ' . $firstname; exit; } 

?>

