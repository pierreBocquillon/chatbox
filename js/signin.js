document.addEventListener('DOMContentLoaded', ()=> {

    /* 
    Déclaration
    */
        const form = document.querySelector('form');
        const userName = document.querySelector('#name');
        const userPassword1 = document.querySelector('#password1');
        const userPassword2 = document.querySelector('#password2');
    //


    /* 
    Gestion de la donnée
    */
        // Définir la BDD PouchDB
        const pouchDatabase = new PouchDB('login');

        // Définir la BDD CouchDB
        const couchDatabase = 'http://134.209.231.153:5984/login';

        // Création d'une méthode pour synchroniser PouchDB et CouchDB
        const syncDatabases = () => {
            // From Pouch to Couch
            pouchDatabase.replicate.to( couchDatabase, { live: true }, (err) => console.log(err)  );
            // from COuch to Pouch
            pouchDatabase.replicate.from( couchDatabase, { live: true }, (err) => console.log(err)  );
        }
    //



    /* 
    Méthodes
    */
        // Fonction pour ajouter un message dasn PouchBD
        const addlogin = ( username, userpassword ) => {
            const dateNow = new Date();

            // Ajouter le message dans la BDD
            pouchDatabase.put({
                _id: dateNow,
                name: username,
                password: userpassword,
            })
            .then( success => window.location = "/login.html" )
            .catch( err => console.error(err) );
        }

        
        
        // Fonction pour la validation du formulaire
        const startsignin = () => {
            // Capter la soumission du formulaire
            form.addEventListener( 'submit', event => {
                // Bloquer le comportement naturel du formulaire
                event.preventDefault();
                if(userPassword1.value == userPassword2.value){
                    addlogin(userName.value, userPassword1.value);
                }else{
                    alert("password are not the same")
                }
            })
        };
    //

    /* 
    Lancer l'interface
    */
        // BDD sync
        syncDatabases();

        // Chatbox start
        startsignin();
    //

});
