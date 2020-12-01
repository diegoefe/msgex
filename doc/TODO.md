## Pending features
- Add a Consumer to the server to receive Msg's from the inbound topic


## Bugs
- Fix memory leak (at least in the kafka Producer wrapper)
```bash
MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners added to [Consumer]. Use emitter.setMaxListeners() to increase limit
```
