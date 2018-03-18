# google-home-push
Send push notifications to your Google Home device.

## Installation
```
$ npm install --save google-home-push
```

## Usage
```
const GoogleHome = require("google-home-push");

// Pass the name or IP address of your device
const myHome = new GoogleHome("Living Room Home");

myHome.speak("Hello world!");
myHome.push("https://example.com/music.mp3");
```

## API
### new GoogleHome(deviceIdentifier, [options])
Creates an `instantce` of GoogleHome.

#### deviceIdentifier
Type: `string`
Accepts valid IP addresses or device name.

#### options
Type: `Object`

##### language
Default: `en`

##### accent
Default: `en`

### .speak(message)
#### message
Type: `string`
Input what you want to notify

### .push(url)
#### url
Type: `string`
Enter a valid media URL to cast

## License
[MIT](https://github.com/taeukme/google-home-push/blob/master/README.md)