# Mon Planning IA – déploiement

Structure :
  index.html   -> l'app
  api/plan.js  -> fonction serveur (appelle Claude)

## 1. Clé API
Crée une clé sur aistudio.google.com (Get API key, gratuit). Ne la mets JAMAIS dans le code.

## 2. GitHub
  git init
  git add .
  git commit -m "Mon Planning IA"
  (crée un repo vide sur github.com, puis)
  git remote add origin https://github.com/TON_NOM/planning-ia.git
  git push -u origin main

## 3. Vercel
1. vercel.com -> Sign up avec GitHub
2. Add New -> Project -> choisis planning-ia
3. Environment Variables : GEMINI_API_KEY = ta clé
4. Deploy -> tu obtiens https://planning-ia.vercel.app

## 4. Test
Ouvre le lien, clique "Générer mon planning". Si l'IA échoue, l'app utilise le calcul local.
Sur téléphone : menu du navigateur -> "Ajouter à l'écran d'accueil".
