export namespace vbuild {

  export class Project implements OpenShot.Project {
    id?: number;
    name?: string;
    width?: number = 640;
    height?: number = 360;
    fps_num?: number = 25;
    fps_den?: number = 1;
    sample_rate?: number = 44100;
    channels?: number = 2;
    channel_layout?: number = 3;
    json?: Object = {};

    audioClips?: AudioClip[] = [];
    textClips?: VideoClip[]= [];
    videoClips?: VideoClip[] = [];
    voiceClips?: VoiceClip[] = [];

    constructor(params?: Project) {
      if (params) Object.assign(this, params);
    }

    public duration?(): number {
      let duration: number = 0;
      duration += this.audioClips.map(audioClip => audioClip.duration()).reduce((acc, curr) => acc + curr, 0);
      duration += this.textClips.map(textClip => textClip.duration()).reduce((acc, curr) => acc + curr, 0);
      duration += this.videoClips.map(videoClip => videoClip.duration()).reduce((acc, curr) => acc + curr, 0);
      duration += this.voiceClips.map(voiceClip => voiceClip.duration()).reduce((acc, curr) => acc + curr, 0);
      return duration;
    }

    public secsToFrame?(secs: number): number {
      return Math.round(secs * (this.fps_num / this.fps_den));
    }
  }

  export abstract class Clip implements OpenShot.Clip {
    id?: number;
    file?: string;
    position?: number;  // seconds
    start?: number;     // seconds
    end?: number;       // seconds
    layer?: number;
    project?: string;   // url
    json?: Object;

    constructor(params?: Clip) {
      if (params) Object.assign(this, params);
    }

    public duration?(): number {
      return this.end - this.start;
    }
  }

  export class VideoClip extends Clip {
    id?: number;
    file?: string;
    position?: number;  // seconds
    start?: number;     // seconds
    end?: number;       // seconds
    layer?: number;
    project?: string;   // url
    json?: Object = {};
    thumbnail?: string | Blob;
    muted?: boolean = false;

    constructor(params?: VideoClip) {
      super(params);
    }
  }

  export class AudioClip extends Clip {
    id?: number;
    file?: string;
    position?: number;  // seconds
    start?: number;     // seconds
    end?: number;       // seconds
    layer?: number;
    project?: string;   // url
    json?: Object = {};
    thumbnail?: string | Blob;

    constructor(params?: AudioClip) {
      super(params);
    }
  }

  export class TextClip extends Clip {
    id?: number;
    file?: string;
    position?: number;  // seconds
    start?: number;     // seconds
    end?: number;       // seconds
    layer?: number;
    project?: string;   // url
    json?: Object = {};

    constructor(params?: TextClip) {
      super(params);
    }
  }

  export class VoiceClip extends Clip {
    id?: number;
    file?: string;
    position?: number;  // seconds
    start?: number;     // seconds
    end?: number;       // seconds
    layer?: number;
    project?: string;   // url
    json?: Object = {};

    constructor(params?: VoiceClip) {
      super(params);
    }
  }

  export class ExportConfig implements OpenShot.Export {
    export_type?: string = 'video';
    video_format?: string = 'mp4';
    video_codec?: string = 'libx264';    // H.264
    video_bitrate?: number = 4000000;    // bps
    audio_codec?: string = 'libmp3lame'; // MP3
    audio_bitrate?: number = 192000;     // bps
    start_frame?: number = 1;
    end_frame?: number = 0;              // auto-detect
    project: string;
    json?: Object = {};

    id?: number;
    status?: string;
    actions?: string[];
    date_created?: string;
    date_updated?: string;
    output?: string;
    progress?: number;
    url?: string;

    constructor(params?: ExportConfig) {
      if (params) Object.assign(this, params);
    }
  }
}
