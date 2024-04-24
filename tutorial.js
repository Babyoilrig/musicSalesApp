

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
    const getSpeechBubble1 = document.querySelector('.speech-bubble1');
    getSpeechBubble1.classList.remove('hiding');
 }
 
 
 export function hideSpeechBubbles(e) {
    const index = e.target.dataset.index;
    this.parentNode.parentNode.classList.add('hiding');
    const speechBubbleButtons = document.querySelectorAll('[data-index]');
    speechBubbleButtons.forEach(item => {
        const currentIndex = parseInt(item.dataset.index);
        const indexToShow = parseInt(index) + 1;
        if (currentIndex === indexToShow) {
            item.parentNode.parentNode.classList.remove('hiding');
        }
    })
 }
 