const {app,BrowserWindow,shell}=require('electron');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..','web');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
let server;
function startServer(){return new Promise((resolve,reject)=>{server=http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()};const file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()};const target=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data)})});server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve(server.address().port))})}
app.whenReady().then(async()=>{const port=await startServer();const win=new BrowserWindow({width:1440,height:900,minWidth:900,minHeight:600,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});win.loadURL('http://127.0.0.1:'+port+'/');win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url);return {action:'deny'}})}).catch(console.error);
app.on('window-all-closed',()=>{if(server)server.close();app.quit()});
