import React, { useCallback, useState } from 'react';
import {useDropzone} from 'react-dropzone'
// import axios from 'axios';
import './App.scss';
import * as API from './api/AI'

// const remoteUrl = 'https://jsonplaceholder.typicode.com/users';

const App = () => {
  const [fileUpLoading, setFileUpLoading] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const [remoteImage, setRemoteImage] = useState(null);
  const [remoteText, setRemoteText] = useState(null);

  const [remoteQuery, setRemoteQuery] = useState(null);
  const [queryResponse, setQueryResponse] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      const base64Encoded = reader.result
      base64Encoded && setLocalImage(base64Encoded)
      setShowUploadButton(true);
    }
    acceptedFiles.forEach(file => reader.readAsDataURL(file))
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})
  const handleUpload = (image) => {
    setFileUpLoading(true);
    setShowUploadButton(false);
    try{
      // axios.post(remoteUrl, { image })
      // .then(res => {
      //   setShowUploadButton(false);
      //   setFileUpLoading(false);
      //   const resData = res && res.data;
      //   const txtSrc = resData && resData.text;
      //   const imgSrc = resData && resData.image;
      //   imgSrc && setRemoteImage(imgSrc);
      //   txtSrc && setRemoteText(txtSrc);
      // })
      // .catch(err => {
      //   console.log(err);
      // })
      API.postImage(image).then( res => {
        setShowUploadButton(false);
        setFileUpLoading(false);
        setRemoteImage(image);
      });
    }
    catch(e) {
      console.log(e);
    }
  }
  // Handles Query
  const handleQuery = (query) => {
    API.queryModel(query).then( res => {
      setShowUploadButton(false);
      setFileUpLoading(false);
      setQueryResponse(res.result);
    });
  }
  return (
    <>
      <div className="app">
        <div className="app--local">
          <div {...getRootProps()}>
            <input 
            {...getInputProps()} 
            accept=".jpg, .jpeg, .png, .gif, .ico, .tiff"
            className="app--local__input"/>
            { 
              localImage ?
              <>
                <img src={localImage} alt="local" className="app--local__image"/>
                <p>Click to select an image</p>
              </>
              :
              <div className="app--local__placeholder">
                <p>Drag 'n' drop an image here</p>
              </div>
            }
          </div>
          {
            showUploadButton ? 
            <>
              <button onClick={() => handleUpload(localImage)} className="App--local__button">Upload</button>      
            </>:
            fileUpLoading &&
            <div className="loading">
              Uploading image...
            </div>
          }
        </div>
        <div className="app--remote">
          {
            remoteImage ?
            <>
              <img src={remoteImage} alt="remote" className="app--remote__image"/>
              <p>{remoteText}</p>
              <div className="app--remote__query">
              {/* <input type="text"></input>  */}
              <button onClick={() => handleQuery(remoteQuery)} className="App--local__button">Query</button>
              <p>{ queryResponse ? queryResponse : '' }</p>
            </div>
            </> :
            <div className="app--remote__placeholder">
              <p>Placeholder for converted image</p>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default App;
