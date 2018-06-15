---
layout: post
title:  "Home Automation // Building Home Assistant on Docker Swarm"
description: I rebuilt my Home Assistant instance on Swarm for uptime!
date:   2018-06-15
tags: [home-automation, iot]
comments: true
share: true
---

As I mentioned a few episodes ago on the [Home Assistant Podcast](https://hasspodcast.io) (hopefully you listen to it!), I've been working on building a Home Assistant instance on my Docker Swarm stack at home. Why, you ask? Two main reasons: uptime, and because why not?! From an uptime perspective, it's more around MQTT uptime that I'm concerned about over the HASS instance itself. If you aren't familiar with it, Docker Swarm is a container scheduling engine built by Docker. In other words, it decides where a container should be run, for how long, and to makes sure it's actually running. If you're know what vCenter is for VMware, its kind-of like that...but for Docker. I also wanted to use this as an opportunity to freshen up on my DevOps/infrastructure skills using an application that I need to run at home anyways.

As part of this, I was trying to also achieve a couple of things that I wanted to do before:
1. Move my configs from my internal GitLabs repo to my public GitHub repo to share my configs, as well as to have it live in the cloud
2. Build a redundant system for MQTT and other applications related to my home automation
3. Move my automations to python-based [AppDaemon](https://github.com/home-assistant/appdaemon) from the standard YAML automations
4. Have at least a small amount of validation of my configuration using a CI/CD platform. I chose [Travis CI](https://travis-ci.org/) for now as I really don't want to deal with having to build that out a service in-house for now.
5. Possibly break out organize my components into different tabs in the home assistant UI (future)

I'm not doing anything complicated (yet) with my home automation, but I plan to keep building on it as I go.

Have a look at my up-to-date repo at https://github.com/rkaramandi/hass-config

From an MQTT point of view, there's a [neat blog post](https://medium.com/@lelylan/how-to-build-an-high-availability-mqtt-cluster-for-the-internet-of-things-8011a06bd000) on how to build a properly highly available MQTT instance using Mosca and HAProxy. For my needs, this is slightly more than I need, and it starts to get heavy when I start adding all the additional components for now. I just want to make sure that if I lose an MQTT node, another one spins up within seconds in it's place. Same with Home Assistant - and eventually when I get to it; AppDaemon. The end goal is that I shouldn't notice if an instance restarted or crashed in any way.

### So how do we do this?

#### Set up the environment
Let's start with the basics of how to set up a Docker Swarm. I'm going to assume that you already have an Ubuntu server or CentOS (or really any Linux distro) set up. My instructions assume Ubuntu.

First we want to install Docker itself; I've ripped most of this right from the [Docker Documentation](https://docs.docker.com/install/linux/docker-ce/ubuntu/).

Let's remove any instances of Docker that may remain, even there shouldn't be any in a fresh install. There's no harm in running this command if you don't already have it
```sh
$ sudo apt remove docker docker-engine docker.io
```
Let's update our repo's
```sh
$ sudo apt update
```
Install apt's secure transport
```sh
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```
Add Docker's GPG Key:
```sh
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
Verify the right fingerprint:
```sh
$ sudo apt-key fingerprint 0EBFCD88

pub   4096R/0EBFCD88 2017-02-22
      Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
```
Add the official repo on the stable channel:
```sh
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```
Now to actually install Docker! This will install the latest version of Docker. In production, it's advisible to run a specific version of Docker everywhere, but since this is for home, I'm just going to stay with the latest
```sh
$ sudo apt update && sudo apt install docker-ce
```
Keep in mind that because we're using the latest, every time you update your packages using `sudo apt update && sudo apt upgrade`, Docker will get updated with this as well.

Go to https://github.com/docker/compose/releases and check the latest release. In my install below, I use <version_number>, replace that with the latest stable version.
Now, install Docker-Compose by downloading the executable and allow it to be run by the system by making it executable:
```sh
$ sudo curl -L https://github.com/docker/compose/releases/download/<version_number>/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose
```
So, at this point we're assuming you have the latest version of Docker installed with the latest Docker-Compose installed and made executable. Assumably, you've done this across a couple of machines so that you're ready to build a cluster.

Without going too deep into Docker Swarm, there's two basic types of nodes: Managers, and Worker nodes. We need to create at least one manager node, and then join the workers to that.

On the manager, where <manager_address> is the routable IP Address of the node:
```sh
$ docker swarm init --advertise-addr <manager_address>
```
You'll see a message with the next step once this is done:
```sh
$ docker swarm init --advertise-addr <manager_address>
Swarm initialized: current node (dxn1zf6l61qsb1josjja83ngz) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join \
    --token <some_token> \
    <manager_address>:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```
We'll do exactly that, on the worker nodes, run the command it gives you
```sh
$ docker swarm join \
--token <some_token> \
<manager_address>:2377
```
Now on the manager, if you run `$ docker node ls`, you should see some of your nodes:
```sh
$ docker node ls

ID                           HOSTNAME  STATUS  AVAILABILITY  MANAGER STATUS
dxn1zf6l61qsb1josjja83ngz *  manager1  Ready   Active        Leader
```

Now our infrastructure is ready to go!
#### Let's create the services

Now, we want to create a docker-compose file. The point of this file is to instruct Docker / Swarm what it actually needs to run and set some parameters around running the container.
```YAML
version: "3.3"

services:

  mqtt:
    image: matteocollina/mosca:latest
    networks:
      - hass
    ports:
      - 1883:1883
    volumes:
      - ./mqtt:/db
      - /etc/localtime:/etc/localtime:ro
    deploy:
      placement:
        constraints:
          - node.labels.network == internal

  home-assistant:
    image: homeassistant/home-assistant:latest
    networks:
      - hass
    ports:
      - 8123:8123
    volumes:
      - ./home-assistant:/config
      - /etc/localtime:/etc/localtime:ro
    deploy:
      placement:
        constraints:
          - node.labels.network == internal
networks:
  hass:
```

Let's dig a little deeper into this. Note that the spacing matters!

The first line `version: "3.3"` specifies the version of syntax we're using in the YAML file.

Next, we define our services by calling out
```YAML
services:
```
Under here, we have our first service we're running, which is our Mosca MQTT server. Both, the Mosca and Home Assistant services, are pretty similarly laid out. Structurally, we start with giving it a name:
```YAML
  mqtt:
```
Next we specify an image:
```YAML
   image: matteocollina/mosca:latest
```
After that, we create a virtual network to which it belongs; in my case, it's named "hass". If you notice, my syntax is slightly different, but that's because this is only a subset of my configuration to get you started. I have other networks that I connect to for things like using a [Traefik](https://traefik.io/) load balancer, which frontends all my internal sites.
```YAML
  networks:
    - hass
```
Now that the network is ready, we need to expose some ports. Otherwise, it will still work, but only from within the system. I typically don't expose the port and front end it with [Traefik](https://traefik.io/), but for this example, let's keep it simple and expose it to the public.
```YAML
  ports:
    - 1883:1883
```
Next, we want to get some persistent storage in there. In the container world, all data within a container is lost when the container is destroyed unless externally mapped. In my case, I've got a NFS volume from my NAS mapped to my Linux Docker VMs (normally these are on bare-metal servers, but this is in my lab and power isn't free, so I'm using VMs across multiple hosts). The syntax for volumes is pretty simple; on the left of the ":" you have the host folder (i.e. the folder on the host that you're mapping), and on the right, is the folder you're mapping to in the container. I included the "localtime" so that it can pull time from the host; you don't necessarily need to do that, I moreso do it out of habit now. In the case of my Home Assistant service, the volume represents where my configurations are stored.
```YAML
  volumes:
    - ./mqtt:/db
    - /etc/localtime:/etc/localtime:ro
```
In the case of my Home Assistant deployment, I use the './homeassistant' directory to map my configurations. I have this configuration pulled from GitHub so that I have some versioning, as well as being able to share my code with the world.
```YAML
volumes:
  - ./home-assistant:/config
````
Lastly, we have the deployment parameters. This part is optional. These say where to place the containers, how to spread them, how many containers to spin up per service, etc. In the example above, we only spin up one instance (default) on Docker hosts who have the label "internal" attached to them (This is labelling that I use to separate my internet-facing hosts from internal). You don't need this in your configuration. By default, Swarm wants these containers to stay up. If it detects that one node is down, it will spin the service up on the next available host. **Note: it's important in this case to have the shared storage with persistent volumes so that the next host can pick up where this one left off**
```YAML
  deploy:
    placement:
      constraints:
        - node.labels.network == internal
```
We replicate this configuration for the Home Assistant service; then lastly we define the network.
```YAML
networks:
  hass:
```
The way the configuration is right now, one of each container will be spun up, and if for whatever reason the container exits, it will automagically get spun up on another host.

Now we just fire up a new "stack" in Docker and off we go!
```bash
$ docker stack deploy <stack_name> --compose-file /path/to/docker-compose.yaml
```

You can verify its operation by running the command `docker stack ps <stack_name>`
```
ID                  NAME                    IMAGE                                 NODE                DESIRED STATE       CURRENT STATE          ERROR                              PORTS
8i95zt1j6yk3        hass_mqtt.1             matteocollina/mosca:latest            <node_name>         Running             Running 5 hours ago                                       
hrow43hwwvi1        hass_home-assistant.1   homeassistant/home-assistant:latest   <node_name>         Running             Running 5 hours ago                                       
```

The same way, you can modify the docker-compose file to add other services like AppDaemon, etc.

If you have containers restarting, you'll notice outputs of it retrying (in my case AppDaemon keeps failing while I test something). This could be for a number of reasons, including that it may not be able to reach the persistent data folder:
```
ID                  NAME                    IMAGE                                 NODE                DESIRED STATE       CURRENT STATE          ERROR                              PORTS
93aq4ga8yuum        hass_appdaemon.1        acockburn/appdaemon:latest            <node_name>         Ready               Ready 3 seconds ago                                       
zxh1q34t8fjt         \_ hass_appdaemon.1    acockburn/appdaemon:latest            <node_name>         Shutdown            Failed 7 minutes ago   "starting container failed: Noâ€¦"   
zull2ubkn9r1         \_ hass_appdaemon.1    acockburn/appdaemon:latest            <node_name>         Shutdown            Failed 7 minutes ago   "task: non-zero exit (1)"          
zx7acaj2dqme         \_ hass_appdaemon.1    acockburn/appdaemon:latest            <node_name>         Shutdown            Failed 2 hours ago     "task: non-zero exit (1)"          
zv9dngw41jow         \_ hass_appdaemon.1    acockburn/appdaemon:latest            <node_name>         Shutdown            Failed 3 hours ago     "task: non-zero exit (1)"          
hrow43hwwvi1        hass_home-assistant.1   homeassistant/home-assistant:latest   <node_name>         Running             Running 5 hours ago
```

## Travis-CI
As I mentioned above, I have some basic configuration checking built in by using GitHub and TravisCI. By pushing my code to GitHub, and by enabling Travis-CI to integrate with my repo, I can have Travis running some basic checks on the configuration. Basically, Home Assistant has a configuration consistency checker built in by running `$ hass -c . --script check_config`. Integrating with Travis-CI, we get a capability where when an update is made to the code and pushed to GitHub, Travis-CI will automatically spin up an environment and test my config by running the previously mentioned script for checking the configuration. If I miss some required configuration or messed up the syntax on something, Travis-CI will pick that up and notify me. Though I could do this manually, this frees me up to do other stuff in that time. Have a look at https://github.com/rkaramandi/hass-config/blob/master/.travis.yml for my Travis configuration. If I was doing this in the cloud (i.e. AWS, etc) I could actually have it automatically pull down the code and restart it too if it passed the build. While I'm not there yet, though I'm hoping to do that soon at some point.

You can check out my HomeAssistant configuration at https://github.com/rkaramandi/hass-config. Right now it's just a development config that I'm using to build my stack, but it will eventually be my full production configuration.

That's all for now!
