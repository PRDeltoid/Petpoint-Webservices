function pull_animals()
{
    var x2js = new X2JS();
    var xmlHttp = null;
    
    //API request URL (locally hosted PHP file that pulls from Petango)
    var requestURL = "http://sspca.org/pullanimals.php?type=dog";

    xmlHttp = new XMLHttpRequest();

    //When the HTTP request is complete, organize and show the results
    xmlHttp.onload = function() {
        //Create an area for our animals to be appended to.
        var output_area = document.getElementById('animals');
        var output_html = "<h3>Dogs for Adoptions</h3>";            //Add a header to the output.
        var jsonObj = x2js.xml_str2json(xmlHttp.responseText);      //Convert messy XML into nice, easy JSON

        //Iterate through each "node" (each animal) and add it's details to the output.
        jsonObj.ArrayOfXmlNode.XmlNode.map(function(e) {            
            //Safety check. Make sure there isn't a null node (the last node is usually null)
            if(e.adoptableSearch == undefined) {
                console.log("Missing name found. Aborting");
                return;
            }
            //Format the animals breed. Don't include Mix as a secondary breed (too vague, too cluttered).
            var animal_breed_formatted = e.adoptableSearch["PrimaryBreed"];
            if( e.adoptableSearch["SecondaryBreed"] != "Mix") { animal_breed_formatted += ", " + e.adoptableSearch["SecondaryBreed"]; };

            //All animal detail formatting goes here.
            var animal_detail_formatted = "<div class='adoptable-animal'>" +
                                        "<img class='animal-picture' src=" + e.adoptableSearch["Photo"] + ">" +
                                        "<div class='animal-name'><a href='/viewanimal/" + e.adoptableSearch["ID"] + "'>" + e.adoptableSearch["Name"] + "</a></div>" +
                                        "<p>" + animal_breed_formatted + "</p>" +
                                        "<p>" + e.adoptableSearch["Sex"] + "</p>" +
                                        "</div>";
            output_html += animal_detail_formatted;
            return;
        });
        console.log("Outside: " + output_html);

        //Add the finished HTML output to the page. 
        output_area.innerHTML = output_html;
        
    }
    
    //Making the HTTP request to the API URL.
    xmlHttp.open( "GET", requestURL, true);
    xmlHttp.send();
}
