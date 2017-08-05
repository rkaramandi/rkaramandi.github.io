---
layout: post
title:  "VXLAN // An Introduction"
description: 
date:   2016-10-25
tags: [vxlan, datacenter, networking, sdn]
comments: true
share: true
---
For my first blog post - I thought I should start with something that a lot of people have been asking me lately: "What the $!@% is VXLAN?". There's been a lot of talk lately about the “next generation data center” using VXLAN - whether that's Cisco, VMware, Arista, etc. – data center technology is moving down this path. I’ll note that this isn’t meant to be a deep-dive into VXLAN, but rather a high-level overview of what it is and why it matters.

## "What is it? Why should I care?"

Long story short, Virtual eXtensible LAN (or VXLAN) a way to tunnel Layer 2 frames through Layer 3 protocols. Now, the more important part is why it matters. With more organizations adopting a cloud strategy, and imposing requirements such as site redundancy, multi-tenancy, etc., there's a very large push for this new way of building data centers. Also, as you look at applications that reside in the data center, there is fundamentally a lot more traffic moving "east-west" rather than "north-south". That is - most of the traffic is moving within or in-between data centers, rather than between the data center(s) and externally. If you’re unsure of East-West vs North-South, have a look at the explanation Greg has on etherealmind.com.

Another large issue to consider, is that data centers are moving towards highly virtualized workloads with Virtual Machines (and now containerization; like Docker and LXC). This brings up a problem – remembering that multiple VMs are a part of a single host, the explosion in VM density means that there is significantly more space used in switch MAC address tables, since each port on a switch is now a lot denser and has more than one MAC address per port.

## What does it achieve?
### Network segmentation

VXLAN is similar to VLANs in the sense that it has the concept of network segmentation built-in. In the traditional L2 world, we address each segment as VLAN # <1-4096>. In the VXLAN world, we call these segments VXLAN Network Identifiers, or VNI for short. Unlike the 12-bit VLAN identifiers, VNI's are 24-bit, allowing for ~16 million unique segments, rather than 4096.

Now imagine you’re working in a multi-tenant environment like a cloud hosting provider – where you have multiple customers hosted on the same physical infrastructure. The problem becomes that 4094 segments sometimes isn’t enough to isolate all your customers from each other. To mitigate this, we run VXLAN on top of our existing environment, segregating tenants that share the same physical infrastructure, and possibly re-use the same IP spaces.

### Layer 2 tunneling

Essentially what happens in a VXLAN environment, is that we encapsulate our frames with VXLAN headers, utilizing a "MAC-in-UDP" encapsulation mechanism (explanation in the next section). With this, we can start traversing L3 networks and tunnel L2 through them. The end goal here is to stretch these L2 networks between data centers without the use of a specific L2 service, like VPLS.

Since the overall VXLAN frame a proper Ethernet frame that any normal switch can recognize, it can easily traverse through L2 and L3 devices that aren’t capable of handling VXLAN.

Now, let’s expand on the example I gave above with the multi-tenant cloud environment. Typically, these environments get built out in “pods” of compute, storage, and network. Now - you have multiple tenants that need to be isolated, which you’ve achieved with VXLAN, but they’re running out of resources in the pod that their infrastructure currently resides in. Or maybe they want to achieve redundancy by having their workload run in separate data centers. Since VXLAN allows you to tunnel L2 traffic, it’s just a matter of connecting up the pods/data centers and using VXLAN to bridge the two pods/data centers together.

This means that something that might physically look like this (note that the different clients in this example are using the same IP numbering scheme):

![Network Diagram]({{ site.url }}/images/1-vxlan-intro/Figure_2-CSP_Physical_Layout.png)

Really achieves this:

![Logical Diagram]({{ site.url }}/images/1-vxlan-intro/Figure_3-Logical_Tunneled_Network.png)

Obviously, this is a grossly over-simplified diagram, but it gets the point across. Think of the diagram spread out over thousands of hosts, with hundreds of VMs each - some of which possibly may even require L2 adjacency between hosts or data centers.

## OK – so how does it work??

As mentioned above, VXLAN is a MAC-in-UDP encapsulation method, which sounds a lot more complicated than it actually is. It looks something like this:

![Logical Diagram]({{ site.url }}/images/1-vxlan-intro/Figure_1-VXLAN_Packet_Structure.png)

As you can see here, it’s a standard frame (the original frame), encapsulated in another standard frame, with a bit of magic in the middle, highlighted in blue. First, you have a normal UDP header as part of the outside frame, using port 4789, which is the IANA-assigned port number for VXLAN. Inside this, there is the original frame, and the VXLAN header. The two important pieces in this are the 5th reserved bit in the flag, and the 24-bit VNI, that identify VXLAN and the segment this frame belongs to.

That’s it for now – stay tuned for more topics coming out whenever I get a chance to write them!
