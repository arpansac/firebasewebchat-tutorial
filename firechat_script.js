//Create a Firebase Reference to enable read/write operations from/to your Firebase Database
var myRef = new Firebase('https://intense-inferno-1504.firebaseio.com/');

// STEP 3: Grab all the form elements which will be used to send the message to firebase
var username = null;
var google_login_button = $('#google_login');
var message_input = $('#text');
var send_button = $('#post');
var results = $('#results');


// A login popup will be displayed when the google login button is clicked
google_login_button.click(function() {

  myRef.authWithOAuthPopup("google", function(error, authData) {
  	
  	if(error){
  		console.log('login failed');
  	}else{
      username =  authData.google.displayName;

      send_button.html("Post as " + username);

      // enable the post message button
      send_button.attr('disabled', false);

      // disable the login button
      google_login_button.attr('disabled', 'true');

    }

  }, {remember: "none"}  // this will end authentication when the page is closed

  );

});

//Add an event listener to the post button which will be used to send the message to your Firebase database
send_button.click(function() {

	var message = message_input.val();
	myRef.push({
		user: username,
		text: message
	});
	message_input.val('');
});


// Display the previous messages only when the user is authenticated
myRef.onAuth(function(authData) {

  if (authData) { // user has authenticated
		myRef.on('child_added', function(snapshot) {
			msg = snapshot.val();

			// create a new div and append the user and text from the snapshot to it
			var new_message = $('<div/>');
			new_message.append('<p><strong>' + msg.user + '</strong></p><p>' + msg.text + '</p>');
			// add a class for styling purposes
			new_message.addClass('msg');

			// to differentiate between your messages and someone else's messages, we'll add a class 'me'
			// to your messages and style them accordingly
			new_message.addClass(msg.user == username ? ' me' : '')

			$("#results").append(new_message);

			$("#results").animate({scrollTop: $('#results')[0].scrollHeight});
			
		});
	}
});

