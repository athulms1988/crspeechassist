try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 2;
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
        pickup = $('input#pickup_location').data('id');
        if(count ==1){
            setLocation();
            setTimeout(setPickupDate,5000);
        }
        else if(count == 2){
          noteContent = noteContent.trim();
          noteContent = noteContent.replace("th", "").replace("st", '').replace("nd", '').replace('rd');
          var pickUpdate = getDate(noteContent)
          if(pickUpdate) {
            noteContent = pickUpdate;
            $('#startDateInput').val(noteContent);
            //$('#startDateInput').val('04/04/2020');
            setTimeout(setPickupTime,2000);
          } else {
            count = count -1;
            readOutLoud('Please provide correct pickup Date');
          }
        }
        else if(count == 3){
          noteContent = noteContent.trim();
          var pickUpTime = getTime(noteContent);
          if(pickUpTime) {
            noteContent = pickUpTime;
            document.getElementById("pu-time-select").value = noteContent;
            var dateTime =  $('#startDateInput').val().split('/').reverse().join("-")+'T'+noteContent+':00Z';
            $('input[name="pickup_datetime"]').val(dateTime);
            setTimeout(setDropoffDate,2000);
          } else {
            count = count -1;
            readOutLoud('Please provide correct pickup time');
          }
        }
        else if(count == 4){
          noteContent = noteContent.trim();
          noteContent = noteContent.replace("th", "").replace("st", '').replace("nd", '').replace('rd');
          var dropOffdate = getDate(noteContent)
          if(dropOffdate) {
            noteContent = dropOffdate;
            $('#endDateInput').val(noteContent);
            //$('#startDateInput').val('04/04/2020');
            setTimeout(setDropoffTime,2000);
          } else {
            count = count -1;
            readOutLoud('Please provide correct Dropoff Date');
          }
        }
        else if(count == 5) {
          noteContent = noteContent.trim();
          var dropOffTime = getTime(noteContent);
          if(dropOffTime) {
            noteContent = dropOffTime;
            document.getElementById("do-time-select").value = noteContent;
            var dateTime =  $('#endDateInput').val().split('/').reverse().join("-")+'T'+noteContent+':00Z';
            $('input[name="dropoff_datetime"]').val(dateTime);
            setTimeout(searchClickConfirm,2000);
          } else {
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
  String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
  };

  function getTime(content){
    var timeCheck = content.replace(/\s/g, '');
    var timeArray;
    if(timeCheck.indexOf("p.m") > -1) {
      timeCheck = timeCheck.replace("a", '').replace("p", '').replace("m", '').replaceAll('.','');
      timeArray = timeCheck.split(':');
      if(timeArray.length === 2  && !isNaN(timeArray[0]) && !isNaN(timeArray[0])) {
        timeArray[0] = ""+(parseInt(timeArray[0]) + 12);
        return timeArray.join(":");
      } else {
        return false;
      }
    } else {
      timeCheck = timeCheck.replace("a", '').replace("p", '').replace("m", '').replaceAll('.','');
      timeArray = timeCheck.split(':');
      if(timeArray.length === 2  && !isNaN(timeArray[0]) && !isNaN(timeArray[0])) {
        return timeArray.join(":");
      } else {
        return false;
      }
    }
  }
  function setLocation(){
    pickupLocation.val(noteContent.trim());
    pickupLocation.focus();
    pickupLocation.click();
    setTimeout(function() {
      noteContent = $("a#aria-option-0").text().trim();
      pickupLocation.val(noteContent);
      testPublisher.publish("typeahead.resultSelected", {element: [$("a#aria-option-0")]});
      $(".autocomplete-dropdown.pickup .close")[0].click();
      $(".noDestinationMsg.noDestinationMsg--pickup").removeClass("hidden");
      $(".noDestinationMsg.noDestinationMsg--pickup").addClass("hidden");
    }, 2000);
  }

  function getDate(voiceData) {
    var year = '';
    var month = '';
    var day = '';
    var voiceDataArray = voiceData.split(" ");
    if(voiceDataArray.length === 3) {
      voiceDataArray.forEach(function(voice) {
        if(isNaN(voice)) {
          month = getMonth(voice)
        } else if(parseInt(voice) > 31) {
          year = ""+parseInt(voice);
          if(year.length != 4) {
            year = "2020";
          }
        } else {
          day = ""+parseInt(voice);
          if(day.length === 0) {
            day = "0"+day;
          }
        }
      });
      return day+"/"+month+"/"+year;
    } else {
      return false;
    }
  }

  function getMonth(voice) {
    var month = "04";
    switch(voice.toLowerCase()) {
      case 'january': {
        month = "01";
        break;
      }
      case 'february': {
        month = "02";
        break;
      }
      case 'march': {
        month = "03";
        break;
      }
      case 'april': {
        month = "04";
        break;
      }
      case 'may': {
        month = "05";
        break;
      }
      case 'june': {
        month = "06";
        break;
      }
      case 'july': {
        month = "07";
        break;
      }
      case 'august': {
        month = "08";
        break;
      }
      case 'september': {
        month = "09";
        break;
      }
      case 'october': {
        month = "10";
        break;
      }
      case 'november': {
        month = "11";
        break;
      }
      case 'december': {
        month = "12";
        break;
      }
    }
    return month;
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
    noteContent = '';
    count = 0;
    readOutLoud("Please let me know your pick up location");
  });
  
  

  function init(){
    responsiveVoice.speak("Welcome to the Carrentals Web Site, Please Command Instructions for Searching Your Car.Please click on Icon to give inputs");
  }

  $('#init-speech').on('click',function(){
    readOutLoud("Helloo Please Tell Me your Carrentals Pickup an Dropoff locations");
  });
  
  
  
  /*-----------------------------
        Speech Synthesis 
  ------------------------------*/
  
  function readOutLoud(message) {
    //message = "Hellooo Please Tell Me your Carrentals Pickup an Dropoff locations";
      var speech = new SpeechSynthesisUtterance();
      try {
        recognition.stop();
      } catch(e) {
        
      }
    // Set the text and voice attributes.
      speech.text = message;
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      speech.onend = function(event) {
        try {
          recognition.start();
        } catch(e) {

        }
      }
    
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
  
  