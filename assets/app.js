(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ICO = (id, w, extra) =>
    `<svg class="ico" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" ${extra || ''}><use href="#${id}"/></svg>`;

  /* Lance « tick » en boucle tant que l'élément est à l'écran, et seulement
     si l'utilisateur accepte le mouvement. Rien ne tourne dans le vide. */
  function whenVisible(el, tick, ms) {
    let timer = 0;
    new IntersectionObserver((entries) => {
      const live = entries[0].isIntersecting && !reduced.matches;
      clearInterval(timer);
      if (live) timer = setInterval(tick, ms);
    }, { threshold: 0.3 }).observe(el);
  }

  /* ─────── 1. Habillage du boîtier : îlot dynamique et boutons ───────
     Purement décoratif, donc ajouté ici plutôt que répété quatre fois
     dans le balisage. */
  document.querySelectorAll('.ph').forEach((ph) => {
    ph.querySelector('.ph-screen')
      .insertAdjacentHTML('afterbegin', '<div class="ph-island"><i></i></div>');
    ph.insertAdjacentHTML('beforeend',
      '<b class="b-mute"></b><b class="b-up"></b><b class="b-dn"></b><b class="b-pwr"></b>');
  });

  /* ─────── 2. Les blocs montent en entrant dans l'écran ─────── */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('seen');
      io.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rise').forEach((el) => io.observe(el));

  /* ══════════ ÉCRAN 1 — DÉCOUVRIR ══════════
     La pile de cartes tourne, le point glisse sous l'onglet actif, et le
     cœur bat au moment où la carte part : le geste qu'on ferait au doigt. */
  const PROFILS = [
    { nom: 'Badr, 36',   ville: 'Rabat, Maroc',     score: 86, teinte: 205,
      cp: 'même intention, même pratique, enfants',
      bio: 'Croyant et posé, je cherche une épouse pratiquante et sincère.',
      quand: 'Dans les 6 mois' },
    { nom: 'Ilyas, 33',  ville: 'Casablanca, Maroc', score: 78, teinte: 28,
      cp: 'même pratique, même ville, langues',
      bio: 'Ingénieur réseaux. Je souhaite fonder un foyer paisible, in sha Allah.',
      quand: "Dès que possible" },
    { nom: 'Aymane, 31', ville: 'Casablanca, Maroc', score: 74, teinte: 152,
      cp: 'même intention, enfants, langues',
      bio: 'Discret et attaché à ma famille. Je cherche une relation sérieuse.',
      quand: 'Dans l’année' },
  ];

  const RR = 16, CC = 2 * Math.PI * RR;
  const dStack = document.getElementById('d-stack');

  const dCards = PROFILS.map((p) => {
    const el = document.createElement('article');
    el.className = 'dcard';
    el.innerHTML = `
      <div class="dphoto">
        <div class="img blur" style="background:
          radial-gradient(56% 50% at 40% 28%, hsl(${p.teinte} 32% 74%), transparent 68%),
          radial-gradient(64% 56% at 70% 72%, hsl(${p.teinte + 24} 26% 44%), transparent 72%),
          linear-gradient(155deg, hsl(${p.teinte} 22% 78%), hsl(${p.teinte + 30} 20% 46%))"></div>
        <div class="veil"></div>
        <span class="lock">${ICO('i-lock', 8, 'stroke-width="2.8"')} Photo privée</span>
        <div class="who">
          <div class="nm">${p.nom} ${ICO('i-check-c', 10, 'stroke-width="2.4"')}</div>
          <div class="ct">${ICO('i-pin', 8, 'stroke-width="2.4"')} ${p.ville}</div>
        </div>
      </div>
      <div class="dbody">
        <div class="dtop">
          <div class="ring">
            <svg width="38" height="38" viewBox="0 0 38 38">
              <circle cx="19" cy="19" r="${RR}" fill="none" stroke="var(--a-line)" stroke-width="3"/>
              <circle cx="19" cy="19" r="${RR}" fill="none" stroke="var(--a-accent)" stroke-width="3"
                      stroke-linecap="round" stroke-dasharray="${CC}"
                      stroke-dashoffset="${CC * (1 - p.score / 100)}"/>
            </svg>
            <span class="val">${p.score}</span>
          </div>
          <div style="min-width:0">
            <div class="lb">Compatibilité</div>
            <div class="cp">Points communs : ${p.cp}</div>
          </div>
        </div>
        <span class="a-pill a-pill--rose">${ICO('i-heart', 8, 'fill="currentColor" stroke="none"')} Mariage : ${p.quand}</span>
        <div class="dbio"><b>À propos</b>${p.bio}</div>
        <span class="dfull">Voir la fiche complète ${ICO('i-chev', 8, 'stroke-width="2.6"')}</span>
      </div>`;
    dStack.appendChild(el);
    return el;
  });

  let dHead = 0;
  const dPlace = () => dCards.forEach((n, i) => {
    const rang = (i - dHead + dCards.length) % dCards.length;
    n.dataset.pos = rang === 0 ? 'front' : rang === 1 ? 'back' : 'hidden';
    n.style.opacity = rang > 1 ? '0' : '';
    n.style.zIndex = rang === 0 ? 2 : rang === 1 ? 1 : 0;
  });
  dPlace();

  const dDot = document.getElementById('d-dot');
  const dTabs = [...document.querySelectorAll('#d-tabs .sorttab')];
  let dTab = 0;

  function moveDot() {
    const slot = document.getElementById('d-tabs').clientWidth / dTabs.length;
    dDot.style.transform = `translateX(${slot * dTab + slot / 2 - 2}px)`;
  }
  new ResizeObserver(moveDot).observe(document.getElementById('d-tabs'));
  addEventListener('resize', moveDot, { passive: true });

  const dHeart = document.getElementById('d-heart');
  let beat = 0;

  whenVisible(dStack, () => {
    beat++;
    // Un tour sur trois, on montre l'onglet qui change plutôt que la carte.
    if (beat % 3 === 0) {
      dTab = (dTab + 1) % dTabs.length;
      dTabs.forEach((t, i) => t.classList.toggle('on', i === dTab));
      moveDot();
      return;
    }

    dHeart.classList.add('beat');
    setTimeout(() => dHeart.classList.remove('beat'), 900);

    const sortante = dCards[dHead];
    sortante.dataset.pos = 'gone';
    dHead = (dHead + 1) % dCards.length;

    dCards.forEach((n, i) => {
      if (n === sortante) return;
      const rang = (i - dHead + dCards.length) % dCards.length;
      n.dataset.pos = rang === 0 ? 'front' : rang === 1 ? 'back' : 'hidden';
      n.style.opacity = rang > 1 ? '0' : '';
      n.style.zIndex = rang === 0 ? 2 : rang === 1 ? 1 : 0;
    });

    setTimeout(() => {
      sortante.style.transition = 'none';
      sortante.dataset.pos = 'hidden';
      sortante.style.opacity = '0';
      sortante.style.zIndex = 0;
      requestAnimationFrame(() => { sortante.style.transition = ''; });
    }, 680);
  }, 2600);

  /* ══════════ ÉCRAN 2 — DEMANDES ══════════
     Une demande est acceptée : sa pastille passe au vert, la ligne sort par
     la droite et la liste se referme. Exactement le geste de l'application. */
  const DEMANDES = [
    { nom: 'Badr, 36',   lieu: 'Rabat · très pratiquant',      teinte: 205, mot: '« Assalamu alaykum, je cherche à me marier in sha Allah »' },
    { nom: 'Ilyas, 33',  lieu: 'Casablanca · très pratiquant', teinte: 28,  mot: '« Salam, votre profil correspond à ce que je recherche »' },
    { nom: 'Aymane, 31', lieu: 'Casablanca · très pratiquant', teinte: 152, mot: '« Salam alaykum, sincèrement intéressé »' },
    { nom: 'Karim, 37',  lieu: 'Casablanca · très pratiquant', teinte: 268, mot: '« Bonjour, j’aimerais faire votre connaissance »' },
  ];

  const rList = document.getElementById('r-list');
  const rCount = document.getElementById('r-count');

  function ligne(d) {
    const el = document.createElement('div');
    el.className = 'req';
    el.innerHTML = `
      <div class="av" style="width:1.9rem;height:1.9rem;font-size:.62rem;background:hsl(${d.teinte} 30% 52%)">${d.nom[0]}</div>
      <div class="who">
        <div class="nm">${d.nom} ${ICO('i-check-c', 9, 'stroke="var(--a-accent)" stroke-width="2.4"')}</div>
        <div class="mt">${d.lieu}</div>
        <div class="qt">${d.mot}</div>
      </div>
      <span class="a-pill a-pill--wait"><i></i>En attente</span>`;
    return el;
  }

  let rQueue = DEMANDES.map(ligne);
  rQueue.forEach((n) => rList.appendChild(n));

  let rStep = 0;
  whenVisible(rList, () => {
    const vivantes = [...rList.querySelectorAll('.req:not(.out)')];

    // Plus rien à accepter : on remet la liste en place et on recommence.
    if (!vivantes.length) {
      rList.innerHTML = '';
      rQueue = DEMANDES.map(ligne);
      rQueue.forEach((n) => rList.appendChild(n));
      rCount.textContent = '4 demandes en attente';
      rStep = 0;
      return;
    }

    const cible = vivantes[0];
    const pastille = cible.querySelector('.a-pill');
    pastille.className = 'a-pill a-pill--ok';
    pastille.innerHTML = '<i></i>Acceptée';

    setTimeout(() => {
      cible.classList.add('out');
      rStep++;
      const reste = DEMANDES.length - rStep;
      rCount.textContent = reste > 1 ? `${reste} demandes en attente`
                         : reste === 1 ? '1 demande en attente'
                         : 'Aucune demande en attente';
    }, 620);
  }, 2400);

  /* ══════════ ÉCRAN 3 — MESSAGES ══════════
     Quelqu'un écrit : trois points apparaissent, puis le message arrive,
     la conversation remonte en tête et la pastille non lue s'incrémente. */
  const CONVS = [
    { nom: 'Ismail',  teinte: 205, pv: 'Salam',                   tm: '2 j' },
    { nom: 'Anas',    teinte: 28,  pv: 'Démarrez la conversation', tm: '' },
    { nom: 'Hamza',   teinte: 152, pv: 'Démarrez la conversation', tm: '' },
    { nom: 'Omar',    teinte: 268, pv: 'Démarrez la conversation', tm: '' },
    { nom: 'Youssef', teinte: 92,  pv: 'Démarrez la conversation', tm: '' },
    { nom: 'Karim',   teinte: 340, pv: 'Démarrez la conversation', tm: '' },
  ];

  const NOUVEAUX = [
    'Wa alaykum salam, merci pour votre message',
    'Barak Allahu fik, j’en parle à ma famille',
    'D’accord pour que nos walis se parlent',
  ];

  const mList = document.getElementById('m-list');
  const mBadge = document.getElementById('m-badge');

  CONVS.forEach((c) => {
    const el = document.createElement('div');
    el.className = 'conv';
    el.innerHTML = `
      <div class="av" style="width:1.85rem;height:1.85rem;font-size:.6rem;background:hsl(${c.teinte} 30% 52%)">${c.nom[0]}</div>
      <div class="who">
        <div class="nm">${c.nom}</div>
        <div class="pv">${c.pv}</div>
      </div>
      <div class="tm">${c.tm}</div>`;
    mList.appendChild(el);
  });

  let mUnread = 11, mTurn = 0;

  whenVisible(mList, () => {
    // Une conversation au hasard parmi celles qui n'ont pas encore bougé.
    const lignes = [...mList.children];
    const cible = lignes[1 + (mTurn % 3)];
    const pv = cible.querySelector('.pv');
    const tm = cible.querySelector('.tm');

    pv.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';

    setTimeout(() => {
      pv.textContent = NOUVEAUX[mTurn % NOUVEAUX.length];
      tm.textContent = "à l’instant";
      cible.classList.add('fresh');
      if (!cible.querySelector('.nb')) {
        const n = document.createElement('div');
        n.className = 'nb';
        n.textContent = '1';
        cible.appendChild(n);
      }
      mUnread++;
      mBadge.textContent = mUnread;

      // La conversation remonte en tête, comme dans l'application.
      mList.insertBefore(cible, mList.firstChild);

      setTimeout(() => {
        cible.classList.remove('fresh');
        cible.querySelector('.nb')?.remove();
      }, 2200);

      mTurn++;
    }, 1400);
  }, 4200);

  /* ══════════ ÉCRAN 4 — PROFIL ══════════
     L'interrupteur bascule et la photo se dévoile, puis se referme. C'est
     la fonctionnalité centrale, montrée plutôt que racontée. */
  const pSwitch = document.getElementById('p-switch');
  const pPhoto = document.getElementById('p-photo');

  whenVisible(pSwitch, () => {
    const flou = pSwitch.classList.toggle('on');
    pPhoto.classList.toggle('blurred', flou);
  }, 3000);
})();
