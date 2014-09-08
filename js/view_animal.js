function view_animal(animal_details) 
{
    var output_area = document.getElementById('animal'); //The div element that our HTML will be placed inside of.

    var photo_regex = /Photo[1-9]{1}/g;
    var num_of_photos = JSON.stringify(animal_details).match(photo_regex).length;

    //Fields here will show up on the page. The title is what you want the user to see, and the field_name is the name of the variable in the animal_details object. 
    /*TYPE CAN ONLY BE ONE OF (case-sensitive): 
      age: formats age as years/months/weeks.
      breed: formats breed
    */
    var output_fields = [
        {title: "Name",     field_name: "AnimalName"}, 
        {title: "Breed",    field_name: "PrimaryBreed", type:"breed"},
        {title: "Age",      field_name: "Age",          type: "age"},
        {title: "Sex",      field_name: "Sex"},
        {title: "Weight",   field_name: "BodyWeight"},
        {title: "Desciption", field_name: "Dsc"},
        {title: "BE Color", field_name: "BehaviorResult"}
    ];

    var output_html = "<table class='animal-detail'><img class='animal-picture' src='" + animal_details["Photo1"] + "' style='border: 3px solid " + animal_details["BehaviorResult"] + "'></img>";

    output_fields.map(function(field_object) {
        //Format the output if a Type is set. 
        if(field_object.type) {
            animal_details[field_object.field_name] = format_field(field_object, animal_details[field_object.field_name]);
        }
        output_html += "<tr><td><b>" + field_object.title + ": </b></td><td>" + animal_details[field_object.field_name] + "</td></tr>";
    });

    output_html += "</table>";
    
    output_area.innerHTML = output_html; //After table is built, insert the html into the page.

}

function load_photo(photo_url) {
    var imageElmement     = document.getElementById('animal-picture');
    imageElmement.src = photo_url;
}

function format_field(field_object, field_data) {
    var object_type = field_object.type;
    switch(object_type) {
        case "age": 
            return format_age(field_data);
            break;
        case "breed":
            return format_breed(field_data);
            break;
        default:
            break;
    }
}

function format_age(age) {
    //Age is set as Months.
    //12 months in a year.
    var years = Math.floor(age/12) 
    var months =  Math.floor(age%12);

    return (years==0 ? "" : years + "y ") + (months==0 ? "" : months +"m");
}

function format_breed(breed) {
    var split_string = breed.split(", ");
    split_string.reverse();
    return split_string.join(" ");
}
