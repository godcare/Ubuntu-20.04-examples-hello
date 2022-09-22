import { Actor,HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { microblog } from "../../declarations/microblog";
import {idlFactory as micro_idl} from "../../declarations/microblog";

async function load_timeline_of(cid){
  let error = document.getElementById("error");
  error.innerText = "";
  let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  try{
    let agent = new HttpAgent();
    agent.fetchRootKey();
    let actor = Actor.createActor(micro_idl,{agent:agent,canisterId:cid});
    let messages = await actor.posts(0);
    for(var i = 0;i < messages.length;i++){
        let follow = document.createElement("p");
        let time = Number(messages[i].time);
        follow.innerText = "Author: "+messages[i].author+" At Time: "+new Date(time/1000000).toLocaleString()+" Say: "+messages[i].text;
        data_section.appendChild(follow); 
    }
  }catch(err){
    error.innerText = "load_follows exception:" + err;
    return;
  }
  error.innerText ="load_follows success";
}

async function load_timeline(){
  let error = document.getElementById("error");
  error.innerText = "";
  let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
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
    return;
  }
  error.innerText ="load_follows success";
}

async function set_name(){
  let error = document.getElementById("error");
  error.innerText = "";
  let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  let setName_button = document.getElementById("setName");
  setName_button.disabled = true;
  try{
    let textarea = document.getElementById("message");
    let text = textarea.value;
    await microblog.set_name(text);
  }catch(err){
    error.innerText = "set_name exception:" + err;
    return;
  }
  error.innerText ="set_name success";
  setName_button.disabled = false;
}

async function follow(){
  let error = document.getElementById("error");
  error.innerText = "";
  let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  let follow_button = document.getElementById("follow");
  follow_button.disabled = true;
  try{
    let textarea = document.getElementById("message");
    let text = textarea.value;
    await microblog.follow(Principal.from(text));
  }catch(err){
    error.innerText = "post exception:" + err;
    return;
  }
  error.innerText ="post success";
  follow_button.disabled = false;
}
async function load_follows()
{
  let error = document.getElementById("error");
  error.innerText = "";
  let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  try{
    let follows = await microblog.follows();
    for(var i = 0;i < follows.length;i++){
      let follow = document.createElement("button");
      let agent = new HttpAgent();
      agent.fetchRootKey();
      let actor = Actor.createActor(micro_idl,{agent:agent,canisterId:follows[i]});
      let name = await actor.get_name();
      follow.innerText = name;
      follow.onclick = load_timeline_of(follows[i]);
      data_section.appendChild(follow);
    }
  }catch(err){
    error.innerText = "load_follows exception:" + err;
    return;
  }
  error.innerText ="load_follows success";
}




async function post(){
  let error = document.getElementById("error");
  error.innerText = "";
  let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  let post_button = document.getElementById("post");
  post_button.disabled = true;
  try{
    let textarea = document.getElementById("message");
    let text = textarea.value;
    await microblog.post(text);
  }catch(err){
    error.innerText = "post exception:" + err;
    post_button.disabled = false;
    return;
  }
  error.innerText ="post success";
  post_button.disabled = false;
}

async function load_posts(){
  let error = document.getElementById("error");
  error.innerText = "";
  let data_section = document.getElementById("data");
  data_section.replaceChildren([]);
  try{
    let posts = await microblog.posts(0);
    for(var i=0;i < posts.length;i++){
      let post = document.createElement("p");
      post.innerText = posts[i].text;
      data_section.appendChild(post);
    }
  }catch(err){
    error.innerText = "load_posts exception:" + err;
    return;
  }
  error.innerText ="load_posts success";
}
function load(){
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  let postlist_button = document.getElementById("posts");
  postlist_button.onclick = load_posts;
  let follow_button = document.getElementById("follow");
  follow_button.onclick = follow;
  let follows_button = document.getElementById("follows");
  follows_button.onclick = load_follows;
  let setName_button = document.getElementById("setName");
  setName_button.onclick = set_name;
  let timeline_button = document.getElementById("timeline");
  timeline_button.onclick = load_timeline;
  //load_posts();
  //setInterval(load_posts,3000);
}
window.onload = load;
