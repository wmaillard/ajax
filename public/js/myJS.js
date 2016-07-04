var titles = {
	"viewRecords": "View Records",
	"editRecord" : "Edit Record",
	"newRecord" : "New Record"
}

$(function(){
	changePage("newRecord", "Add a New Record");
	//console.log($("a", "nav"));
	$("a", "nav").on("click", function(event){
		//console.log("Target id:" + event.target.id);
		var targetID = event.target.id;
		changePage(event.target.id, titles[targetID]);
		return false;
	});

})


function changePage(newPage, title){
	$("#pageTitle").html(title);
	$("#ajaxContainer").load(newPage + ".html", function(){
		if(newPage == "viewRecords"){
			$(".edit").on("click", function(event){
				if($("#contactFormDiv").length === 0){
					$("#ajaxContainer").append($('<div id = "contactFormDiv">').load("newRecord.html", function(){
            var idWithoutTag = $(event.target).closest("tr").attr("id");
            
            $("#save").on("click", function(e){
              var data = newRecord();
              data["recordNumber"] = idWithoutTag;
              
              
              $.post('/updateRecord', data, function(){
                alert("I have saved the data");
                changePage(newPage, title);
              });
              return false;
            });
            var id = "#" + idWithoutTag;
            
            
            //console.log(id);
            $("#name").val($.trim($(id).children(".name").text())); 
            $("#email").val($.trim($(id).children(".email").text())); 
            $("#website").val($.trim($(id).children(".website").text())); 
            
            if($.trim($(id).children(".icecream").text()) == "Vanilla"){
                 $('#Vanilla').prop('checked', true);
            }
            else if($.trim($(id).children(".icecream").text()) == "Chocolate"){ 
                 $('#Chocolate').prop('checked', true);
            }
            
            var animals = $(id).children(".animals").text();
            animals = $.trim(animals);
            animals = animals.split(" ");
  
            $.each(animals, function(index, value){
              //console.log('#' + value);
              if($('#' + value).length > 0){
                $('#' + value).prop('checked', true);
              }
            });
          
            
            
            
            
            
            
						//Sweet scrolling idea from here: stackoverflow.com/questions/6677035/jquery-scroll-to-element
						$('html, body').animate({
							scrollTop: $("#contactFormDiv").offset().top
							}, 2000);
						
						}));
				}
				return false;
										   
			});
			$(".delete").on("click", function(event){

        $.post('/deleteRecord', {'recordNumber': $(event.target).closest("tr").attr("id")}, function(){
          $(event.target).closest("tr").remove();
        });
			})
			
		}
		else if(newPage = "newRecord"){
			$("#save").on("click", function(e){
				var data = newRecord();
				$.post('/newRecord', data, function(){
					alert("I have saved the data");
					changePage(newPage, title);
				});
				
				//Send new data here
				return false;

				});
		
		}
	});
	
};



function newRecord(){
	var radio, checked;
	checked= [];
	if($("#Vanilla").is(':checked')){
		radio = "Vanilla";
	}
	else radio = "Chocolate";
	
	$(".checks").each(function(index){
		if ($(this).is(':checked')){
			checked.push($(this).val());
		}
	})
	var data = {"fName":$("#name").val(), 
				"email":$("#email").val(),
				"website":$("#website").val(),
				"icecream":radio,
				"animals":checked
			   }
  if(!data.fName) data.fName = " ";
  if(!data.email) data.email = " ";
  if(!data.website) data.website = " ";
  if(!data.icecream) data.icecream = " ";
  if(data.animals.length === 0) data.animals[0] = " ";
  else if(data.animals.length == 1) data.animals[1] = " "; //silly fix for Jade problems
				
	return data;
	
}














