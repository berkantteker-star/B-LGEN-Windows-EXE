const {app,BrowserWindow,shell,dialog}=require('electron');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..','web');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
let server,settingsFile,settings;
const safe=x=>String(x||'').trim();
function valid(c){return c&&safe(c.institution).length>=2&&/^[a-z0-9][a-z0-9-]{4,}$/.test(safe(c.projectId))&&c.projectId!=='daviva-lab'&&/^AIza[\w-]{20,}$/.test(safe(c.apiKey))&&/^\d+:\d+:web:[a-f0-9]+$/i.test(safe(c.appId))&&/^\d+$/.test(safe(c.messagingSenderId))&&safe(c.authDomain)===safe(c.projectId)+'.firebaseapp.com'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe(c.adminEmail))&&safe(c.storageBucket).startsWith(safe(c.projectId)+'.');}
function response(res,status,body,type='text/plain; charset=utf-8'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(body)}
function startServer(){return new Promise((resolve,reject)=>{server=http.createServer((req,res)=>{
let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{return response(res,400,'Invalid URL')}
if(req.method==='POST'&&pathname==='/__bilgem/setup'){
if(valid(settings))return response(res,403,'Already configured');
let data='';req.on('data',chunk=>{data+=chunk;if(data.length>20000)req.destroy()});req.on('end',()=>{try{const c=JSON.parse(data);if(!valid(c))return response(res,400,'Kurum ve Firebase alanlarını kontrol edin. DAVIVA LAB projesi kullanılamaz.');const selected={institution:safe(c.institution),logo:safe(c.logo),adminEmail:safe(c.adminEmail),projectId:safe(c.projectId),apiKey:safe(c.apiKey),appId:safe(c.appId),messagingSenderId:safe(c.messagingSenderId),authDomain:safe(c.authDomain),storageBucket:safe(c.storageBucket)};fs.writeFileSync(settingsFile,JSON.stringify(selected,null,2),{flag:'wx',mode:0o600});settings=selected;response(res,200,'OK')}catch(e){response(res,400,'Kurulum kaydedilemedi: '+e.message)}});return}
if(!valid(settings)){
if(req.method==='GET'&&(pathname==='/'||pathname==='/index.html'))return fs.readFile(path.join(__dirname,'setup.html'),(err,buf)=>err?response(res,500,'Setup missing'):response(res,200,buf,'text/html; charset=utf-8'));
return response(res,403,'Önce kurum kurulumu tamamlanmalı')}
if(pathname==='/daviva-firebase-config.js'){
const config={apiKey:settings.apiKey,authDomain:settings.authDomain,projectId:settings.projectId,storageBucket:settings.storageBucket,messagingSenderId:settings.messagingSenderId,appId:settings.appId};
return response(res,200,'export const firebaseConfig = '+JSON.stringify(config)+';','text/javascript; charset=utf-8')}
if(pathname==='/__bilgem/institution')return response(res,200,JSON.stringify({name:settings.institution,logo:settings.logo}), 'application/json');
const file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep))return response(res,403,'Forbidden');
const target=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;
if(pathname==='/'||pathname==='/index.html'){
return fs.readFile(target,'utf8',(err,html)=>{if(err)return response(res,404,'Not found');
html=html.replace(/DAVIVA LAB/g,'BİLGEM').replace(/Daviva Lab/g,'BİLGEM').replace(/Daviva/g,'BİLGEM');
const branding='<script>fetch("/__bilgem/institution").then(r=>r.json()).then(c=>{document.title="BİLGEM | "+c.name;const h=document.querySelector("aside h1");if(h)h.textContent="BİLGEM";const sub=document.querySelector("aside .sub");if(sub)sub.textContent=c.name;if(c.logo&&/^https:\\/\\//.test(c.logo)){const img=document.createElement("img");img.src=c.logo;img.alt=c.name;img.style.cssText="max-width:160px;max-height:70px;object-fit:contain;display:block;margin:10px 8px";h?.after(img)}}).catch(()=>{});<\\/script>';
html=html.replace(/<\\/body>/i,branding+'</body>');
response(res,200,html,'text/html; charset=utf-8')})}

fs.readFile(target,(err,data)=>err?response(res,404,'Not found'):response(res,200,data,mime[path.extname(target)]||'application/octet-stream'));
});server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve(server.address().port))})}
app.whenReady().then(async()=>{settingsFile=path.join(app.getPath('userData'),'institution.json');try{settings=JSON.parse(fs.readFileSync(settingsFile,'utf8'))}catch{settings=null}const port=await startServer();const win=new BrowserWindow({width:1440,height:900,minWidth:900,minHeight:600,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});win.loadURL('http://127.0.0.1:'+port+'/');win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\//.test(url))shell.openExternal(url);return {action:'deny'}})}).catch(e=>dialog.showErrorBox('BİLGEM',e.message));
app.on('window-all-closed',()=>{if(server)server.close();app.quit()});
