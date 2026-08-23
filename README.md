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

## Les deux langues

| Adresse | Fichier | Langue |
|---|---|---|
| `/` | `index.html` | français |
| `/ar/` | `ar/index.html` | arabe, lecture de droite à gauche |

Les deux pages partagent **la même feuille de style et le même script**.
Seul le contenu est dupliqué.

**Modifier le site, c'est donc toucher aux deux fichiers.** C'est le prix de
l'approche : en échange, chaque langue a sa propre adresse (donc son propre
référencement, et un lien partageable tel quel), la page s'affiche
instantanément dans la bonne langue, et rien ne dépend de JavaScript.

### Ce qui bascule tout seul

`dir="rtl"` sur `<html>` suffit : flex et grid se retournent d'eux-mêmes. Les
quelques règles qui suivent le sens de lecture emploient des propriétés
**logiques** (`border-inline-start` plutôt que `border-left`), qui s'adaptent
sans qu'on s'en occupe.

### ⚠️ Ce qui ne doit PAS basculer

**Le boîtier du téléphone.** C'est la photo d'un objet réel : ses boutons
latéraux, son îlot et son ombre restent où ils sont, quelle que soit la
langue. Ces règles emploient volontairement des propriétés **physiques**
(`left`, `right`), qui ignorent `dir`. Seul le *contenu de l'écran* suit le
sens de lecture.

### Les textes à l'intérieur des téléphones

Ils vivent dans `assets/app.js`, dans l'objet `TEXTES`, avec une entrée `fr`
et une entrée `ar`. Le script lit `lang` sur `<html>` et pioche dans la bonne.
Un seul fichier, donc une seule logique à maintenir.

## Deux choses à savoir avant de retoucher

**Les couleurs passent toutes par des jetons**, définis en haut de
`styles.css`. Ils existent en **trois exemplaires** : le thème clair, le thème
sombre du système, et le thème sombre choisi à la main. Ajouter une couleur
dans un seul des trois blocs la rend absente dans les deux autres cas — c'est
l'erreur la plus facile à commettre ici.

**Le boîtier du téléphone et l'écran de l'application ont des couleurs
figées** (les jetons `--d-*` et `--a-*`). C'est voulu : une capture d'écran ne
change pas de couleur parce que le site qui l'affiche est en mode sombre.
