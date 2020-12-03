## Simple messaging excercise
- [Overview](#overview)
- [Setup](#setup)
- [Usage](#usage)
- [Utilities](#utilities)
- [OS notes](#os-notes)


### Overview
This demo consists and a custom Ping/Pong service that:
1. Connects to a Apache Kafka server and: 
    1. Listens for incoming "ping" messages from an *inbound* queue
    1. Sends "pong" responses to three different *outbound* queues:
        - *success*: a message was succesfuly processed
        - *error*: there was an error processing this message
        - *dead letter*: there where to many errors processing this message
1. Additionally, it:
    1. Listens to a configurable port
    1. Receives HTTP PUT requests with messages that get processed the same way as the ones from the inbound queue
    This feature was added to facilitate the testing stage
1. Various features can be configured:
    - Inbound and outbound queues
    - The processing time (delay)
    - The number of times a failed message can be retried
1. A couple of utilities are provided to use/test the service:
    - A script to enqueue ping messages to the inbound queue
    - A script to generate a message with an HTTP request
    - Both scripts allow to, optionally:
        - Define a transaction-id
        - Set and *force_error* flag



### Setup
- Install nodejs
- Install dependencies

  ```bash
    $ npm install
  ```

- Run tests

  ```bash
    $ npm test
  ```

- Configure the sevice and Kafka access:
    - Copy [sample-config.yaml](sample-config.yaml) to **config.yaml** and customize it

      ```bash
      $ cp sample-config.yaml config.yaml
      $ vim config.yaml
      ```
    - To use it on a remote deploy you may have a look at [sample-env.sh](sample-env.sh)


### Usage
- Start kafka server, if necessary

- If it's the first time, or kafka/zookeeper didn't persist the data, run:
  ```bash
  $ npm run kinit
  ```
  To create all the topics and prevent a service start failure

- Start the server locally
  ```bash
    $ npm start
  ```

## Utilities
**[prod.ts](util/prod.ts)**
- Can be runned with
  ```bash
  $ node_modules/.bin/ts-node util/prod.ts
  ```
  Or if you installed ts-node globally, with
  ```bash
  $ ts-node util/prod.ts
  ```
  To list the options, run
  ```bash
  $ ts-node util/prod.ts -h
  ```

**[post_msg.sh](util/post_msg.sh)**
- You must have [curl](https://curl.se/) installed to use it.
  Sample usages:
  ```bash
  # Post a message
  $ ./util/post_msg.sh
  # Post a error message
  $ ./util/post_msg.sh -e
  # Post a message with custom 'transaction-id'
  $ ./util/post_msg.sh -t "my transaction id"
  # Post a error message with custom 'transaction-id'
  $ ./util/post_msg.sh -t "my transaction id" -e
  ```
Of course, you must use back-slashes in Windows platforms


### OS notes
- Linux
  - For testing, run (or npm test):
    ```bash
      $ npm test_all
    ```

- Win32
  - If **npm install** fails, it can be because some pre-compiled binaries for your machine where not found and may need to be recompiled, you may try this command (before *npm install*), to make it work:
    ```ms-dos
      npm install -g windows-build-tools
      rem or
      npm install --global --production windows-build-tools@4.0.0
    ```