var global_results;         //pulled animal results, made globally available for other functions
var global_view_animal_url; //URL to the View Animal page, made globally available

function pull_animals(view_animal_url, requestURL_In, sort_func, sort_name)
{
    var requestURL = requestURL_In; //API request URL (locally hosted PHP file that pulls from Petango)
    
    global_view_animal_url = view_animal_url; //Assign the passed animal url to a global version for use in other functions

    jQuery.getJSON(requestURL, function(results) {  //Request the animal's data as a JSON object.
        var output_area = document.getElementById('animal'); //find the output area based on the id 'animal'
        output_area.innerHTML = "";     //Reset the output area's html.
        
        results = convert_results_to_array(results); //Places resuls into an array, giving access to prototypes map and sort.

        
        global_results = results; //Create a global results variable using the sorted results array 

        results.sort(sort_func); //Sort the results by the animal's name

        render_animals_html(results, output_area, view_animal_url); //Create the HTML nodes for each animal.

        setup_sort_buttons(view_animal_url); //Setup the sorting links.
        toggle_sort_button(sort_name);       //Toggle the button for the initially sorted type
    });
}

function create_animal_detail(animal, view_animal_url) {

    var animal = animal.adoptableSearch; //Sets the animal variable to be easier to read. 

    var animal_be = animal.BehaviorResult;
   
    var animal_breed_formatted = format_breed(animal["PrimaryBreed"]); //Format the animals breed (removes 'Mix' breed).

    var animal_name_formatted = format_name(animal["Name"]);
    
    var animal_node = create_html_node('div', [{name:'class', value:'adoptable-animal'}], [
        //The animal's picture and picture link nodes
        create_html_node('a',   [{name:'href',      value:view_animal_url + animal["ID"]}], [
            create_html_node('img', [{name:'class', value:'animal-picture'},
                                     {name:'src',   value: animal["Photo"]}]) ]),
        //The animal's name
        create_html_node('a',   [{name:'href',  value: view_animal_url + animal["ID"]},
                                 {name:'class', value: 'animal-name'}], null, animal_name_formatted),
        //animal's BE result as a colored circle. Returns null if the BE result does not exist.
        animal_be != "" ? create_html_node('div', [{name: 'class', value: 'animal-be-result'}, 
                                 {name: 'style', value: 'background-color:' + animal_be},
                                 {name: 'title', value: ''}]) : null,
        //Breed
        create_html_node('p', null, null, animal_breed_formatted),
        //Sex
        create_html_node('p', null, null, animal["Sex"]),
        //Age
        create_html_node('p', null, null, format_age(animal["Age"]))
    ]);


    return animal_node;
}

function get_animal_type(results) {
    return results[0].adoptableSearch.AnimalType;
}

function render_animals_html(results, output_area, view_animal_url) {
    results.map(function(animal) {
        output_area.appendChild(create_animal_detail(animal, view_animal_url));
    });
    
    //Generate the behavior result tooltips only for dogs.
    if(get_animal_type(results) == "Dog") {
        generate_tooltips();
    }
}

function create_html_node(node_type, attributes, child_nodes, html_content) {
    var node = document.createElement(node_type);
    //Set node attributes
    if(attributes && attributes instanceof Array ){
        attributes.map(function(attribute) {
            node.setAttribute(attribute.name, attribute.value);
        });
    }

    if(html_content) {
        node.innerHTML = html_content;
    }

    //Set up any child nodes (recursive)
    if(child_nodes) {
        child_nodes.map(function(child_node) {
            if(child_node != null) {  //Skip null nodes.
                node.appendChild(child_node);
            }
        });
    }

    return node;
}

function convert_results_to_array(results) {
    results = jQuery.map(results, function(value, index) {
        return [value];
    });
    return results;
}

function generate_tooltips() {
    jQuery('.animal-be-result').tooltip({content: 'These colors are used to categorize animals by behavior type. <br><br>' +
    '<b style="color: Green">Green:</b> This animal needs training or has special needs. Should go to an adult and dog savvy home. <br>' +
    '<b style="color: Orange">Orange:</b> This animal needs training. Better with older children and people who have owned dogs previously <br>' +
    '<b style="color: Purple">Purple:</b> This animal is friendly and trainable. Does well with children or novice pet owners.'});
}

