const tcfg = {
    server: {
        topics: {
            inbound: 'myinboundtopic',
            outbound: {
                error: "myoutbounderrortopic",
                success: "myoutboundsuccesstopic"
            }
        },
        messages: { processing_time: 30, failure_limit: 3 },
        port: 8088
    },
    kafka: { url: 'localhost:2181' }
};

export default tcfg;