const header=document.querySelector('.site-header');
if(header){
  const toggleHeader=()=>header.classList.toggle('scrolled',window.scrollY>12);
  toggleHeader();
  window.addEventListener('scroll',toggleHeader,{passive:true});
}

const productCount=document.getElementById('productCount');
const selectedProducts=document.getElementById('selectedProducts');
const shopTotal=document.getElementById('shopTotal');
const extras=[...document.querySelectorAll('[data-extra]')];

function euro(value){return new Intl.NumberFormat('de-DE').format(value)+' €';}
function updateShop(){
  const option=productCount.options[productCount.selectedIndex];
  let total=Number(option.value);
  extras.forEach(box=>{if(box.checked) total+=Number(box.dataset.extra);});
  selectedProducts.textContent=option.dataset.count+' Produkte';
  shopTotal.textContent=euro(total);
}
productCount.addEventListener('change',updateShop);
extras.forEach(box=>box.addEventListener('change',updateShop));

const packages=[
  [30,2490],[60,2990],[100,3490],[150,3990],[200,4490],[250,4990],[300,5490],
  [350,5990],[400,6490],[450,6990],[500,7490],[600,8490],[800,10490],[1000,12490]
];
const options=document.getElementById('shopOptions');
packages.forEach(([count,price])=>{
  const button=document.createElement('button');
  button.type='button';
  button.className='shop-option';
  button.innerHTML=`<strong>${new Intl.NumberFormat('de-DE').format(count)} Produkte</strong><span>${euro(price)}</span>`;
  button.addEventListener('click',()=>{
    const opt=[...productCount.options].find(o=>Number(o.dataset.count)===count);
    if(opt){productCount.value=opt.value;updateShop();document.getElementById('shop').scrollIntoView();}
  });
  options.appendChild(button);
});

const revealTargets=document.querySelectorAll('.card,.price-card,.hero-panel,.included,.calculator,.contact-form,.shop-option');
revealTargets.forEach(el=>el.classList.add('reveal'));
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  revealTargets.forEach(el=>revealObserver.observe(el));
}else{
  revealTargets.forEach(el=>el.classList.add('is-visible'));
}

document.querySelectorAll('.package-choice').forEach(button=>{
  button.addEventListener('click',()=>{
    document.getElementById('contactPackage').value=button.dataset.package;
    document.getElementById('kontakt').scrollIntoView();
  });
});
document.getElementById('chooseShop').addEventListener('click',()=>{
  document.getElementById('contactPackage').value=`Online-Shop · ${selectedProducts.textContent} · ${shopTotal.textContent}`;
  document.getElementById('kontakt').scrollIntoView();
});

document.getElementById('contactForm').addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const pkg=document.getElementById('contactPackage').value.trim();
  const message=document.getElementById('message').value.trim();
  const subject=encodeURIComponent(`Projektanfrage von ${name}`);
  const body=encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\nPaket: ${pkg}\n\nProjektbeschreibung:\n${message}`);
  document.getElementById('formStatus').textContent='Ihr E-Mail-Programm wird geöffnet. Ersetzen Sie später die Empfängeradresse in script.js.';
  window.location.href=`mailto:info@webstudio24.digital?subject=${subject}&body=${body}`;
});