setScreen("Startpage");

onEvent("Log", "click", function() {
  setScreen("screen1"); // Log in screen
});

onEvent("SIgn", "click", function() {
  setScreen("Loginscreen"); // Sign-up screen
});

onEvent("button26", "click", function( ) {
  setScreen("Startpage");
});

onEvent("button27", "click", function( ) {
  setScreen("Startpage");
});



// Password validation function
function isValidPassword(password) {
  var minLength = 8;
  var uppercasePattern = /[A-Z]/;
  var specialCharPattern = /[._]/;

  return (
    password.length >= minLength &&
    uppercasePattern.test(password) &&
    specialCharPattern.test(password)
  );
}

// Function to check email uniqueness
function isEmailUnique(email, records) {
  for (var i = 0; i < records.length; i++) {
    if (email === records[i].Email) {
      return false;
    }
  }
  return true;
}

// Sign-up button logic
onEvent("signinbut", "click", function() {
  var Theiremail = getProperty("email", "value");
  var Theirpass = getProperty("password", "value");
  var Reenteredpass = getProperty("ConfirmPassword", "value");

  // Validate password
  if (!isValidPassword(Theirpass)) {
    setText("errorLabel", "Password must be at least 8 characters, include 1 uppercase letter, and either '.' or '_'.");
    return;
  }

  // Check if passwords match
  if (Theirpass !== Reenteredpass) {
    setText("errorLabel", "Passwords do not match.");
    return;
  }

  // Read records to ensure email uniqueness
  readRecords("Accounts", {}, function(records) {
    if (!isEmailUnique(Theiremail, records)) {
      setText("errorLabel", "Email is already registered.");
    } else {
      // Save the new account to the database
      createRecord("Accounts", { Email: Theiremail, Password: Theirpass }, function() {
        setText("errorLabel", ""); // Clear error message
        setProperty("email", "text", ""); // Clear email input
        setProperty("password", "text", ""); // Clear password input
        setProperty("ConfirmPassword", "text", ""); // Clear re-entered password input
        setScreen("screen1"); // Redirect to login screen after successful sign-up
      });
    }
  });
});

// Log in button logic
onEvent("LOGIN", "click", function() {
  var inputEmail = getProperty("Email", "value");
  var inputPass = getProperty("Pass", "value");

  // Fetch account records from the database
  readRecords("Accounts", {}, function(records) {
    var isAuthenticated = false;
    for (var i = 0; i < records.length; i++) {
      if (inputEmail === records[i].Email && inputPass === records[i].Password) {
        isAuthenticated = true;
        setScreen("screen3"); // Redirect to the next screen on successful login
        break;
      }
    }

    // Display error message if authentication fails
    if (!isAuthenticated) {
      setText("label1", "Username or password incorrect.");
      setTimeout(function() {
        setText("label1", "");
      }, 3000);
    }
  });
});




//chat


