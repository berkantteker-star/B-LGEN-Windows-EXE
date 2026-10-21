'use strict';
function install(db){
 db.exec("CREATE TABLE IF NOT EXISTS stock_items(id INTEGER PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, barcode TEXT, lot TEXT, expiry TEXT, unit TEXT DEFAULT 'adet', quantity INTEGER NOT NULL DEFAULT 0 CHECK(quantity>=0), min_stock INTEGER NOT NULL DEFAULT 0 CHECK(min_stock>=0));");
 db.exec("CREATE TABLE IF NOT EXISTS stock_moves(id INTEGER PRIMARY KEY, item_id INTEGER NOT NULL, kind TEXT NOT NULL CHECK(kind IN ('IN','OUT')), amount INTEGER NOT NULL CHECK(amount>0), before_qty INTEGER NOT NULL, after_qty INTEGER NOT NULL, actor_id INTEGER NOT NULL, note TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);");
 const add=db.prepare('INSERT INTO stock_items(code,name,barcode,lot,expiry,unit,quantity,min_stock) VALUES(@code,@name,@barcode,@lot,@expiry,@unit,@quantity,@min_stock)');
 const get=db.prepare('SELECT * FROM stock_items WHERE id=?');
 const update=db.prepare('UPDATE stock_items SET quantity=? WHERE id=?');
 const log=db.prepare('INSERT INTO stock_moves(item_id,kind,amount,before_qty,after_qty,actor_id,note) VALUES(?,?,?,?,?,?,?)');
 return {
  list:()=>db.prepare('SELECT * FROM stock_items ORDER BY name').all(),
  critical:()=>db.prepare('SELECT * FROM stock_items WHERE quantity<=min_stock ORDER BY name').all(),
  history:()=>db.prepare('SELECT * FROM stock_moves ORDER BY id DESC LIMIT 500').all(),
  addItem(a){if(!a||!String(a.code||'').trim()||!String(a.name||'').trim())throw Error('Ürün kodu ve adı gerekli');const quantity=Number(a.quantity||0),min_stock=Number(a.min_stock||0);if(!Number.isSafeInteger(quantity)||quantity<0||!Number.isSafeInteger(min_stock)||min_stock<0)throw Error('Geçersiz miktar');return Number(add.run({code:String(a.code).trim(),name:String(a.name).trim(),barcode:String(a.barcode||''),lot:String(a.lot||''),expiry:String(a.expiry||''),unit:String(a.unit||'adet'),quantity,min_stock}).lastInsertRowid)},
  move:db.transaction((id,kind,amount,actor,note='')=>{if(!['IN','OUT'].includes(kind)||!Number.isSafeInteger(amount)||amount<=0)throw Error('Geçersiz işlem');const item=get.get(id);if(!item)throw Error('Ürün bulunamadı');const next=item.quantity+(kind==='IN'?amount:-amount);if(next<0)throw Error('Yetersiz stok');update.run(next,id);const row=log.run(id,kind,amount,item.quantity,next,actor,String(note));return {id:Number(row.lastInsertRowid),quantity:next}})
 };
}
module.exports={install};
