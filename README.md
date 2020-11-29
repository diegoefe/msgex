## Simple message excercise

### Setup
- Install nodejs
- Install dependencies

  ```bash
    $ npm install
  ```

- Run tests

  ```bash
    $ npm tests
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
