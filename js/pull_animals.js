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
    
    var animal_node = create_html_node('div', [{name:'class', value:'adoptable-animal'}], [
        //The animal's picture node
        create_html_node('a',   [{name:'href', value:view_animal_url + animal["ID"]}], [
            create_html_node('img', [{name:'class', value:'animal-picture'},
                                     {name:'src', value: animal["Photo"]}]) ]),
        //The animal's name
        create_html_node('a',   [{name:'href', value: view_animal_url + animal["ID"]},
                                {name:'class', value: 'animal-name'}], null, animal["Name"]),
        //Breed
        create_html_node('p', null, null, animal_breed_formatted),
        //Sex
        create_html_node('p', null, null, animal["Sex"]),        
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
