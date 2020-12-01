const tcfg = {
    server: {
        port: 8088
    },
    messages: {
        processing_delay: 30,
        failure_limit: 3
    },
    topics: {
        inbound: 'myinboundtopic',
        outbound: {
            error: "myoutbounderrortopic",
            success: "myoutboundsuccesstopic",
            dead:"mydeadlettertopic"
        }            
    },
    kafka: {
        url: 'localhost:2181',
    },
};

export default tcfg;