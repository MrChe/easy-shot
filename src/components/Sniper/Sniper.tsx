import React, { Fragment, useState } from 'react';
import { Cropper } from "../Cropper/Cropper";
import Jimp from "jimp";
import path from 'path';
import {AxiosResponse} from "axios";
import {
    ipcRenderer,
    desktopCapturer,
    shell,
    remote,
    screen,
    BrowserWindow,
    DesktopCapturerSource
} from "electron";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import axios from 'axios';

import './Sniper.scss';

const dev = process.env.NODE_ENV === 'development';
let snipWindow = null;
let mainWindow: any = null;
const UPLOAD_URL = 'http://127.0.0.1:8989/upload';

export const Sniper = () => {
    // const { screen } = remote; // Main process modules
    const screenSize = screen?.getPrimaryDisplay().size;
    const getContext = () => {
        const context = global.location.search;
        return context.substr(1, context.length - 1);
    }
    const [image, setImage] = useState('');
    const [saveControls, setSaveControls] = useState(false);
    const view = getContext();

    const initCropper = () => {
        mainWindow = getCurrentWindow();
        mainWindow.hide();

        snipWindow = new BrowserWindow({
            width: screenSize.width,
            height: screenSize.height,
            frame: false,
            transparent: true,
            kiosk: true
        });

        snipWindow.on('close', () => {
            snipWindow = null
        });

        ipcRenderer.once('snip', (event, data) => {
            captureScreen(data);
        });

        ipcRenderer.once('cancelled', () => {
            mainWindow?.show();
        });

        snipWindow.loadURL(path.join('file://', __dirname, '/index.html') + '?snip');
        snipWindow.setResizable(false);
        //snipWindow.webContents.openDevTools();
    }



    const getCurrentWindow = () => {
        return remote.getCurrentWindow();
    }

    const getAllInstances = () => {
        return remote?.BrowserWindow?.getAllWindows();
    }

    const getMainInstance = () => {
        let instances = getAllInstances();
        return instances?.filter((instance) => {
            return instance.id !== getCurrentWindow().id
        })[0];
    }

    const destroyCurrentWindow = () => {
        getCurrentWindow().close();
    }

    const getScreenShot = (callback: any, imageFormat = 'image/png') => {

       const handleStream = (stream: MediaStream) => {
            // Create hidden video tag
            let video = document.createElement('video');
           video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
            // Event connected to stream
           video.onloadedmetadata = () => {
                // Set video ORIGINAL height (screenshot)
               video.style.height = video.height + 'px'; // videoHeight
               video.style.width = video.width + 'px'; // videoWidth

                // Create canvas
                let canvas = document.createElement('canvas');
                canvas.width = video.width;
                canvas.height = video.height;
                let ctx = canvas.getContext('2d');
                // Draw video on canvas
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

                if (callback) {
                    // Save screenshot to base64
                    callback(canvas.toDataURL(imageFormat));
                } else {
                    console.log('Need callback!');
                }

                // Remove hidden video tag
               video.remove();
                try {
                    // Destroy connect to stream
                    stream.getTracks()[0].stop();
                } catch (e) {
                }
            };
           video.src = URL.createObjectURL(stream);
            document.body.appendChild(video);
        };

        const handleError = (error: any) => {
            console.error(error);
        };

        desktopCapturer.getSources({types: ['window','screen']}).then(async (sources: DesktopCapturerSource[]) => {
            try {
                for (let i = 0; i < sources.length; ++i) {
                    // Filter: main screen
                    if (sources[i].name === "Entire screen") {
                        const stream = await navigator.mediaDevices.getUserMedia({
                            audio: false,
                            video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: sources[i].id,
                                    minWidth: 1280,
                                    maxWidth: 4000,
                                    minHeight: 720,
                                    maxHeight: 4000
                                }
                            }
                        });

                        handleStream(stream)
                    }
                }
            } catch (error) {
                handleError(error);
            }
        })
    }

    const captureScreen = (coordinates: any) => {
        mainWindow = getCurrentWindow();
        mainWindow?.hide();

        setTimeout(() => {

            getScreenShot(async (base64data: string) => {

                // add to buffer base64 image instead of saving locally in order to manipulate with Jimp
                let encodedImageBuffer = new Buffer(base64data.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');

                await Jimp.read(encodedImageBuffer, (err: Error, image: Jimp) => {
                    if (err) {
                        throw err;
                    }

                    let crop = coordinates ?
                        image.crop(coordinates.x, coordinates.y, parseInt(coordinates.width, 10), parseInt(coordinates.height, 10)) :
                        image.crop(0, 0, screenSize.width, screenSize.height);

                    crop.getBase64('image/png', (error: Error | null, base64data: string) => {
                        setImage(base64data)
                        setSaveControls(true)
                        resizeWindowFor('snip');
                        mainWindow?.show();
                    });
                });
            });
        }, 200);
    }

    const snip = (dimensions: any) => {
        console.log('dimensions', dimensions)
        getMainInstance()?.webContents.send('snip', dimensions);
        destroyCurrentWindow();
    }

    const destroySnipView = () => {
        getMainInstance().webContents.send('cancelled');
        destroyCurrentWindow();
    }

    const resizeWindowFor = (view: string) => {
        if (view === 'snip') {
            mainWindow?.setSize(800, 500);
            let x = (screenSize.width / 2) - 400;
            let y = (screenSize.height / 2) - 250;
            mainWindow?.setPosition(x, y);
        } else if (view === 'main') {
            const width = dev ? 800 : 400;
            const height = dev ? 800 : 200;
            mainWindow?.setSize(width, height);
            let x = (screenSize.width / 2) - width / 2;
            let y = (screenSize.height / 2) - height / 2;
            mainWindow?.setPosition(x, y);
        }
    }

    const discardSnip = () => {
        setImage('');
        setSaveControls(false);
        resizeWindowFor('main');
    }

    const saveToDisk = () => {
        const directory = remote.app.getPath('pictures');
        const filepath = path.join(directory + '/' + uuidv4() + '.png');
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        fs.writeFile(filepath, image.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64', (error: any) => {
            if (error) {
                console.error(error);
            }
            shell.showItemInFolder(filepath);
            discardSnip();
        });
    }

    const uploadAndGetURL = () => {
        axios.post(UPLOAD_URL, {
            image: image
        })
            .then(async (response: AxiosResponse<any>) => {
                const res = response.data;
                if (res.uploaded) {
                   await shell.openExternal(UPLOAD_URL + '/' + res.filename);
                    discardSnip();
                }
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }

    return (
        <Fragment>
            {view === 'main' ? (
                    <Fragment>
                        <div className="snip-controls text-center">
                        <span
                            className="close"
                            title="close"
                            onClick={destroyCurrentWindow}>&times;
                        </span>

                            <div>
                                <h2>
                                    <span>logo</span>
                                    Snipper
                                </h2>
                            </div>

                            {!saveControls ?
                                <div>
                                    <button
                                        className="btn btn-primary mr-1"
                                        onClick={() => captureScreen(null)}>
                                        Fullscreen
                                    </button>

                                    <button
                                        className="btn btn-primary mr-1"
                                        onClick={initCropper}>
                                        Crop Image
                                    </button>
                                </div> :

                                <div>
                                    <button
                                        className="btn btn-primary mr-1"
                                        onClick={saveToDisk}>
                                        Save to Disk
                                    </button>

                                    <button
                                        className="btn btn-primary mr-1"
                                        onClick={uploadAndGetURL}>
                                        Upload URL
                                    </button>

                                    <button
                                        className="btn btn-primary mr-1"
                                        onClick={discardSnip}>
                                        Discard
                                    </button>

                                </div>
                            }
                        </div>

                        {image &&
                        <div className="snipped-image">
                            <img className="preview" src={image} alt=""/>
                        </div>
                        }

                    </Fragment>
                ) :
                <Cropper
                    snip={snip}
                    destroySnipView={destroySnipView}
                />
            }
        </Fragment>
    )
}
