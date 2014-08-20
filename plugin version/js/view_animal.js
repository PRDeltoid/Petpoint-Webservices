function view_animal(detail) 
{
    var x2js = new X2JS();
    var jsonObj = x2js.xml_str2json(detail);  
    var animal_details = jsonObj.adoptableDetails;
    var output_html = "<img class='animal-picture' src='" + animal_details["Photo1"] + "'></img>" +
                    "<table>" +
                    "<tr><td>" + animal_details["AnimalName"] + "</tr></td>" +
                    "<tr><td>" + animal_details["PrimaryBreed"] + "</tr></td>" +
                    "<tr><td>" + animal_details["Age"] + " weeks old</tr></td>" +
                    "<tr><td>" + animal_details["BodyWeight"] + "</tr></td>" +
                    "</table>";
                        
    var output_area = document.getElementById('animal');

    output_area.innerHTML = output_html;

}
