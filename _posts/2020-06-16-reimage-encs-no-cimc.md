---
layout: post
author: "Rohan Karamandi"
title:  "ENCS // Re-imaging without dedicated CIMC Access"
description: This post is a walkthrough for installing the NFVIS hypervisor on the ENCS 5400 via an ISO install without dedicated CIMC access.
date:   2020-06-16
tags: [nfv, encs, networking, sdn]
comments: true
share: true
---
## Re-Imaging ENCS via CIMC when no CIMC connection is present

It’s been a while since I’ve posted, and I've been meaning to post more home automation stuff, but this is something top of mind for some of my enterprise customers, and thought it would be good to share. Before continuing, I would like to thank Kent Lai for helping me validate the configuration. Also, before we start, I cannot stress enough that you should FIRST TRY THIS IN A LAB!! Also note that you're doing this at your own risk! Don't blame me if you break anything :).

If you’re not familiar with the Cisco Enterprise Network Compute System (ENCS) platform, check it out [here](https://cisco.com/go/encs). Essentially, ENCS is a platform built around running enterprise NFV’s and has some advanced capabilities that I will talk about in future blog posts. ENCS runs a purpose-built hypervisor named NFVIS, which you may be familiar with if you use Cisco [Cloud Services Platform](https://cisco.com/go/csp) (CSP) servers. 

The scenario here is that they have a large number of branches (1500+) where an old version of NFVIS is installed on the devices. Instead of having to go through them and upgrade them one by one, validate, and re-connect, they are looking to manage them through [Cisco vManage](https://cisco.com/go/sdwan) which is the management UI used to manage SDWAN, which they operate today. 

If you’re not familiar with CIMC, the Cisco Integrated Management Controller is normally found on compute platforms, such as UCS to perform out-of-band / lights-out management tasks on the server. CIMC is typically out-of-band from the processor (i.e. it has its own processor) and NICs, but the NIC’s don’t always have to be out-of-band. The ENCS platform also leverages CIMC as to ensure the ability to manage the system remotely if/when the box is turned off. For example, you will have the ability to re-image the ENCS box while it is powered off, as long as you have remote connectivity to the CIMC port (possibly through LTE or a secondary router).

### So what happens if you don’t plug in the CIMC port?
Well…everything still keeps working, but at the same time, you may not be able to get fully out-of-band access. However…the engineering team behind ENCS put in a command where you can bring the CIMC in-line, and use the ENCS’ native management system instead. With that said though, the **best practice is to plug in the CIMC port**. If you haven’t done it, and the box is already in production, that's ok, you can use the `system settings cimc-access enable` access in the NFVIS CLI which is accessible through SSH in-band. You'll lose some insight during the upgrade, but it will still work. It’s important to note that this is **only possible with the ENCS 5400 Series**.

```
nfvis# config t
Entering configuration mode terminal
nfvis(config)#
nfvis(config)# system settings cimc-access enable
nfvis(config)# commit
Commit complete.
nfvis(config)# end
```

These would map the following ports to the CIMC using the in-band management IP address:
* 20226 for SNMP
* 20227 for SSH
* 20228 for HTTP
* 20229 for HTTPS

### Download and map an ISO to the ENCS via CIMC CLI

Now - the premise of this was to upgrade the ENCS via an ISO mount. To do this, we want to upload the ISO to the CIMC part of the ENCS, since the main NFVIS portion of this is going to get wiped and get a fresh install. As such, we want to SSH to the newly in-band CIMC port, and go to the image mapping section. Obviously, replace NVFIS_IP with the IP address of your NFVIS instance.

```
ssh -p 20227 admin@NFVIS_IP
Warning: Permanently added '[NFVIS_IP]:20227' (RSA) to the list of known hosts.
admin@NFVIS_IP's password:
ENCS5412#
ENCS5412#
ENCS5412# scope host-image-mapping
```

If you check, there are probably not any files already there:

```
ENCS5412 /host-image-mapping # show filelist
ENCS5412 /host-image-mapping #
ENCS5412 /host-image-mapping #
ENCS5412/host-image-mapping # show detail
    Current Mapped Image : None
    Host Image Status: None
```

Now, let’s download the image from an HTTP server we have remotely accessible by the ENCS via the management interface. This isn’t just limited to HTTP, but just for this example, let’s use HTTP. Again replace `HTTP_SERVER_IP`and `VERSION` with your respective details:

```
ENCS5412 /host-image-mapping # download-image HTTP HTTP_SERVER_IP image/Cisco_NFVIS_BRANCH-VERSION.iso
Username:
Password: 
Image download has started.
Please check the status using "show detail".
ENCS5412 /host-image-mapping # show detail
    Current Mapped Image : None
    Host Image Status: Downloading ..Please wait
ENCS5412 /host-image-mapping #
...
<wait a little bit>
...
ENCS5412 /host-image-mapping # show detail
    Current Mapped Image : None
    Host Image Status: Image Downloaded and Processed Successfully
```

Great, once we see `Image Downloaded and Processed Successfully` in the show detail screen, we’re good to go! Keep in mind that this is all in the scope of `host-image-mapping` .

Now, if we `show filelist` again, you should see that the file has been uploaded:

```
ENCS5412 /host-image-mapping # show filelist
Index Name
----- ---------------------------------------------
1     Cisco_NFVIS_BRANCH-4.2.1-EFT3.iso
```

In this case, we’re testing with a development image, but you should see something similar.

Great, now that we have this uploaded, we can go ahead and map the ISO to the IP KVM portion of CIMC:

```
ENCS5412 /host-image-mapping # map-image Cisco_NFVIS_BRANCH-4.2.1-EFT3.iso
Please check the status using "show detail".
ENCS5412 /host-image-mapping # show detail
    Current Mapped Image : Cisco_NFVIS_BRANCH-4.2.1-EFT3.iso
    Host Image Status: Image mapped successfully, set CDROM as the Boot device.
```

You can see above that the image is mapped to the ISO we just downloaded. Now, let’s verify if the CDROM is properly set in the boot order. If not, set it.

### Set the boot order
First, let’s leave the `host-image-mapping` scope, and go back to the main CIMC and then go to the `bios` scope where we can set the boot order.

```
ENCS5412 /host-image-mapping # top
ENCS5412#
ENCS5412# scope bios
ENCS5412 /bios # show detail
BIOS:
    BIOS Version: "ENCS54_2.11 (Build Date: 02/10/2020)"
    Boot Order: CDROM:Virtual-CD,CDROM:CIMC-VDVD,HDD:SSD
    FW Update/Recovery Status: None, OK
    Active BIOS on next reboot: main
    UEFI Secure Boot: disabled
ENCS5412 /bios #
```

In case it’s not set to CDROM, then we can set it by entering the following:

```
ENCS5412 /bios # set boot-order CDROM:Virtual-CD,CDROM:CIMC-VDVD,HDD:SSD
To manage boot-order:
- Reboot server to have your boot-order settings take place
- Do not disable boot options via BIOS screens
- If a specified device type is not seen by the BIOS, it will be removed
  from the boot order configured on the BMC
- Your boot order sequence will be applied subject to the previous rule.
  The configured list will be appended by the additional device types
  seen by the BIOS
ENCS5412 /bios *# commit
ENCS5412 /bios # show detail
BIOS:
    BIOS Version: "ENCS54_2.11 (Build Date: 02/10/2020)"
    Boot Order: CDROM:Virtual-CD,CDROM:CIMC-VDVD,HDD:SSD
    FW Update/Recovery Status: None, OK
    Active BIOS on next reboot: main
    UEFI Secure Boot: disabled
ENCS5412 /bios #
```

Now leave the `bios` scope, and let’s reinstall the OS by rebooting!

```
ENCS5412 /bios # top
ENCS5412#
ENCS5412# scope chassis
ENCS5412 /chassis # power cycle
This operation will change the server's power state.
Do you want to continue?[y|N]y
ENCS5412 /chassis #
```

You **WILL** lose access to the CIMC (since you don’t have a dedicated port to access it), and it might take a while to install NFVIS, but it will keep running in the background even though the box might upgrade once or twice through the BIOS updates, firmware updates, etc.

