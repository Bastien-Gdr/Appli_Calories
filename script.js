// Controleur pour le stockage
// fonction auto-lancée
const StorageCtrl = (function(){

    return{

        storeItem : function(item){
            let items;

            // vérifier si l'élément existe déjà dans le local Storage
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);

                // modification du local Storage pour inscrire le nouvel élément

                localStorage.setItem('items',JSON.stringify(items));
            }
            else{
                // aller chercher les élements se trouvant déjà dans le local Storage

                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items',JSON.stringify(items));

            }
        },

        getItemsFromStorage : function(){

            let items;

            if(localStorage.getItem('items') === null ){

                items =[];
            }
            else{

                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        }

    }

})();




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
        items : StorageCtrl.getItemsFromStorage(),

        currentItem : null,

        totalCalories : 0
    }

    // Public

    return {

        getItems : function(){
            return data.items;
        },

        addItem : function(name,calories){
            // console.log(name,calories);

            let ID;

            // Générer un id 
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{

                ID = 0;
            }

            // Convertir les calories en INT 

            calories = parseInt(calories);

            // Créer un nouveau objet item

            newItem = new Item(ID, name, calories);

            // Ajout de l'élément dans le tableau

            data.items.push(newItem);

            return newItem;

        },

        getItemById : function(id){

            let found = null;

            // boucle parmi les éléments

            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });

            return found;

        },

        updateItem : function(name,calories){

            // Calories => nombre
            calories = parseInt(calories);
            
            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;

        },

        setCurrentItem : function(item){

            data.currentItem = item;

        },

        getCurrentItem : function(){

            return data.currentItem;

        },

        getTotalCalories : function(){
            let total = 0;

            // boucle

            data.items.forEach(function(item){

                total += item.calories;
                
                // Ajout du total dans la structure de donnée      
            });
            
            data.totalCalories = total;

            // Retourner le total

            return data.totalCalories;

        },

        deleteItem : function(id){

            // On va chercher les id
            const ids = data.items.map(function(item){

                return item.id;

            });

            // On va chercher l'index du tableau
            const index = ids.indexOf(id);

            // On supprime l'élément du tableau
            data.items.splice(index,1);

        },

        clearAllItems : function(){
            data.items = [];
        },

        logData : function(){
            return data;
        }
    }
    
    

})();


// Controleur Interface Utilisateur

const UiCtrl = (function(){

    const UiSelectors = {
        itemList : '#item-list',
        listItems : '#item-list li',
        addBtn : '.add-btn',
        deleteBtn : '.delete-btn',
        updateBtn : '.update-btn',
        backBtn : '.back-btn',
        deleteAll : '.deleteAllBtn',
        itemNameInput : '#aliment',
        itemCaloriesInput : '#calories',
        totalCalories : '.total-calories'
    }

    // Méthode publiques
    return{
        populateItemList : function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="list-group-item" id="item-${item.id}">
                            <strong>${item.name} :</strong> <em>${item.calories} calories</em>
                            <a href=""><i class="fas fa-pencil-alt"></i></a>
                        </li>`
            });

            document.querySelector(UiSelectors.itemList).innerHTML = html;
        },

        getItemInput : function(){
            return{
                // Retourne un objet avec des options d'où les ':'
                name : document.querySelector(UiSelectors.itemNameInput).value,
                calories : document.querySelector(UiSelectors.itemCaloriesInput).value
            }
        },

        addListItem : function(item){

            // Montrer la liste

            document.querySelector(UiSelectors.itemList).style.display = 'block';

            // Création d'un élément <li>

            const li = document.createElement('li');

            // Ajouter une classe à la <li>

            li.className = 'list-group-item';

            // Ajouter un identifiant

            li.id = `item-${item.id}`;

            // Ajouter au HTML

            li.innerHTML = `<strong>${item.name} :</strong> <em>${item.calories} calories</em>
                            <a href="#"><i class="fas fa-pencil-alt edit-item"></i></a>`;

            // Rattacher les li à la ul (#item-list)

            document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend',li);

        },

        updateListItem : function(item){

            let listItems = document.querySelectorAll(UiSelectors.listItems);

            // Convertir en tableau toutes les li (id)
            listItems = Array.from(listItems);

            // boucle
            listItems.forEach(function(listItem){

                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = 
                    `<strong>${item.name} : </strong> <em>${item.calories} calories</em>
                        <a href="#"><i class="fas fa-pencil-alt"></i></a>`;
                }

            });

        },

        clearInput : function(){

            document.querySelector(UiSelectors.itemNameInput).value = '';
            document.querySelector(UiSelectors.itemCaloriesInput).value = '';
            
        },

        deleteListItem : function(id){

            const itemID = `#item-${id}`;

            const item = document.querySelector(itemID);

            item.remove();

        },

        removeItems : function(){

            let listItems = document.querySelectorAll(UiSelectors.listItems);

            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },

        hideList : function(){

            document.querySelector(UiSelectors.itemList).style.display = 'none';

        },

        showTotalCalories : function(totalCalories){

            document.querySelector(UiSelectors.totalCalories).textContent = totalCalories;

        },

        addItemToForm : function(){
            
            document.querySelector(UiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UiCtrl.showEditState();

        },

        clearEditState : function(){

            document.querySelector(UiSelectors.updateBtn).style.display = 'none';
            document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
            document.querySelector(UiSelectors.backBtn).style.display = 'none';
            document.querySelector(UiSelectors.addBtn).style.display = 'inline';

        },

        showEditState : function(){

            document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
            document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UiSelectors.backBtn).style.display = 'inline';
            document.querySelector(UiSelectors.addBtn).style.display = 'none';

        },

        getSelectors : function(){
            return UiSelectors;
        }

    }

})();

