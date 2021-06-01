.PHONY: run
run: 
	go run ./

.PHONY: gen
gen:
	@# temporary work around https://github.com/99designs/gqlgen/issues/1483
	go get github.com/99designs/gqlgen
	go run github.com/99designs/gqlgen generate
