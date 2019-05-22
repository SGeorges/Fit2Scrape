// Grab the articles as a json
function printArticles(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var newDiv = $("<div class= 'border border-dark mb-2 p-3'>");
        newDiv.append("<h5 data-id='" + data[i]._id + "'>" + data[i].title + "</h5>");
        newDiv.append("<a href='" + data[i].link + "'>" + data[i].link + "</a> </br>");
        newDiv.append("<button id= 'comment-btn' class= 'btn btn-sm btn-primary mt-1 mr-1' data-id= '" + data[i]._id + "'>Comment</button>");
        newDiv.append("<button id= 'fav-btn' class= 'btn btn-sm btn-primary mt-1' data-id= '" + data[i]._id + "'>Add Favorite</button>");
    $("#articles").append(newDiv);
  }
}

function printNotes(passed_id) {
  $.getJSON("/notes", (data) => {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      if (data[i].article_id === passed_id) {
        var newDiv = $("<div class= 'border border-dark mt-2 p-3'>");
            newDiv.append("<h5 data-id='" + data[i]._id + "'>" + data[i].title + "</h5>");
            newDiv.append("<p>" + data[i].body + "</p>");
        
        $("#notes").append(newDiv);
      }
    }
  });
}

  $(document).on("click", "#fav-btn", function() {
    // Grab the id associated with the article from the submit button
    let thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/favorites/" + thisId,
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
      });
  });

  $(document).on("click", "#favorites-btn", function() {
    $("#articles").empty();
    $.getJSON("/favorites", (data) => {
      printArticles(data);
    });
  });

  // Whenever someone clicks a p tag
  $(document).on("click", "#comment-btn", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the comment-btn
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h5>" + data.title + "</h5>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' class= 'form-control' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' class= 'form-control' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      })
      .then(printNotes(thisId));
  });

  $(document).on("click", "#clear-btn", function() {
    $("#articles").empty();

    $.ajax({
        method:"DELETE",
        url: "/articles"
    }).then(function(data) {
        console.log(data);
    });
  });

  $(document).on("click", "#scrape-btn", function() {
    $("#articles").empty();

    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data) {
      $.getJSON("/articles", (data) => {
        printArticles(data);
      });
    });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val(),
        // Value taken from button data-id
        article_id: thisId
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
$.getJSON("/articles", (data) => {
  printArticles(data);
});
