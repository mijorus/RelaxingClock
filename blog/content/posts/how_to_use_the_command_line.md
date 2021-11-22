---
title: "How to use the command box"
date: 2021-11-21T20:09:19+01:00
draft: false
categories: ["Guides"]
---

Relaxing Clock **v3** introduced a new *terminal-style* command box, that allows you to interact with the web application quickly, without lifting your fingers from the keyboard to do some key operations.

## How to launch the command box
The command box can be launched with `ctrl + [space]`, which will bring the focus to the input field. You can leave it at any time with the `Esc` key.

## Usage
A general command is structured as follow:

```perl
alarm: set 16:20
```

1. The first word is the "feature" you want to control, just like a program in the terminal: in this case, we want to control the alarm. 

    It **should always be separated with a colon**; if you press space while typing, it wil be inserted automatically.
2. The second is the "action" that we want to execute; basically, what we want to do with it.
3. The third is the argument, basically the input for the action that we want to execute. In this case, we want to create an alarm at a specific time.

The autocompletion will help you while typing with the *current* available features and actions. Please note that some feature will only be enabled when a condition is met, for example `spotify` will not be available until you successfully log in.

### Suggestions and selections
Sometimes while you are typing a command you will see a list of suggestions popping up above the input. These are simply some guidelines that explain how to use a certain feature.

Some other times however, when an interaction is needed, these fields can be selected using the `arrow keys`. This happens for example when searching a song in the Spotify library or when you want to dismiss an old reminder.

### Move in the history
You can use `Page UP` and `Page DOWN` while the command box is opened to move in the history of commands. 

### Special use cases
While this is the basic usage, there are some commands that do not follow this structure if not needed. For example, the aforementioned command will also work if issued like this:

```perl
alarm: 16:20 Back to work
```
In this case, it is just a shortcut. It understands that the first work that you typed is not an "action" but is part of the command that you are "executing", thus a new alarm titled *"Back to work"* will be created.

