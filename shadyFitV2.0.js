function clearElement() {
  //----------------------------------------------------//
  //Clears the innerHTML of an element or elements      //
  //element-> arguments[n]: element to be cleared       //
  //----------------------------------------------------//

  for (let i = 0; i < arguments.length; i++) {
    arguments[i].innerHTML = "";
  }
}

function insertTextNode(element, text) {
  //----------------------------------------------------//
  //Inserts text into an element without erasing the    //
  //  previous text                                     //
  //element-> element: element to be inserted into      //
  //string-> text: text to insert                       //
  //----------------------------------------------------//

  let node = document.createTextNode(text);
  element.appendChild(node);
}

function makeDiv() {
  //----------------------------------------------------//
  //Makes a <div> element and assigns it an id and class//
  //string-> arguments[0]: id of the element            //
  //  "   -> arguments[1+]: classes of the element      //
  //----------------------------------------------------//

  let div = document.createElement("div");
  if (arguments.length > 0) {div.id = arguments[0]}
  if (arguments.length > 1) {
    for (let i = 1; i < arguments.length; i++) {
      div.classList.add(arguments[i]);
    }
  }
  return div;
}

function makeImg(src) {
  //----------------------------------------------------//
  //Makes an <img> element and gives it a path, id,     //
  //  and classes                                       //
  //string-> src: path to the image file                //
  //  "   -> arguments[1]: id of the element            //
  //  "   -> arguments[2+]: classes of the element      //
  //----------------------------------------------------//

  let img = document.createElement("img");
  img.src = src;
  if (arguments.length > 1) {
    img.id = arguments[1];
  }
  if (arguments.length > 2) {
    for (let i = 2; i < arguments.length; i++) {
      img.classList.add(arguments[i]);
    }
  }
  return img;
}

function makeButton(callback, text, id = "") {
  //----------------------------------------------------//
  //Makes a <button> element, assigns it an onclick     //
  //  function, a label, an id, and classes             //
  //function-> callback: function to call when the      //
  //  button is clicked                                 //
  //string-> text: text on the button                   //
  //  "   -> id: id of the button                       //
  //  "   -> arguments[3+]: classes of the button       //
  //----------------------------------------------------//

  const button = document.createElement("button");
  insertTextNode(button, text);
  button.type = "button";
  button.onclick = callback;
  button.id = id;
  if (arguments.length > 3) {
    for (let i = 3; i < arguments.length; i++) {
      button.classList.add(arguments[i]);
    }
  }
  return button;
}

function makeTime(ms) {
  //----------------------------------------------------//
  //Converts a millisecond value into a minutes, seconds//
  //  and milliseconds format                           //
  //integer-> ms: millisecond value to convert          //
  //----------------------------------------------------//

  let minutes = Math.floor(ms / 60000);
  let seconds = Math.floor(ms / 1000) % 60;
  seconds = (seconds > 9) ? "" + seconds : "0" + seconds;
  let milliseconds = (ms % 100).toFixed(0, 10);
  return minutes + ":" + seconds + "<span id=\"milliseconds\">" + milliseconds + "</span>";
}

