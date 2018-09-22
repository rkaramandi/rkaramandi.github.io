---
layout: post
author: "Rohan Karamandi"
title:  "Home Automation // Presence Detection with Home Assistant"
description: A 2-Part blog published by myself and Phil Hawthorne around presence detection
date:   2018-09-22
tags: [home-automation, iot]
comments: true
share: true
---
This is one of two parts on presence detection. The other half of this post can be found on [Phil Hawthorne's blog](https://philhawthorne.com/breaking-down-presence-detection-with-home-assistant), where he covers WiFi, Bluetooth, and using Bayesian sensors for accuracy. If you haven't already, have a listen to [Spotlight Episode 2](https://hasspodcast.io/sp002) of the Home Assistant Podcast as this is a complementary post to that episode.

# Presence Detection
In home automation scenarios, presence detection becomes important to identify who is home (or not), and possibly even who is where in the house, and to make intelligent decisions based on that data. For example, we could say that because I'm home, we could use that information to trigger one set of automations - like turning on the lights; whereas when I'm not home, I might want to save energy and not turn on certain lights, or any lights at all. Essentially, using presence information really brings together the "automation" part of home automation.

Presence can be found in many different ways, but this blog is covering a couple that I use in my automations.

## Mobile Sensors
Personally, I use the SmartThings presence sensor on my phone to detect where in the world I am. I find that it's decently reliable sources in the sense that my phone has great accuracy and I don't have to worry about changing batteries, etc. While there are other apps (OwnTracks, Locative, etc) that provide location information, I chose SmartThings as I already had the app installed from my SmartThings installation and it's one less app. It's actually quite efficient on battery usage too from what I could tell. I tried using Home Assistant's integration with iCloud, thinking "oh maybe I can use that since it's native" I found really quickly that polling devices *really* drains battery quickly. So I settled back on using the SmartThings sensor built into the app.

### How Does it Work?
The premise of the SmartThings sensor is pretty straight forward:
1. What is your address? You feed this to the app.
2. Using your phone's built-in location mechanism, where are you?
3. Are you in the Geofence? Yes? Then mark the user as home.

In my case, I carry this across MQTT using the [Smarter SmartThings](https://community.home-assistant.io/t/smarter-smartthings-with-mqtt-and-home-assistant/42493) script. This tells my HomeAssistant instance (which has all my automations in it) whether I'm home or not.

Overall I'm a huge fan of mobile sensors, like the SmartThings mobile presence sensor, as long as they're efficient in its battery utilization. For the most part, they rely on phone location data, which is usually decently accurate nowadays.

## TrackR
Phil is talking about using Bluetooth/BLE sensors, but I'm going to talk about sensors like Tile, TrackR, etc as a whole since they work a little differently than BLE sensors. I use the TrackR Bravo myself, but they all have the same premise. I'm going to start with saying that this isn't necessarily the best use case for these types of devices...BUT...it does work. These devices are meant to track your keys, your wallet, backpacks, luggage, etc. And they do a fantastic job at that.

### How Does it Work?
These are a little more complicated than something like a mobile presence sensor, but still has a reliance on your mobile device;
1. The fobs / devices connect to your phone using Bluetooth
2. The app registers those fobs under your login credentials
3. The app also registers your location, which like above, is provided by your phone
4. As the app is connected to the fobs, it determines that the specific connected fobs are in the current location on the map
5. With this information, it updates the map saying that the fob is in this place.

The principal is similar, except now we have a hardware fob. There are a couple of pros and cons with this
Pros:
- The fobs act as a beacon to locate lost items (e.g. the TrackR can sound a built-in chime to help you find objects that are in range)

Cons:
- You have to worry about batteries and replacing them (Apparently TrackR gives free battery replacements?)
- There's a higher cost since there is a hardware component
- Not overly accurate (i.e. room-to-room presence)

## ZigBee/Z-Wave Presence Sensors
Lastly, I'm going to talk about ZigBee-based Presence Sensors. Like I've mentioned in the past, I started my Home Automation journey with SmartThings, but then shifted to Home Assistant, and as such had some things that came along with me; like the mobile sensor and my ZigBee-based Presence sensor. SmartThings actually calls it an Arrival Sensor. Sure...why not?

### How Does it Work?
Probably the simplest of all the sensors here so, it's a fob that connects to the ZigBee network in your home. When you're home, it remains connected, and says that you're home. When you leave, it no longer communicates with the ZigBee network, and then marks you as away. That's it. Nothing else to worry about.

As much as dealing with replacing batteries on this thing annoys me, it's probably my favorite and most reliable way of letting Home Assistant know that I'm home. Sometimes there's nothing really to beat a good old hardware fob that doesn't rely on your cellphone. I leave one of these in my car (I'm not really in a town where things are walkable; so I need the car for most things), and the idea is that if my car is home, then I'm probably home. If it's gone, then I'm probably gone. I had this on my keys for a while since it's technically more accurate, but with it's bulk, I opted for a TrackR on my key, and the ZigBee sensor in the car. My thoughts on these:

Pros:
- Not reliant on cellphone; it connects directly to your home's ZigBee/Z-Wave network
- Batteries actually last a decently long time

Cons:
- Even though the batteries last, they still need to be changed from time to time
- Just like the TrackR, there is a higher cost to this since we need a physical fob
- Not overly accurate (i.e. room-to-room presence)

## In Conclusion...
All three of these methods seem to work pretty well for me, with my favorite/most relied on being the ZigBee sensor. I've found that the TrackR, for having an additional device (cellphone + fob), isn't overly effective, though its a cheaper way of tracking devices than using something like a ZigBee/Z-Wave sensor. I've also found that the app sometimes loses connectivity with the fobs which can be a bit frustrating since you don't realize that it's disconnected. While this doesn't always happen, it's still frustrating when it does once in a while.

The mobile presence sensor is a good complement to the fobs. While I'm not tied to SmartThings for that, it seems to work well enough for me, so I'm ok with it. Who knows, I might give OwnTracks or some of the other ones a try later on too.

Lastly, if you noticed, none of my presence sensors really detect in-room presence or anything to that degree. I found that I'm not doing anything (yet) that needs that level of accuracy; for the most part I just care about if I'm home or not. If you are looking at that level of accuracy, I would look at the BLE sensors that Phil talks about.
