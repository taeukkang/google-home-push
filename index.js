'use strict';

const debug = require('debug')('ghome-push');
debug('starting up...')

const GoogleCastClient = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const mdns = require('mdns');
const browser = mdns.createBrowser(mdns.tcp('googlecast'));
const googleTTS = require('google-tts-api');
const isIp = require('is-ip');

class GoogleHome {
    constructor(deviceIdentifier, options = {}) {
        this.device = {};

        if (isIp(deviceIdentifier)) {
            debug('deviceIdentifier as IP address');
            this.device.ip = deviceIdentifier;
        } else {
            debug('deviceIdentifier as device name');
            this.device.name = deviceIdentifier;
        }
        this.device.identifier = deviceIdentifier;

        this.options = options;

        this.options.language = (this.options.language === undefined) ? 'en' : options.language;
        this.options.accent = (this.options.accent === undefined) ? 'en' : options.accent;
    }

    searchDevice(name = this.device.name) {
        return new Promise((resolve, reject) => {
            browser.start();
            debug('google cast browser started');

            browser.on('serviceUp', (service) => {
                browser.stop();

                // Only use the first IP address in the array
                const address = service.addresses[0];
                console.log(`Device ${service.txtRecord.fn} at ${address}:${service.port} found`);
                debug(`found device ${service.txtRecord.fn} at ${address}:${service.port}`);

                if (service.txtRecord.fn.includes(name)) {
                    resolve(address);
                } else {
                    debug(`unable to find device with deviceIdentifier`);
                    return reject('Unable to find device');
                }
            });
        });
    }

    async speak(message, language) {
        return new Promise((resolve, reject) => {
            googleTTS(message, language ? language : this.options.language, 1, 3000, this.options.accent).then((url) => {
                debug('pushing Google TTS speech data');
                this.push(url)
                    .then(resolve)
                    .catch(reject);
            }).catch(reject); 
        });
    }

    push(url) {
        return new Promise(async (resolve, reject) => {
            if (this.device.ip === undefined || !isIp(this.device.ip)) {
                try {
                    this.device.ip = await this.searchDevice();
                } catch(err) {
                    return reject(err)
                }
            }
    
            const client = new GoogleCastClient();
            client.connect(this.device.ip, () => {
                client.launch(DefaultMediaReceiver, (err, player) => {
                    const media = {
                        contentId: url,
                        contentType: 'audio/mp3',
                        streamType: 'BUFFERED'
                    };
    
                    player.load(media, { autoplay: true }, (err, status) => {
                        client.close();
                        debug(`Google Cast Client closed, successfully pushed data to device`)
                        console.log(`Pushed to device at ${this.device.ip}`);
                    });
                });
            });

            client.on('error', (err) => {
                debug(`Google Cast Client error: ${err}`);
                reject(`Google Cast Client error:\n${err}`);
                client.close();
            });
        });
    }
};

module.exports = GoogleHome;