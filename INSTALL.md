# Installation Guide

This guide will walk you through the installation of Git, Node.js, Python, Express, and MongoDB on your system.

## Install Git

### Windows
1. Download the installer from the [official Git website](https://git-scm.com/download/win).
2. Run the downloaded installer.
3. Follow the on-screen instructions.
4. Select default settings if you are unsure of any options.
5. Once installed, verify the installation by opening Command Prompt and running:
   ```bash
   git --version
   ```

## Install Node.js

### Windows
1. Download the installer from the [official Node.js website](https://nodejs.org/).
2. Run the downloaded installer and follow the on-screen instructions.
3. Make sure to check the box that adds Node.js to your PATH.
4. Once installed, verify by running the following commands in Command Prompt:
   ```bash
   node --version
   npm --version
   ```

## Install Python

### Windows
1. Download the installer from the [official Python website](https://www.python.org/downloads/).
2. Run the installer and ensure to check the box **Add Python to PATH**.
3. Follow the on-screen instructions to complete the installation.
4. Verify the installation by running:
   ```bash
   python --version
   pip --version
   ```

## Install Express

Express is a Node.js framework. To install it, you’ll need npm, which is included with Node.js.

1. Open Command Prompt.
2. Run the following command to install Express globally:
   ```bash
   npm install -g express
   ```
3. Verify the installation by running:
   ```bash
   npm list -g express
   ```

## Install MongoDB

### Windows
1. Download the installer from the [official MongoDB website](https://www.mongodb.com/try/download/community).
2. Run the installer and follow the on-screen instructions.
3. Make sure to select the option to install MongoDB as a service.
4. Once installed, verify the installation by running:
   ```bash
   mongo --version
   ```


