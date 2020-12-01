## Simple message excercise

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


- Start the server locally

  ```bash
    $ npm run dev
  ```

- Remote deploy (TODO)


### OS notes
- Linux
  - For testing, run (or npm test):
    ```bash
      $ npm test_all
    ```

- Win32
  - If **npm install** fails, you may try this command (before *npm install*), to make it work:
    ```ms-dos
      npm install -g windows-build-tools
      rem or
      npm install --global --production windows-build-tools@4.0.0
    ```
    In case some pre-compiled binaries for your machine where not found and may need to be recompiled  
