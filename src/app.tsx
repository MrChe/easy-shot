import React,{useRef, useState} from 'react';
import ReactDOM from 'react-dom';
// import fs from 'fs';
// import electron from 'electron';
// import path from 'path';
// import { Stage, Layer, Image } from 'react-konva';
import { Sniper } from './components/Sniper/Sniper';
import './app.scss';

// const BrowserWindow = electron.remote.BrowserWindow;
//
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const App = () => {
   //  const imgRef = useRef(null);
   //  const [imgSrc, setImgSrc] = useState(null);
   // // Importing dialog module using remote
   //  const dialog = electron.remote.dialog;
   //  let win = BrowserWindow.getFocusedWindow();
   //  const handleScreenShot = async () => {
   //      let img = null;
   //      let file = null;
   //      try {
   //          img = await win?.webContents.capturePage({
   //              x: 0,
   //              y: 0,
   //              width: 800,
   //              height: 600,
   //          });
   //          if(img) {
   //              console.log('img', img);
   //             file = await dialog.showSaveDialog({
   //                      // Default path to assets folder
   //                      defaultPath: path.join(__dirname,  "../assets/image.png"),
   //                      // Restricting the user to only Image Files.
   //                      filters: [
   //                          {
   //                              name: "Image Files",
   //                              extensions: ["png", "jpeg", "jpg"],
   //                          },
   //                      ],
   //                      properties: [],
   //                  });
   //          }
   //
   //          if(!file?.canceled) {
   //              console.log('file', file);
   //              console.log('img to png', img?.toPNG());
   //              console.log(file.filePath.toString());
   //
   //              // Creating and Writing to the image.png file
   //              // Can save the File as a jpeg file as well,
   //              // by simply using img.toJPEG(100);
   //              fs.writeFile(file.filePath.toString(), img.toPNG(), "base64", (err) => {
   //                  if (err) {
   //                      throw err;
   //                  }
   //                  console.log("Saved!");
   //              });
   //          }
   //      } catch (error) {
   //          console.error(error)
   //      }
   //
   //
   //  }
  return (
      <div>
          <Sniper />
           {/*<button onClick={handleScreenShot}>screenshot</button>*/}
      </div>

  )
}

ReactDOM.render(<App />, mainElement);


// import React from 'react';
// import ReactDOM from 'react-dom';
// import Sniper from './components/Sniper/Sniper';
//
// const render = (Component: any) => {
//     ReactDOM.render(
//         <Component />,
//         document.getElementById('root'),
//     );
// };
//
// render(Sniper);