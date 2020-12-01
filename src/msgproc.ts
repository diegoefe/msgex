import { Config } from './config'
import { v4 as uuidv4 } from 'uuid';
import { LooseObject } from './types';

// Message
export class Msg {
    readonly transaction_id:string;
    readonly payload:LooseObject;
    constructor(_text:string, _data:LooseObject, _transaction_id:string) {
        this.payload = { "message":_text };
        Object.keys(_data).forEach((key:string) => {
            this.payload[key] = _data[key];
        })
        this.transaction_id = _transaction_id;
    }
};

export class PingMsg extends Msg {
    constructor(_force_error:boolean, _transaction_id:string=uuidv4()) {
        super("ping", {"force_error": _force_error, "created_at": new Date()}, _transaction_id);
    }
}

export class PongMsg extends Msg {
    constructor(_time:number, _transaction_id:string) {
        super("pong", {"processing_time":_time }, _transaction_id);
    }
}

export class ErrMsg extends Msg {
    constructor(_desc:string) {
        super("error", {"description":_desc}, uuidv4());
    }
}

export interface iProducer {
    send(_topic:string, _msg:Msg) : Promise<string>;
}

enum Status {
    Unsent=1, SentOK, SendErr, Deleted
}

class MsgState {
    msg:PingMsg;
    status:Status;
    number_of_tries:number;
    constructor(_msg:PingMsg) {
        this.msg = _msg;
        this.status = Status.Unsent;
        this.number_of_tries = 0;
    }
}

type MsgDB = {
    [key: string]: MsgState
};


// Message Processor
export class MsgProc {
    readonly delay:number;
    readonly failure_limit:number;
    private prod_:iProducer;
    private msgs_:MsgDB = {};
    private topics_:LooseObject;
    constructor(_config:Config, _prod:iProducer) {
        this.delay = _config.server.messages.processing_delay;
        this.failure_limit = _config.server.messages.failure_limit;
        this.prod_ = _prod;
        this.topics_ = _config.kafka.topics.outbound;
    }
    private async send(_msg:PingMsg) {
        let mt:MsgState = new MsgState(_msg);
        if(! (_msg.transaction_id in this.msgs_)) {
            this.msgs_[_msg.transaction_id] = mt;
        }
        // try {
            const now:Date = new Date();    
            const pong:PongMsg = new PongMsg(now.getDate()-_msg.payload.created_at.getDate(), mt.msg.transaction_id);
            if(mt.msg.payload.force_error) {
                await this.prod_.send(this.topics_.error, pong);
                mt.status = Status.SendErr;
            } else {
                await this.prod_.send(this.topics_.success, pong);
                mt.status = Status.SentOK;
            }
            ++mt.number_of_tries;
            if(mt.number_of_tries>=this.failure_limit) {
                await this.prod_.send(this.topics_.dead, pong);
                mt.status = Status.Deleted;
            }
        // } catch(e:any) { }
    }
    private process(_msg:PingMsg) {
        setTimeout(() => { this.send(_msg); }, this.delay);
    }
    async consume(_msg:PingMsg) {
        if(_msg.transaction_id in this.msgs_) {
            let mt:MsgState = this.msgs_[_msg.transaction_id];
            // updating error flag to simulate failure
            mt.msg.payload.force_error = _msg.payload.force_error;
            switch(mt.status) {
                case Status.Deleted:
                    // nothing to do
                    break;
                case Status.SentOK:
                    // we respond without processing
                    await this.send(_msg);
                    break;
                case Status.SendErr:
                    // retry the failed message
                    this.process(_msg);
                    break;                    
            }
        } else {
            // new nessage
            this.process(_msg);
        }
    }
}
