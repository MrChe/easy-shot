import React from 'react';
import ReactDOM from 'react-dom';
import screenshot from 'screenshot-desktop';
import fs from 'fs';
import electron from 'electron';
import path from 'path'; 

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const App = () => {
    const dialog = electron.remote.dialog; 
    const handleScreenShot = () => {
    
        screenshot({format: 'png'}).then((img) => {
            fs.writeFile('out.png', img, (err) => {
                if (err) {
                  throw err
                }
              })


            // dialog.showSaveDialog({
            //     defaultPath: path.join(__dirname, '../assets/sample.txt'), 
            // }).then((file) => {
            //     console.log(file.canceled); 
            //     if (!file.canceled) {
            //         console.log(file.filePath.toString()); 
                  
            //         // Creating and Writing to the sample.txt file 
            //         fs.writeFile(file.filePath.toString(),  
            //         'This is a Sample File', function (err) { 
            //             if (err) {
            //                 throw err; 
            //             }
            //             console.log('Saved!'); 
            //         }); 
            //     } 
            // }).catch((err) => {
            //     console.error(err)
            // })



          }).catch((err) => {
            console.error(err)
          })
    }
  return (
    <h1>
      <button onClick={handleScreenShot}>screenshot</button>
    </h1>
  )
}

ReactDOM.render(<App />, mainElement);