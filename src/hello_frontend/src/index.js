import { Actor,HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { microblog } from "../../declarations/microblog";
import {idlFactory as micro_idl} from "../../declarations/microblog";


async function post(){
  //let error = document.getElementById("error");
  error.innerText = "querying...";
  //let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  subdata_section.replaceChildren([]);
  post_button.disabled = true;
  try{
    //let textarea = document.getElementById("message");
    //let text = textarea.value;
    await microblog.post(textarea.value);
  }catch(err){
    error.innerText = "post exception:" + err;
    post_button.disabled = false;
    return;
  }
  error.innerText ="post success";
  post_button.disabled = false;
}

async function load_posts(){
  //let error = document.getElementById("error");
  error.innerText = "loading...";
  //let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  subdata_section.replaceChildren([]);
  postlist_button.disabled = true;
  try{
    let posts = await microblog.posts(0);
    for(var i=0;i < posts.length;i++){
      let post = document.createElement("p");
      post.innerText = posts[i].text;
      data_section.appendChild(post);
    }
  }catch(err){
    error.innerText = "load_posts exception:" + err;
    postlist_button.disabled = false;
    return;
  }
  error.innerText ="load_posts success";
  postlist_button.disabled = false;
}


async function follow(){
  //let error = document.getElementById("error");
  error.innerText = "querying...";
  //let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  subdata_section.replaceChildren([]);
  follow_button.disabled = true;
  try{
    //let textarea = document.getElementById("message");
    //let text = textarea.value;
    await microblog.follow(Principal.from(textarea.value));
  }catch(err){
    error.innerText = "post exception:" + err;
    follow_button.disabled = false;
  return;
  }
  error.innerText ="post success";
  follow_button.disabled = false;
}
async function load_follows()
{
  //let error = document.getElementById("error");
  error.innerText = "loading...";
  //let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  subdata_section.replaceChildren([]);
  followlist_button.disabled = true;
  try{
    let follows = await microblog.follows();
    let infos = [];
    let agent = new HttpAgent();
    agent.fetchRootKey();
    for(var i = 0;i < follows.length;i++){
      let follow = document.createElement("button");
      var name;
      try{
        let actor = Actor.createActor(micro_idl,{agent:agent,canisterId:follows[i]});
        name = await actor.get_name();
      }catch(err1){
        name = "canister:"+follows[i]+" get exception:"+err1;
      }
      follow.innerText = name;
      follow.canisterId = follows[i];
      follow.onclick = load_timeline_of;
      infos[i] = follow;
    }
    for(var i = 0;i < infos.length;i++){
      data_section.appendChild(infos[i]);
    }
  }catch(err){
    error.innerText = "load_follows exception:" + err;
    followlist_button.disabled = false;
  return;
  }
  error.innerText ="load_follows success";
  followlist_button.disabled = false;
}

async function set_name(){
  //let error = document.getElementById("error");
  error.innerText = "setting...";
  //let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  subdata_section.replaceChildren([]);
  setName_button.disabled = true;
  try{
    //let textarea = document.getElementById("message");
    //let text = textarea.value;
    await microblog.set_name([textarea.value]);
  }catch(err){
    error.innerText = "set_name exception:" + err;
    setName_button.disabled = false;
  return;
  }
  error.innerText ="set_name success";
  setName_button.disabled = false;
}

async function load_timeline(){
  //let error = document.getElementById("error");
  error.innerText = "loading...";
  //let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  subdata_section.replaceChildren([]);
  timeline_button.disabled = true;
  try{
    let messages = await microblog.timeline(0);
    for(var i = 0;i < messages.length;i++){
      let follow = document.createElement("p");
      let time = Number(messages[i].time);
      follow.innerText = "Author: "+messages[i].author+" At Time: "+new Date(time/1000000).toLocaleString()+" Say: "+messages[i].text;
      data_section.appendChild(follow); 
    }
  }catch(err){
    error.innerText = "load_follows exception:" + err;
    timeline_button.disabled = false;
    return;
  }
  error.innerText ="load_follows success";
  timeline_button.disabled = false;
}

async function load_timeline_of(event){
  var button = event.currentTarget;
  //let error = document.getElementById("error");
  error.innerText = "loading...";
  //let data_section = document.getElementById("data");
  subdata_section.replaceChildren([]);
  button.disabled = true;
  try{
    let agent = new HttpAgent();
    agent.fetchRootKey();
    let actor = Actor.createActor(micro_idl,{agent:agent,canisterId:button.canisterId});
    let messages = await actor.posts(0);
    for(var i = 0;i < messages.length;i++){
        let follow = document.createElement("p");
        let time = Number(messages[i].time);
        follow.innerText = "Author: "+messages[i].author+" At Time: "+new Date(time/1000000).toLocaleString()+" Say: "+messages[i].text;
        subdata_section.appendChild(follow); 
    }
  }catch(err){
    error.innerText = "load_follows of ["+button.canisterId+"] exception:" + err;
    button.disabled = false;
  return;
  }
  error.innerText ="load_follows success";
  button.disabled = false;
}
async function clearData(){
  error.innerText = "clearing...";
  data_section.replaceChildren([]);
  subdata_section.replaceChildren([]);
  clearData_button.disabled = true;
  var result;
  try{
    result = await microblog.cleardata(textarea.value);
  }catch(err){
    error.innerText = "clearData exception:" + err;
    clearData_button.disabled = false;
    return;
  }
    error.innerText = "clearData Result: "+result;
    clearData_button.disabled = false;
}

var error;
var data_section;
var subdata_section;
var textarea;
var post_button;
var postlist_button;
var follow_button;
var followlist_button;
var setName_button;
var timeline_button;
var clearData_button;
function load(){

  error = document.getElementById("error");
  data_section = document.getElementById("data");
  subdata_section = document.getElementById("subData");
  textarea = document.getElementById("message");


  post_button = document.getElementById("post");
  post_button.onclick = post;

  postlist_button = document.getElementById("posts");
  postlist_button.onclick = load_posts;

  follow_button = document.getElementById("follow");
  follow_button.onclick = follow;

  followlist_button = document.getElementById("follows");
  followlist_button.onclick = load_follows;

  setName_button = document.getElementById("setName");
  setName_button.onclick = set_name;

  timeline_button = document.getElementById("timeline");
  timeline_button.onclick = load_timeline;

  clearData_button = document.getElementById("clearData");
  clearData_button.onclick = clearData;
  //load_posts();
  //setInterval(load_posts,3000);
}
window.onload = load;
