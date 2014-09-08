function pull_animals(view_animal_url, requestURL_In)
{
    //API request URL (locally hosted PHP file that pulls from Petango)
    var requestURL = requestURL_In;


    jQuery.getJSON(requestURL, function(results) {
        var output_area = document.getElementById('animal');
        output_area.innerHTML = "";

        //XmlNode is a holdover from the conversion process.
        results.XmlNode.map(function(animal) {            
            //Safety check. Make sure there isn't a null node (the last node is usually null)
            if(animal.adoptableSearch == undefined) {
                return;
            }
            //Insert invidual formatted animal's details as HTML into the final output output_html
            output_area.appendChild(create_animal_detail(animal, view_animal_url));
            return;
        });
    });
}

function create_animal_detail(animal, view_animal_url) {
   //Sets the animal variable to be easier to read. 
    var animal = animal.adoptableSearch;
   
    //Format the animals breed. Don't include Mix as a secondary breed (too vague, too cluttered).
    var animal_breed_formatted = format_breed(animal["PrimaryBreed"]);
    
    if( animal["SecondaryBreed"] != "Mix") { 
        animal_breed_formatted += ", " + format_breed(animal["SecondaryBreed"]);
    }

    var animal_node = document.createElement('div');
    animal_node.setAttribute("class", "adoptable-animal");

    var animal_picture = document.createElement('img');
    animal_picture.setAttribute("class", "animal-picture");
    animal_picture.setAttribute("src", animal["Photo"]);
    animal_picture.setAttribute("style", 'border: 3px solid ' + animal["BehaviorResult"]);

    var animal_picture_link = document.createElement('a');
    animal_picture_link.setAttribute("href", view_animal_url + animal["ID"]);
    animal_picture_link.appendChild(animal_picture);

    animal_node.appendChild(animal_picture_link);

    var animal_name = document.createElement('a');
    animal_name.setAttribute("href", view_animal_url + animal["ID"]);
    animal_name.setAttribute("class", "animal-name");
    animal_name.innerHTML = animal["Name"];

    animal_node.appendChild(animal_name);

    var animal_breed = document.createElement('p');
    animal_breed.innerHTML = animal_breed_formatted;
    var animal_sex = document.createElement('p');
    animal_sex.innerHTML = animal["Sex"];

    animal_node.appendChild(animal_breed);
    animal_node.appendChild(animal_sex);

    return animal_node;
}

function format_breed(breed_string) {
    var split_string = breed_string.split(", ");
    split_string.reverse();
    output_breed_string = split_string.join(" ");
    if(output_breed_string == "") {
        if(breed_string.length > 22) {
            return breed_string.substr(0,22) + "..";
        } else {
            return breed_string;
        }
    } else {
        if(breed_string.length > 22) {
            return output_breed_string.substr(0,24) + "..";
        } else {
            return output_breed_string;
        }
    }
}
