
// LOAD

const DEFAULT_LESSON_IDX = 12;

const load = new Promise(function(resolve, reject){
  chrome.storage.sync.get('lessonIdx', function(data) {
    const currentLessonIdx = parseInt(data.lessonIdx) || DEFAULT_LESSON_IDX;
    resolve(currentLessonIdx);
  });
});

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

function display({ currentLessonIdx, entry }) {
  let lessonTitle = "";
  LESSONS.forEach(({ title, idx }) => {
    let selected = (idx === currentLessonIdx) ? 'selected' : '';
    $('#dropdown').append($(`<option ${selected}>`).val(idx).html(title));
    if(entry.lesson == idx) {
      lessonTitle = title;
    }
  });
  $('#dropdown').change(() => {
    const newLessonIdx = $('#dropdown').val()
    chrome.storage.sync.set({ 'lessonIdx': newLessonIdx });
  });

  $('#container').click(() => {
    window.location = `https://translate.google.com/#view=home&op=translate&sl=zh-CN&tl=en&text=${entry.word}`;
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
      currentLessonIdx,
      entry: getRandomEntry(currentLessonIdx)
    });
  });
})();