// Run from the repository root: node --test tests/catalog.test.cjs
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","script.js"),"utf8");
const start=source.indexOf('function rankBooks(');
const end=source.indexOf('function displayBooks(',start);
assert.ok(start>=0&&end>start,"Catalog ranking function must exist");
const context=vm.createContext({
  normalize:value=>String(value).normalize("NFC").toLocaleLowerCase("bg-BG").trim(),
  translations:{bg:{classic:"Класика"},en:{classic:"Classics"}},
  available:b=>b.available
});
vm.runInContext(source.slice(start,end),context);
const books=[
  {id:1,title:"Под игото",author:"Иван Вазов",genre:"classic",available:true},
  {id:2,title:"Немили-недраги",author:"Иван Вазов",genre:"classic",available:false},
  {id:3,title:"Бай Ганьо",author:"Алеко Константинов",genre:"classic",available:true}
];
const ids=q=>Array.from(context.rankBooks(books,q),b=>b.id);
test("matches title and author together",()=>assert.deepEqual(ids("игото Вазов"),[1]));
test("ignores case and repeated whitespace",()=>assert.deepEqual(ids("  ИГОТО   ВАЗОВ "),[1]));
test("matches both genre languages",()=>{assert.deepEqual(ids("classic"),[1,3,2]);assert.deepEqual(ids("класика"),[1,3,2]);});
test("rejects unmatched terms",()=>assert.deepEqual(ids("Вазов xyz"),[]));
test("empty query keeps all books with available first",()=>assert.deepEqual(ids(""),[1,3,2]));
test("author matches prefer available books",()=>assert.deepEqual(ids("Вазов"),[1,2]));
