DEST := dest
STATIC_FILES := $(DEST)/styles.css $(DEST)/manifest.json
MAIN := $(DEST)/main.js

all: $(DEST) $(STATIC_FILES) $(README) $(MAIN)

$(DEST):
	mkdir -p $(DEST)

$(DEST)/%: %
	cp $< $@

$(DEST)/main.js: main.js
	mv $< $@

main.js:
	pnpm run build

.PHONY: all FORCE clean dependencies build

clean:
	rm -rf $(DEST)

dependencies:
	pnpm install
