console.log("V1 : Mon dico anglais");

/*

MON PROGRAMME : 

> Je veux pouvoir donner la définition d'un mot à mes utilisateurs

- 1. Récupérer le mot saisi par l'utilisateur
- 2. Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- 3. Récupérer le JSON (la donnée) en lien avec mon mot
- 4. Afficher les informations de mon mot sur ma page (HTML)
- 5. Ajouter un lecteur pour écouter la prononciation du mot

*/

/* Etape 1 : Récupérer mon mot */
const watchSubmit = () => {
  // d'abord on récupère une donnée via un formulaire
  const form = document.querySelector("#form");
  // ensuite on écoute un évênement qui arrive lorque qu'on clique sur le bouton grace au mot submit
  form.addEventListener("submit", (event) => {
    // on annule le comportement par défaut du submit qui est de réinitialiser la page et donc de mettre à zéro la recherche
    event.preventDefault();
    // on crée une variable data pour récupérer les données de mon formulaire via la class FormData(form) native de js
    const data = new FormData(form);
    // on enregistre la donnée saisie dans mon input via data.get et le nom donné dans l'attribut name de input et on le met dans une variable
    let wordToSearch = data.get("search");
    // on l'affiche dans la console pour vérifier que tout marche bien
    console.log("mot à définir: ", wordToSearch);
    console.log("je lance la recherche");
    apiCall(wordToSearch);
  });

  /*Etape 2: on envoie l mot à l'API */
  // on fait une requète fetch est une fonction une sorte de chien à qui on dit va chercher
  const apiCall = (wordToSearchInApi) => {
    fetch(
      // on va concaténer notre lien vers l'API avec notre variable du mot à chercher
      `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToSearchInApi}`
    )
      // ensuite il met la réponse en format json (javscript object notation)
      .then((response) => response.json())
      /*etape 3 on récupère le fichier JSON de l'API*/
      .then((data) => {
        console.log(data);

        const informationsNeeded = extractData(data[0]);
        renderToHTML(informationsNeeded);
      })
      // gestion de l'erreur on attrape l'erreur et peut  soit mettre un message d'alerte soit mettre les infos dans la console
      .catch((error) => {
        alert(" le mot demandé ne semble pas exister");
        console.error(error);
      });
  };
};
// const extradata permet de stocker dans une fonction toutes les données que nous avons cherchées
const extractData = (data) => {
  // on affiche le mot
  const word = data.word;
  console.log(word);
  // on affiche la phonétique
  const phonetic = findProp(data.phonetics, "text");
  // on affiche la prononciation (audio)
  const pronoun = findProp(data.phonetics, "audio");
  // on affiche la définition
  const meanings = data.meanings;

  return {
    word: word,
    phonetic: phonetic,
    pronoun: pronoun,
    meanings: meanings,
  };
};

// const findProp = (array, propertyToFind) => {
// /elle parcours un tableau d'objets et cherche si l'object contient une certaine propriété
// si elle contient cette propriété elle l'a renvoie
// };
const findProp = (array, name) => {
  console.log("array ", array);
  console.log("name", name);
  // cette fonction fait une boucle for pour parcourir un tableau d'objets
  for (let i = 0; i < array.length; i++) {
    const currentObjet = array[i];
    const hasProp = currentObjet.hasOwnProperty(name);
    if (hasProp) return currentObjet[name];
  }
};

/*Etape 4 afficher toutes ces informations sur ma page html */
const renderToHTML = (data) => {
  const card = document.querySelector(".js-card");
  card.classList.remove("card--hidden");
  // manipulation de texte avec la propriété text.content
  const title = document.querySelector(".js-card-title");
  title.textContent = data.word;
  const phonetic = document.querySelector(".js-card-phonetic");
  phonetic.textContent = data.phonetic;

  // création d'éléments HTML
  const list = document.querySelector(".js-card-list");
  for (let i = 0; i < data.meanings.length; i++) {
    const meaning = data.meanings[i];
    const partOfSpeech = meaning.partOfSpeech;
    const definition = meaning.definitions[0].definition;

    // 1 - Avec un innerHTML
    // list.innerHTML += `
    // <li class="card__meaning">
    //     <p class="card__part-of-speech">${partOfSpeech}</p>
    //     <p class="card__definition">${definition}</p>
    // </li>`
    // Attention : lisibilité peut être mauvaise quand on a de gros blocs HTML

    // 2 - Avec la création d'élements
    const li = document.createElement("li");
    // pour ajouter de la stylisation on nomme l'objet avec la syntaxe suivante element.classlist.add("nom-de-la-classe-que -je-veux-ajouter")
    li.classList.add("card__meaning");
    const pPartOfSpeech = document.createElement("p");
    pPartOfSpeech.textContent = partOfSpeech;
    pPartOfSpeech.classList.add("card__part-of-speech");
    const pDefinition = document.createElement("p");
    pDefinition.textContent = definition;
    pDefinition.classList.add("card__definition");

    li.appendChild(pPartOfSpeech);
    li.appendChild(pDefinition);
    list.appendChild(li);
  }

  // ajout de l'audio en JS
  const button = document.querySelector(".js-card-button");
  const audio = new Audio(data.pronoun);
  button.addEventListener("click", () => {
    button.classList.remove("card__player--off");
    button.classList.add("card__player--on");
    audio.play();
  });
  audio.addEventListener("ended", () => {
    button.classList.remove("card__player--on");
    button.classList.add("card__player--off");
  });
};

// je lance tout mon programme
watchSubmit();
