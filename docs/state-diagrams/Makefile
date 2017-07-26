### Makefile for graphviz renderings [fr0b 20170719 17:42 CDT]

### Example usage:
##    make
##    make pngs
##    make built-diagrams/btcr-state-diagram-all.png && open built-diagrams/btcr-state-diagram-all.png
##    env CPPFLAGS="-DWITH_ATTACKS -DNIGHT_MODE -DNO_HAND_POSITIONING -DSOME_RANK_POSITIONING_ANYWAY -UCROSS_TYPES" make

BUILD_DIR = built-diagrams
TARGET_BRANCHES = all simple recovery key
TARGET_PREFIX = $(BUILD_DIR)/btcr-state-diagram-
PNG_TARGETS = $(foreach branch,$(TARGET_BRANCHES),$(TARGET_PREFIX)$(branch).png)
SVG_TARGETS = $(foreach branch,$(TARGET_BRANCHES),$(TARGET_PREFIX)$(branch).svg)

all: pngs svgs
.PHONY : all

pngs: $(PNG_TARGETS)
.PHONY : pngs

svgs: $(SVG_TARGETS)
.PHONY : svgs

clean:
	rm -f \
	  $(PNG_TARGETS) \
	  $(SVG_TARGETS) \
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

# The "all" cases use an extra define, CROSS_TYPES, earning a separate rule.
$(BUILD_DIR)/btcr-state-diagram-all.png $(BUILD_DIR)/btcr-state-diagram-all.svg: DIAGRAM_SELECTOR = DIAGRAM_ALL
$(BUILD_DIR)/btcr-state-diagram-all.png $(BUILD_DIR)/btcr-state-diagram-all.svg: btcr-state-diagram-all.dot
	mkdir -p $(BUILD_DIR)
	cpp -DCROSS_TYPES $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -T$(subst .,,$(suffix $@)) $(BUILD_DIR)/graphviz-build.dot > $@

# Set DIAGRAM_SELECTOR.
#   A cpp #define passed in through $(DIAGRAM_SELECTOR) slices up the source.
#   However, no % variable remains defined after the rule's ":".
#   We elaborately extract the match for % exactly as used in the rule match:
#     $(patsubst $(TARGET_PREFIX)%$(suffix $@),%,$@)
#   Then upcase.
$(BUILD_DIR)/btcr-state-diagram-%.png: btcr-state-diagram-all.dot
	$(eval DIAGRAM_SELECTOR := DIAGRAM_$(shell echo $(patsubst $(TARGET_PREFIX)%$(suffix $@),%,$@) | tr 'a-z' 'A-Z'))
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -T$(subst .,,$(suffix $@)) $(BUILD_DIR)/graphviz-build.dot > $@

# Copy and paste (!!) general png rule for svg, since multiple targets fails.
#   Only necessary with a % match in the targets (i.e. not for "all", above).
#   Else, make believed svg target already existed after making png. (BUG?)
$(BUILD_DIR)/btcr-state-diagram-%.svg: btcr-state-diagram-all.dot
	$(eval DIAGRAM_SELECTOR := DIAGRAM_$(shell echo $(patsubst $(TARGET_PREFIX)%$(suffix $@),%,$@) | tr 'a-z' 'A-Z'))
	mkdir -p $(BUILD_DIR)
	cpp $(CPPFLAGS) btcr-state-diagram-all.dot > $(BUILD_DIR)/graphviz-build.dot
	dot -T$(subst .,,$(suffix $@)) $(BUILD_DIR)/graphviz-build.dot > $@
