# FN Traduction — Site web (v2, dynamique)

Site vitrine bilingue (Français / বাংলা) : traduction assermentée, interprétation, services administratifs, FN Formation, devis.

## Publier sur GitHub Pages
1. Créez un dépôt GitHub, puis envoyez-y **le contenu** de ce dossier (index.html à la racine du dépôt).
2. **Settings → Pages** → Source : branche `main`, dossier `/ (root)` → Save.
3. Le site sera en ligne sur `https://<utilisateur>.github.io/<depot>/` (domaine personnalisé possible).

Tous les liens sont relatifs et les polices sont hébergées dans `fonts/` : aucune dépendance externe, aucun appel à Google.

## Personnalisation
- E-mail / téléphone : `contact@fntraduction.fr`, `+33 7 58 12 34 56` (WhatsApp : `33758123456`) — à remplacer dans les `.html` et dans `data-email` / `data-wa` du formulaire (devis.html).
- Le formulaire ouvre le logiciel e-mail du visiteur (`mailto:`) ou WhatsApp ; les fichiers ne peuvent pas être joints automatiquement. Pour recevoir les demandes directement, branchez-le à Formspree ou Web3Forms.
- Les pages sont générées : textes FR/BN dans les attributs `data-fr` / `data-bn`.
