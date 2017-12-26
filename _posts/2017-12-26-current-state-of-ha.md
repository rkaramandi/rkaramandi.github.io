---
layout: post
title:  "Home Automation // Current State of My Smart Home"
description: Here's what I'm running at home today!
date:   2017-12-26
tags: [home-automation, iot]
comments: true
share: true
---
I've been asked a few times about what I'm running at home in terms of home automation. Right now, my needs are pretty simple; it's all about making my life easy and not having to worry about the little things.

## Light Switches:
I'm primarily on the Lutron ecosystem. I did start out with Linear Z-wave switches, but they were a bit tedious to work with and didn't really look good. Moreover, my house wasn't built with home-automation in mind, and used shallower wall-boxes, which meant I had to use wall-box extenders from Home Depot (https://www.homedepot.ca/en/home/p.shallow-wallbox-extender-for-gfci-white.1000152020.html) to get around it. The Lutron switches were shallower, which allowed me to mount the switches flush against the wall, like normal switches usually are. I started with a bridge/dimmer kit then expanded from there.

  - Lutron
    - [Lutron Caseta Wireless Dimmer Kit with Smart Bridge](http://amzn.to/2DgnCs9)
    - [Lutron PD-6ANS-WH Caseta Wireless Switch](http://amzn.to/2DijUyr)
    - [Lutron PJ2-2B-GWH-L01 Pico On/Off Remote Control](http://amzn.to/2Dhg0FL) (To add remote switches)
    - [Lutron PD-6WCL-WH Caseta Wireless Dimmer](http://amzn.to/2CaVuHF)
    - [Lutron P-PKG1W-WH-C Caseta Wireless Dimmer + Pico Remote Kit](http://amzn.to/2C7UYu3) (for where I needed 3-way switches or an extra switch)
  - [Linear GoControl WS15Z-1](http://amzn.to/2BEnLp7)

On the other hand, I have a few table lamps that I automate. Those are all on Wemo. Though I'm not a huge fan of the stability behind Wemo (i.e. Alexa has a hard time always being able to talk to it, as is their own app), It's what I bought into, and unfortunately most other devices use mDNS/Bonjour as well for discovery, so it's not a ton better. Wemo's support team on twitter isn't bad either; they usually try and make things right if they can. On the Wemo line, I've got:
  -  [Wemo Mini](http://amzn.to/2BVnNNy) - These ones are my favourite out of the bunch, since they have a much smaller form factor, allowing for plugs underneath. Plus they were on sale pretty much from Black Friday until now for $25 CAD (at the time of writing), which was a great bonus! They don't give you insight into the power usage like the next one does, but that's honestly not a make-or-break for me.
  - [Wemo Insight Switch](http://amzn.to/2DeWQk3) As I mentioned above, these guys can tell you your electricity usage. Even though I use them for lights and such, they're probably best on things like air conditioners and heaters if you're concerned about usage
  - [Wemo Switch](http://amzn.to/2DizGci) - nothing special about these guys; as far as I'm concerned, for my utility, they're similar to the Wemo Mini's, except fatter, and honestly, a bit uglier

## Doors / Windows:
This was one of the first things I did to the house to get me up and going. At the time, I didn't do a ton of research and bought the SmartThings SmartSense open/closed sensor, which does work great, is quite reliable, and has a great battery life, but looks a touch bulky.

  - [SmartThings SmartSense Open/Closed Sensor](http://amzn.to/2C7OdZg)

Instead, I'm currently looking at a recessed Door Sensor, Aeotec's or Monoprice's since it's hidden and out of sight.

## Climate:
Even though I have other Nest items (below) I opted to go with an Ecobee3 since I can use the remote presence sensors around the house to try and optimize the areas where people are around. The only problem I have right now with this system is that the way it calculates temperature is by using the average temperature around the house. In other words, if my thermostat is set to 23 degrees, and my basement is 20 degrees and upstairs is 23, my house will still warm up so that the *average* temperature is 23. Combine that with the fact that I don't have any sensors in the bedroom which means that it can get pretty hot in the winter when I'm sleeping.

- [Ecobee 3](http://amzn.to/2zxC8d0)
  - [Ecobee Remote Sensors](http://amzn.to/2zzcDrC) - I eventually want to get more sensors for the bedroom, kitchen, etc. Just waiting for the price to drop a bit. At the time of writing (Boxing Day in Canada), [Best Buy](https://www.bestbuy.ca/en-ca/product/ecobee3-remote-wi-fi-temperature-sensor-eb-rse3pk2-01-2-pack/10368680.aspx?) apparently has them on sale (a duplicate, where the original is normal price - I suspect an error), but is sold out.

## Media:
  - Apple TV 4
  - Google Chromecast
  - Logitech Harmony Ultimate Home Remote w/ Harmony Hub
  - Raspberry Pi 3 running Rasplex

## Presence:
  - [SmartThings Motion Sensor](http://amzn.to/2DerlGU)
  - SmartThings Presence Sensor - not sure if they sell this anymore but it looks like the [Arrival Sensor](http://amzn.to/2DerVo4) is more modern
  - SmartThings Phone Sensor - using the SmartThings app
  - TrackR Bravo (deprecated)

## Cleaning:
  - iRobot Roomba 860
  - Looking to get am iRobot Braava Mopping Robot

## Smoke / Fire Alarm
  - [Nest Protect](http://amzn.to/2Dg0VnY)

## Home Automation Engine:
For my home automation hub, I use a combination of [Home Assistant](https://home-assistant.io) and [SmartThings](https://www.smartthings.com/). All my automations and almost all devices sit in Home Assistant, and SmartThings acts as my Z-Wave/Zigbee hub for any devices that I have supporting those technologies, which get sent over and automated in Home Assistant using MQTT and the [Smarter SmartThings](https://home-assistant.io/blog/2016/02/09/Smarter-Smart-Things-with-MQTT-and-Home-Assistant/) integration. I will eventually get off SmartThings and use local radios sitting on a Raspberry Pi or something similar, but until then, this works well enough.

I've been asked a couple of times about why I'm using Home Assistant when I already have a SmartThings hub. There are a few reasons:
  1. I really don't want to learn Groovy - the programming language they use
  2. The automations I want to do aren't really too complicated, and I found that automating them using ST was just too much
  3. The ecosystem is massive, and growing even faster; people like [Franck](https://twitter.com/Frenck) and [Dale](https://twitter.com/dale3h)
  4. Being an open ecosystem, you know exactly what's going into the code, and eventually exactly what you're running at home. Plus it's all local with no dependence on the cloud (unless of course you've got a cloud service you're using; and/or are using the [recently announced Cloud component](https://home-assistant.io/blog/2017/12/17/introducing-home-assistant-cloud/))

I hope to have a little more done down the road, right now I just have to get some home reno's done =) Slowly but surely...
