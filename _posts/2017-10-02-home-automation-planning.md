---
layout: post
title:  "Home Automation // Considerations before automating a home"
description: What should you consider while designing a home automation system? This topic covers things like what you can automate, and designing for usability and natural interaction with daily life.
date:   2017-10-02
tags: [home-automation, design, iot]
comments: true
share: true
---
So - you're looking to automate your home, and don't really know where to start. I've been seeing a lot of threads on Reddit for the last while where people are asking what they should do for automating their homes, and where to begin. I'm not going to cover specific products since technology evolves daily, but hopefully I can get some ideas flowing in your mind with some common use cases and some things to consider!

## What should I do first?

Ah yes - the age old question. Unfortunately that's not something I can answer; but hopefully we can figure out what the different paths are so that you can make the decision. You can obviously go down multiple paths simultaneously, but it's a matter of what you prioritize, and what you (and your cohabitants') primary concerns are. For example: if you already have a professionally monitored home security system and aren't looking to move away from it, then maybe that's not the highest priority over something else, like conserving electricity.

Whatever it is you end up doing, just make sure that there is a reason for it. Home automation can be amazing, but unless you have a good reason to do it, it might just be a money-sink where you invest in the technology and don't use it.

**Keep in mind** no technology is perfect, so expect hiccups, or things to break (though unlikely if properly set up - but not impossible).

So what are the options? What different things can be done? Where do you start? This is by no means an exhaustive list, but it hopefully covers about 70-80% of cases.

### Home security (Door locks, motion detection, door/window open/close detection, cameras, etc)

Home security, as the name suggests is mostly around the premise of protecting your premise. Some common use cases are:
* Knowing when trusted people (like family) are home
* Conversely, knowing when untrusted people are home
* Monitoring who is on your property (via video)
* Monitoring for fires, floods, and other such destructive activities
* Letting in a dog-walker or someone who may be renting your property for a bit (like Airbnb)
* Notify when kids/pets/seniors arrive home or leave
* Make sure your garage doors are shut and doors are locked when you're not home (especially if you're travelling! There's nothing worse than the uncertainty of whether or not you left your door unlocked right as you board a flight to go to another continent for a while)

The above are just some use cases, but hopefully you can come up with your own based on a couple of those.

**Important:** I'll leave this first topic with the following food for thought - home security is sometimes a touchy subject because depending on your adversity to risk, you may want to consider getting it monitored professionally. You can roll your own system, have notifications, have sirens go off, etc, but if no one is around to look at the alerts or hear the alarm, then that may be a risk that you're facing. I'm in no way pushing for one way or the other, but just keep that in mind when designing your home security.

### Environmentals (Lights, Power, HVAC, etc)

Environmentals are about making the environment around you more comfortable. That is, using automation to do trivial tasks easier and to possibly save utility costs, etc. Let's look at some examples:
* Turn on lights automatically (and dim/brighten to a certain brightness) based on sunset or even room brightness (for dark and cloudy days)
* Help yourself wake up better by turning your bedroom lights into something like the [Wake-Up Light](https://www.amazon.ca/Philips-HF3500-60-Wake-Up-Light/dp/B00F0W1RIW/). Sidenote: I can't say that I've used these, but a lot of people have claimed that it really helps them wake up because of the sunlight simulation.
* Automatically have your HVAC go into an 'away' state when no one is around to save utility costs
* Have lights automatically turn on when you enter a room

You can make some really neat things happen when you combine these activities. A lot of these need the same types of hardware. Typically you need lights or light switches, maybe some power outlets that are controllable, a smart thermostat, and some sort of presence-sensing mechanism to see if specific people are present or not.

#### Multimedia

I put this in as a sub-topic of environmentals because to me its a combination of environmentals and entertainment systems, etc.

Putting the environmentals and multimedia together, you can do some pretty snazzy stuff! For example, you can have a "movie mode" where multiple systems in a multimedia setup turn on (eg amp, tv, media player, etc), and when you start playing a movie or show, the lights automatically dim to a level you set, to give you that cinema-like experience!

### Others

* [Automatically water plants](https://www.faradayrobotech.com/single-post/2016/11/09/Arduino-based-Automatic-Plant-Watering-System) based on soil moisture.
* Similarly, efficiently and automatically water your lawn based on the weather outside using smart sprinkler systems
* Vacuum the house everyday when no one is home

## How do I make it happen?

At a minimum, you need sensors, and other devices that can give you feedback on what's going on or what their state currently is. There's a slew of different devices that do different things - some cheap, some expensive, and some you can make yourself (if you're up to it)! Some common examples of these are:
* Smart locks
* Motion sensors
* Smart switches
* Smart bulbs
* Presence sensors
* Smart thermostats
* Smart remotes (for multimedia activities)
* Door open/close sensors

There are a lot of smart devices that also act as their own ecosystem (eg. Nest, Logitech Harmony, etc) where they have some automation capabilities out of the box - and this may be good enough depending on what you want to do or how far you want to get into this. If not, you might want to consider getting an IoT hub - ideally one that supports a variety of different protocols for connectivity (eg. Wired/WiFi Ethernet network, Zigbee, Z-Wave, Bluetooth, etc). I've gotten a few questions about what protocol is preferred, or what are most things using these days; sadly, there's no real answer to that yet. No one standard has emerged (at least to my knowledge) over the rest as the 'standard' IoT method of connectivity. Ideally, if you get a hub that supports most of these, you should be good for the most part. There might still be some one-off systems that you'll have to spend some time Googling to figure out, but between those options, you should be covered (hubs exist with all those different options put together).

There are both paid and free options of hubs, depending on what you're looking for. The free ones are typically just software you could install on something like a Raspberry Pi or old laptop, and support ethernet/WiFi, with the capability to add other physical radios like Bluetooth, Zigbee, and Z-Wave. These are software-based like I mentioned, so expanding the capability for other radios requires additional physical hardware.

**A shameless plug:** I'm a huge fan of [Home Assistant](https://home-assistant.io) (no they're not paying me for saying that), which is a free and open-source home automation software. As part of sharing my obsession with it, I encourage you to check out the [Home Assistant Podcast](https://hasspodcast.io/) which I sometimes co-host at [https://hasspodcast.io/](https://hasspodcast.io/). Subscribe on whatever your preferred podcast app/player is! (not paying me for that either...)

**Note:** Some of these may need some basic to moderate level of programming knowledge to do advanced automations. With that said, basic automations are usually pretty easy to deal with - depending on the platform. I'm sure there are some platforms out there to do advanced automations easily too, but I just haven't come across it yet!

## Usability and things to consider

Usability is a huge, but often forgotten aspect of home automation. By usability, I don't mean reliability, but rather how you interface with your automation.

First, a lot of people find the notion of using their mobile device to turn off or turn on a device pretty neat (and don't get me wrong, I do as well!), but to some extent, it's not very practical. On the other hand, it should be intuitive enough that when someone like a guest comes in, they should ideally know how to interface with the system without any coaching. Again - doing it for bragging rights, and doing it for utility are two different things. If you do it for bragging rights, you may never use it practically. Light switches are a great example - if you want to turn on a light, you could:

a) find your phone; pull it out; unlock it; find the app; open the app; wait for it to load; find the light switch power icon in the app; then press it to turn on the light, or
b) walk up to the light switch; press the button.

In this case - b) seems to be the easier option

Ideally, your automations should be just what the name suggests - automated. This means that a home automation system triggers actions as things happen (eg. trigger - time is 5:45 pm; action - turn on the porch lights). Notice how there's no human interaction in that. When designing the solution,  automations should wherever possible happen on their own; not by going into an app or portal and triggering actions, unless we want to do a one-off. Let's take an example of someone coming home. Walking into the house, and pressing a button to turn on a "welcome home" scene (that maybe turns on a set of lights, etc.) less intuitive than if the system itself detects that a presence sensor (physical sensor, mobile device, car, etc) has arrived, and realizes "Hey, Rohan's home!", triggering that same scene automatically.

Of course, there are always one-off's, and the question arises around how to deal with that. In other words, let's say your property is automated to your satisfaction, there may be a situation where you want to manually override something. For example, if it's still bright out, my "turn lights on" automation won't trigger, but if I drop something under the bed and want to brighten up the room a bit with the lights in the room; how do we deal with that? Sure you can get up, walk up to the switch, and turn it on manually, but that's also sort-of impractical while you're under your bed.

So how do we deal with this?

### Enter voice...

For the time being (until something more advanced comes along at least), voice is a great alternative to using the app or doing a task manually for several reasons that we mentioned above.

1) It's intuitive; I can say a command like "turn on the living room lights", and that task would just happen
2) It's not a burden; I don't have to pull out a device go to a portal to do a simple one-off task
3) It makes life easier for the non-technical users in the house like guests and other family members, which then drives up the utility and usability of the system.

