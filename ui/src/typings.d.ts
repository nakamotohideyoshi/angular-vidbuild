/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var StripeCheckout:any;

declare var JSZip: any;

declare namespace OpenShot {
  interface Project {
    id?: number;
    name?: string;
    width?: number;
    height?: number;
    fps_num?: number;
    fps_den?: number;
    sample_rate?: number;
    channels?: number;
    channel_layout?: number;
    json?: Object;
  }

  interface RawFile {
    media: File,
    project: string;
    json: Object;
  }

  interface Clip {
    id?: number;
    file?: string;
    position?: number;
    start?: number;
    end?: number;
    layer?: number;
    project?: string;
    json?: Object;
  }

  interface Effect {
    title: string;
    type: string;
    position: number;
    start: number;
    end: number;
    layer: number;
    project: string;
    json: Object
  }

  interface Export {
    export_type?: string;
    video_format?: string;
    video_codec?: string;
    video_bitrate?: number;
    audio_codec?: string;
    audio_bitrate?: number;
    start_frame?: number;
    end_frame?: number;
    project: string;
    json?: Object;

    status?: string;
    actions?: string[];
    date_created?: string;
    date_updated?: string;
    id?: number;
    output?: string;
    progress?: number;
    url?: string;
  }
}