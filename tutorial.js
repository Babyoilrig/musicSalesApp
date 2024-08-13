
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

export function showTutorial() {
  console.log('I am show tutorial and I have run!');
  const getSpeechBubble1 = document.querySelector('.speech-bubble1');
  console.log(getSpeechBubble1);
    getSpeechBubble1.style.visibility = "visible";
  
 
}


export function hideSpeechBubbles(e) {
  const index = e.target.dataset.index;
  console.log(index);
  this.parentNode.parentNode.style.visibility = "hidden";
  const speechBubbleButtons = document.querySelectorAll('[data-index]');
  speechBubbleButtons.forEach(item => {
      const currentIndex = parseInt(item.dataset.index);
      const indexToShow = parseInt(index) + 1;
      if (currentIndex === indexToShow) {
          item.parentNode.parentNode.style.visibility = "visible";
      }
  })
}

