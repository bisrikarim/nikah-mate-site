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

  /* ─────── Textes des écrans, selon la langue de la page ───────
     Le script est partagé par les deux versions du site : il lit
     « lang » sur <html> et pioche dans le bon jeu de textes. Un seul
     fichier, donc une seule logique à maintenir. */
  const LANG = document.documentElement.lang === 'ar' ? 'ar' : 'fr';

  const TEXTES = {
    fr: {
      lock: 'Photo privée', compat: 'Compatibilité', communs: 'Points communs : ',
      mariage: 'Mariage : ', apropos: 'À propos', fiche: 'Voir la fiche complète',
      attente: 'En attente', acceptee: 'Acceptée', maintenant: 'à l’instant',
      restantes: (n) => n > 1 ? `${n} demandes en attente`
                      : n === 1 ? '1 demande en attente'
                      : 'Aucune demande en attente',
      profils: [
        { nom: 'Badr, 36', ville: 'Rabat, Maroc',
          cp: 'même intention, même pratique, enfants',
          bio: 'Croyant et posé, je cherche une épouse pratiquante et sincère.',
          quand: 'Dans les 6 mois' },
        { nom: 'Ilyas, 33', ville: 'Casablanca, Maroc',
          cp: 'même pratique, même ville, langues',
          bio: 'Ingénieur réseaux. Je souhaite fonder un foyer paisible, in sha Allah.',
          quand: 'Dès que possible' },
        { nom: 'Aymane, 31', ville: 'Casablanca, Maroc',
          cp: 'même intention, enfants, langues',
          bio: 'Discret et attaché à ma famille. Je cherche une relation sérieuse.',
          quand: 'Dans l’année' },
      ],
      demandes: [
        { nom: 'Badr, 36', lieu: 'Rabat · très pratiquant', mot: '« Assalamu alaykum, je cherche à me marier in sha Allah »' },
        { nom: 'Ilyas, 33', lieu: 'Casablanca · très pratiquant', mot: '« Salam, votre profil correspond à ce que je recherche »' },
        { nom: 'Aymane, 31', lieu: 'Casablanca · très pratiquant', mot: '« Salam alaykum, sincèrement intéressé »' },
        { nom: 'Karim, 37', lieu: 'Casablanca · très pratiquant', mot: '« Bonjour, j’aimerais faire votre connaissance »' },
      ],
      convs: ['Ismail', 'Anas', 'Hamza', 'Omar', 'Youssef', 'Karim'],
      salam: 'Salam', demarrer: 'Démarrez la conversation', ilya: '2 j',
      nouveaux: [
        'Wa alaykum salam, merci pour votre message',
        'Barak Allahu fik, j’en parle à ma famille',
        'D’accord pour que nos walis se parlent',
      ],
    },
    ar: {
      lock: 'صورة خاصة', compat: 'التوافق', communs: 'نقاط مشتركة: ',
      mariage: 'الزواج: ', apropos: 'نبذة', fiche: 'عرض الملف كاملاً',
      attente: 'في الانتظار', acceptee: 'مقبولة', maintenant: 'الآن',
      restantes: (n) => n > 1 ? `${n} طلبات في الانتظار`
                      : n === 1 ? 'طلب واحد في الانتظار'
                      : 'لا توجد طلبات في الانتظار',
      profils: [
        { nom: 'بدر، 36', ville: 'الرباط، المغرب',
          cp: 'نفس النية، نفس الالتزام، الأطفال',
          bio: 'مؤمن وهادئ، أبحث عن زوجة ملتزمة وصادقة.',
          quand: 'خلال 6 أشهر' },
        { nom: 'إلياس، 33', ville: 'الدار البيضاء، المغرب',
          cp: 'نفس الالتزام، نفس المدينة، اللغات',
          bio: 'مهندس شبكات. أرغب في تأسيس بيت هادئ، إن شاء الله.',
          quand: 'في أقرب وقت' },
        { nom: 'أيمن، 31', ville: 'الدار البيضاء، المغرب',
          cp: 'نفس النية، الأطفال، اللغات',
          bio: 'كتوم ومتعلق بعائلتي. أبحث عن علاقة جادة.',
          quand: 'خلال السنة' },
      ],
      demandes: [
        { nom: 'بدر، 36', lieu: 'الرباط · ملتزم جداً', mot: '«السلام عليكم، أبحث عن الزواج إن شاء الله»' },
        { nom: 'إلياس، 33', lieu: 'الدار البيضاء · ملتزم جداً', mot: '«سلام، ملفك يوافق ما أبحث عنه»' },
        { nom: 'أيمن، 31', lieu: 'الدار البيضاء · ملتزم جداً', mot: '«السلام عليكم، مهتم بصدق»' },
        { nom: 'كريم، 37', lieu: 'الدار البيضاء · ملتزم جداً', mot: '«مرحباً، أودّ التعرف عليك»' },
      ],
      convs: ['إسماعيل', 'أنس', 'حمزة', 'عمر', 'يوسف', 'كريم'],
      salam: 'سلام', demarrer: 'ابدأ المحادثة', ilya: 'يومان',
      nouveaux: [
        'وعليكم السلام، شكراً على رسالتك',
        'بارك الله فيك، سأتحدث مع عائلتي',
        'موافق على أن يتواصل وليّانا',
      ],
    },
  };

  const T = TEXTES[LANG];

  /* ══════════ ÉCRAN 1 — DÉCOUVRIR ══════════
     La pile de cartes tourne, le point glisse sous l'onglet actif, et le
     cœur bat au moment où la carte part : le geste qu'on ferait au doigt. */
  const SCORES = [86, 78, 74];
  const TEINTES = [205, 28, 152];
  const PROFILS = T.profils.map((p, i) => ({ ...p, score: SCORES[i], teinte: TEINTES[i] }));

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
        <span class="lock">${ICO('i-lock', 8, 'stroke-width="2.8"')} ${T.lock}</span>
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
            <div class="lb">${T.compat}</div>
            <div class="cp">${T.communs}${p.cp}</div>
          </div>
        </div>
        <span class="a-pill a-pill--rose">${ICO('i-heart', 8, 'fill="currentColor" stroke="none"')} ${T.mariage}${p.quand}</span>
        <div class="dbio"><b>${T.apropos}</b>${p.bio}</div>
        <span class="dfull">${T.fiche} ${ICO('i-chev', 8, 'stroke-width="2.6"')}</span>
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
  const T_DEM = [205, 28, 152, 268];
  const DEMANDES = T.demandes.map((d, i) => ({ ...d, teinte: T_DEM[i] }));

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
      <span class="a-pill a-pill--wait"><i></i>${T.attente}</span>`;
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
      rCount.textContent = T.restantes(DEMANDES.length);
      rStep = 0;
      return;
    }

    const cible = vivantes[0];
    const pastille = cible.querySelector('.a-pill');
    pastille.className = 'a-pill a-pill--ok';
    pastille.innerHTML = `<i></i>${T.acceptee}`;

    setTimeout(() => {
      cible.classList.add('out');
      rStep++;
      rCount.textContent = T.restantes(DEMANDES.length - rStep);
    }, 620);
  }, 2400);

  /* ══════════ ÉCRAN 3 — MESSAGES ══════════
     Quelqu'un écrit : trois points apparaissent, puis le message arrive,
     la conversation remonte en tête et la pastille non lue s'incrémente. */
  const T_CONV = [205, 28, 152, 268, 92, 340];
  const CONVS = T.convs.map((nom, i) => ({
    nom, teinte: T_CONV[i],
    pv: i === 0 ? T.salam : T.demarrer,
    tm: i === 0 ? T.ilya : '',
  }));

  const NOUVEAUX = T.nouveaux;

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
      tm.textContent = T.maintenant;
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
