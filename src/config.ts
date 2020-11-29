import * as fs from 'fs';
import * as yaml from 'js-yaml';

import{ LooseObject } from './types';

// loads configuration from file or environment
export class Config {
    public server:LooseObject;
    public kafka:LooseObject;
    // if null == _yaml_file_path, reads from environment variables
    constructor(_yaml_file_path?:string) {
        if(_yaml_file_path) {
            const data:string = fs.readFileSync(_yaml_file_path, { encoding:'utf8'} );
            const cfg = yaml.load(data);
            this.server = cfg.server;
            this.kafka = cfg.kafka;
        } else {
            const env = process.env;
            this.server = {
                messages: {
                    processing_time: this.getInt(env.ME_MESSAGE_PROC_TIME),
                    failure_limit: this.getInt(env.ME_MESSAGE_FAILURE_LIMIT)
                },
                port: this.getInt(env.ME_SERVER_PORT)
            };
            this.kafka = {
                url : env.ME_KAFKA_URL,
                topics : {
                    inbound: env.ME_TOPICS_INBOUND,
                    outbound: {
                        success: env.ME_TOPICS_OUTBOUND_SUCCESS,
                        error: env.ME_TOPICS_OUTBOUND_ERROR,
                        dead: env.ME_TOPICS_OUTBOUND_DEAD
                    }
                },

            };
        }
    }
    private getInt(val?:string) {
        if(val) {
            return parseInt(val);
        }
        return 0;
    }
};

