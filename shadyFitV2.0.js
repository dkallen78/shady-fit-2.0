let imageBin = [];

const preloadImages = function(images, callback = false, value = 0) {
  //----------------------------------------------------//
  //Preloads images before they are needed              //
  //array-> images[]: an array containing strings that  //
  //are the paths to the images to be loaded            //
  //----------------------------------------------------//

  if (images[0] != "") {
    imageBin = [];
  } else {
    images.shift();
  }

  let imgLength = images.length;
  let img = null;

  for (let i = 0; i < imgLength; i++) {
    imageBin.push(new Image());
    imageBin[imageBin.length - 1].src = images[i];
  }

  if (callback) {
    imageBin[imageBin.length - 1].onload = function () {
      callback(value);
    }
  }
}

const clearElement = function() {
  //----------------------------------------------------//
  //Clears the innerHTML of an element or elements      //
  //element-> arguments[n]: element to be cleared       //
  //----------------------------------------------------//

  for (let i = 0; i < arguments.length; i++) {
    arguments[i].innerHTML = "";
  }
}

const removeElement = function() {
  //----------------------------------------------------//
  //Removes any number of elements passed in as         //
  //  arguments from their parent element               //
  //string-> arguments[0+]: id of the elements          //
  //  to be removed                                     //
  //----------------------------------------------------//

  for (let i = 0; i < arguments.length; i++) {
    let element = document.getElementById(arguments[i]);
    element.parentNode.removeChild(element);
  }
}

const insertTextNode = function(element, text) {
  //----------------------------------------------------//
  //Inserts text into an element without erasing the    //
  //  previous text                                     //
  //element-> element: element to be inserted into      //
  //string-> text: text to insert                       //
  //----------------------------------------------------//

  let node = document.createTextNode(text);
  element.appendChild(node);
}

