const API_URL = 'https://apis.is/company?name=';


/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */

//  Hjálparfall
function el(name, ...children) {
  const element = document.createElement(name);
  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  }
  return element;
}

//  Fall sem býr til div fyrir hvert result[i]
function buaTilDivNumer(i, data) {
  //  Innstu börn
  const dalkurNafn = el('dt');
  dalkurNafn.innerHTML = 'Lén';
  const nafn = el('dd');
  nafn.innerHTML = data.results[i].name;
  const dalkurKennitala = el('dt');
  dalkurKennitala.innerHTML = 'Kennitala';
  const kennitala = el('dd');
  kennitala.innerHTML = data.results[i].sn;
  const dalkurHeimilisfang = el('dt');
  dalkurHeimilisfang.innerHTML = 'Heimilisfang';
  const heimilisfang = el('dd');
  heimilisfang.innerHTML = data.results[i].address;
  //  Foreldri barna
  const dl = el('dl', dalkurNafn, nafn, dalkurKennitala, kennitala);
  if (heimilisfang.innerHTML) {
    dl.appendChild(dalkurHeimilisfang);
    dl.appendChild(heimilisfang);
  }

  //  Foreldra nóða
  const div = el('div', dl);
  div.classList.add('company--active', 'company');

  if (!data.results[i].active) {
    div.classList.add('company--inactive');
    div.classList.remove('company--active');
  }
  return div;
}

function utkoma(data) {
  //  Slekkur á loading gif'inu
  const x = document.getElementById('loading');
  x.remove();
  //  Búa til ný div og birtir þau
  for (let i = 0; i < data.results.length; i += 1) {
    const div = buaTilDivNumer(i, data);
    document.getElementsByTagName('section')[0].appendChild(div);
  }
}

function loading() {
  //  Eyða öllum niðurstöðum sem voru á síðunni
  const x = document.querySelectorAll('.company');
  for (const xx of x) {
    xx.remove();
  }
  //  Býr til loading gif og birtir það
  const mynd = el('img');
  mynd.src = 'loading.gif';
  mynd.loop = 'infinite';
  mynd.id = 'loading';
  document.getElementsByTagName('section')[0].appendChild(mynd);
}

function action(e) {
  e.preventDefault();
  const frm = e.target;
  const inpt = frm.querySelector('input');
  const strengur = inpt.value;
  const leitastrengur = API_URL + strengur;
  //  Smá bull
  if (strengur === 'Never gonna') {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }
  //  Kall á loading gif
  loading();
  //  Fetcha json frá apis
  fetch(leitastrengur)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong on api server!');
    })
    .then((response) => {
      utkoma(response);
    })
    .catch((error) => {
      console.error(error);
    });
}

//  Listener fyrir form tagið sem kallar í action()
document.querySelector('form').addEventListener('submit', action);
