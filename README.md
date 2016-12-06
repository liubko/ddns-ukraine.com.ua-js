# ddns-ukraine.com.ua-js

JS script to update ip-address at **ukraine.com.ua** hosting.

# Getting started

## Requirements:

    node v6.9.1
    npm v3.10.8

## Install:

    npm install

## Configure

Create `config.json` and fill it with correct data

    cp config.json.template config.json

## Run

Run cron job

    npm start

Run cron job in a background

    npm start-forever

To stop background process

    npm stop-forever

----

_Inspired by https://github.com/kvasilov48/ddns-ukraine.com.ua_