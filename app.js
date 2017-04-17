(function(){
'use strict';
angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
.directive('foundItems',foundItemsDirective);

function foundItemsDirective(){
	var ddo = {
		templateUrl: 'foundItems.html',
		 scope:{
			 items : '<',
             onRemove: '&'
		 },
        controller: foundItemsDirectiveController	,
        controllerAs: 'list',
        bindToController: true
	};
	return ddo;	
};

function foundItemsDirectiveController(){
	var list = this;
};
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService)
{
var list = this;
list.searchItem = function (searchWord){
var promise = MenuSearchService.getMatchedMenuItems(searchWord);
	promise.then(function (response) {
		list.foundItems = response;
		//console.log(list.foundItems);
		//console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })

	
};
list.removeItem= function(itemIndex){
	console.log("this is "+this);
    MenuSearchService.removeItem(itemIndex);
};
}

MenuSearchService.$inject=['$http', 'ApiBasePath']; 	
function MenuSearchService($http, ApiBasePath){
	var service = this;
    var foundItems=[];
    service.getMatchedMenuItems = function(searchWord){
        foundItems = [];
		return $http({
			method: "GET",	
		url: ApiBasePath}).then(function (result) {
				//console.log(result);
				var results = result.data.menu_items;
            	if(searchWord!=""){
				for(var i=0;i<results.length;i++)
				{
					if(results[i].description.includes(searchWord))
					{
						foundItems.push(results[i]);
					}
				}
					
				}
				//	console.log(foundItems);
				
			// process result and only keep items that match
			//var foundItems...

			// return processed items
		return foundItems;
		});
		
			
	};

	service.removeItem = function(itemIndex){
		foundItems.splice(itemIndex,1);
	}
	
	
	
};
	
	
})();