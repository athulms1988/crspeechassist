try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    init();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
  var noteTextarea = $('#note-textarea');
  var pickupLocation = $('#pickup_location');
  var dropoffLocation = $('#dropoff_location');
  var pickupDatetime = $('#pickup_datetime')
  var startDate = $('#startDate');
  var dropoffDatetime = $('#dropoff_datetime')
  var searchButton = $('.search-button');
  var instructions = $('#recording-instructions');
  var notesList = $('ul#notes');
  var count = 0;
  
  var noteContent = '';
  
  // Get all notes from previous sessions and display them.
  var notes = getAllNotes();
  renderNotes(notes);
  
  
  
  /*-----------------------------
        Voice Recognition 
  ------------------------------*/
  
  // If false, the recording will stop after a few seconds of silence.
  // When true, the silence period is longer (about 15 seconds),
  // allowing us to keep recording even when the user pauses. 
  recognition.continuous = true;
  
  // This block is called every time the Speech APi captures a line. 
  recognition.onresult = function(event) {
  
    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;
  
    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;
  
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
  
    if(!mobileRepeatBug) {
        count = count+1;
        noteContent = transcript;
        $targetInputPickup = $('input[name="pickup_location"]');
        pickup = $('input#pickup_location').data('id')
        if(count ==1){
            noteContent = noteContent.trim();
            pickupLocation.val(noteContent);
            $("#pickup_location").focus();
            $("#pickup_location").click();
            setTimeout(setLocation,2500); 
            setTimeout(setPickupDate,5000);
        }
        else if(count == 2){
          noteContent = noteContent.trim();
          noteContent = noteContent.replace(/\s/g, '/');
          if(noteContent.length!==10){
            count = count -1;
            readOutLoud('Please provide correct pickup Date');
          }
          else{
            $('#startDateInput').val(noteContent);
            //$('#startDateInput').val('04/04/2020');
            setTimeout(setPickupTime,2000);
          }
         
        }
        else if(count == 3){
            noteContent = noteContent.replace(/\s/g, '').substr(0,5);
            if(noteContent.length!== 5){
              count = count -1;
              readOutLoud('Please provide correct pickup time');
            }
            else{
              document.getElementById("pu-time-select").value = noteContent
              var dateTime =  $('#startDateInput').val().replace(/\//g, '-')+'T'+noteContent+':00Z';
              $('input[name="pickup_datetime"]').val(dateTime);
              setTimeout(setDropoffDate,2000);
            }
           
        }
        else if(count == 4){
          noteContent = noteContent.trim();
          noteContent = noteContent.replace(/\s/g, '/');
          if(noteContent.length!==10){
            count = count -1;
            readOutLoud('Please provide correct Dropoff Date');
          }
          else if(noteContent.length==10){
            $('#endDateInput').val(noteContent);
            setTimeout(setDropoffTime,2000);
          }
         
      }
      else if(count == 5){
        noteContent = noteContent.replace(/\s/g, '').substr(0,5);
       
        if(noteContent.length == 5){
          document.getElementById("do-time-select").value = noteContent
          var dateTime =  $('#endDateInput').val().replace(/\//g, '-')+'T'+noteContent+':00Z';
          $('input[name="dropoff_datetime"]').val(dateTime);
          setTimeout(searchClickConfirm,2000);
        }
        else if(noteContent.length!== 5){
          count = count -1;
          readOutLoud('Please provide correct Dropoff time');
        }
       
    }
    else if(count == 6){
      if(noteContent.includes("yes")){
       

        count = 0;
        readOutLoud('Please wait for the search result');
        setTimeout(searchClick,2000);
      }
      else if(noteContent.includes("no")){
        count = 0;
        readOutLoud('Please Click on the Icon to change the inputs');
      }
  }
           
      
        //setTimeout(setTime,7000);
        //$('input[name="pickup_datetime"]').val("2021-03-31T10:00:00Z");
        //$('#startDateInput').val('04/04/2020');
        //$('#endDateInput').val('04/06/2020');

        
    }
  };
  function setLocation(){
    //$('#pickup-typeahead-list .results-item')[0].click()   
   // $('#pickup-typeahead-list').blur(); 
    //$('#pickup-typeahead-list').click();
    $('#pickup_location').focusout();
    $('#pickup_location').click();
    $('#hero-image').focus();
    //$('#pickup-typeahead-list.results .results-item')[0].click();
  }

  function setPickupDate(){
    console.log('pickup date');
    readOutLoud("Please Let me know ur pickup date for your travel");
    //responsiveVoice.speak("Please Let me know ur pickup date for your travel");
  }
  function setPickupTime(){
    console.log('pickup time');
    readOutLoud("Please Let me know ur Time for your travel");
  }
  function setDropoffDate(){
    console.log('dropoff date');
    readOutLoud("Please Let me know ur Dropoff date for your travel");
  }
  function setDropoffTime(){
    console.log('dropoff time');
    readOutLoud("Please Let me know ur Dropoff time for your travel ");
  }
  function searchClickConfirm(){
    console.log('confirm search ');
    readOutLoud("Are you confirming the details?");
  }

  function searchClick(){
    console.log(' search click ');
    $('.search-button').click();
  }

  recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
  }
  
  recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
  }
  
  recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
      instructions.text('No speech was detected. Try again.');  
    };
  }
  
  
  
  /*-----------------------------
        App buttons and input 
  ------------------------------*/
  
  $('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
      noteContent += ' ';
    }
    readOutLoud("Please Let me know  Your travel Location");
    recognition.start();
  });
  
  
  $('#pause-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Voice recognition paused.');
  });

  // Sync the text inside the text area with the noteContent variable.
  noteTextarea.on('input', function() {
    noteContent = $(this).val();
  })
  
  $('#save-note-btn').on('click', function(e) {
    recognition.stop();
  
    if(!noteContent.length) {
      instructions.text('Could not save empty note. Please add a message to your note.');
    }
    else {
      // Save note to localStorage.
      // The key is the dateTime with seconds, the value is the content of the note.
      saveNote(new Date().toLocaleString(), noteContent);
  
      // Reset variables and update UI.
      noteContent = '';
      renderNotes(getAllNotes());
      noteTextarea.val('');
      instructions.text('Note saved successfully.');
    }
        
  })
  
  
  notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);
  
    // Listen to the selected note.
    if(target.hasClass('listen-note')) {
      var content = target.closest('.note').find('.content').text();
      readOutLoud(content);
    }
  
    // Delete note.
    if(target.hasClass('delete-note')) {
      var dateTime = target.siblings('.date').text();  
      deleteNote(dateTime);
      target.closest('.note').remove();
    }
  });

  function init(){
    responsiveVoice.speak("Welcome to the Carrentals Web Site, Please Command Instructions for Searching Your Car");
  }

  $('#init-speech').on('click',function(){
    initSpeech();
  });
  
  
  
  /*-----------------------------
        Speech Synthesis 
  ------------------------------*/
  
  function readOutLoud(message) {
    //message = "Hellooo Please Tell Me your Carrentals Pickup an Dropoff locations";
      var speech = new SpeechSynthesisUtterance();
  
    // Set the text and voice attributes.
      speech.text = message;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
    
      window.speechSynthesis.speak(speech);
  }

  function initSpeech(){
    message = "Helloo Please Tell Me your Carrentals Pickup an Dropoff locations";
    var speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);

  }
  
  
  
  
  /*-----------------------------
        Helper Functions 
  ------------------------------*/
  
  function renderNotes(notes) {
    var html = '';
    if(notes.length) {
      notes.forEach(function(note) {
        html+= `<li class="note">
          <p class="header">
            <span class="date">${note.date}</span>
            <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
            <a href="#" class="delete-note" title="Delete">Delete</a>
          </p>
          <p class="content">${note.content}</p>
        </li>`;    
      });
    }
    else {
      html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
  }
  
  
  function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
  }
  
  
  function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
  
      if(key.substring(0,5) == 'note-') {
        notes.push({
          date: key.replace('note-',''),
          content: localStorage.getItem(localStorage.key(i))
        });
      } 
    }
    return notes;
  }
  
  
  function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime); 
  }
  
  