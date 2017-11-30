import { Component, OnInit } from '@angular/core';
import { EditorService } from './../../services/editor.service';
@Component({
  selector: 'app-add-voiceover',
  templateUrl: './add-voiceover.component.html',
  styleUrls: ['./add-voiceover.component.scss']
})
export class AddVoiceoverComponent implements OnInit {
  pitch = 50;
  pitch_value = '50%';
  speed = 50;
  speed_value = '50%';
  volume = 50;
  volume_value = '50%';

  constructor(
    public editorService: EditorService
  ) { }

  ngOnInit() {
  }

  tab1() {
    document.getElementById('tab2').classList.remove('active');
    document.getElementById('tab1').classList.add('active');
  }
  tab2() {
    document.getElementById('tab1').classList.remove('active');
    document.getElementById('tab2').classList.add('active');
  }
  setPitch() {
    this.pitch_value = this.pitch + '%';
  }
  setSpeed() {
    this.speed_value = this.speed + '%';
  }
  setVolume() {
    this.volume_value = this.volume + '%';
  }
  onWhisper() {
    document.getElementById('whisper-off').classList.remove('active');
    document.getElementById('whisper-on').classList.add('active');
  }
  offWhisper() {
    document.getElementById('whisper-on').classList.remove('active');
    document.getElementById('whisper-off').classList.add('active');
  }
  resetVaules() {
    this.pitch = 50;
    this.pitch_value = '50%';
    this.speed = 50;
    this.speed_value = '50%';
    this.volume = 50;
    this.volume_value = '50%';
  }

}
