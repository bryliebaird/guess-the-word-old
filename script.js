const guessedList = document.querySelector("ul");
const guessBtn = document.querySelector(".guess");
const userInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const guessNumber = document.querySelector(".guess-number");
const message = document.querySelector(".message");
const playAgainBtn = document.querySelector(".play-again");
const guessCountMessage = document.querySelector(".remaining");

let word = "magnolia";
let guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function(){
  let res = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt")
  let words = await res.text();
  //console.log(word);
  let wordsArray = words.split("\n");
  //console.log(wordsArray);
  let randomIndex = Math.floor(wordsArray.length * Math.random());
  //console.log(randomIndex);
  word = wordsArray[randomIndex].trim();
  console.log(`The mystery word is, "${word}."`);
  placeholder(word);
  return word;
  //return secretWord;
}
getWord();

// Placeholder for Secret Word
const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
      //console.log(letter);
      placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
  };

// Button Click Event
guessBtn.addEventListener("click", function(e){
    e.preventDefault();
    message.innerText = "";
    
    const input = userInput.value;
    const userGuess = validateInput(input);

    if(userGuess){
        checkGuess(input, word);
    }
    userInput.value = "";

});


//  Function ==> Validate Input (Single Letter)
const validateInput = function(input){
    const acceptedLetter = /[a-zA-Z]/;

    if(input === ""){
        message.innerText = "Please enter a letter.";
    } else if (input.length > 1){
        message.innerHTML = `Please enter only <em><u>one</u></em> letter.`;
    } else if (!input.match(acceptedLetter)){
        message.innerText = "Please use letters only."
    } else {
        return input;
    }
}

// Function ==> 
const checkGuess = function(input, word){
    let guess = input.toUpperCase();
    console.log(`checkGuess Function passing the mystery word = ${word}.`)

    if(guessedLetters.includes(guess)){
        message.innerText = `You've already guessed the letter "${guess}," try another letter!`;
        //return guess;
    } else {
        let li = document.createElement("li");
        li.innerText = guess;
        guessedList.append(li);
    }
    guessedLetters.push(guess);
    counter(guess, word);
    displayLetter(guessedLetters, word);
}

const counter = function(guess, word){
  let upperCaseWord = word.toUpperCase();
  console.log(upperCaseWord);
  console.log(upperCaseWord);

  if(upperCaseWord.includes(guess)){
      message.innerHTML = `Good job! The letter "${guess} is in our mystery word!`;
  } else if(!upperCaseWord.includes(guess)){
      message.innerHTML = `Sorry, the letter "${guess}" is <em><u>not</u></em> is in our mystery word."`
      remainingGuesses -= 1;
      guessNumber.innerHTML = `${remainingGuesses} guesses`;
    }

  if(remainingGuesses === 1){
      //alert("You have only one guess left, make it count!");
      message.innerText = "You only have one guess left, make it count!";
  } else if (remainingGuesses === 0){
      //alert("Sorry, you have no more guesses. Better luck next time!");
      message.innerText = `Sorry, you don't have any guesses left. The mystery word was: "${word}." Better luck next time!`;
      startOver();
  }
}

const displayLetter = function(guessedLetters, word){
    const mysteryWordArray = word.toUpperCase().split("");
    console.log(mysteryWordArray);
    const revealWord = [];

    for (const letter of mysteryWordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter);
        } else {
            revealWord.push("●");
        }
      }
    console.log(revealWord);
    // wordInProgress --> we use join to return the revealed word as a string and not an array, we also remove the , separating the letters by using join with "" 
    wordInProgress.innerText = revealWord.join("");

    checkWin(mysteryWordArray, revealWord);
}

const checkWin = function (mysteryWordArray, revealWord){
  let hiddenWord = mysteryWordArray.join("");
  let userWord = revealWord.join("");
  //console.log(hiddenWord, userWord);

  if(hiddenWord === userWord){
    message.classList.add("win");
    message.innerHTML = `<p class="highlight">You guessed correct the word! Congrats!</p>`;
    startOver();
  }
}

const startOver = function(){
  guessBtn.classList.add("hide");
  guessCountMessage.classList.add("hide");
  guessedList.classList.add("hide");

  playAgainBtn.classList.remove("hide");
}

playAgainBtn.addEventListener("click", function(){
  //alert("Play again function is running");
 
  message.classList.remove("win");
  message.innerText = "Let's play again!";


  //console.log(`playAgainBtn is running, ${guessedLetters}.`);

  remainingGuesses = 8;
  guessCountMessage.classList.remove("hide");
  guessNumber.innerHTML = `${remainingGuesses} guesses`
  //console.log(`playAgain, you have ${remainingGuesses} left.`);

  guessBtn.classList.remove("hide");
  playAgainBtn.classList.add("hide");

  guessedLetters = [];
  //console.log(guessedLetters);
  guessedList.innerHTML = "";
  guessedList.classList.remove("hide");
  
  getWord();
})
