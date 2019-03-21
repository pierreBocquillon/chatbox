document.addEventListener('DOMContentLoaded', ()=> {

    /* 
    Déclaration
    */
        const form = document.querySelector('form');
        const userName = document.querySelector('#name');
        const userPassword = document.querySelector('#password');
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
        const login = ( name, password ) => {
            var pass = {};
            pouchDatabase.allDocs( { include_docs: true }, ( err, data ) => {
                err ? console.error(err) : data.rows.map( item => pass[item.doc.name] = item.doc.password ) ;
                
                if(pass[name] == password){
                    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = name;
                    window.location = "/"
                }else{
                    userName.value = "";
                    userPassword.value = "";
                    alert("wrong name or password");
                }
            });
        }

        
        
        // Fonction pour la validation du formulaire
        const startLogin = () => {
            // Capter la soumission du formulaire
            form.addEventListener( 'submit', event => {
                // Bloquer le comportement naturel du formulaire
                event.preventDefault();
                login(userName.value, userPassword.value);
            })
        };
    //

    /* 
    Lancer l'interface
    */
        // BDD sync
        syncDatabases();

        // Chatbox start
        startLogin();
    //

});
