
class FlashcardPage {
  constructor(config) {
    // config
    this.storageKey = config.storageKey;
    this.libraryKey = config.libraryKey;

    // state
    this.flashcards = [];
    this.knownFlashcards = [];
    this.isHidden = [];
    this.currentIndex = 0;
  }

  async init() {
    // load data
    this.knownFlashcards = Storage.load(this.storageKey) || [];
    const [dictionary, allFlashcards] = await Promise.all([
      loadCsv('data/dictionary'),
      loadCsv(this.libraryKey)
    ]);
    DICTIONARY = dictionary;
    this.flashcards = allFlashcards.filter(card => !this.knownFlashcards.includes(card.phrase));
  }

  revealOrNext() {
    if (this.isHidden) {
      this.reveal();
    } else {
      this.next();
    }
  }

  markAsKnown() {
    const { phrase } = this.flashcards[this.currentIndex];
    this.knownFlashcards.push(phrase)
    this.flashcards = this.flashcards.filter(card => card.phrase !== phrase);
    Storage.save(this.storageKey, this.knownFlashcards);
    this.display();
    this.hide();
  }

  reset() {
    Storage.remove(this.storageKey);
    window.location.reload();
  }


  shuffle() {
    this.flashcards = this.flashcards.sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    this.display();
    this.hide();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
    this.display();
    this.hide();
  }

  hide() {
    $('.zhuyin-holder').each(function () {
      $(this).addClass('hidden');
    });
    $('.pinyin').each(function () {
      $(this).addClass('hidden');
    });
    $('#english').addClass('hidden');
    $('#reveal-or-next-button').text('Reveal');
    this.isHidden = true;
  }

  reveal() {
    $('.zhuyin-holder').each(function () {
      $(this).removeClass('hidden');
    });
    $('.pinyin').each(function () {
      $(this).removeClass('hidden');
    });
    $('#english').removeClass('hidden');
    $('#reveal-or-next-button').text('Next');
    this.isHidden = false;
  }

  renderText(text) {
    $('#display-characters').children('.character').remove();
    for (let i = 0; i < text.length; ++i) {
      const html = getCharacterHtml(DICTIONARY, text[i], i);
      $('#display-characters').append(html);
    }
  }

  display() {
    const entry = this.flashcards[this.currentIndex];
    this.renderText(entry.phrase);
    $('#count').text(`${this.currentIndex + 1} / ${this.flashcards.length}`);
    $('#known-button').text(`Known (${this.knownFlashcards.length})`);
    $('#english').text(entry.english);
    $('#google-translate').attr('href', `https://translate.google.com?sl=zh-TW&tl=en&text=${entry.phrase}&op=translate`);
  }
}
