# Create Container

Run the following commands to clean-up containers and images. Or, to build a docker image, and create a docker container using mimOE.

## Reset Docker

If image was already build, and container was already created, ensure clean-up using the following script on the local machine.
- ./reset.sh

## Build Image/Create Container

Following simple scripts can build a docker image, and create a container named `mimoe-new` on the local machine.
- ./image.sh
- ./container.sh (or ./container.sh bridge_172)

> **Note** bridge_172 is the custom network name, it can be blank

## Custom Bridge Network (wip)

To connect docker containers with edge containers running locally, we may need to create custom bridge network, with *same IPAM config as local machine*. For e.g., if local machine has gateway `172.25.1.1`, then we can create a custom network using the following command.

> docker network create --driver bridge --subnet 172.25.1.0/24 --gateway 172.25.1.1 bridge_172

The result can be inspected using `docker network inspect bridge_172 | jq ".[0].IPAM"`, it should have the same gateway config.

```json
{
  "Driver": "default",
  "Options": {},
  "Config": [
    {
      "Subnet": "172.25.1.0/24",
      "Gateway": "172.25.1.1"
    }
  ]
}
```

## Start Bash

To start `bash` on the container with name `mimoe-new` or anything else, please ensure `nvm use` is also added to properly link the installed packages in the `lib` folder.
> docker exec -it mimoe-new bash -c "source ~/.nvm/nvm.sh && nvm use 18.19.1 && exec bash"

# Container Runtime

Following sections are relevant once a container is started, and is in interactive mode using `bash`.

## Running Processes

If `nvm` itself, or any `npm package` seems uninstalled, please check the running processes using `ps aux`. If it shows pending installation(s), it is due to `setup.sh` which installs `nvm`, specific `global packages`, and packages for a `node project`.
| Step | Command                      | Description                        |
|------|------------------------------|------------------------------------|
| 1    | `nvm install <version>`      | Install a specific node version    |
| 2    | *(wait)*                     | Wait for the version to install    |
| 3    | `npm install <pkg>`          | Install a specific package         |
| 4    | *(wait)*                     | Wait for the package to install    |
| 5    | `npm install`                | Install from `package.json`        |
| 6    | *(wait)*                     | Wait for all packages to install   |

## Global Modules

As this setup is using `nvm` to manage multiple `nodejs` versions, the folder where global node modules are installed is given by the following path.
> /root/.nvm/versions/node/v18.19.1/lib/node_modules/

## Build Microservice

To build the starter-microservice, first `cd` into the respective folder, and run the following command.
> npm run build && npm run package && cp ./build/microservice-v1-1.0.3.tar /app/deploy

## Test/Linting Commands

From `cli-utils` following commands can be executed.
- npx eslint . --fix
- npx mocha test