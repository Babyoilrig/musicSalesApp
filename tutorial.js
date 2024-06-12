
export function showTutorialOnFirstVisit(){
  console.log('I am the checkIfFirstVisit function and I have run!');
  if (!localStorage.getItem('previouslyVisited')) {
     const getSpeechBubble1 = document.querySelector('.speech-bubble1');
     getSpeechBubble1.classList.remove('hiding');
     console.log('Here is the tutorial!');
      localStorage.setItem('previouslyVisited', 'true');
    } else {
      return;
    }
}

//THE First speech bubble is not showing and hiding
export function showTutorial() {
  console.log('I am show tutorial and I have run!');
  const getSpeechBubble1 = document.querySelector('.speech-bubble1');
  console.log(getSpeechBubble1);
    // getSpeechBubble1.classList.remove('hiding');
    getSpeechBubble1.style.visibility = "visible";
  
 
}


export function hideSpeechBubbles(e) {
  console.log('I am hideSpeechBubbles and I have run!')
  const index = e.target.dataset.index;
  console.log(index);
  this.parentNode.parentNode.classList.add('hiding');
  const speechBubbleButtons = document.querySelectorAll('[data-index]');
  speechBubbleButtons.forEach(item => {
    console.log(speechBubbleButtons);
      const currentIndex = parseInt(item.dataset.index);
      const indexToShow = parseInt(index) + 1;
      if (currentIndex === indexToShow) {
          item.parentNode.parentNode.classList.remove('hiding');
      }
  })
}

