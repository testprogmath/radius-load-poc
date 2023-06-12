<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/goflink/flinkord-cli">
    <img src="resources/logo.png" alt="Logo" width="100" height="100">
  </a>

<h3 align="center">Flinkord-CLI</h3>

  <p align="center">
    CLI tool for easy order generation and management
    <br />
    <a href="https://github.com/goflink/flinkord-cli"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/goflink/flinkord-cli.git">View Demo</a>
    ·
    <a href="https://github.com/goflink/flinkord-cli/issues">Report Bug</a>
    ·
    <a href="https://github.com/goflink/flinkord-cli/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/goflink/flinkord-cli)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![Typescript][Typescript]][typescript-url]
* [![Commander][commander]][commander-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This CLI uses internal flink packages, such as `@flink/catalog` and `@flink/hub-manager`. To install them, you might
need to set it up. Please
see [internal documentation](https://goflink.atlassian.net/wiki/spaces/PLATFORM/pages/343343497/Configuring+yarn+npm+registry+to+download+and+publish+packages#Yarn-1-%26-NPM-Usage%3A)
or follow the steps below:

1. Install npm 18:
   ```shell
   npm install npm@18 -g
   ```
2. Use the npx command to refresh the access token by first installing
    ```shell
    npx google-artifactregistry-auth
    ```
3. Log in on gcloud by running:
   ```shell
   gcloud auth login --project flink-core-shared
   ```
4. Check the file .npmrc in your home directory. If there's no one, create it with the following content:
    ```
   @flink:registry=https://europe-west3-npm.pkg.dev/flink-core-shared/npm-registry/
    //europe-west3-npm.pkg.dev/flink-core-shared/npm-registry/:always-auth=true
   ```
5. Then run from your home directory:
   ```shell
   npx google-artifactregistry-auth --repo-config=.npmrc --credential-config=.npmrc 
   ```

You should see the output:

```
Retrieving application default credentials...
Retrieving credentials from gcloud...
Success!
```

Using this command will produce a token using the information in your `.npmrc` file, and store the token in the `.npmrc`
file located in your user folder.

This method ensures that the authToken is not stored in the `.npmrc` file of your project, which helps prevent it from
being accidentally committed.

### Installation

1. Install the flinkord-cli:
   ```sh
   npm install @flink/flinkord-cli --global
   ```

2. Run the help command to check if everything works:
   ```sh
   flinkord -h
   ```

You should see the following output:

```shell
  _____ _ _       _                 _ 
 |  ___| (_)_ __ | | _____  _ __ __| |
 | |_  | | | '_ \| |/ / _ \| '__/ _` |
 |  _| | | | | | |   < (_) | | | (_| |
 |_|   |_|_|_| |_|_|\_\___/|_|  \__,_|
                                      
Usage: flinkord [options] [command]

A CLI tool for order management

Options:
  -V, --version       output the version number
  create <arguments>  Create an order with parameters or with default values
  free <arguments>    Deal with 'Something went wrong: hub is closed right now' error
  cancel <value>      Cancel by order name
  defaults            list defaults
  -h, --help          display help for command

Commands:
  create [options]
  free [options]
  help [command]      display help for command
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Usage: flinkord [options]

To create the order in the chosen hub, please use -h (--hub option):

### Create an order in a particular hub
```shell
flinkord create -h fr_par_lepe
```

If you run command without specifying the hub, you'll need to provide the hub in the interactive mode or choose the
default one:

![flinkord-hub-not-defined.png](resources%2Fflinkord-hub-not-defined.png)

To receive notifications to your email, please use -m (--email option):

### Create an order with your email to receive a receipt

```shell
flinkord create -h fr_par_lepe -m myemail@goflink.com
```

### Create an in-store order

To create an in-store order, please use --instore flag:

```shell
flinkord create -h fr_par_lepe --instore
```

### Create an order with clickAndCollect option
To switch on clickAndCollect option, please use -s (--shipping) flag:

```shell
flinkord create -h fr_par_lepe -s true
```

### Create an order with particular products in it
To add your items to the cart, use -p flag with the following format:
sku1:quantity1,sku2:quantity2. For example:
```shell
flinkord create -h de_ham_wint -p  15012024:2,11014933:3,11013382:4 
```

Don't hesitate to use help command to discover all possible options:

```shell
flinkord help create
```

or

```shell
flinkord create --help
```

### Deal with _Something went wrong: hub is closed right now_ error

This error often appears when there are too many orders in the hub queue. To free the hub queue, use this command:

```shell
flinkord free -h fr_par_lepe
```

For the first time, you need to enter your CommerceTools client creds. You can also use default ones. Run

```shell
flinkord setup
```

```shell
Enter CT_CLIENT_ID (default: wxgadKVe9YfVkHWUDhgpIIJ6): 
Enter CT_CLIENT_SECRET (to use the default value, press enter):
.env file successfully created 
```

### To deliver an order, use "deliver" command with an orderId:

```shell
flinkord deliver <orderId>
```

_For more examples, please refer to
the [Documentation](https://docs.google.com/document/d/1aGe_5EBZ-VZ-27SChg9Ouc9E6NQlTNZf5FiS7AhimXQ/edit#)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->

## Roadmap

- [x] "Create" command with default values
    - [x] Implement -h (--hub) option ([HO-1044](https://goflink.atlassian.net/browse/HO-1044))
    - [x] Implement -m (--email) option  ([HO-1070](https://goflink.atlassian.net/browse/HO-1070))
- [x] Deploy artifact to GCP Artifact Registry
- [ ] Support custom config file
- [ ] "Cancel" command by order_name
    - [ ] Support order_id in "cancel" command

See the [jira story](https://goflink.atlassian.net/browse/HO-1010) for a full list of proposed features (and known
issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the Flink community such an amazing place to learn, inspire, and create. Any contributions
you make are **greatly appreciated**.

If you have a suggestion that would make this better, please create a pull request. You can also simply open an issue
with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Create or pick a ticket in [the Jira story](https://goflink.atlassian.net/browse/HO-1010)
2. Create your Feature Branch (`git checkout -b HO-xxxx`)
3. Commit your Changes (`git commit -m 'Add some <your changes>'`)
4. Push to the Branch (`git push origin HO-xxxx`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->

## Contact

Anna Khvorostianova - ext-anna.khvorostianova@goflink.com

Project Link: [https://github.com/goflink/flinkord-cli](https://github.com/goflink/flinkord-cli)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: resources/flinkord_screenshot.png

[Typescript]: https://img.shields.io/badge/-Typescript-blue?style=for-the-badge

[typescript-url]: https://www.typescriptlang.org/

[commander]: https://img.shields.io/badge/-Commander-brightgreen?style=for-the-badge

[commander-url]: https://github.com/tj/commander.js




