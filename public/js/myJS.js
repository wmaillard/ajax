var titles = {
	"viewRecords": "View Records",
	"editRecord" : "Edit Record",
	"newRecord" : "New Record"
}

$(function(){
	changePage("newRecord", "Add a New Record");
	console.log($("a", "nav"));
	$("a", "nav").on("click", function(event){
		console.log("Target id:" + event.target.id);
		var targetID = event.target.id;
		changePage(event.target.id, titles[targetID]);
		return false;
	});

})


function changePage(newPage, title){
	$("#pageTitle").html(title);
	$("#ajaxContainer").load(newPage + ".html", function(){
		if(newPage == "viewRecords"){
			$("#edit").on("click", function(event){

				console.log("hey");
				if($("#contactFormDiv").length === 0){
					$("#ajaxContainer").append($('<div id = "contactFormDiv">').load("newRecord.html", function(){
						//Sweet scrolling idea from here: stackoverflow.com/questions/6677035/jquery-scroll-to-element
						$('html, body').animate({
							scrollTop: $("#contactFormDiv").offset().top
							}, 2000);
						
						$("#save").on("click", function(e){
							//Send edited form data here
							$("#contactFormDiv").remove();
							
							return false;

							});
						}));
				}
				return false;
										   
			});
		}
		else if(newPage = "newRecord"){
			$("#save").on("click", function(e){
				alert("sent data");
				//Send new data here
				return false;

				});
		
		}
	});
	
};