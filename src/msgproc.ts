import { Config } from './config'

// Message Processor
export class MsgProc {
    config_:Config;
    constructor(_config:Config) {
        this.config_ = _config;
    }
}