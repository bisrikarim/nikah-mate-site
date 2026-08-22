# Nikah Mate — page de présentation

Le site public de l'application. Du HTML, du CSS et du JavaScript écrits à la
main : **aucune compilation, aucune dépendance à installer**.

Le code de l'application, lui, vit dans un dépôt séparé et privé.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page entière : le contenu et sa structure |
| `assets/styles.css` | Toute la mise en forme, jetons de couleur compris |
| `assets/app.js` | Les animations des quatre écrans de téléphone |
| `assets/motif.png` | Le médaillon du logo, utilisé comme pochoir de fond |
| `assets/og.png` | L'image qui s'affiche quand on partage le lien |
| `netlify.toml` | Ce que Netlify publie, et les en-têtes HTTP |

## La voir en local

Ouvrir `index.html` suffit pour l'essentiel. Pour un rendu identique à la
production :

```
npx serve .
```

## La mettre en ligne

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an
   existing project**
2. Choisir GitHub, puis ce dépôt
3. Ne rien changer aux réglages — `netlify.toml` s'en occupe
4. **Deploy**

Chaque `git push` republie la page automatiquement.

## Publier une nouvelle version de l'APK

**L'APK ne se met jamais dans le dépôt.** Git garderait chaque version pour
toujours : le dépôt grossirait de plusieurs dizaines de Mo à chaque build, et
plus rien ne pourrait l'alléger. Il se publie en pièce jointe d'une
**Release** GitHub, qui ne pèse pas sur l'historique.

1. Construire l'APK depuis le dépôt de l'application :
   ```
   npx eas-cli build --platform android --profile preview
   ```
2. Télécharger le fichier produit et le **renommer `nikah-mate.apk`**.
   Le nom doit rester le même à chaque version : c'est lui que le bouton
   cherche.
3. Sur GitHub : **Releases** → **Draft a new release** → choisir un tag
   (`v1.0.0`, `v1.0.1`…) → glisser l'APK → **Publish release**.

Le bouton de la page pointe sur `releases/latest/download/nikah-mate.apk` :
il suit automatiquement la dernière release. **Aucune modification du site
n'est nécessaire pour publier une mise à jour.**

> ⚠️ Ce dépôt doit être **public**. Sur un dépôt privé, les fichiers d'une
> Release exigent une authentification : le bouton renverrait une erreur 404
> à tous les visiteurs.

> ⚠️ Gardez toujours la **même méthode de build** d'une version à l'autre.
> Android refuse de remplacer une application par une autre signée avec une
> clé différente : les utilisateurs devraient désinstaller avant de mettre à
> jour, et perdraient leur session.

## Trois adresses à corriger après le premier déploiement

Netlify attribue une adresse du type `xxxxx.netlify.app`. Trois lignes
d'`index.html` doivent la reprendre, sans quoi l'aperçu du lien partagé sur
WhatsApp ou les réseaux sociaux restera cassé :

- `<link rel="canonical" href="...">`
- `<meta property="og:url" content="...">`
- `<meta property="og:image" content=".../assets/og.png">`

Elles sont regroupées en haut du fichier, sous un commentaire qui les signale.

## Deux choses à savoir avant de retoucher

**Les couleurs passent toutes par des jetons**, définis en haut de
`styles.css`. Ils existent en **trois exemplaires** : le thème clair, le thème
sombre du système, et le thème sombre choisi à la main. Ajouter une couleur
dans un seul des trois blocs la rend absente dans les deux autres cas — c'est
l'erreur la plus facile à commettre ici.

**Le boîtier du téléphone et l'écran de l'application ont des couleurs
figées** (les jetons `--d-*` et `--a-*`). C'est voulu : une capture d'écran ne
change pas de couleur parce que le site qui l'affiche est en mode sombre.
