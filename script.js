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
            pickupLocation.val(noteContent);
            $("#pickup_location").focus();
            $("#pickup_location").click();
            setTimeout(setLocation,3000); 
            setTimeout(setDate,5000);
        }
        else if(count == 2){
            startDate.val(noteContent);
        }
        else if(count == 3){
            pickupDatetime.val(noteContent);
        }
           
      
        //setTimeout(setTime,7000);
    }
  };
  function setLocation(){
    $('#pickup-typeahead-list .results-item')[0].click()    
  }

  function setDate(){
    responsiveVoice.speak("Please Let me know ur date for travel");
  }
  function setTime(){
    responsiveVoice.speak("Please Let me know ur Time of travel");
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
      debugger;
    if (noteContent.length) {
      noteContent += ' ';
    }
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
    message = "Hellooo Please Tell Me your Carrentals Pickup an Dropoff locations";
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
  
  