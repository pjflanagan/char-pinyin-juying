
const ModeText = [
  "汉字 → English",
  "汉字 + pinyin → English",
  "English → 汉字"
]

class FlashcardPage {
  constructor() {
    this.storageKey = '';

    // state
    this.flashcards = [];
    this.knownFlashcards = [];
    this.isHidden = [];
    this.currentIndex = 0;
    this.setName = null;

    this.mode = 0;
  }

  cycleMode() {
    this.mode = (this.mode + 1) % ModeText.length;
    $('#mode').text(ModeText[this.mode]);
    this.hide();
  }

  openModal() {
    $('#modal').removeClass('hidden');
  }

  chooseSet(setName) {
    this.setName = setName;
    this.flashcards = [];
    $('#modal').addClass('hidden');
    this.loadFlashcards();
  }

  async loadFlashcards() {
    this.storageKey = `flanny-sm-${this.setName}-flashcards`;
    this.knownFlashcards = StorageUtil.load(this.storageKey) || [];

    const allFlashcards = await loadCsv(`data/flashcards/${this.setName}`);
    const unknownFlashcards = allFlashcards.filter(card => card.phrase !== '' && !this.knownFlashcards.includes(card.phrase));


    // shuffle and display
    this.flashcards = unknownFlashcards.sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    this.display();
    this.hide();
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
    StorageUtil.save(this.storageKey, this.knownFlashcards);
    this.display();
    this.hide();
  }

  reset() {
    StorageUtil.remove(this.storageKey);
    this.loadFlashcards();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
    // CONSIDER: a little shake animation?
    this.display();
    this.hide();
  }

  hide() {
    switch (this.mode) {
      case 0: // hanzi -> english
        $("#hanzi").removeClass('hidden');
        $('#pinyin').addClass('hidden');
        $('#english').addClass('hidden');
        break;
      case 1: // hanzi + pinyin -> english
        $("#hanzi").removeClass('hidden');
        $('#pinyin').removeClass('hidden');
        $('#english').addClass('hidden');
        break;
      case 2: // english -> hanzi
        $("#hanzi").addClass('hidden');
        $('#pinyin').addClass('hidden');
        $('#english').removeClass('hidden');
        break;
    }
    $('#reveal-or-next-button').text('Reveal');
    this.isHidden = true;
  }

  reveal() {
    $('#hanzi').removeClass('hidden');
    $('#english').removeClass('hidden');
    $('#pinyin').removeClass('hidden');
    $('#reveal-or-next-button').text('Next');
    this.isHidden = false;
  }

  display() {
    const entry = this.flashcards[this.currentIndex];
    $('#container').removeClass();
    $('#container').addClass(entry.color);
    $('#count').text(`${this.currentIndex + 1} / ${this.flashcards.length}`);
    $('#known-button').text(`Known (${this.knownFlashcards.length})`);
    $('#hanzi').text(entry.phrase);
    $('#pinyin').text(entry.pinyin);
    $('#english').text(entry.english);
    $('#google-translate').attr('href', `https://translate.google.com?sl=zh-TW&tl=en&text=${entry.phrase}&op=translate`);
  }
}
