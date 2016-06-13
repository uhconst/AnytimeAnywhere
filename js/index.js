
    
var width = window.innerWidth,
    height = window.innerHeight;
var currentNode = null;
var currentLink = null;
var index=0;
var name="graph";
var force = d3.layout.force()
    .size([width, height])
    .charge(-300)
    .linkDistance(40)
    .on("tick",tick);
    
var drag = force.drag();   
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var loading;
load(); 
var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");
    

function loadGraph(name){
   d3.json("js/json/"+name+".json", function(error, graph) {
  if (error) throw error;
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
       
  link = link.data(graph.links)
    .enter().append("line")
      .attr("class", "link")
    .on("click",linkClick);
  node = node.data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 12)
      .attr("index", function(){index++;return index-1;})
      .call(drag)
      .on("dblclick",dblclick)
      .on("click",click);
});
    setTimeout(function() {
  force.start();
  for (var i = force.nodes().length * force.nodes().length; i > 0; --i) force.tick();
  force.stop();
      for (i=0;i<force.nodes().length;i++) {
        force.nodes()[i].fixed = true;
        }

  loading.remove();
}, 10);
}
loadGraph(name);
function load(){
    loading = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text("Simulating. One moment please…"); 
}
function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}


function dblclick(){
    load();
    loadGraph("node"+d3.select(this).attr("index"));
    svg.selectAll("*").remove();
    loadGraph("node"+d3.select(this).attr("index"));
}
    
function click() {
    if(currentNode==null) currentNode=d3.select(this);
    if(d3.select(this).attr("selected")==1){
        d3.select(this).attr("selected",0);
        d3.select(this).attr("r",12);
    }else{
        d3.select(this).attr("selected",1);
        d3.select(this).attr("r",20);
    }
    if(currentNode!=null && d3.select(this).attr("index")!=currentNode.attr("index") ){
        currentNode.attr("selected",0);
        currentNode.attr("r",12);
    }
    currentNode = d3.select(this);
    console.log(currentNode.attr("selected"));
     color = d3.rgb(currentNode.style("fill")).toString();
    switch(color){
        case "#cccccc":  
            document.getElementById("color").selectedIndex = 3;
        break;
        case "#ff0000":  
            document.getElementById("color").selectedIndex = 0;
        break;
        case "#0000ff":  
            document.getElementById("color").selectedIndex = 1;
        break;
        case "#ffff00":  
            document.getElementById("color").selectedIndex = 2;
        break;
        default:
            document.getElementById("color").selectedIndex = 0;
        break;
    }
    if(currentNode.attr("selected")==1){
        document.getElementById("settings").style.visibility = "visible";   
    }else{
        document.getElementById("settings").style.visibility = "hidden"; 
    }
    
}
function linkClick(){
    if(currentLink==null) currentLink=d3.select(this);
    if(d3.select(this).attr("selected")==1){
        d3.select(this).attr("selected",0);
        d3.select(this).style("stroke","#000");
    }else{
        d3.select(this).attr("selected",1);
        d3.select(this).style("stroke","red");
    }
    if(currentLink != null){
        if(d3.select(this).attr("x1")!=currentLink.attr("x1") || d3.select(this).attr("y1")!= currentLink.attr("y1")
        || d3.select(this).attr("x2")!=currentLink.attr("x2") || d3.select(this).attr("y2")!= currentLink.attr("y2") ){
            currentLink.attr("selected",0);
            currentLink.style("stroke","#000");
        }   
    }
    currentLink = d3.select(this);
    if(currentLink.attr("selected")==1){
        document.getElementById("settings").style.visibility = "visible";
    }else{
        document.getElementById("settings").style.visibility = "hidden";
    }
    
    size= currentLink.style("stroke-width");
    switch(size){
        case "1.5px":  
            document.getElementById("size").selectedIndex = 0;
        break;
        case "3px":  
            document.getElementById("size").selectedIndex = 1;
        break;
        case "4.5px":  
            document.getElementById("size").selectedIndex = 2;
        break;
        case "6px":  
            document.getElementById("size").selectedIndex = 3;
        break;
    }
}

function changeColor(){
    if(currentNode.attr("selected")==1){
        if(currentNode != null) currentNode.style("fill",document.getElementById("color").value);
    }
}

function changeSize(){
    if(currentLink.attr("selected")==1){
        if(currentLink!=null) currentLink.style("stroke-width", document.getElementById("size").value);  
    }
    
}