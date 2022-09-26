# greenworks-overlay
Greenworks Steam Overlay - Complete Example in NW.js

![alt tag](https://imgur.com/e4RMEdv.png)

### Features

- Fix display overlay
- Removed blurred toolbar
- Add new toolbar created with CSS
- Add buttons: fullscreen and close window
- Hide toolbar in fullscreen mode
- Show toolbar in fullscreen mode on mouseover in toolbar
- Open window app in the center of the screen
- Add div "dragMe" to be able to drag the window
- Fixed method to close the app correctly and make sure it doesn't run in the background
- Place icons correctly in the executable file

### How download 

```txt
git clone https://github.com/Gurigraphics/greenworks-overlay
```

### How add Steam dependences 

Set correct version of NW.js in package.json

```js
  "build": {
        "nwVersion": "0.55.0",
```

Add correct version of Steam API files to folder src/steam

```js
greenworks-win64.node
sdkencryptedappticket64.dll
steam_api64.dll
```

### How create build

Install dependences
```js
cd greenworks-overlay
npm install
```
Build Windows
```js
npm run win
```
Build Linux
```js
npm run linux
```
Build Mac
```js
npm run mac
```

### Production

To production change in json "nwFlavor": "sdk" to "nwFlavor": "normal".

Or add in chromium-args: --disable-devtools

### How test Steam Overlay

1. Open Steam
2. Add the Game as a No Steam Game
3. Execute the Game
4. Press "Shift" + "Tab"
