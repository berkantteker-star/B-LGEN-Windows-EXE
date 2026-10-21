'use strict';
const {app,BrowserWindow,shell,dialog}=require('electron');
const path=require('node:path');
let backend;
app.whenReady().then(async()=>{
  process.env.BILGEM_DATA_DIR=path.join(app.getPath('userData'),'local-data');
  const {start}=require('./local-server.cjs');
  backend=await start('127.0.0.1',0);
  const win=new BrowserWindow({
    width:1440,height:900,minWidth:900,minHeight:600,
    webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}
  });
  await win.loadURL('http://127.0.0.1:'+backend.port+'/');
  win.webContents.setWindowOpenHandler(({url})=>{
    if(/^https:\/\//i.test(url))shell.openExternal(url);
    return {action:'deny'};
  });
}).catch(error=>dialog.showErrorBox('BİLGEM başlatılamadı',String(error&&error.stack||error)));
app.on('window-all-closed',()=>{
  if(backend)backend.server.close();
  app.quit();
});
