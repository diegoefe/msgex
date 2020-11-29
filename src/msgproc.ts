import { Config } from './config'
import { v4 as uuidv4 } from 'uuid';

class Payload {
    readonly text:string;
    readonly force_error:boolean;
    constructor(_text:string, _force_error:boolean) {
        this.text = _text;
        this.force_error = _force_error;
    }
};

// Message
export class Msg {
    readonly transaction_id:string;
    readonly payload:Payload;
    constructor(_text:string, _force_error:boolean) {
        this.payload = new Payload(_text, _force_error)
        this.transaction_id = uuidv4();
    }
};

// Message Processor
export class MsgProc {
    process_time_:number;
    failure_limit_:number;
    constructor(_config:Config) {
        this.process_time_ = _config.server.messages.processing_time;
        this.failure_limit_ = _config.server.messages.failure_limit;
    }
};
