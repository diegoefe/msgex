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
            const cfg = yaml.safeLoad(data);
            this.server = cfg.server;
            this.kafka = cfg.kafka;
        } else {
            const env = process.env;
            this.server = {
                topics : {
                    inbound: env.ME_TOPICS_INBOUND,
                    outbound: {
                        success: env.ME_TOPICS_OUTBOUND_SUCCESS,
                        error: env.ME_TOPICS_OUTBOUND_ERROR
                    }
                },
                messages: {
                    processing_time: parseInt(env.ME_MESSAGE_PROC_TIME),
                    failure_limit: parseInt(env.ME_MESSAGE_FAILURE_LIMIT)
                }
            };
            this.kafka = { url : env.ME_KAFKA_URL };
        }
    }
};

