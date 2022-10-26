// Controleur pour le stockage





// Controleur pour les aliments (éléments)

const ItemCtrl = (function(){

    // Création d'un constructeur
    const Item = function(id,name,calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Structure des données

    const data = {
        items : [
            {id : 0,name : 'Pain',calories : 245},
            {id : 1,name : 'Orange',calories : 45},
            {id : 2,name : 'Poulet',calories : 100}
        ],

        currentItem : null,

        totalCalories : 0
    }

    // Public

    return {
        logData : function(){
            return data;
        }
    }
    
    

})();


// Controleur Interface Utilisateur

const UiCtrl = (function(){

    // Méthode publiques
    return{

    }

})();

// Controleur Application

const App = (function(ItemCtrl,UiCtrl){

   // console.log(ItemCtrl.logData());

    // Méthodes publiques
    return{
        init : function(){
            console.log('Application en cours d\'execution');
        }
    }
})(ItemCtrl,UiCtrl); // Sert à charger les deux controlleur automatiquement et donc pouvoir acceder à toutes les méthodes publiques

App.init();