---
layout: post
title:  "MQTT // An Intro to MQTT for IoT"
description: Lately, I've been into building custom sensors and I've been talking to Farraday Robotech and he mentioned that it would be pretty helpful if I could do an introductory post about MQTT and its use in IoT applications.
date: 2017-01-16
tags: [mqtt, iot, home-automation]
comments: true
share: true
---
I use MQTT for custom sensors and integrating external platforms in my home automation setup. For those who are wondering, I’m using a combination of Home Assistant and SmartThings for my HA setup; but I’ll save those details for a separate post.

Lately, I've been into building custom sensors and I've been talking to [Farraday Robotech](https://www.faradayrobotech.com/) and he mentioned that it would be pretty helpful if I could do an introductory post about MQTT and its use in IoT applications. BTW - check out the blog – he’s building some pretty neat electronics + IoT devices and inspiring others to do the same!

## So...What Is MQTT?

Simply put MQTT is a client/server based messaging application, which runs over your normal TCP/IP networking stack. What that means is that you don’t really need any special protocols, etc on your network to use it.

With that said, there are three parts to getting MQTT to work: a publisher, a subscriber, and a message broker.

Let’s start with the easier two: the publisher and subscribers. Essentially, the publisher "publishes" messages **to** the server, and the subscriber receives messages **from** the server, which the publisher originally sent. Then there’s the MQTT Broker/Server. This guy is essentially a server with an MQTT application (a few examples of these are [Mosquitto](https://mosquitto.org/), [CloudMQTT](https://www.cloudmqtt.com/), etc.) that hosts all the conversations.

Put together, you have something that looks like this in a Publisher/Subscriber Model:

![MQTT Pub/Sub Model]({{ site.url }}/images/3-mqtt-intro/figure_1_mqtt_client-server.png)

## OK...Give Me An Example!

Pretend for a minute that your sensors are people, that are trying to tell other people what’s going on.

They are a part of a chat room (called a ”**topic**” in MQTT lingo), and they are writing (publishing) to others about what their status is, and you have others reading (subscribing) that are interested to find out what their status is. Sometimes these people are both publishers and subscribers, where they read conversations as well as write back.

Topics are typically set up in a hierarchical manner. Let’s have a look at one as an example:
```
Lights/Office_Room/Status
```

In here, we can see that we have the parent called `Lights`, within there, we might have a few different light switches, one for the office room, one for a washroom, one for a dining room, etc. And going another step further, we can maybe see different properties, like the status in this example. These can really be anything that you choose to use.

Now let’s take these concepts and apply it to something simple like a home automation system that’s controlling an MQTT based light switch. The light switch publishes its status (Let's keep it simple, and say `ON` or `OFF`, but it can be whatever you want it to be) to a room called `Lights/Office_Room/Status`.

So - You walk into the room and turn on the light manually using the switch on the wall. Now, the light switch closes the circuit, turning on the light; also, it fires off a message using the MQTT protocol to the MQTT broker, who’s IP is `192.168.1.2`, announcing to the topic `Lights/Office_Room/Status` is `ON`. That message is now pushed to anyone listening - in our example, this could be a home automation engine. So, the automation engine who asked to subscribe to the topic `Lights/Office_Room/Status` from `192.168.1.2` (can be authenticated, or not…depending on how the broker is set up), now receives an update: `ON`, and the user can log in and see that the light switch is on.

![Sending A Message]({{ site.url }}/images/3-mqtt-intro/figure_2_light_switch.png)

Similarly, if the switch can act as a subscriber as well, the home automation engine can send an `OFF` back to the switch (whether by user input, automation, etc.), and the switch would turn off.

What I didn't show on the diagram above is that technically, both the publisher and subscriber first "connect" to the server, and establish a communication channel between themselves and the broker. Only once the connection is established can the clients publish or subscribe to a topic.

## MQTT Broker Methods

The broker can accept a few different commands related to publishers and subscribers, which are pretty straight forward:
* **Connect/Disconnect**: which establish or terminate a connection between the broker and client
* **Subscribe/Unsubscribe**: which allow a publisher/subscriber to become a part of a topic, or remove themselves from a topic
* **Publish**: which pushes a status to the clients

## MQTT Tools

There are a whole bunch of tools out there for using MQTT. I mentioned some MQTT brokers above. I personally use Mosca running in a docker container, but both Mosca and Mosquitto seem to be pretty common for an on-premise MQTT server. HiveMQ is more enterprise-grade, and is a paid application that's optimized for larger deployments of MQTT, like in factories, etc.

Debugging MQTT can be kind of annoying, especially if you host your broker in a docker container, like me, so it's usually good to have a MQTT client handy on your laptop/phone. My go-to is a chrome app called [MQTTLens](https://chrome.google.com/webstore/detail/mqttlens/hemojaaeigabkbcookmlgmdigohjobjm?hl=en). It's free, easy, and seems to work pretty well; at least for what I need to do with it. Another one people seem to like is [mqtt-spy](http://kamilfb.github.io/mqtt-spy/), which is available on most platforms (Win/Mac/Linux) and is Java-based. 

That’s it for now! At some point, I’ll post an example from the code of a leak detector sensor I built, diagrams, etc in a separate post following this one! I'll also post a follow-up post later going into more advanced MQTT topics like QoS if I get the chance.