// Controleur Application

const App = (function(ItemCtrl,StorageCtrl,UiCtrl){

   // console.log(ItemCtrl.logData());

   const loadEventListeners = function(){

        // Séléctionner le sélécteur approprié
        const UiSelectors = UiCtrl.getSelectors();

        // Ajouter l'évènement
        document.querySelector(UiSelectors.addBtn).addEventListener('click',itemAddSubmit)


        // Editer en cliquant sur les li qui contiennent le crayon

        document.querySelector(UiSelectors.itemList).addEventListener('click',itemUpdateSubmit);

        // MAJ éléments

        document.querySelector(UiSelectors.updateBtn).addEventListener('click',itemUpdateList);

        // boutton annuler
        document.querySelector(UiSelectors.backBtn).addEventListener('click',UiCtrl.clearEditState);

        // boutton supprimer
        document.querySelector(UiSelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

        // boutton tout supprimer
        document.querySelector(UiSelectors.deleteAll).addEventListener('click',clearAllItemsClick);

   }

   const itemAddSubmit = function(e){

        const input = UiCtrl.getItemInput();

        // Vérification des champs
        if(input.name !== '' && input.calories !== ''){

            const newItem = ItemCtrl.addItem(input.name,input.calories)
        }

        //console.log('Ajout ok');
        // Ajouter l'élément à l'UI

        UiCtrl.addListItem(newItem);

        // Obtenir le total de calories

        const totalCalories = ItemCtrl.getTotalCalories();

        // Afficher le total sur l'UI

        UiCtrl.showTotalCalories(totalCalories);

        // Stockage dans le local Storage

        StorageCtrl.storeItem(newItem);

        // Suppression des valeurs contenue dans les champs

        UiCtrl.clearInput();

        e.preventDefault();

   }

   // MAJ des éléments
   const itemUpdateSubmit = function(e){

        if(e.target.classList.contains('edit-item')){
            // On va chercher l'id de l'élément ciblé item-0 item-1...

            const listId = e.target.parentNode.parentNode.id;

            // Mettre l'id dans un tableau en 2 parties : item et le nombre

            const listIdArr = listId.split('-');

            // Obtenir l'id actuel (le convertir en nombre)

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            // Mise à jour de l'élément courant

            ItemCtrl.setCurrentItem(itemToEdit);

            // Ajout de l'élément dans le formulaire

            UiCtrl.addItemToForm();

        }

        e.preventDefault();

   }

   const itemUpdateList = function(e){

    // Identification du champ en question

    const input = UiCtrl.getItemInput();

    // Mettre à jour les éléments
    const updatedItem = ItemCtrl.updateItem(input.name,input.calories);

    // Mettre à jour l'UI

    UiCtrl.updateListItem(updatedItem);

    // MAJ total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Ajoute les calories à l'UI
    UiCtrl.showTotalCalories(totalCalories);

    UiCtrl.clearEditState();

    e.preventDefault();
   }

   // Gestion du boutton supprimer
   const itemDeleteSubmit = function(e){

    const currentItem = ItemCtrl.getCurrentItem();

    // Supprime l'élément courant des données

    ItemCtrl.deleteItem(currentItem);

    // Supprimer de l'UI
    UiCtrl.deleteListItem(currentItem.id);

    // MAJ total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // On ajoute le total dans l'UI
    UiCtrl.showTotalCalories(totalCalories);

    UiCtrl.clearEditState();

    // Suppression des valeurs à l'intérieur des champs

    UiCtrl.clearInput();

    e.preventDefault();
   }

   const clearAllItemsClick = function(){
    // Suppression de tous les éléments de la structure contenus dans data
    ItemCtrl.clearAllItems();

    // Modifier le total de calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);

    // Suppression des éléments de l'UI
    UiCtrl.removeItems();
    }      

    // Méthodes publiques
    return{
        init : function(){

            // Gestion des boutons

            UiCtrl.clearEditState();

            // Parcours et obtient les données
            const items = ItemCtrl.getItems();

            // Vérifier si la lsite possède des éléments
            if(items.length === 0){

                UiCtrl.hideList();

            }else{

                // Peupler la liste (ul) avec des éléments (items)
                UiCtrl.populateItemList(items);
            }

               // Obtenir le total de calories

        const totalCalories = ItemCtrl.getTotalCalories();

        // Afficher le total sur l'UI

        UiCtrl.showTotalCalories(totalCalories);

            // Lancement de la fonction LoadEventListeners

            loadEventListeners();
        }
    }
})(ItemCtrl,StorageCtrl,UiCtrl); // Sert à charger les deux controlleur automatiquement et donc pouvoir acceder à toutes les méthodes publiques

App.init();