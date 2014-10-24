var global_results;

function setup_sort_links(view_animal_url) {
    var button_area = document.getElementById('animal').parentNode;
    var output_area = document.getElementById('animal');

    create_sort_button(button_area, "Sort by Age", 'sort_by_age', sort_by_age, view_animal_url, output_area); 
    create_sort_button(button_area, "Sort by Breed", 'sort_by_breed', sort_by_breed, view_animal_url, output_area); 
    create_sort_button(button_area, "Sort by Name", 'sort_by_name', sort_by_name, view_animal_url, output_area); 
}

function pull_animals(view_animal_url, requestURL_In, sort_func)
{
    //API request URL (locally hosted PHP file that pulls from Petango)
    var requestURL = requestURL_In;

    jQuery.getJSON(requestURL, function(results) {
        var output_area = document.getElementById('animal');
        output_area.innerHTML = "";
        
        //Places all objects contained within the results variable into an array, 
        //so that I can use the default array prototypes map and sort.
        results = convert_results_to_array(results);

        //Create a global results variable using the sorted results array
        global_results = results;
        console.log(global_results);

        //Sort the results by the animal's name
        results.sort(sort_func);

        //Create the HTML nodes for each animal.
        render_animals_html(results, output_area, view_animal_url);

    });
}

function create_animal_detail(animal, view_animal_url) {
   //Sets the animal variable to be easier to read. 
    var animal = animal.adoptableSearch;
   
    //Format the animals breed. Don't include Mix as a secondary breed (too vague, too cluttered).
    var animal_breed_formatted = format_breed(animal["PrimaryBreed"]);
    
    var animal_node = create_html_node('div', [{name:'class', value:'adoptable-animal'}], [
        //The animal's picture node
        create_html_node('a',   [{name:'href', value:view_animal_url + animal["ID"]}], [
            create_html_node('img', [{name:'class', value:'animal-picture'},
                                     {name:'src', value: animal["Photo"]}]) ]),
        //The animal's name
        create_html_node('a',   [{name:'href', value: view_animal_url + animal["ID"]},
                                {name:'class', value: 'animal-name'}], null, animal["Name"]),
        //animal's BE result as a colored circle
        create_html_node('div', [{name: 'class', value: 'animal-be-result'}, 
                                {name: 'style', value: 'background-color:' + animal["BehaviorResult"]},
                                {name: 'title', value: ''}]),
        //Breed
        create_html_node('p', null, null, animal_breed_formatted),
        //Sex
        create_html_node('p', null, null, animal["Sex"]),
        //Age
        create_html_node('p', null, null, format_age(animal["Age"]))
    ]);


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

function format_age(age) {
    var years = Math.floor(age/12) 
    var months =  Math.floor(age%12);

    //return the age, ignoring years or months if it is set to 0
    return (years==0 ? "" : ((years>1) ? years + " years " : years + " year ")) + (months==0 ? "" : ((months>1) ? months + " months" : months + " month"));
}

var sort_by_name = function(a, b) {
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

function render_animals_html(results, output_area, view_animal_url) {
    results.map(function(animal) {
        output_area.appendChild(create_animal_detail(animal, view_animal_url));
    });
    //Generate the behavior result tooltips.
    generate_tooltips();
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
            node.appendChild(child_node);
        });
    }

    return node;
}

function create_sort_button(button_area, button_name, button_id, sort_func, view_animal_url, output_area) {
    button_area.insertBefore(create_html_node('button', [{name: 'id', value: button_id}], null, button_name), output_area);
    jQuery('#' + button_id).click(function() {
        output_area.innerHTML = "";
        global_results.sort(sort_func);
        render_animals_html(global_results, output_area, view_animal_url);
    });

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
