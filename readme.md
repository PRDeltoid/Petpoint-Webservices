## Consider using PetPress instead

Consider using [PetPress](https://wordpress.org/plugins/petpress/) instead. It is very well made and being updated regularly. I've tried it out and it provides the same functionality as this plugin but is much better looking.

I will still be fixing any issues with this plugin and adding some simple features but competing with PetPress's features would require a full rewrite. I'm flattered that anyone has chosen to use a plugin I wrote for an animal shelter I worked for many years ago but If something like PetPress had existed at the time, I would have used it right away.

## THIS PLUGIN IS PROVIDED AS-IS, WITH NO WARRANTY. THIS PLUGIN AND ITS AUTHOR ARE NOT ASSOCIATED WITH OR EMPLOYEED BY PETHEALTH INC, OWNERS OF THE PETPOINT SOFTWARE OR THE WORDPRESS FOUNDATION. USE AT YOUR OWN RISK.

That being said, this program cannot edit any information in your PetPoint database, it can only READ information. You can find out more about PetPoint Webservices and what kind of information can be pulled from this link: http://ws.petango.com/webservices/wsAdoption.asmx.

If you just need a simple way to display adoptable animal information on your site, I suggest the use of the Adoptable Search I-Frame found [here](https://www.petpoint.com/downloads/Adoptable_Search_I-frame.pdf). The Adoptable Search I-Frame is provided directly by PetPoint and the results can be customized using CSS. This plugin is meant to provide advanced functionality such as filtering, sorting and displaying more animal details. If you do not need these advanced features, you will have a much easier time using the Adoptable Search I-Frame. If you have a web developer as an employee or volunteer, ask them about possiblity of writing some custom CSS to make the I-Frame match your site better!

10-7-2018:
Issues have been reported for HTTPS enabled sites. A fix is currently in the works.

### Install: 
* Click **Plugins**
* Click **Add New near** the top. 
* Click **Upload**
* Click **Choose File**
* Locate the .zip file, then click **Open**
* Click **Install Now**

You have succesfully installed the plugin! From the next page, simply click **Activate** to activate the plugin. 

### Setup:

#### Configuring the pages:
You must create three pages, one for Cats, one for Dogs, and one for singular Animals to be viewed. These pages can have any name. For each page, you must enter the "Text" view, and then include the HTML "&lt;div id="animal"&gt;&lt;/div&gt;". Without this HTML, the pages will fail to load any information. You can enter in any message you like between the tags, but that text will be removed when the animal's information is loaded. This is a good place to put a message stating that the page requires Javascript to be enabled to function correctly. 
#### Configuring the settings:
Once you have all three pages prepared, you must update your settings so the plugin knows where they are. Follow the instructions below to do this:
* From the main dashboard, hover over Settings and then select "PP Webservices Settings". 
* Enter the URL for the three pages you made previously into their respective settings boxes.
* For the View Animal pages to work correctly, you MUST refresh your Permalink settings. To do this, go to Settings, then Permalinks, and click "Save Changes". You do not need to make any changes to the settings, simply clicking the button will work.

#### Adding new fields:
You can add new fields to the View Animals page by editing the config.json file in this plugin (Note: This will be reset if there is an update to the plugin, so keep a backup of all your custom fields). To do this, open up the Wordpress Editor, or connect via FTP to your webhost, and find the file 'config.json' in the plugin's base folder. Open it, and locate the object "fields". Add a new item onto the end of the array of items, with the signature:
    \{"title": \[What you want to display to the user\], "field_name": \[name of the field to show \(located below\)\]\}.   
Make sure to include a comma in between every item (when adding a new item, you'll have to add a comma to the end of the previously last item.)
If you have done all of this correctly, the page will now show your new field.

#### Changing Behavior Evaluation Tooltip descriptions:
You can also change the Behavior Evaluation descriptions by editing the same 'config.json' file. Open it up the same way as instructed above, and locate the "be\_descriptions" object. Edit the string at the end of the color you would like to change (ie. change the string after "green\_be" to edit the green BE description). This change should be reflected next time you load the page.

#### Accessible Fields:
* CompanyID
* ID
* AnimalName
* Species
* Sex
* Altered
* PrimaryBreed
* SecondaryBreed
* PrimaryColor
* SecondaryColor
* Age
* Size
* Housetrained
* Declawed
* Price
* LastIntakeDate
* Location
* Dsc
* Photo1
* Photo2
* Photo3
* OnHold
* SpecialNeeds
* NoDogs
* NoCats
* NoKids
* BehaviorResult
* MemoList
* Site
* DateOfSurrender
* TimeInFormerHome
* ReasonForSurrender
* PrevEnvironment
* LivedWithChildren
* LivedWithAnimals
* LivedWithAnimalTypes
* BodyWeight
* DateOfBirth
* ARN
* VideoID
* BehaviorTestList
* Stage
* AnimalType
* AgeGroup
* WildlifeIntakeInjury
* WildlifeIntakeCause
* BuddyID
* Featured
* Sublocation
* ChipNumber
* ColorPattern
