function view_animal(animal_id, plugin_base, page_urls) 
{
    var requestURL = plugin_base + "/viewanimal.php?id=" + animal_id; //Build the request URL using the animal's ID

    var animal_details = get_animal_details(requestURL); //request animal data
    
    var output_area = document.getElementById('animal'); //Find the div element that our HTML will be placed inside of.

    var request_data = {output_fields: "", be_descriptions: ""}; //Initialize the object for pass-by-reference use

    request_configs(plugin_base, request_data); //Loads config.json which sets up the animal data fields and BE information

    //Assigns the data pulled from the configs function to it's own variable.
    var output_fields = request_data.output_fields;
    var be_descriptions = request_data.be_descriptions;

    generate_back_button(animal_details['Species'], page_urls, output_area); //Generate the Back to Dogs/Cats link

    setup_photo(output_area, animal_details); //Create the animal's picture element.

    generate_fields(output_fields, animal_details, output_area); //Create animal's details in a table

    generate_tooltips(be_descriptions); //generate behavior tooltips

    set_title(animal_details["AnimalName"]); //Set the page title to the animal's name
}

function get_animal_details(requestURL) {
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
    return animal_details;
}

function request_configs(plugin_base, request_data) {
    jQuery.ajax({
        url: plugin_base + "/config.json",
        dataType: 'json',
        async: false,
        success: function(data) {
            request_data.output_fields = data["fields"];
            request_data.be_descriptions = data["be_descriptions"];
        },
        error: function(x, text, error) {
            console.log(error);
        }
    });
}

function generate_back_button(animal_species, page_urls, output_area) {
    if(animal_species == 'Dog') {
        var back_button_url = page_urls.dogs;
    } else if(animal_species == 'Cat') {
        var back_button_url = page_urls.cats;
    }

    //Create a back button and insert it before the output_area node. 
    var back_button = create_html_node('a', [{name: 'href', value: back_button_url}], null, null, 'Back to ' + animal_species + 's');
    output_area.parentNode.insertBefore(back_button, output_area);
}

function generate_fields(output_fields, animal_details, output_area) {
    //Create the animal's detail table (this is an empty container at this point).
    var animal_detail_node = create_html_node('table', [{name:'class', value:'animal-detail'}], output_area); 

    //Go through each object in output_fields and output a table row containing the title, and the animal's detail for the field_name
    output_fields.map(function(field_object) {
        if(typeof animal_details[field_object.field_name] != 'object') {
            //Format the output if a Type is set. 
            if(field_object.type) {
                animal_details[field_object.field_name] = format_field(field_object, animal_details[field_object.field_name]);
            }

            create_html_node('tr', null, animal_detail_node, [
                create_html_node('td', null, null, null, "<b>" + field_object.title + "</b>"),
                create_html_node('td', null, null, null, animal_details[field_object.field_name])  
            ]);
        }
    });
}

function set_title(animal_name) {
    document.title = animal_name + " - " + document.title;
}

function generate_tooltips(be_descriptions) {
    jQuery('sup').tooltip({content: 'These colors are used to categorize animals by behavior type. <br><br>' +
        '<b style="color: Green">Green:</b> ' + be_descriptions["green_be"] + '<br>' +
        '<b style="color: Orange">Orange:</b> ' + be_descriptions["orange_be"] + '<br>' +
        '<b style="color: Purple">Purple:</b> ' + be_descriptions["purple_be"]});
}

function create_html_node(node_type, attributes, parent_node, child_nodes, html_content) {
    var node = document.createElement(node_type);
    //Set node attributes
    if(attributes) {
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
    //Append to the parent_node, if set.
    if(parent_node) {
        parent_node.appendChild(node);
    }
    return node;
}

function load_photo(photo_url) {
    var image_element = jQuery('#animal-picture');
    var loading_spinner = jQuery('.loading');
    image_element.attr('src', photo_url);
    image_element.each(function() {
       if(!this.complete) { //Check if image is cached, run animation if it's not.
            image_element.css('opacity', 0.3); //Dim the background image
            loading_spinner.css('display', 'inline'); //Show the spinner
            jQuery(this).load(function() { //Undo dim and hide spinner when image is loaded
                loading_spinner.css('display', 'none'); 
                image_element.css('opacity', 1.0);
            });
       }
    });
}

function setup_photo(output_area, animal_details) {
    var animal_picture_container_node = 
            create_html_node('div', [ {name:'class',  value: 'animal-picture-container'} ], output_area, [
                create_html_node('div', [ {name: 'class', value: 'loading'} ]),
                create_html_node('img', [ {name: 'class', value: 'view-animal-picture'},
                                          {name: 'id',    value: 'animal-picture'},
                                          {name: 'src',   value: animal_details['Photo1']}]),
                create_html_node('div', [ {name: 'id', value: 'photo-links'} ]) 
            ]);

    setup_photo_links(animal_details);
}

function setup_photo_links(animal_details) {
    var photo_output_area = document.getElementById('photo-links');

    //Count the number of photo entries (Regex catches all Photo nodes with a link inside them, if it has no link, then it's a blank photo)
    var photo_regex = /"Photo[1-9]{1}":"http:/g;
    var num_of_photos = JSON.stringify(animal_details).match(photo_regex).length;

    //Create a button node for each picture, and add an event listener to fire when that button is clicked. 
     for(i=0; i<num_of_photos; i++) {
        //Don't want to output 0, so we add 1 to make it more user friendly.
        var photo_num = i+1;
        var photo_url = animal_details['Photo' + photo_num];
        var picture_element = create_html_node('input', [ {name: 'type',  value: 'button'},
                                    {name: 'id',    value: 'photo' + photo_num},
                                    {name: 'class', value: 'photo-btn btn btn-primary btn-sm'},
                                    {name: 'value', value: photo_num}],
                            photo_output_area);

        if(photo_num==1) {
            jQuery('#photo1').addClass('active');
        }

        //Finally, add an event listener to switch to the picture when it's button is clicked (using load_photo).
        picture_element.addEventListener("click", load_photo.bind(null, photo_url));
        jQuery('#photo'+photo_num).click(function() {
            jQuery('.active').removeClass('active');
            jQuery(this).addClass('active');
        });
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
        case "desciption":
            return format_description(field_data);
            break;
        case "be":
            return format_be(field_data);
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
    return (years==0 ? "" : ((years>1) ? years + " years " : years + " year ")) + (months==0 ? "" : ((months>1) ? months + " months" : months + " month"));
    //return (years==0 ? "" : years + "y ") + (months==0 ? "" : months +"m");
}

function format_breed(breed) {
    //Reverse the breed string by the comma (ex. Chihuahua, Short Coat => Short Coat Chihuahua)
    var split_string = breed.split(", ");
    split_string.reverse();
    return split_string.join(" ");
}

function format_description(desc) {
    //Remove any (initials) or [initials] notes inside the animal desciption.
   return desc.replace(/[\[\(]\w+[\)\]]/g, '');
}

function format_be(be_result) {
    //Colors the result as the behavior result's color. Also adds a small Superscript link at the end to link to a page where the BE colors are explained
    return "<span style='font-weight:bold; color: " + be_result + "'>" + be_result + "</span>   <sup title=''><a href='#'>What is this?</a></sup>";
}

