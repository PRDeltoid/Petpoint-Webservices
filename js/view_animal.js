function view_animal(animal_details) 
{
    var output_area = document.getElementById('animal'); //The div element that our HTML will be placed inside of.

    //Fields here will show up on the page. The title is what you want the user to see, and the field_name is the name of the variable in the animal_details object. 
    var output_fields = [
        {title: "Name",     field_name: "AnimalName"}, 
        {title: "Breed",    field_name: "PrimaryBreed"},
        {title: "Age",      field_name: "Age"},
        {title: "Sex",      field_name: "Sex"},
        {title: "Weight",   field_name: "BodyWeight"},
        {title: "Desciption", field_name: "Dsc"},
        {title: "BE Color", field_name: "BehaviorResult"}
    ];

    var output_html = "<table class='animal-detail'><img class='animal-picture' src='" + animal_details["Photo1"] + "' style='border: 3px solid " + animal_details["BehaviorResult"] + "'></img>";

    output_fields.map(function(field_object) {
        output_html += "<tr><td><b>" + field_object.title + ": </b></td><td>" + animal_details[field_object.field_name] + "</td></tr>";
    });

    output_html += "</table>";
    
    output_area.innerHTML = output_html; //After table is built, insert the html into the page.

}

function load_photo(photo_url) {
    var imageElmement     = document.getElementById('animal-picture');
    imageElmement.src = photo_url;
}