const makeDiv = function() {
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

const makeImg = function(src) {
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

const makeButton = function(callback, text, id = "") {
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

const makeTime = function(ms) {
  //----------------------------------------------------//
  //Converts a millisecond value into a minutes, seconds//
  //  and milliseconds format                           //
  //integer-> ms: millisecond value to convert          //
  //----------------------------------------------------//

  let minutes = Math.floor(ms / 60000);
  let seconds = Math.floor(ms / 1000) % 60;
  seconds = (seconds > 9) ? `${seconds}` : `0${seconds}`;
  let milliseconds = (ms % 100).toFixed(0, 10);

  return `${minutes}:${seconds}<span id="milliseconds">${milliseconds}</span>`;
}

const shadyFit = function() {
  //----------------------------------------------------//
  //Sets up the initial screen for the user             //
  //----------------------------------------------------//

  const showWorkouts = function(workoutList) {
    //----------------------------------------------------//
    //Shows the available workouts and puts elements and  //
    //  buttons on the screen                             //
    //array-> workoutList: an array of exercise objects   //
    //----------------------------------------------------//

    const showWorkout = function(index) {
      //----------------------------------------------------//
      //Shows the available workouts and changes them when  //
      //the user presses/clicks a button                    //
      //integer-> index: index of the object array to show  //
      //----------------------------------------------------//

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

    let buttons = makeDiv("buttons");

      let next = makeDiv("next", "buttons");
        next.textContent = "Next";
        next.onclick = function() {
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
          /*let imgs = [];
          for (let i = 0; i < exercises.length; i++) {
            exercises[i].images.forEach(function(item) {
              imgs.push(exercises[i].src + item);
            });
          }
          preloadImages(imgs, startWorkout, totalSets);*/
          startWorkout(totalSets);
        });
    }
  }

  const startWorkout = function(totalSets) {
    //----------------------------------------------------//
    //The wrapper function for the workout. Makes and     //
    //  appends the elements for the other functions      //
    //integer-> totalSets: how many rounds of exercise    //
    //  in the workout.                                   //
    //----------------------------------------------------//

    const showExercise = function(data) {
      //----------------------------------------------------//
      //Handles the exercises of the workout. Puts data into//
      //  the elements, and animates the images and timer   //
      //object-> data: object that contains the information //
      //  about the exercise                                //
      //----------------------------------------------------//

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
      //setCountBox.style.filter = "opacity(100%)";
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
      //Cycles between the exercise images
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

    const exerciseRest = function(time) {
      //----------------------------------------------------//
      //Makes the rest screen displayed between each set.   //
      //integer-> time: how long the rest timer should be   //
      //  in milliseconds (unimplemented)                   //
      //----------------------------------------------------//

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

    const exerciseSummary = function() {
      //----------------------------------------------------//
      //Makes the summary screen shown to the user after    //
      //  they have completed all sets                      //
      //----------------------------------------------------//

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

      startButton.textContent = "Again?";
      startButton.onclick = function() {
        clearElement(document.body);
        shadyFit();
      }

      workoutWindow.appendChild(summaryDiv);
    }

    const countDown = function(callback, text = false) {
      //----------------------------------------------------//
      //Flashes a "3, 2, 1" countdown on the screen, then   //
      //  runs a callback function                          //
      //function-> callback: function to call at the end of //
      //  the countdown                                     //
      //string-> text: text to display during the countdown //
      //----------------------------------------------------//

      const fadeNumber = function(element) {
        //----------------------------------------------------//
        //Transitions of the number element                   //
        //----------------------------------------------------//

        element.style.filter = "opacity(0%)";
        element.style.fontSize = "0rem";
        element.style.height = "0rem";
        element.style.padding = "0rem";
      }

      startButton.style.display = "none";

      preloadImages(exercises[exerciseCount].images);
      exerciseImg.src = exercises[exerciseCount].src + exercises[exerciseCount].images[0];

      clearElement(workoutWindow);
      clearInterval(timer);

      if (text) {
        let nextExercise = makeDiv("nextExercise");
          nextExercise.textContent = text;
        workoutWindow.appendChild(nextExercise);
      }

      let three = makeDiv("three", "countDown");
        three.textContent = "3";
        /*three.onclick = function() {
          three.style.filter = "opacity(0%)";
          three.style.fontSize = "0rem";
        }*/
      workoutWindow.appendChild(three);
      setTimeout(function() {
        fadeNumber(three);
      }, 20);

      setTimeout(function() {
        removeElement("three");
        let two = makeDiv("two", "countDown");
          two.textContent = "2";
        workoutWindow.appendChild(two);
        setTimeout(function() {
          fadeNumber(two);
        }, 20);
      }, 1200);

      setTimeout(function() {
        removeElement("two");
        let one = makeDiv("one", "countDown");
          one.textContent = "1";
        workoutWindow.appendChild(one);
        setTimeout(function() {
          fadeNumber(one);
        }, 20);
      }, 2400);

      setTimeout(function() {
        clearElement(workoutWindow);
        startButton.style.display = "table";
        callback();
      }, 3400);
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
        countDown(function() {
          showExercise(exercises[exerciseCount]);
        }, exercises[exerciseCount].name);
      } else {
        if (sets === totalSets) {
          exerciseSummary();
        } else {
          preloadImages(["", "water.png"]);
          exerciseRest(120000);
        }
      }
    }

    //
    //Starts the timer and shows the exercise
    let workoutStartTime = null;


    countDown(function() {
      workoutStartTime = new Date();
      showExercise(exercises[0]);
    }, exercises[0].name);
  }

  let exercises = null;

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
          showWorkouts(workoutList);
        });
    }
  });
}

//--------------------------------------------------------//
//Exercise Object:                                        //
//  "exerciseName": {                                     //
//    "name": "Exercise Name",                            //
//    "count": ##,                                        //
//    "src": "./directory/path/",                         //
//    "images": ["fileToUse1.png", "fileToUse2.png", ...] //
//  },                                                    //
//--------------------------------------------------------//

//--------------------------------------------------------//
//Workout Object:                                         //
//  "workoutName": {                                      //
//    "name": "Workout Name",                             //
//    "src": "directory/file.json",                       //
//    "names": [                                          //
//      "Exercise Name", "Exercise Name", ...             //
//    ],                                                  //
//    "counts": [10, 5, 5, 10, 10, 5],                    //
//    "sets": 3                                           //
//  },                                                    //
//--------------------------------------------------------//
