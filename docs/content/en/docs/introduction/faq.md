---
title: "Frequently Asked Questions"
linkTitle: "FAQ"
weight: 20
---

Below is a collection of frequent questions and the best answers I can give.

### Why do I need Vortex for this?

You don't! If you prefer installing and managing your mods manually, or using any other modding tools, I recommend using them! HZDV is just an alternate method of installing mods for those who are more familiar with Vortex already. In particular, installing Horizon Zero Dawn mods manually is not particularly arduous if you are used to it.

### I’m a mod/pack author, how do I make mods compatible with Vortex?

The over-simplified answer is that Vortex works best when a single mod archive (i.e. a file on Nexus Mods) contains just one `.bin` mod file in it. This won't be suitable for every mod, so the installer will try to detect and adapt to different mod structures to make installing mods easier, even when they're not packaged how Vortex likes them.

### What about mods that aren't on the Nexus?

They should still work fine! Download the archive file and install it using Vortex's standard "Install from File" button. You might be prompted to choose what files you want installed, and also remember that non-Nexus mods won't have quite the same metadata available in Vortex you might be used to.

### The installer prompt failed and now I can't install my mod?!

If you are facing problems installing mods with multiple `.bin` files, you may have found a problem in the advanced installer that HZDV uses to cut down on conflicts. First, head to your Settings page in Vortex and turn off the *Enable Interactive Installer* toggle under the **Enable Advanced Installer for HZDV** section and try to install your mod again.

If that works, **please** raise an issue [on GitHub](https://github.comm/agc93/vortex-horizonzerodawn) and make sure to link/include which mod you're trying to install. We're always trying to improve mod compatibility and you might have just found a bug!