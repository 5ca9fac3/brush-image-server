### Instructions

1. Go to the root folder and run

```bash
npm install
```

2. Install docker and docker-compose (optional)

    [docker] https://docs.docker.com/engine/install/

    [docker-compose] https://docs.docker.com/compose/install/

3. Install redis to your system and start the service 


4. Optional to run redis commader and view redis cache

```bash
npm install -g redis-commander
```
5. Update env, add "tmp" folder at the root of the project

```.env
NODE_ENV
PORT
REDIS_HOST
REDIS_PORT
```
6. Start the node server

```bash
npm start
```
7. Instead you can run all the service by doing(requires docker),

```bash
docker-compose up
```
