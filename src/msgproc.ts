import { Config } from './config'

// Message Processor
export class MsgProc {
    process_time_:number;
    failure_limit_:number;
    constructor(_config:Config) {
        this.process_time_ = _config.server.messages.processing_time;
        this.failure_limit_ = _config.server.messages.failure_limit;
    }
}