let genButton;

function setup() { 
  noCanvas();
  background(255);
  genButton = createButton("Click to generate");
  genButton.mousePressed(generate);
} 

function draw() { 
}

function generate() {
  // removes existing outputs from the page (if any)
  for (let elem of selectAll("p")) {
    elem.remove();
  }
  
  // remove this loop or change the loop condition if you only want
  // to produce a single output!
  for (let i = 0; i < 10; i++) {
    let grammar = tracery.createGrammar(grammarSource);
    grammar.addModifiers(tracery.baseEngModifiers);
    let output = grammar.flatten("#origin#");
    createP(output);
  }
}

// write your grammar below, or cut-and-paste from another tool (as the value for variable "grammarSource")
let grammarSource = {
  "origin": "#interjection.capitalize#, #name#! I'm #profession.a#, not #profession.a#!",
  "interjection": ["alas", "congratulations", "eureka", "fiddlesticks",
    "good grief", "hallelujah", "oops", "rats", "thanks", "whoa", "yes"],
  "name": ["Jim", "John", "Tom", "Steve", "Kevin", "Gary", "George", "Larry"],
  "profession": [
        "accountant",
        "actor",
        "archeologist",
        "astronomer",
        "audiologist",
        "bartender",
        "butcher",
        "carpenter",
        "composer",
        "crossing guard",
        "curator",
        "detective",
        "economist",
        "editor",
        "engineer",
        "epidemiologist",
        "farmer",
        "flight attendant",
        "forest fire prevention specialist",
        "graphic designer",
        "hydrologist",
        "librarian",
        "lifeguard",
        "locksmith",
        "mathematician",
        "middle school teacher",
        "nutritionist",
        "painter",
        "physical therapist",
        "priest",
        "proofreader",
        "rancher",
        "referee",
        "reporter",
        "sailor",
        "sculptor",
        "singer",
        "sociologist",
        "stonemason",
        "surgeon",
        "tailor",
        "taxi driver",
        "teacher assistant",
        "teacher",
        "teller",
        "therapist",
        "tour guide",
        "translator",
        "travel agent",
        "umpire",
        "undertaker",
        "urban planner",
        "veterinarian",
        "web developer",
        "weigher",
        "welder",
        "woodworker",
        "writer",
        "zoologist"
  ]
};