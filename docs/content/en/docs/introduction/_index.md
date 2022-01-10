---
title: "Introduction"
linkTitle: "Introduction"
weight: 1
description: >
  A basic introduction to HZDV
---

HZD for Vortex (HZDV) is an **unofficial** extension for the [Vortex mod manager](https://www.nexusmods.com/about/vortex/) that adds support for installing and managing Horizon Zero Dawn mods in Vortex, just like any other supported title. To clarify, this project is not affiliated in any way with Nexus Mods, Guerrilla Games or anyone else, and is an open-source community resource.

## Status and Limitations

HZDV is still alpha-quality software! While I can test locally, I won't be able to cover every case and there is a high potential for bugs that haven't been found yet. The following is definitely supported at this point:

- **Installing mods**: Installing mods from archive files works, deploying directly to your install directory.
- **Managing mods**: The standard Vortex install/enable/disable/uninstall operations should all work just as they do for any other Vortex-managed game.
- **Profiles**: Create multiple profiles for different sets of mods and quickly switch between them.

There's some features that we've included to get them in your hands as fast as possible, but might still have some rough edges:

- **Save Game Support**: The extension will now attempt to detect when a mod is actually a save game and correctly deploy them to your profile's game save folder.

> If you're really missing specific features you can open an issue and we can discuss the viability, or find me on the Nexus Mods Discord.

### Nexus Mods

To be clear and upfront: being supported in Vortex (using HZDV) **does not** mean that the Nexus Mods or Vortex team officially supports this extension or any mods you install using it. See [the FAQ](/docs/introduction/faq) for extra details.