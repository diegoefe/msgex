import { Config } from './config'
import { v4 as uuidv4 } from 'uuid';
import { LooseObject } from './types';

// Message
export class Msg {
    readonly transaction_id:string;
    readonly payload:LooseObject;
    constructor(_text:string, _data:LooseObject) {
        this.payload = { "message":_text };
        Object.keys(_data).forEach((key:string) => {
            this.payload[key] = _data[key];
        })
        
        this.transaction_id = uuidv4();
    }
};

export class PingMsg extends Msg {
    constructor(_force_error:boolean) {
        super("ping", {"force_error": _force_error});
    }
}

export class PongMsg extends Msg {
    constructor(_time:number) {
        super("pong", {"processing_time":_time });
    }
}

export class ErrMsg extends Msg {
    constructor(_desc:string) {
        super("error", {"description":_desc});
    }
}

// Message Processor
export class MsgProc {
    readonly process_time:number;
    readonly failure_limit:number;
    constructor(_config:Config) {
        this.process_time = _config.server.messages.processing_time;
        this.failure_limit = _config.server.messages.failure_limit;
    }

};
