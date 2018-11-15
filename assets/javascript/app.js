$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyDjBeBAy2UHLesNMBmzF5SoE4OE5ywvlaA",
        authDomain: "trainscheduler-6b4da.firebaseapp.com",
        databaseURL: "https://trainscheduler-6b4da.firebaseio.com",
        projectId: "trainscheduler-6b4da",
        storageBucket: "trainscheduler-6b4da.appspot.com",
        messagingSenderId: "769903848979"
    };
    firebase.initializeApp(config);
    
    var database = firebase.database()
    
    var name = ""
    var destination = ""
    var time
    var frequency
    var newArrivalTime
    var nextTrain
    
    var d = new Date()
    
    

    $("#add-train").on("click", function(e){
        e.preventDefault()
    
        name = $("#name").val().trim()
        destination = $("#destination").val().trim()
        time = $("#time").val()
        frequency = $("#frequency").val()
    
        database.ref().push({
            name: name,
            destination: destination,
            time: time,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    })

    function timeDiff(start, end, freq){
        var diff
        var startSplit = start.split(":")
        var endSplit = end.split(":")
        
        var startTotal = (parseInt(startSplit[0])*60)+parseInt(startSplit[1])
        var endTotal = (parseInt(endSplit[0])*60)+parseInt(endSplit[1])
        
        if(endTotal < startTotal){
            diff = (24*60)-startTotal + endTotal
            
        } else {
            diff = endTotal - startTotal
            
        }
        // newArrivalTime = normalizeTime(endTotal +)
        return (diff%parseInt(freq))+parseInt(freq)
        // console.log(minutesAway);
        
    }
    function normalizeTime(minToAdd, end){
        var endSplit = end.split(":")
        var endTotal = (parseInt(endSplit[0])*60)+parseInt(endSplit[1])
        var hoursLeftover = Math.floor((minToAdd+endTotal)/60)
        if(hoursLeftover > 12){
            hoursLeftover = hoursLeftover-12
        }
        var minLeftover = (minToAdd+endTotal)%60
        return hoursLeftover + ":" + minLeftover
    }
    
    database.ref().on("child_added", function(snapshot, prevChildKey){
        var newData = snapshot.val()
        var currentTime = d.getHours() + ":" + d.getMinutes()
        var minToNext = timeDiff(newData.time, currentTime, newData.frequency)
        
        
        $("#train-table").append("<tr>"+
        "<td>"+newData.name+"</td>"+
        "<td>"+newData.destination+"</td>"+
        "<td>"+newData.frequency+"</td>"+
        "<td>"+ normalizeTime(minToNext, currentTime) +"</td>"+
        "<td>"+minToNext+"</td>"+
        "<td></td>")
    
    })
    
    })