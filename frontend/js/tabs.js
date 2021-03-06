"use strict";

/* Sript pour gérer le changement de tab
 *
 */

/* ******* CONSTANTES ET VARIABLES GLOBALES ******** */

// Permet de connaire l'id de la section à afficher en fonction de l'id du tab cliqué
const LIENS_TAB_SECTION = {
    tabAffichageResume : "affichageResume",
    tabVisitesVilles : "visitesVilles",
    //tabRecherchePersonnes : "recherchePersonnes",
    tabPersonnes : "personnes",
    tabVilles : "villes"
}


// mémorise la tab actuelle
// initialisée à "tabPersonnes" par défaut
let idTabActuel = "tabVilles"; 



/* ******* main ***************** */

// Une fois la page chargée, initialise les tabs
document.addEventListener("DOMContentLoaded", initTabs);


/**
 * Sert à initialiser l'onglet par défaut.
 * Se base sur la variable globale "idTabActuel", dont la valeur initiale sert de valeur par défaut
 * Pas de paramètres.
 * Pas de retour.
 */
function initTabs() {
    document.getElementById(LIENS_TAB_SECTION[idTabActuel]).style.display = "block";
    document.getElementById(idTabActuel).classList.add("active");
}

/**
 * Entraine un changement d'onglet
 * Le contenu de l'onglet précédent sera caché et l'onglet précédent ne sera plus actif.
 * Le contenu du nouvel onglet sera affiché et le nouvel onglet sera actif (pour le mettre en évidence en couleur).
 * La variabe globale "idTabActuel" est utilisée pour savoir quel onglet ne plus afficher, puis elles est mise à jour avec le nouveau.
 * L'onglet actuel est reçu en paramètre et son id est utilisé.
 * La constante LIENS_TAB_SECTION est utilisée pour retrouver les id des contenu des onglets, sur base des id des onglets.
 * 
 * Pas de retour
 * @param {HTMLElement} tabButton - le bouton qui a enclenché le changement de tab
 */
function changerTab(tabButton) {
    //console.log(tabButton);
    // cache le tab actuel
    document.getElementById(LIENS_TAB_SECTION[idTabActuel]).style.display = "none";
    document.getElementById(idTabActuel).classList.remove("active");

    // affiche le tab demandé
    document.getElementById(LIENS_TAB_SECTION[tabButton.id]).style.display = "block";
    document.getElementById(tabButton.id).classList.add("active");

    // mémorise le nouveau tab actuel
    idTabActuel = tabButton.id;
}
function afficherVilles(){
	let xhr = new XMLHttpRequest();
	xhr.open('get', 'http://localhost:622/recupererVilles', true);
	xhr.onload = function fonctionVilles(){
		let reponse = JSON.parse(xhr.responseText);
		console.log(reponse);
		let str = '';
		for (let i in reponse){
			str += '<li>' + reponse[i].codePostal + ', ' + reponse[i].ville + '</li>'
		}
		document.getElementById("listeVilles").innerHTML = str;
	};
	xhr.send();
}
afficherVilles();

function ajouterVille(form){
	let ville = form.nomVille.value;
	let codePostal = form.codePostal.value;
	console.log(ville);
	console.log(codePostal);
	if(ville.length > 30){
		console.log("erreur, inserez un nom de ville de moins de 30 caractères");
		//break;
	}
	else if(codePostal.length != 4){
		console.log("erreur, le code postal doit contenir 4 chiffres !");
		//break;
	}
	else{
		codePostal = Number(codePostal);
		if(typeof(codePostal) != "number"){
			return "erreur, le code postal doit être composé de 4 chiffres !";
			//break;
		}
	
		let xhr = new XMLHttpRequest();
		xhr.open('get', 'http://localhost:622/enregistrerVille?codeP='+codePostal+'&vil='+ville, true);
		xhr.onload = function fonctionEnregistrerVille(){
			console.log("ville enregistrée");
		};
	xhr.send();
	afficherVilles();
	}
}
function afficherPersonnes(){
	let xhr = new XMLHttpRequest();
	xhr.open('get', 'http://localhost:622/afficherPersonnes', true);
	xhr.onload = function recupererPersonne(){
		let reponse = JSON.parse(xhr.responseText);
		let str = '';
		for(let i in reponse){
			let positif;
			console.log(String(reponse[i].expiration));
			let date = new Date(String(reponse[i].expiration))
			if(reponse[i].resultat == "positif" && date >= new Date()){
				positif = true;
			}
			else{
				positif = false;
			}
			if(positif){
				str += "<tr><td>" + reponse[i].id + "</td><td>" + reponse[i].prenom + "</td><td>" + reponse[i].nom + "</td><td>" + reponse[i].dateNaiss + "</td><td id=\"reultatTest\" style=\"color: red;\">oui</td></tr>";
			}
			else {
				str += "<tr><td>" + reponse[i].id + "</td><td>" + reponse[i].prenom + "</td><td>" + reponse[i].nom + "</td><td>" + reponse[i].dateNaiss + "</td><td>non</td></tr>";
			}
		};
		document.getElementById("tbodyPersonnes").innerHTML = str;
		document.getElementById("resultatTest").style.fontWeight = bold;
	};
	xhr.send();
}
afficherPersonnes();

function ajouterPesronne(form){
	let nom = form.nomPersonne.value;
	let prenom = form.prenomPersonne.value;
	let dateNaiss = form.dateNaissance.value;
	let sexe = form.sexePersonne.value;
	if(nom.length > 30){
		console.log("attention, le nom doit contenir maximum 30 caractères !");
	}
	else if(nom.length > 30){
		console.log("attention, le prenom doit contenir maximum 30 caractères !");
	}
	else{
		let xhr = new XMLHttpRequest();
		xhr.open('get', 'http://localhost:622/enregistrezPersonne?nom='+nom+'&prenom='+prenom+'&dateNaiss='+dateNaiss+'&sexe='+sexe, true);
		xhr.onload = function fonctionEnregistrerPersonne(){
			console.log("Personne enregistrée");
		};
	xhr.send();
	afficherPersonnes();
	}
}
function ajouterTestCovid(form){
	document.getElementById("personneTestCovid") = //"<option value=" + idPersonne + ">"+ ... (ajouter les ids des personnes dans chaque option )
	let personne = form.personneTestCovid.value;
	let result = form.resultatTestCovid.value;
	let dateTest = form.dateTestCovid.value;
	let dateExp = form.dateExpirationTestCovid.value;
	let xhr = new XMLHttpRequest();
	xhr.open('get', 'http://localhost:622/ajouterTest?pers='+personne+'&resultat='+result+'&dateTest='+dateTest+'&expiration='+dateExp, true);
	xhr.onload = function fonctionCallback(){
		console.log("test enregistré");
	};
	xhr.send();

}
