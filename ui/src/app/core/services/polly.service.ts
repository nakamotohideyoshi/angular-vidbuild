import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

@Injectable()
export class PollyService {

  loggedin: boolean;
  aws_accessKeyId = 'AKIAISWYQTF2BWSBFTXQ';
  aws_secretAccessKey = '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';
  aws_region: 'us-west-2';
  polly: any;
  voiceList: any[];

  constructor() {
    this.loggedin = false;

   }

   textToSpeech( audioElement: HTMLAudioElement, speechText: String, speed: any, volume: any ) {
    this.aws_region = 'us-west-2';
    AWS.config.update({
        region: this.aws_region,
        accessKeyId: this.aws_accessKeyId,
        secretAccessKey: this.aws_secretAccessKey
    });
    this.polly = new AWS.Polly({apiVersion: '2016-06-10'});
        const params = {
        OutputFormat: 'mp3',
        Text: speechText,
        VoiceId: 'Joanna',
        SampleRate: '22050',
        TextType: 'text'
    };

    this.polly.synthesizeSpeech(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }  else {
            const uInt8Array = data.AudioStream;
            const arrayBuffer = data.AudioStream.buffer;
            const url = URL.createObjectURL(new Blob([arrayBuffer]));
            audioElement.src = url;
            audioElement.playbackRate = 0.01 * (50 + speed);
            audioElement.volume = 0.01 * volume;
            console.log(audioElement.volume);
            audioElement.play();
        }
    });
  }

  getVoiceList() {
    const params = {
        LanguageCode: 'en-GB'
       };
       this.polly.describeVoices(params, function(err, data) {
         if (err) console.log(err, err.stack);
         else     console.log(data);
         /*
         data = {
          Voices: [
             {
            Gender: "Female", 
            Id: "Emma", 
            LanguageCode: "en-GB", 
            LanguageName: "British English", 
            Name: "Emma"
           }, 
             {
            Gender: "Male", 
            Id: "Brian", 
            LanguageCode: "en-GB", 
            LanguageName: "British English", 
            Name: "Brian"
           }, 
             {
            Gender: "Female", 
            Id: "Amy", 
            LanguageCode: "en-GB", 
            LanguageName: "British English", 
            Name: "Amy"
           }
          ]
         }
         */
       });
  }


}
