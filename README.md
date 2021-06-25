[![npm (scoped)](https://img.shields.io/npm/v/@forgerock/javascript-sdk?color=%23f46200&label=Version&style=flat-square)](CHANGELOG.md)
[![Build Status](https://jenkins.petrov.ca/buildStatus/icon?job=01-JS-UI-SDK-BUILD&style=flat-square)](https://jenkins.petrov.ca/job/01-JS-UI-SDK-BUILD/)

<p align="center">
  <a href="https://github.com/ForgeRock">
    <img src="https://www.forgerock.com/themes/custom/forgerock/images/fr-logo-horz-color.svg" alt="Logo">
  </a>
  <h2 align="center">ForgeRock SDK UI for JavaScript</h2>
  <p align="center">
    <a href="https://github.com/ForgeRock/forgerock-javascript-sdk-ui/blob/master/CHANGELOG.md">Change Log</a>
    ·
    <a href="#support">Support</a>
    ·
    <a href="#documentation" target="_blank">Docs</a>
  </p>
<hr/></p>

The ForgeRock JavaScript SDK with UI contains the [Core SDK](https://github.com/ForgeRock/forgerock-javascript-sdk) and adds UI rendering capability. This project greatly reduces the effort to quickly prototype and demonstrate the use of the Core SDK in a more real-word scenario.

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- REQUIREMENTS - Supported AM versions, API versions, any other requirements. -->

## Requirements

* ForgeRock Identity Platform
    * Access Management (AM) 6.5.2+

* Browsers:
    * Chrome 87
    * Firefox 84
    * Safari 14
    * Edge 87 (Chromium)
    * Edge 44 (Legacy): requires one polyfill for TextEncoder, [`fast-text-encoding` is recommended](https://www.npmjs.com/package/fast-text-encoding)

> **Tip**: Older browsers (like IE11) may require multiple [polyfills, which can be found in our documentation](https://sdks.forgerock.com/javascript/polyfills/).

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- INSTALLATION -->

## Installation

```
npm install @forgerock/javascript-sdk-ui
```

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- QUICK START - Get one of the included samples up and running in as few steps as possible. -->

## Getting Started

To try out the ForgeRock JavaScript SDK UI, perform these steps:

1. Setup CORS support in an Access Management (AM) instance.

   See [Enabling CORS Support](https://sdks.forgerock.com/js/01_prepare-am/#enabling-cors-support) in the Documentation.

2. Create an authentication tree in AM.

   See [Creating a User Authentication Tree](https://sdks.forgerock.com/js/01_prepare-am/#creating-a-user-authentication-tree) in the Documentation.

3. Clone this repo:

    ```
    git clone https://github.com/ForgeRock/forgerock-javascript-sdk-ui.git
    ```

4. In the root folder of the repo, use NPM to install dependencies:

    ```
    npm install
    ```

5. Build the ForgeRock JavaScript SDK:

    ```
    npm run build
    ```

6. Open `samples/basic/index.html` and edit the configuration values to match your AM instance.

7. This SDK requires HTTPS (secure protocol) which means security (SSL/TLS) certificates are necessary. For local testing and development, it's common to generate your own self-signed certificates. You're free to use any method to do this, but if you need assistance in generating your own certs, the following can be helpful:

    - Using [this utility (`mkcert`) can help simplify the process of creating trusted certs](https://github.com/FiloSottile/mkcert)
    - After following `mkcert`'s installation guide and simple example of creating certs, you should have two files: `example.com+5.pem` & `example.com+5-key.pem`

        (Ensure these two files are in the root of this project)

    > **Warning: Self-signed certificates or certificates not from an industry-recognized, certificate authority (CA) should never be used in production.**

8. Serve the `samples` directory by using a simple HTTP server.

   - If you used the `mkcert` utility from above, followed their tutorial, and the files are in the root of this project, simply run `npm run start:samples`
   - Or, if you generated certs using a different method, you will need to run the below with your certificate and key file names you created:

       ```
       http-server samples -c1 -p 8443 --ssl --cert <your_certificate> --key <your_private_key>
       ```

9. Edit your `/etc/hosts` file to point your localhost (e.g. `127.0.0.1`) to `sdkapp.example.com`

10. In a [supported web browser](#requirements), navigate to `https://sdkapp.example.com:8443`, and then click
 **Custom UI**.

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- DOCS - Link off to the AM-centric documentation at sdks.forgerock.com. -->

## Documentation

Documentation for the SDKs is provided at **<https://sdks.forgerock.com>**, and includes topics such as:

* Introducing the SDK Features
* Preparing AM for use with the SDKS
* API Reference documentation

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- MORE DETAIL -->

## ForgeRock JS SDK UI in More Detail

The two key concepts in the SDK are **Step Handlers** and **Callback Renderers**. Step handlers control how a given step in an authentication tree is handled, and callback renderers control how each callback in that step is rendered.

For example, a single authentication tree might use a Choice Collector in different ways:

- To ask if the user wants to register a security device
- To ask how the user wants to receive a one-time password

In the first scenario, simple yes/no buttons aligned horizontally may suffice. But you might want to render a vertical list with custom icons for each option in the second scenario. You could create custom step handlers to invoke the correct custom callback renderer (buttons vs list).

This SDK includes two UI step handlers: Basic and Express.

### Basic

This is the default UI and can be used with any OpenAM installation version 6.5.2 or greater. It can render all of the [supported callbacks](https://sdks.forgerock.com/getting-started/compatibility/) with generic styling based on Bootstrap 4. You can optionally add your own CSS to customize or brand the user experience.

The out-of-box integration is extremely simple:

```js
const frui = new forgerock.FRUI();
const result = await frui.getSession();
```

### Taking More Control

If you need deeper customization, you can override built-in behavior at both the step and callback levels by providing factory functions.

The following example overrides the rendering of the callback produced by the "Platform Username" tree node:

```js
// Define a factory that returns the custom callback renderer
const myRendererFactory = (cb, index, step, onChange) => {
  if (cb.getType() === 'ValidatedCreateUsernameCallback') {
    return {
      render: () => {
        // Render the custom UI here
        const div = document.createElement('div');
        div.innerHTML = 'This is a custom UI for capturing username';
        return div;
      },
    };
  }

  // Return `undefined` to defer to the SDK for other callback types
  return undefined;
};

// Define a factory that returns the step handler
const myHandlerFactory = (target, step) => {
  return new forgerock.BasicStepHandler(target, step, myRendererFactory);
};

// Use the step handler factory when instantiating FRUI
const frui = new forgerock.FRUI({ handlerFactory: myHandlerFactory });
const result = await frui.getSession();
```

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- SUPPORT -->

## Support

If you encounter any issues, be sure to check our **[Troubleshooting](https://backstage.forgerock.com/knowledge/kb/article/a83789945)** pages.

Support tickets can be raised whenever you need our assistance; here are some examples of when it is appropriate to open a ticket (but not limited to):

* Suspected bugs or problems with ForgeRock software.
* Requests for assistance - please look at the **[Documentation](https://sdks.forgerock.com)** and **[Knowledge Base](https://backstage.forgerock.com/knowledge/kb/home/g32324668)** first.

You can raise a ticket using **[BackStage](https://backstage.forgerock.com/support/tickets)**, our customer support portal that provides one stop access to ForgeRock services.

BackStage shows all currently open support tickets and allows you to raise a new one by clicking **New Ticket**.

## Version History

[Our version history can be viewed by visiting our CHANGELOG.md](https://github.com/ForgeRock/forgerock-javascript-sdk/blob/master/CHANGELOG.md).

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- COLLABORATION -->

## Contributing

If you would like to contribute to this project you can fork the repository, clone it to your machine and get started.

<!-- Note: Found elsewhere, but is Java-only //-->
Be sure to check out our [Coding Style and Guidelines](https://wikis.forgerock.org/confluence/display/devcom/Coding+Style+and+Guidelines) page.

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- LEGAL -->

## Disclaimer

> **This code is provided by ForgeRock on an “as is” basis, without warranty of any kind, to the fullest extent permitted by law. ForgeRock does not represent or warrant or make any guarantee regarding the use of this code or the accuracy, timeliness or completeness of any data or information relating to this code, and ForgeRock hereby disclaims all warranties whether express, or implied or statutory, including without limitation the implied warranties of merchantability, fitness for a particular purpose, and any warranty of non-infringement. ForgeRock shall not have any liability arising out of or related to any use, implementation or configuration of this code, including but not limited to use for any commercial purpose. Any action or suit relating to the use of the code may be brought only in the courts of a jurisdiction wherein ForgeRock resides or in which ForgeRock conducts its primary business, and under the laws of that jurisdiction excluding its conflict-of-law provisions.**

<!------------------------------------------------------------------------------------------------------------------------------------>
<!-- LICENSE - Links to the MIT LICENSE file in each repo. -->

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

&copy; Copyright 2020 ForgeRock AS. All Rights Reserved.

[forgerock-logo]: https://www.forgerock.com/themes/custom/forgerock/images/fr-logo-horz-color.svg "ForgeRock Logo"
