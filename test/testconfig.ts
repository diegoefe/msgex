const tcfg = {
    server: {
        messages: { processing_time: 30, failure_limit: 3 },
        port: 8088
    },
    kafka: {
        url: 'localhost:2181',
        topics: {
            inbound: 'myinboundtopic',
            outbound: {
                error: "myoutbounderrortopic",
                success: "myoutboundsuccesstopic",
                dead:"mydeadlettertopic"
            }            
        }
    }
};

export default tcfg;