// Bubble Sort Function
function bubbleSort(arr) {
  var n = arr.length;
  // Loop through all elements in the array
  for (var i = 0; i < n - 1; i++) {
    // Last i elements are already sorted
    for (var j = 0; j < n - i - 1; j++) {
      // Compare and swap if the elements are in the wrong order
      if (arr[j].toLowerCase() > arr[j + 1].toLowerCase()) {
        // Swap arr[j] and arr[j + 1]
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

onEvent("Chat", "click", function() {
  var userEmail = getText("Email");
  if (userEmail !== undefined && userEmail !== "") {
    setScreen("screen6");
    setText("UserEmail", userEmail);
  } else {
    console.log("Email is undefined or empty");
  }
});

onEvent("Options", "click", function() {
  readRecords("Accounts", {}, function(records) {
    var x = [];
    for (var i = 0; i < records.length; i++) {
      appendItem(x, records[i].Email);  // Collect emails from records
    }
    // Sort the emails alphabetically using the bubble sort algorithm
    var sortedEmails = bubbleSort(x);
    setProperty("Options", "options", sortedEmails);  // Set the sorted emails as options
  });
});

onEvent("Send", "click", function() {
  createRecord("Message", {
    Sender: getText("UserEmail"),
    Receiver: getText("Options"),
    Message: getText("text_input1")
  }, function(record) {
    setText("text_input1", "");  // Clear the input after sending
  });
});

onEvent("Receive", "click", function() {
  readRecords("Message", {}, function(records) {
    for (var i = 0; i < records.length; i++) {
      if (records[i].Sender == getText("Options") && records[i].Receiver == getText("UserEmail")) {
        setText("text_area1", records[i].Message);  // Display received message
      }
    }
  });
});

onEvent("button13", "click", function( ) {
  setScreen("screen3");
});


var Note_title, note_content, note_id;

onEvent("Notesbut", "click", function() {
  setScreen("screen2");
});

onEvent("button3", "click", function() {
  setScreen("screen5");
});

onEvent("subnot", "click", function() {
  Note_title = getText("Note_title_input");
  note_content = getText("note_content_input");
  createRecord("Notes", {Note_title: Note_title, note_content: note_content}, function(record) {
    console.log("Note created with ID: " + record.id);
    setScreen("screen3");
  });
});

onEvent("button24", "click", function() {
  setScreen("screen3");
});

onEvent("viewnotesbutton", "click", function() {
  setScreen("screen9");
  
  // Clear previous labels and buttons
  for (var j = 0; j < 10; j++) { // Assuming up to 10 notes
    deleteElement("note" + j);
    deleteElement("notebutton" + j);
  }

  var noteLabel, yPos, buttonid, buttonText;
  
  // Read all notes from the database
  readRecords("Notes", {}, function(records) {
    for (var i = 0; i < records.length; i++) {
      console.log(records[i].id + ': ' + records[i].Note_title);
      
      // Create a label to display the note title with a unique id
      noteLabel = "note" + i;
      textLabel(noteLabel, records[i].Note_title);
      yPos = 27 + (i * 30);
      setPosition(noteLabel, 20, yPos, 220, 20);
      
      // Create a button for each note with a unique id
      buttonid = "notebutton" + i;
      buttonText = "View Note " + records[i].id;
      // First, ensure that the button exists (create it dynamically if needed)
      if (!getText(buttonid)) {
        // Create the button only if it doesn't exist
        button(buttonid, buttonText);
      }
      
      // Set the properties for the button
      setText(buttonid, buttonText);
      setPosition(buttonid, 200, yPos, 100, 20);
      setProperty(buttonid, "hidden", false);

      // Dynamically assign event listeners for each button
      addNoteClickListener(buttonid, records[i].id);
    }
  });
});

// Function to dynamically add event listeners for note buttons
function addNoteClickListener(buttonId, note_id) {
  onEvent(buttonId, "click", function() {
    console.log("Clicked button for note ID: " + note_id);

    // Navigate to the note content screen
    setScreen("note_content_screen");

    // Read the selected note from the database by ID
    readRecords("Notes", {id: note_id}, function(records) {
      if (records.length > 0) {
        setText("nnote_title", records[0].Note_title);
        setText("nnote_content", records[0].note_content);
      } else {
        setText("nnote_title", "Note not found");
        setText("nnote_content", "");
      }
    });
  });
}



onEvent("button4", "click", function() {
  setScreen("screen3");
});

onEvent("button5", "click", function() {
  setScreen("screen5");
});

onEvent("B2notes", "click", function( ) {
  setScreen("screen9");
});





// Event listener for when the "Quote" button is clicked
onEvent("Quotebut", "click", function() {
  // Switch to the screen where the quote will be displayed
  setScreen("screen10");
  
  // Array of quotes (you can add more quotes if you'd like)
  var Quote = ["Success is no accident", "Stay positive, work hard", "Believe in yourself","Comparing yourself to others will only fog up the path to success","You miss 100% of the shots you dont take"];

  // Randomly select a quote from the array (optional)
  var randomIndex = Math.floor(Math.random() * Quote.length);
  var selectedQuote = Quote[randomIndex];

  // Set the selected quote to the 'quoteLabel' element
  setText("quoteLabel", selectedQuote);
  
  // Optional: Log the selected quote to the console for debugging
  console.log(selectedQuote);
});

// Example function to position the elements correctly
function setUpQuotePage() {
  
  // Set up the position of the "quoteLabel" just under the title (for example, y = 100)
  setPosition("quoteLabel", 10, 100, 300, 40); // Adjust x, y, width, and height as needed
}

// Call this function on screen load or setup
setUpQuotePage();

onEvent("button28", "click", function( ) {
  setScreen("screen3");
});



onEvent("Games", "click", function( ) {
  setScreen("screen7");
});
onEvent("button15", "click", function( ) {
  open("https://kidshelpline.com.au/games/thinking-brain");
});
onEvent("button16", "click", function( ) {
  open("https://www.crazygames.com/");
});
onEvent("button17", "click", function( ) {
  open("https://declutterthemind.com/blog/anxiety-relief-games/");
});
onEvent("button18", "click", function( ) {
  setScreen("screen3");


});

onEvent("Dailyac", "click", function( ) {
  setScreen("screen4");
});

onEvent("Dailyac2", "click", function( ) {
  setScreen("screen11");
onEvent("button11", "click", function( ) {
  setScreen("screen3");
});

onEvent("button9", "click", function( ) {
  setScreen("screen12");
onEvent("button10", "click", function( ) {
  setScreen("screen4");
});

onEvent("button12", "click", function( ) {
  setScreen("screen11");

  
});

onEvent("button11", "click", function( ) {
  setScreen("screen3");
});

});


  
});


