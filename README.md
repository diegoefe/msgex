## Simple messaging excercise
- [Setup](#setup)
- [Usage](#usage)
- [OS notes](#os-notes)


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

- Configure the server and Kafka access
    - To use the server locally, copy [sample-config.yaml](sample-config.yaml) to **config.yaml** and customize it

      ```bash
      $ cp sample-config.yaml config.yaml
      $ vim config.yaml
      ```
    - To use it on a remote deploy you may have a look at [sample-env.sh](config-env.sh)

- Remote deploy (TODO)



### Usage
- Start kafka server, if necessary
- Start the server locally

  ```bash
    $ npm start
  ```

- With the servers running you can produce a message with:
  ```bash
  $  node_modules/.bin/ts-node util/prod.ts
  # or if you installed ts-node globally
  $ ts-node util/prod.ts
  # to generate messages with forced errors or custom transaction id's run it with -h for help
  $ ts-node util/prod.ts -h
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