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
        pouchDatabase = new PouchDB('todo');

        // Définir la BDD CouchDB
        const couchDatabase = 'http://134.209.231.153:5984/todo';

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
                err ? console.error(err) : data.rows.map( item => messages.innerHTML += `<p class="${item.doc.status}" id="${item.doc._id}"  > <b>${item.doc.author}:</b> ${item.doc.content}<input class="donebtn btn" type="button" value="Done" style="margin-left: auto;" onclick="donetodo('${item.doc._id}')"></input>  <input class="undonebtn btn" type="button" value="Undone" onclick="undonetodo('${item.doc._id}')"></input> <input class="deletebtn btn" type="button" value="delete" onclick="deletetodo('${item.doc._id}')"></input></p>` ) ;
                
                for(var i= 0; i < document.getElementsByClassName(document.cookie).length; i++)
                {
                    //document.getElementsByClassName(me)[i].style.backgroundColor = "#3a39ad";
                    //document.getElementsByClassName(me)[i].style.alignSelf = "flex-end";
                }

                btn1 = document.getElementsByClassName("donebtn")
                btn2 = document.getElementsByClassName("undonebtn")
                btn3 = document.getElementsByClassName("deletebtn")

                if(document.cookie != "tazertazer"){
                    for(var i= 0; i < btn1.length; i++){
                        btn1[i].style.display = "none";
                        btn2[i].style.display = "none";
                        btn3[i].style.display = "none";
                    }
                }


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
                status: "todo",
                created_at: dateNow
            })
            .then( success => console.log(success) )
            .catch( err => console.error(err) );
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


const donetodo = ( id ) => {
    pouchDatabase.get(id).then(function (doc) {
        doc.status = "done";
        return pouchDatabase.put(doc);
      }).then(function () {
        return pouchDatabase.get(id);
      }).then(function (doc) {
        console.log(doc);
      });
      
}
const undonetodo = ( id ) => {
    pouchDatabase.get(id).then(function (doc) {
        doc.status = "todo";
        return pouchDatabase.put(doc);
      }).then(function () {
        return pouchDatabase.get(id);
      }).then(function (doc) {
        console.log(doc);
      });
 
    
}
const deletetodo = ( id ) => {
    pouchDatabase.get(id).then(function (doc) {
        return pouchDatabase.remove(doc);
      });
}


       
