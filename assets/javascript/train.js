// Initialize Firebase
var config = {
    apiKey: "AIzaSyAeYxJYUZ7Es4lVIRdqcIqp55eSRXR9qsA",
    authDomain: "traintime-b3f7b.firebaseapp.com",
    databaseURL: "https://traintime-b3f7b.firebaseio.com",
    storageBucket: "traintime-b3f7b.appspot.com",
    messagingSenderId: "1046597430249"
};
firebase.initializeApp(config);

var database = firebase.database();

//on click for submit btn

$("#submit-btn").on("click", function(event) {
    event.preventDefault();

    //get value from input, keep neat with trim 
    var trainName = $("#new-train-name").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    //store user input
    var newTrain = {
        name: trainName,
        goingTo: destination,
        trainStarts: firstTrain,
        howOften: frequency
    };

    //push data to database
    database.ref().push(newTrain);


    //clear
    $("#new-train-name").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
    // stop from going to new page
    return false;
});

// event to add new trains

database.ref().on("child_added", function(childSnapshot) {

    // store new data
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().goingTo;
    var firstTrain = childSnapshot.val().trainStarts;
    var frequency = childSnapshot.val().howOften;

    //moment conversion for theads 

    var convers = moment(firstTrain, "HH:mm");
    var nowTime = moment();
    var diffTime = moment().diff(convers, "minutes");
    var remain = diffTime % frequency;
    var timeAway = frequency - remain;
    var nextTime = moment().add(timeAway, "minutes");
    var nextTrain = moment(nextTime).format("HH:mm");

    // append to html

    $("#new-train-table").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + nextTrain + "</td><td>" + timeAway + "</td><td class='col-xs-1'>" +
        "<input type='submit' value='Remove' class='remove-train btn btn-primary btn-sm'>" +
        "</td>" + "</tr>");

    // handle errors

}, function(errorObject) {});

//if time: remove train btn

$("body").on("click", ".remove-train", function() {
    $(this).closest("tr").remove();
});
database.ref().on("child_removed", function(childSnapshot) {
    $(this).closest("tr").remove();
});
