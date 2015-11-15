# Ref: https://gist.github.com/toolmantim/6200029

# Variables
BIN=node_modules/.bin
DIST=build

# Phony targets - these are for when the target-side of a definition
# (such as "all" below) isn't a file but instead a just label. Declaring
# it as phony ensures that it always run, even if a file by the same name
# exists.
.PHONY : all deps docker

all: app docker

deps:
	docker build --rm=true -t huge/deps ./src/deps

docker:
	docker build --rm=true -t huge/server ./src/server

# The final JS file
app: $(DIST)/app.js
	$(BIN)/webpack -p --config webpack.production.config.js
