.PHONY: help serve manifest refine print chrome-zip

help:
	@echo "Usage:"
	@echo "  make serve                          Start local dev server"
	@echo "  make manifest                       Regenerate data/flashcard-sets.json"
	@echo "  make refine type=<unit|class> args=<args>  Refine a set"
	@echo "    e.g. make refine type=unit args=songs/wu_bai_norweigan_forest"
	@echo "    e.g. make refine type=class args=verbs"
	@echo "  make print type=<unit|class> args=<args>   Print a set to PDF"
	@echo "    e.g. make print type=unit args=songs/wu_bai_norweigan_forest"
	@echo "    e.g. make print type=class args='verbs 2'"
	@echo "  make chrome-zip                     Package the Chrome extension"

serve:
	python3 -m http.server

manifest:
	python3 scripts/gen_sets_manifest.py

refine:
	python3 scripts/refine.py $(type) $(args)

print:
	python3 scripts/print.py $(type) $(args)

chrome-zip:
	cd chrome && zip out/src.zip -r src/*
