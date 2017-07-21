### Makefile for graphviz renderings [fr0b 20170719 17:42 CDT]

### Example usage:
##    make all
##    make built-diagrams/btcr-state-diagram-all.png && open built-diagrams/btcr-state-diagram-all.png
##    env CPPFLAGS="-DWITH_ATTACKS -DNIGHT_MODE -DNO_HAND_POSITIONING -DSOME_RANK_POSITIONING_ANYWAY" make

BUILD_DIR = built-diagrams

all: pngs svgs
.PHONY : all

pngs: \
  $(BUILD_DIR)/btcr-state-diagram-all.png \
  $(BUILD_DIR)/btcr-state-diagram-simple.png \
  $(BUILD_DIR)/btcr-state-diagram-recovery.png \
  $(BUILD_DIR)/btcr-state-diagram-key.png
.PHONY : pngs

svgs: \
  $(BUILD_DIR)/btcr-state-diagram-all.svg \
  $(BUILD_DIR)/btcr-state-diagram-simple.svg \
  $(BUILD_DIR)/btcr-state-diagram-recovery.svg \
  $(BUILD_DIR)/btcr-state-diagram-key.svg
.PHONY : svgs

clean:
	rm -f \
	  $(BUILD_DIR)/btcr-state-diagram-all.png \
	  $(BUILD_DIR)/btcr-state-diagram-all.svg \
	  $(BUILD_DIR)/btcr-state-diagram-simple.png \
	  $(BUILD_DIR)/btcr-state-diagram-simple.svg \
	  $(BUILD_DIR)/btcr-state-diagram-recovery.png \
	  $(BUILD_DIR)/btcr-state-diagram-recovery.svg \
	  $(BUILD_DIR)/btcr-state-diagram-key.png \
	  $(BUILD_DIR)/btcr-state-diagram-key.svg \
	  $(BUILD_DIR)/graphviz-build.dot
.PHONY : clean

BUILD_DATE := $(shell date "+%Y%m%d")
BUILD_GITDESC := $(shell git describe --dirty --always --long --tags)

# graphviz fails cpp-style string concatenation, so do it here.
BUILD_STRING = "\"\n\n rendered $(BUILD_DATE) from commit $(BUILD_GITDESC) \n https://github.com/WebOfTrustInfo/btcr-hackathon \n http://www.weboftrust.info/ \""

CPPFLAGS += \
  -DBUILD_STRING=$(BUILD_STRING) \
  -D$(DIAGRAM_SELECTOR) \
  -Wno-extra-tokens

$(BUILD_DIR)/btcr-state-diagram-all.png: DIAGRAM_SELECTOR = DIAGRAM_ALL
$(BUILD_DIR)/btcr-state-diagram-all.png: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) -DCROSS_TYPES btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-all.png

$(BUILD_DIR)/btcr-state-diagram-all.svg: DIAGRAM_SELECTOR = DIAGRAM_ALL
$(BUILD_DIR)/btcr-state-diagram-all.svg: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) -DCROSS_TYPES btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tsvg $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-all.svg

$(BUILD_DIR)/btcr-state-diagram-simple.png: DIAGRAM_SELECTOR = DIAGRAM_SIMPLE
$(BUILD_DIR)/btcr-state-diagram-simple.png: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-simple.png

$(BUILD_DIR)/btcr-state-diagram-simple.svg: DIAGRAM_SELECTOR = DIAGRAM_SIMPLE
$(BUILD_DIR)/btcr-state-diagram-simple.svg: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tsvg $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-simple.svg

$(BUILD_DIR)/btcr-state-diagram-recovery.png: DIAGRAM_SELECTOR = DIAGRAM_RECOVERY
$(BUILD_DIR)/btcr-state-diagram-recovery.png: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-recovery.png

$(BUILD_DIR)/btcr-state-diagram-recovery.svg: DIAGRAM_SELECTOR = DIAGRAM_RECOVERY
$(BUILD_DIR)/btcr-state-diagram-recovery.svg: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tsvg $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-recovery.svg

$(BUILD_DIR)/btcr-state-diagram-key.png: DIAGRAM_SELECTOR = DIAGRAM_KEY
$(BUILD_DIR)/btcr-state-diagram-key.png: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-key.png

$(BUILD_DIR)/btcr-state-diagram-key.svg: DIAGRAM_SELECTOR = DIAGRAM_KEY
$(BUILD_DIR)/btcr-state-diagram-key.svg: btcr-state-diagram-all.dot Makefile
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tsvg $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-key.svg
