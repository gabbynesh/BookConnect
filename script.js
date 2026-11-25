"use strict";
const translations = {
  "bg": {
    "home": "Начало",
    "catalog": "Каталог",
    "myBooks": "Моите книги",
    "howNav": "Как работи",
    "aboutNav": "За библиотеката",
    "welcome": "Добре дошъл в BookConnect",
    "heroText": "Открий, резервирай и заеми книги от училищната библиотека.",
    "search": "Търси",
    "browse": "Разгледай каталога",
    "browseDesc": "Открий интересни книги",
    "reserve": "Резервирай книга",
    "reserveDesc": "Запази книга онлайн",
    "borrow": "Заеми книга",
    "borrowDesc": "Вземи книга от библиотеката",
    "stats": "Моите книги",
    "statsDesc": "Проследи резервациите си",
    "newBooks": "Книги в каталога",
    "allGenres": "Всички жанрове",
    "classic": "Класика",
    "children": "Детска литература",
    "fantasy": "Фентъзи",
    "modern": "Съвременна",
    "allBooks": "Всички книги",
    "availableOnly": "Само налични",
    "noResults": "Няма намерени книги.",
    "howTitle": "Как работи BookConnect?",
    "step1": "1. Намери книга",
    "step1Desc": "Потърси по заглавие, автор или тема.",
    "step2": "2. Резервирай",
    "step2Desc": "Запази избраната книга онлайн.",
    "step3": "3. Заеми",
    "step3Desc": "Вземи книгата от библиотекаря.",
    "step4": "4. Върни",
    "step4Desc": "Върни книгата в определения срок.",
    "myReservations": "Моите резервации",
    "demoNote": "Демонстрационни резервации, запазени само в този браузър.",
    "aboutTitle": "За нашата библиотека",
    "aboutText": "BookConnect е уеб система за управление на училищната библиотека. Учениците могат да откриват и резервират книги, а библиотекарят организира заеманията и връщанията.",
    "explore": "Разгледай книгите",
    "footerDesc": "Училищна библиотека"
  },
  "en": {
    "home": "Home",
    "catalog": "Catalog",
    "myBooks": "My books",
    "howNav": "How it works",
    "aboutNav": "About",
    "welcome": "Welcome to BookConnect",
    "heroText": "Discover, reserve and borrow books from your school library.",
    "search": "Search",
    "browse": "Browse catalog",
    "browseDesc": "Discover interesting books",
    "reserve": "Reserve a book",
    "reserveDesc": "Reserve a book online",
    "borrow": "Borrow a book",
    "borrowDesc": "Collect a book from the library",
    "stats": "My books",
    "statsDesc": "Track your reservations",
    "newBooks": "Books in the catalog",
    "allGenres": "All genres",
    "classic": "Classics",
    "children": "Children's literature",
    "fantasy": "Fantasy",
    "modern": "Modern",
    "allBooks": "All books",
    "availableOnly": "Available only",
    "noResults": "No books found.",
    "howTitle": "How does BookConnect work?",
    "step1": "1. Find a book",
    "step1Desc": "Search by title, author or topic.",
    "step2": "2. Reserve",
    "step2Desc": "Reserve your chosen book online.",
    "step3": "3. Borrow",
    "step3Desc": "Collect the book from the librarian.",
    "step4": "4. Return",
    "step4Desc": "Return the book by its due date.",
    "myReservations": "My reservations",
    "demoNote": "Demo reservations are saved in this browser only.",
    "aboutTitle": "About our library",
    "aboutText": "BookConnect is a school library system. Students discover and reserve books, and librarians manage loans and returns.",
    "explore": "Explore books",
    "footerDesc": "School library"
  }
};
const books = [
{id:1,title:"Под игото",author:"Иван Вазов",genre:"classic",available:true},
{id:2,title:"Бай Ганьо",author:"Алеко Константинов",genre:"classic",available:true},
{id:3,title:"Немили-недраги",author:"Иван Вазов",genre:"classic",available:false},
{id:4,title:"Железният светилник",author:"Димитър Талев",genre:"classic",available:true},
{id:5,title:"Тютюн",author:"Димитър Димов",genre:"classic",available:false}
];
let language="bg", selected=null;
const $=id=>document.getElementById(id);
let reservations=[];
try { const saved=JSON.parse(localStorage.getItem("bookconnect-reservations")||"[]"); if(Array.isArray(saved)) reservations=saved.filter(r=>books.some(b=>b.id===r.id)); } catch {}
const tr=(bg,en)=>language==="bg"?bg:en;
const t=key=>translations[language][key]||key;
const normalize=value=>String(value).toLocaleLowerCase("bg-BG").trim();
const available=b=>b.available&&!reservations.some(r=>r.id===b.id);
function save(next){try{localStorage.setItem("bookconnect-reservations",JSON.stringify(next));reservations=next;return true;}catch{notify(tr("Записът е неуспешен.","Unable to save."));return false;}}
function notify(message){$("notice").textContent=message;$("notice").style.display="block";clearTimeout(notify.timer);notify.timer=setTimeout(()=>$("notice").style.display="none",3000);}
function element(tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;}
function button(text,action){const b=element("button",text,"btn");b.type="button";b.addEventListener("click",action);return b;}
function rankBooks(items,query){const q=normalize(query);return items.map(b=>({b,score:!q?0:(normalize(b.title)===q?100:normalize(b.title).startsWith(q)?50:normalize(b.title).includes(q)?30:0)+(normalize(b.author).includes(q)?20:0)+(normalize(t(b.genre)).includes(q)?10:0)})).filter(x=>!q||x.score>0).sort((a,b)=>b.score-a.score||Number(available(b.b))-Number(available(a.b))||a.b.id-b.b.id).map(x=>x.b);}
function displayBooks(){const q=$("catalogSearch").value,g=$("genreFilter").value,a=$("availabilityFilter").value;const items=rankBooks(books.filter(b=>(g==="all"||b.genre===g)&&(a!=="available"||available(b))),q);$("bookGrid").replaceChildren();$("noResults").style.display=items.length?"none":"block";for(const b of items){const card=element("article","","book-card");card.append(element("h3",b.title),element("p",b.author,"author"),element("span",t(b.genre),"tag"),element("p",available(b)?tr("Налична","Available"):tr("Заета","Unavailable"),available(b)?"available":"unavailable"),button(tr("Подробности","Details"),()=>openBook(b)));$("bookGrid").append(card);}}
function heroSearch(){$("catalogSearch").value=$("heroSearch").value;displayBooks();$("catalog").scrollIntoView();}
function openBook(b){selected=b;$("modalTitle").textContent=b.title;$("modalAuthor").textContent=b.author;$("modalGenre").textContent=t(b.genre);$("modalDescription").textContent="";$("modalCover").hidden=true;$("modalCover").style.display="none";$("modalAvailable").textContent=available(b)?tr("Налична","Available"):tr("Заета","Unavailable");$("reserveBtn").textContent=t("reserve");$("reserveBtn").disabled=!available(b);$("bookModal").classList.add("open");}
function closeModal(){$("bookModal").classList.remove("open");selected=null;}
function closeOnBackdrop(event){if(event.target===$("bookModal"))closeModal();}
function reserveSelected(){if(!selected||!available(selected))return;if(save([...reservations,{id:selected.id,date:new Date().toISOString(),status:"reserved"}])){closeModal();displayBooks();showMyBooks();notify(tr("Книгата е резервирана.","Book reserved."));}}
function showMyBooks(){$("myBooks").style.display="block";const list=$("reservationList");list.replaceChildren();if(!reservations.length)list.append(element("p",tr("Нямаш резервации.","No reservations.")));for(const r of reservations){const b=books.find(b=>b.id===r.id);const item=element("div","","my-item");item.append(element("span",b.title+" — "+(r.status==="borrowed"?tr("Заета","Borrowed"):tr("Резервирана","Reserved"))));if(r.status!=="borrowed")item.append(button(tr("Отбележи като заета (демо)","Mark borrowed (demo)"),()=>{if(save(reservations.map(x=>x.id===r.id?{...x,status:"borrowed"}:x)))showMyBooks();}));item.append(button(r.status==="borrowed"?tr("Върни (демо)","Return (demo)"):tr("Откажи","Cancel"),()=>{if(save(reservations.filter(x=>x.id!==r.id))){displayBooks();showMyBooks();}}));list.append(item);}}
function setLanguage(lang){language=lang==="en"?"en":"bg";document.documentElement.lang=language;document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));$("heroSearch").placeholder=tr("Търси книга по заглавие, автор или тема...","Search by title, author or topic...");$("catalogSearch").placeholder=tr("Търси по заглавие или автор...","Search by title or author...");$("bgBtn").classList.toggle("active",language==="bg");$("enBtn").classList.toggle("active",language==="en");displayBooks();if($("myBooks").style.display==="block")showMyBooks();if(selected)openBook(selected);}
$("catalogSearch").addEventListener("input",displayBooks);$("genreFilter").addEventListener("change",displayBooks);$("availabilityFilter").addEventListener("change",displayBooks);$("heroSearch").addEventListener("keydown",e=>{if(e.key==="Enter")heroSearch();});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});setLanguage("bg");
