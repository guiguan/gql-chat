FROM golang:1.17 as golang-build-env

WORKDIR /go/src/app
COPY ./spa-server .

RUN go vet -v
RUN go test -v

RUN CGO_ENABLED=0 go build -o /go/bin/app

FROM node:16 AS node-build-env

COPY . /app
WORKDIR /app

RUN npm i
RUN npm run build

FROM gcr.io/distroless/static

COPY --from=golang-build-env /go/bin/app /app/spa-server
COPY --from=node-build-env /app/build /app/public
WORKDIR /app
CMD ["./spa-server"]
