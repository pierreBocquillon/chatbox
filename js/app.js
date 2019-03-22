document.addEventListener('DOMContentLoaded', ()=> {

    /* 
    Déclaration
    */
        const form = document.querySelector('form');
        const userMessage = document.querySelector('#message');
        const messages = document.querySelector('#messages');
    //


    /* 
    Gestion de la donnée
    */
        // Définir la BDD PouchDB
        const pouchDatabase = new PouchDB('chat');

        // Définir la BDD CouchDB
        const couchDatabase = 'http://134.209.231.153:5984/chat';

        // Création d'une méthode pour synchroniser PouchDB et CouchDB
        const syncDatabases = () => {
            // From Pouch to Couch
            pouchDatabase.replicate.to( couchDatabase, { live: true }, (err) => console.log(err)  );
            // from COuch to Pouch
            pouchDatabase.replicate.from( couchDatabase, { live: true }, (err) => console.log(err)  );
        }

        // Fonction pour ajouter un message dans le DOM
        const fetchMessages = () => {
            messages.innerHTML = ''
            pouchDatabase.allDocs( { include_docs: true }, ( err, data ) => {
                //data.rows.map( item =>  messages.innerHTML += `<p class="${item.doc.author}"><b>${item.doc.author} :</b><br> ${item.doc.content}</p><hr>` ) ;
                console.log(data.rows.length);

                var limite = 100;

                if(data.rows.length > limite){
                    for(var i= data.rows.length-limite; i < data.rows.length;i++){
                        messages.innerHTML += `<p class="${data.rows[i].doc.author}"><b>${data.rows[i].doc.author} :</b><br> ${data.rows[i].doc.content}</p><hr>`;
                    }
                }else{
                    data.rows.map( item =>  messages.innerHTML += `<p class="${item.doc.author}"><b>${item.doc.author} :</b><br> ${item.doc.content}</p><hr>` ) ;
                }
                for(var i= 0; i < document.getElementsByClassName(document.cookie).length; i++)
                {
                    //document.getElementsByClassName(me)[i].style.backgroundColor = "#3a39ad";
                    //document.getElementsByClassName(me)[i].style.alignSelf = "flex-end";
                }
                //console.clear();
                messages.scrollTo(0,document.querySelector("#messages").scrollHeight);
            });
        };

        // Configurer la synchronisation
        pouchDatabase.changes({
            since: 'now',
            live: true
        }).on('change', fetchMessages );
    //



    /* 
    Méthodes
    */
        // Fonction pour ajouter un message dasn PouchBD
        const addMessage = ( message ) => {
            userMessage.value="";
            const dateNow = new Date();

            // Ajouter le message dans la BDD
            pouchDatabase.put({
                _id: dateNow,
                author: document.cookie,
                content: message,
                created_at: dateNow
            })
        }

        
        
        // Fonction pour la validation du formulaire
        const startChat = () => {
            // Capter la soumission du formulaire
            form.addEventListener( 'submit', event => {
                // Bloquer le comportement naturel du formulaire
                event.preventDefault();
                
                // Vérifier la taille du message
                if( userMessage.value.length >= 2 ){
                    // Enregistrer le message dans la BDD
                    addMessage(userMessage.value);
                };
            })
        };
    //

    /* 
    Lancer l'interface
    */
        // BDD sync
        syncDatabases();
        fetchMessages();

        // Chatbox start
        startChat();
    //

});