function shadyFit() {
  //----------------------------------------------------//
  //Sets up the initial screen for the user             //
  //----------------------------------------------------//

  const showWorkouts = function(workoutList) {

    const showWorkout = function(index) {

      let workoutName = document.getElementById("workoutName");
      if (!workoutName) {
        workoutName = makeDiv("workoutName");
      }
      //let workoutName = makeDiv("workoutName");
        workoutName.textContent = workoutList[index].name;
      workoutWindow.insertBefore(workoutName, buttons);

      let workoutOverview = document.getElementById("workoutOverview");
      if (!workoutOverview) {
        workoutOverview = makeDiv("workoutOverview");
      } else {
        clearElement(workoutOverview);
      }
      //let workoutOverview = makeDiv("workoutOverview");

      for (let i = 0; i < workoutList[index].names.length; i++) {
        let exSummary = makeDiv("", "workoutSummary");

          let exNumber = makeDiv("", "summaryNumber");
            exNumber.textContent = workoutList[index].counts[i];
          exSummary.appendChild(exNumber);

          let summaryExercise = makeDiv("", "summaryExercise");
            summaryExercise.textContent = workoutList[index].names[i];
          exSummary.appendChild(summaryExercise);

        workoutOverview.appendChild(exSummary);
      }
      workoutWindow.insertBefore(workoutOverview, buttons);
    }

    let workoutIndex = 0;

    clearElement(workoutWindow);

    /*let workoutName = makeDiv("workoutName");
      workoutName.textContent = workoutList[0].name;
    workoutWindow.appendChild(workoutName);

    let workoutOverview = makeDiv("workoutOverview");

    for (let i = 0; i < workoutList[0].names.length; i++) {
      let exSummary = makeDiv("", "workoutSummary");

        let exNumber = makeDiv("", "summaryNumber");
          exNumber.textContent = workoutList[0].counts[i];
        exSummary.appendChild(exNumber);

        let summaryExercise = makeDiv("", "summaryExercise");
          summaryExercise.textContent = workoutList[0].names[i];
        exSummary.appendChild(summaryExercise);

      workoutOverview.appendChild(exSummary);
    }
    workoutWindow.appendChild(workoutOverview);*/
    //showWorkout(workoutIndex);

    let buttons = makeDiv("buttons");
      let next = makeDiv("next", "buttons");
        next.textContent = "Next";
        next.onclick = function() {
          //workoutIndex++
          workoutIndex = (workoutIndex === workoutList.length - 1) ? 0 : (workoutIndex + 1);
          showWorkout(workoutIndex % workoutList.length);
        }
    buttons.appendChild(next);
      let prev = makeDiv("prev", "buttons");
        prev.textContent = "Prev";
        prev.onclick = function() {
          workoutIndex = (workoutIndex === 0) ? (workoutList.length - 1) : (workoutIndex - 1);
          showWorkout(workoutIndex);
        }
    buttons.appendChild(prev);

    workoutWindow.appendChild(buttons);

    showWorkout(workoutIndex);

    startButton.textContent = "Start Workout";
    startButton.onclick = function() {
      fetch(workoutList[workoutIndex].src)
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          let exerciseSet = myJson;
          exercises = Object.values(exerciseSet);
          let totalSets = exercises.shift();
          startWorkout(totalSets);
        });
    }
  }
  //
  //Starts the workout logic
  function startWorkout(totalSets) {
    //
    //Shows the individual exercise
    function showExercise(data) {

      exerciseCount++;
      //
      //Change the text of the button based on context
      if (exerciseCount === 6 && sets === 3) {
        startButton.textContent = "Finish";
      } else if (exerciseCount === 6) {
        startButton.textContent = "Rest";
      } else {
        startButton.textContent = "Next Exercise";
      }

      //
      //Uses the data to fill the workoutWindow
      setCountBox.style.filter = "opacity(100%)";
      setCount.textContent = `${sets} / ${totalSets}`;
      exerciseImg.src = data.src + data.images[0];
      exerciseNumber.textContent = data.count;
      exerciseName.textContent = data.name;

      //
      //Puts the elements on the screen
      workoutWindow.appendChild(exercisePreview);
      workoutWindow.appendChild(exerciseInfo);
      workoutWindow.appendChild(timerDiv);

      //
      //Cycles between the workout preview images
      //  every half second
      let imgCount = 0;
      clearInterval(exImg);
      exImg = setInterval(function() {
        imgCount++;
        exerciseImg.src = data.src + data.images[imgCount % data.images.length];
      }, 500);

      //
      //Updates the timer aproximately every 50 ms
      clearInterval(timer);
      timer = setInterval(function() {
        let timeCheck = new Date();
        let timeElapsed = (timeCheck - workoutStartTime);
        timerDiv.innerHTML = makeTime(timeElapsed);
      }, 50);
    }
    //
    //The rest between exercise sets
    function exerciseRest(time) {
      exerciseCount = 0;
      //
      //Sets up the rest screen
      startButton.textContent = "Next Exercise";
      setCountBox.style.filter = "opacity(0%)";
      exerciseImg.src = "water.png";
      exerciseNumber.textContent = "2 min";
      exerciseName.textContent = "Take a break";
      clearInterval(exImg);
      clearInterval(timer);

      let restTimerStart = new Date();

      //
      //Countdown timer for the rest
      timer = setInterval(function() {
        let timeCheck = new Date();
        let timeElapsed = timeCheck - restTimerStart;
        if (120000 - timeElapsed <= 0) {
          clearInterval(timer);
          timerDiv.textContent = "00:00";
        } else {
          timerDiv.innerHTML = makeTime(120000 - timeElapsed);
        }
      }, 50);
      sets++;
    }

    function exerciseSummary() {
      let finalTime = new Date();
      clearElement(workoutWindow);

      let timeText = makeDiv("timeText");
        timeText.textContent = "Total Time";
      workoutWindow.appendChild(timeText);

      let totalTime = makeDiv("totalTime");
        totalTime.innerHTML = makeTime(finalTime - workoutStartTime);
      workoutWindow.appendChild(totalTime);

      let summaryDiv = makeDiv("summaryDiv");

      for (let i = 0; i < exercises.length; i++) {
        let summary = makeDiv("", "workoutSummary");
          let summaryNumber = makeDiv("", "summaryNumber");
            summaryNumber.textContent = exercises[i].count;
          summary.appendChild(summaryNumber);
          let summaryExercise = makeDiv("", "summaryExercise");
            summaryExercise.textContent = exercises[i].name;
          summary.appendChild(summaryExercise);
        summaryDiv.appendChild(summary);
      }

      console.log("text change next");
      startButton.textContent = "Again?";
      startButton.onclick = function() {
        clearElement(document.body);
        shadyFit();
      }

      workoutWindow.appendChild(summaryDiv);

    }
    //
    //Shows the image preview of the exercise
    let exercisePreview = makeDiv("exercisePreview");

      let setCountBox = makeDiv("setCountBox");
        let setText = makeDiv("setText");
          setText.textContent = "Set: ";
      setCountBox.appendChild(setText);

        let setCount = makeDiv("setCount");
          let sets = 1;
          setCount.textContent = sets;
      setCountBox.appendChild(setCount);

    exercisePreview.appendChild(setCountBox);
      let exerciseImg = makeImg("", "exerciseImg");
    exercisePreview.appendChild(exerciseImg);

    //
    //Shows the name and number to do of the exercise
    let exerciseInfo = makeDiv("exerciseInfo");
      let exerciseNumber = makeDiv("exerciseNumber");
      let exerciseName = makeDiv("exerciseName");
    exerciseInfo.appendChild(exerciseNumber);
    exerciseInfo.appendChild(exerciseName);

    //
    //A container for the timer
    let timerDiv = makeDiv("timerDiv");
    let timer = null;
    let exImg = null;

    let exerciseCount = 0

    //
    //clears the workout window to put in other stuff
    clearElement(workoutWindow);

    //
    //Defines what the "start" button does
    startButton.textContent = "Next Exercise";
    startButton.onclick = function() {
      if (exerciseCount <= exercises.length - 1) {
        showExercise(exercises[exerciseCount]);
      } else {
        if (sets === totalSets) {
          exerciseSummary();
        } else {
          exerciseRest(120000);
        }
      }
    }

    //
    //Starts the timer and shows the exercise
    let workoutStartTime = new Date();
    showExercise(exercises[0]);
  }
  //
  //Makes the window that shows the workout information
  const workoutWindow = makeDiv("workoutWindow");
  document.body.appendChild(workoutWindow);
  //
  //My logo
  let logoDiv = makeDiv("logoDiv");
  logoDiv.textContent = "ShadyFit";
  workoutWindow.appendChild(logoDiv);
  setTimeout(function() {
    logoDiv.style.filter = "opacity(100%)";
  }, 10);
  //
  //The "Start Workout" button that's just outside
  //the workoutWindow
  let startButton = makeDiv("startButton");
  startButton.textContent = "Choose Workout";
  let exercises = null;
  document.body.appendChild(startButton);
  //
  //Shows the startButton after the logo is done showing
  logoDiv.addEventListener("transitionend", function(event) {
    event.stopPropagation();
    startButton.style.filter = "opacity(100%)";
    startButton.onclick = function() {
      fetch("workoutList.json")
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          let workoutList = Object.values(myJson);
          console.log("showing Workouts");
          showWorkouts(workoutList);
        });
    }
  });
}

/*fetch("workoutList.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    let exerciseSet = myJson;
    console.log(exerciseSet);
    exercises = Object.values(exerciseSet);
    console.log(exercises);
    let totalSets = exercises.shift();
    startWorkout(totalSets);
  });*/
