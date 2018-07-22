// Artificial Butoh Teacher and Butoh Score Generator System
//
// this is the director (AKA score renderer)
//
// this node program translates a Contextfree Grammar into verbal guiding
// using the RiTa toolkit for computional literature
//
// work in progres by honzasvasek@gmail.com
//
// enjoy, copy, remix, share...
// may the spirits posses our random number generators

const fs = require('fs')
const YAML = require('yamljs')
const RiTa = require('rita')
const lame = require('lame')
const stream = require('stream')
const Speaker = require('speaker')
const textToSpeech = require('@google-cloud/text-to-speech')
var client = new textToSpeech.TextToSpeechClient()

function command (score, label) {
  var rg = RiTa.RiGrammar(YAML.load(score))
  var bufferStream = new stream.PassThrough();

  // TODO experiment to find trance inducive combinations
  //time=Math.floor(Math.random()*4567)+1234 // singing
  time=Math.floor(Math.random()*34567)+1234 // active meditation
  //time=Math.floor(Math.random()*90000)+1234 // relax...
  rate=Math.floor(Math.random()*34+56)
  pitch=Math.floor(Math.random()*3)+1

  text=rg.expand(label)

  ssml = '<speak><break time="1s"/><prosody rate="' + rate +
         '%" pitch="-' + pitch +'st">' + text + '</prosody></speak>'

  console.log(rate +" "+pitch+ "  " +text +" "+ time/1000)

  const request = {
    input: {ssml: ssml},
    voice: {languageCode: 'en-US', name: 'en-US-Wavenet-C'},
    audioConfig: {audioEncoding: 'MP3'}
  }
  client.synthesizeSpeech(request, (err, response) => {
    if (err) { console.error('Hmmm:', err) }
    bufferStream.end(response.audioContent)
    .pipe(new lame.Decoder()).on('format', function (format) {
      this.pipe(new Speaker(format)).on('close', function (close) {
        setTimeout(command, time, score, label)
      })
    })
  })
}

command("score.yaml","<start>")
