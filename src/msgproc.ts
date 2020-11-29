import { Config } from './config'
import { v4 as uuidv4 } from 'uuid';
import { LooseObject } from './types';

// Message
export class Msg {
    readonly transaction_id:string;
    readonly payload:LooseObject;
    constructor(_text:string, _pname:string, _pval:any) {
        this.payload = { "message":_text };
        this.payload[_pname] = _pval;
        this.transaction_id = uuidv4();
    }
};

export class PingMsg extends Msg {
    constructor(_force_error:boolean) {
        super("ping", "force_error", _force_error);
    }
}

export class PongMsg extends Msg {
    constructor(_time:number) {
        super("pong", "processing_time", _time);
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
