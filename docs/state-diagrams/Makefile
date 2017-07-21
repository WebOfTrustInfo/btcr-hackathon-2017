### Makefile for graphviz renderings [fr0b 20170719 17:42 CDT]

### Purpose of this configuration:
##    We want to fade-in parts of a graphviz graph, to aid learning.
##    Graphviz layers are broken.  So, keep the entire graph in one
##    file, and render from it using the C preprocessor.  Targets use
##    separate defines, like -DDIAGRAM_ALL.

### Example usage:
##    make all
##    make built-diagrams/btcr-state-diagram-all.png && open built-diagrams/btcr-state-diagram-all.png
##    env CPPFLAGS="-DWITH_ATTACKS -DNIGHT_MODE" make

BUILD_DIR = built-diagrams

all: \
  $(BUILD_DIR)/btcr-state-diagram-all.png \
  $(BUILD_DIR)/btcr-state-diagram-simple.png \
  $(BUILD_DIR)/btcr-state-diagram-recovery.png \
  $(BUILD_DIR)/btcr-state-diagram-key.png
.PHONY : all

clean:
	rm -f \
  $(BUILD_DIR)/btcr-state-diagram-all.png \
  $(BUILD_DIR)/btcr-state-diagram-simple.png \
  $(BUILD_DIR)/btcr-state-diagram-recovery.png \
  $(BUILD_DIR)/btcr-state-diagram-key.png \
  $(BUILD_DIR)/graphviz-build.dot
.PHONY : clean

BUILD_DATE := $(shell date "+%Y%m%d")
BUILD_GITDESC := $(shell git describe --dirty --always --long --tags)

# graphviz fails cpp-style string concatenation, so do it here.
BUILD_STRING = "\"built $(BUILD_DATE) from commit $(BUILD_GITDESC)\""

CPPFLAGS += \
  -DBUILD_STRING=$(BUILD_STRING) \
  -D$(DIAGRAM_SELECTOR) \
  -Wno-extra-tokens

$(BUILD_DIR)/btcr-state-diagram-all.png: DIAGRAM_SELECTOR = DIAGRAM_ALL
$(BUILD_DIR)/btcr-state-diagram-all.png: btcr-state-diagram-all.dot Makefile
	cpp $(CPPFLAGS) -DCROSS_TYPES btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-all.png

$(BUILD_DIR)/btcr-state-diagram-simple.png: DIAGRAM_SELECTOR = DIAGRAM_SIMPLE
$(BUILD_DIR)/btcr-state-diagram-simple.png: btcr-state-diagram-all.dot Makefile
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-simple.png

$(BUILD_DIR)/btcr-state-diagram-recovery.png: DIAGRAM_SELECTOR = DIAGRAM_RECOVERY
$(BUILD_DIR)/btcr-state-diagram-recovery.png: btcr-state-diagram-all.dot Makefile
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-recovery.png

$(BUILD_DIR)/btcr-state-diagram-key.png: DIAGRAM_SELECTOR = DIAGRAM_KEY
$(BUILD_DIR)/btcr-state-diagram-key.png: btcr-state-diagram-all.dot Makefile
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -Tpng $(BUILD_DIR)/graphviz-build.dot > $(BUILD_DIR)/btcr-state-diagram-key.png
