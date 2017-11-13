// When user clicks the weight sort button, display table sorted by weight
$("#new").on("click", function() {
  // Set new column as currently-sorted (active)
//  setActive("#animal-weight");


function displayResults(news) {
	$("#scrape2").hide(1000);
	$("th").css("display", "inline");

  // First, empty the table
   $("tbody").empty();

  // Then, for each entry of that json...
  news.forEach(function(result) {
    // Append each of the animal's properties to the table
    $("tbody").append("<tr><td>" + "Title:" + result.title + "</td>" +
                         "<td>" + "Link:" + "<a href =" + result.link +">" + result.link + "</a>" + "</td>");
	 $("tbody").append("<button id = 'save'>"+ "Save Article"+ "</button>");


	});


}

// Do an api call to the back end for json with all animals sorted by weight
  $.getJSON("/api", function(data) {
    // Call our function to generate a table body
		displayResults(data);
		alert("Added 20 New Articles");
});

});


$("#save").on("click", function() {



	var $row = $(this).closest('tr');

	var Article = {
        title: $row.title,
        link: $row.link,

        };
       console.log(Article);

   $.post( Article , function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