function create_sort_button(button_area, button_name, button_id, sort_func, output_area) {
    button_area.insertBefore(create_html_node('button', 
                                            [{name: 'id',         value: button_id},
                                             {name: 'sort_order', value: 'asc'},
                                             {name: 'class',      value: 'btn btn-primary'}], 
                                             null, button_name), 
                            output_area);
    jQuery('#' + button_id).click(function() {
        var sort_order = jQuery(this).attr('sort_order'); //Get sort order as 'asc' (ascending) and 'dsc' (descending)
        output_area.innerHTML = "";
        global_results.sort(sort_func); //sort the results based on the provided sort function
        if(sort_order == 'dsc') {
            global_results.reverse(); //Reverse the results after sorting to make the results sorted in Descending order
        }
        render_animals_html(global_results, output_area, global_view_animal_url);
        toggle_sort_button(button_id);
    });
}

function setup_sort_buttons(view_animal_url) {
    var button_area = document.getElementById('animal').parentNode;
    var output_area = document.getElementById('animal');

    create_sort_button(button_area, "Sort by Age &#8593;",   'sort_by_age',   sort_by_age,   output_area); 
    create_sort_button(button_area, "Sort by Breed &#8593;", 'sort_by_breed', sort_by_breed, output_area); 
    create_sort_button(button_area, "Sort by Name &#8593;",  'sort_by_name',  sort_by_name,  output_area); 
}

function toggle_sort_button(sort_name) {
    var sort_button = jQuery('#' + sort_name);
    var button_text = sort_button.html();

    var last_active_button = jQuery('.active');

    last_active_button.removeClass('active'); //Remove the active class from the last selected button

    sort_button.addClass('active');           //Add the active class to the newly selected button

   if(sort_button.attr('sort_order') == 'asc') {         //If sort_order is currently ascending, set it to descending
       button_text = button_text.replace('↑', '↓');
       sort_button.attr('sort_order', 'dsc');
   } else if (sort_button.attr('sort_order') == 'dsc') { //If sort_order is currently descending, set it to ascending
       button_text = button_text.replace('↓', '↑');
       sort_button.attr('sort_order', 'asc');
   }
   sort_button.html(button_text);
}

function format_breed(breed_string) {
    //Breed string is in format "Chihuahua, Short Haired" or just "Yorkshire Terrier"

    var split_string = breed_string.split(", "); //Create an array containing the animals breed split on the comma ([Chihuahua, Short Haired])
    
    split_string.reverse(); //Reverse the array of names ([Short Haired, Chihuahua])
    output_breed_string = split_string.join(" "); //Rejoin the array with a space ("Short Haired Chihuahua")

    if(output_breed_string == "") {  
        output_breed_string = breed_string; //Assigns the original passed value if the formatted breed string is empty (there was no comma).
    }
    
    if(output_breed_string.length > 22) {
            return output_breed_string.substr(0,24) + "..";  //Chop the breed string at the 22nd character, then add a ".." to the end
    } else {
            return output_breed_string; //If the breed string is below 22 characters, just return it unchanged.
    }
}

function format_age(age) {
    var years = Math.floor(age/12) 
    var months =  Math.floor(age%12);

    //return the age, ignoring years or months if it is set to 0
    return (years==0 ? "" : ((years>1) ? years + " years " : years + " year ")) + (months==0 ? "" : ((months>1) ? months + " months" : months + " month"));
}

function format_name(name) {
    if(name.length > 18) {
        return name.substr(0,18) + "..";
    } else {
        return name;
    }
}

var sort_by_name = function(a, b) {
    this.name = "sort_by_name";
    if(a["adoptableSearch"].Name < b["adoptableSearch"].Name) {
        return -1;
    } else if(a["adoptableSearch"].Name > b["adoptableSearch"].Name) {
        return 1;
    }
    return 0;
}

var sort_by_age = function(a, b) {
    var age_a = parseInt(a["adoptableSearch"].Age);
    var age_b = parseInt(b["adoptableSearch"].Age);
    if(age_a < age_b) {
        return -1;
    } else if(age_a > age_b) {
        return 1;
    }
}

var sort_by_breed = function(a, b) {
    if(a["adoptableSearch"].PrimaryBreed < b["adoptableSearch"].PrimaryBreed) {
        return -1;
    } else if(a["adoptableSearch"].PrimaryBreed > b["adoptableSearch"].PrimaryBreed) {
        return 1;
    }
}
