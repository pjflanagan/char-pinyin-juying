
// LOAD



// GET RANDOM ENTRY

function getRandomEntry(currentLessonIdx) {
  const learnedWords = [];
  WORDS.forEach((word) => {
    if(word.lesson <= currentLessonIdx) {
      learnedWords.push(word);
    }
  });

  const idx = Math.floor(Math.random() * learnedWords.length);
  return learnedWords[idx];
}

// DISPLAY

function display({ entry }) {
  $('#container').click(() => {
    // window.location = `https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=${entry.word}`;
    // TODO: switch to a new entry
    // TODO: make a link somewhere else on the page that goes to google
  });
  $('#character').text(entry.word);
  $('#pinyin').text(entry.pinyin);
  $('#english').text(entry.english);
  $('#lesson').text(lessonTitle);
  $('#splash').addClass('hidden');
}

// MAIN

(function() {
  load.then((currentLessonIdx) => {
    display({
      entry: getRandomEntry(currentLessonIdx)
    });
  });
})();