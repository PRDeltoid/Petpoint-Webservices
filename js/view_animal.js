function view_animal(animal_id, plugin_base) 
{
    var requestURL = plugin_base + "/viewanimal.php?id=" + animal_id

    //request animal data
    var animal_details;
    jQuery.ajax({
        type: 'GET',
        url: requestURL,
        dataType: 'json',
        success: function(data) {
            animal_details=data;
        },
        data: {},
        async: false
    });

    var output_area = document.getElementById('animal'); //The div element that our HTML will be placed inside of.

    //Fields here will show up on the page. The title is what you want the user to see, and the field_name is the name of the variable in the animal_details object. 
    /*TYPE CAN ONLY BE ONE OF (case-sensitive): 
      age: formats age as years/months.
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

    //Create the animal's picture element.
    var animal_picture_node = document.createElement("img");
    animal_picture_node.setAttribute("class", "animal-picture")
    animal_picture_node.setAttribute("id", "animal-picture")
    animal_picture_node.setAttribute("src", animal_details["Photo1"])
    animal_picture_node.setAttribute("style", "border: 3px solid " + animal_details["BehaviorResult"]); 
    output_area.appendChild(animal_picture_node);

    //Create the buttons to view additional pictures of the animal.
    var animal_pic_link_node = document.createElement("div");
    animal_pic_link_node.setAttribute("id", "photo-links");
    output_area.appendChild(animal_pic_link_node);
    setup_photo_links(animal_details);

    //Create the animal's detail table.
    var animal_detail_node = document.createElement("table");
    animal_detail_node.setAttribute("class", "animal-detail");

    //Go through each object in output_fields and output a table row containing the title, and the animal's detail for the field_name
    output_fields.map(function(field_object) {
        //Format the output if a Type is set. 
        if(field_object.type) {
            animal_details[field_object.field_name] = format_field(field_object, animal_details[field_object.field_name]);
        }

        var detail_row_node = document.createElement('tr');

        //Create the title
        var detail_data_name_node = document.createElement('td');
        detail_data_name_node.innerHTML = "<b>" + field_object.title + "</b>"
        detail_row_node.appendChild(detail_data_name_node);

        //Create the animal detail data
        var detail_data_node = document.createElement('td');
        detail_data_node.innerHTML = animal_details[field_object.field_name];
        detail_row_node.appendChild(detail_data_node);

        //Add it all to the animal_detail_node table.
        animal_detail_node.appendChild(detail_row_node);
    });

    //Add the detail to the page.
    output_area.appendChild(animal_detail_node);
}

function load_photo(photo_url) {
    var imageElmement = document.getElementById('animal-picture');
    imageElmement.src = photo_url;
}

function setup_photo_links(animal_details) {
    var photo_output_area = document.getElementById('photo-links');

    //Count the number of photo entries
    var photo_regex = /Photo[1-9]{1}/g;
    var num_of_photos = JSON.stringify(animal_details).match(photo_regex).length;

    //Create a button node for each picture, and add an event listener to fire when that button is clicked. 
     for(i=0; i<num_of_photos; i++) {
        //Don't want to output 0, so we add 1 to make it more user friendly.
        var photo_num = i+1;
        var photo_url = animal_details['Photo' + photo_num];
        var photo_node = document.createElement('input');
        photo_node.setAttribute("type", "button")
        photo_node.setAttribute("id", "photo" + photo_num);
        photo_node.setAttribute("value", photo_num);

        //Insert input node into the DOM.
        photo_output_area.appendChild(photo_node);
        var picture_element = document.getElementById('photo' + photo_num);

        //Finally, add an event listener to switch to the picture when it's button is clicked (using load_photo).
        picture_element.addEventListener("click", load_photo.bind(null, photo_url));
    }
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

    //return the age, ignoring years or months if it is set to 0
    return (years==0 ? "" : years + "y ") + (months==0 ? "" : months +"m");
}

function format_breed(breed) {
    //Reverse the breed string by the comma (ex. Chihuahua, Short Coat => Short Coat Chihuahua)
    var split_string = breed.split(", ");
    split_string.reverse();
    return split_string.join(" ");
}
