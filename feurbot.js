#!/usr/bin/env node

'use strict';

var Slack = require('slack-client');
var token = process.argv[2];

if (!token) {
  console.error([
    'Usage: feurbot <token>',
    null,
    'To generate a token, create a bot at http://my.slack.com/services/new/bot'
  ].join('\n'));
  process.exit(1);
}

var slack = new Slack(token);

slack.on('message', function (message) {
  if (message.type !== 'message') {
    return;
  }

  if (!/quoi\s*[?!]*$/.test(message.text) && Math.random() < 0.99) {
    return;
  }

  var channel = slack.getChannelGroupOrDMByID(message.channel);
  var before  = 'FEEEEEUUUUUUUR !';
  var after   = Math.random() < .5 ? '(bim !)' : '(boum !)';
  var msg     = channel.send(before);

  setTimeout(function() {
    msg.updateMessage(before + ' ' + after);
  }, 700);
});

slack.on('error', function (err) {
  if (err === 'invalid_auth') {
    console.error('Invalid token, go grab a valid one!')
    process.exit(1);
  }

  console.error(err);
});

slack.login();