I'm not saying that voice integration is the ultimate solution, but the benefits definitely outweigh the cons when you're talking about augmenting your home automation setup with voice. Plus, let's face it, you're talking to your house, and it's responding back - there's just something intrinsically cool in that! With that said, there are tons of situations where Alexa, Google Home, etc hear something else when you ask it to do something :)

### Security

If you watch the show "Mr. Robot" (on USA), the first episode of the second season shows some pretty scary - but oddly sobering concerns around home automation. **(Spoiler Alert)** If you don't plan to watch the show - the Readers Digest version of it is that they take-over a lawyer's smart home since it's on the same network as the lawyer's computer and make all of the systems freak out (play music automatically, lower a projector automatically, etc) driving her out of the house.

Sadly, even though it's dramatized, IoT is unfortunately front and center when it comes to security breaches right now. Think about it this way - does your Doorbell have an antimalware mechanism on it?

To start with, figure out where you stand with your comfort levels of your privacy as it relates to you and your family resting in someone else's hands (i.e. your location data sitting in someone else's "cloud-based" infrastructure). Cloud access makes life WAY easier to manage your devices, scenes, and automations; from both inside and outside your property, but the data is out of your hands. If you do choose to have cloud based services (nothing wrong with doing that - there are some really good ones out there), at minimum follow proper best-practice security practices like having strong passwords and enabling dual-factor authentication wherever possible. You may also want to track logins, etc if the platform allows it.

For local (i.e. residing within your house) home automation implementations, it's crucial to make sure that your network is protected sufficiently. Using services like a security-focused cloud DNS is a good idea, as they tend to block malicious requests. It's also a good idea to segment the network that your home automation devices sit on and restrict access to that network.

Lastly, be careful with using things like automated locks on voice control systems; you don't want a burglar to walk in and yell "Alexa, unlock the front door" and the door opens for them.

Unfortunately there is no such thing as perfect security today, but just make sure to do a bit of your own research on security for cloud-based and on-premise IoT solutions.

## Conclusion

I'll end with this - figure out what your priorities are with automation, and what you want to do. But - as part of that process, make sure you take usability and security into consideration.

Also, have a look at the post on [Perfect Home Automation](https://home-assistant.io/blog/2016/01/19/perfect-home-automation/) on the Home Assistant Blog that Paulus posted - it's another good primer on home automation.
