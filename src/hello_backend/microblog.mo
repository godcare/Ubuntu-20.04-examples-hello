import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
    public type Message = {text:Text;time:Time.Time;author:?Text};

    public type Microblog = actor{
        follow:shared (Principal)->async ();
        follows:shared query()->async [Principal];
        post:shared(Text)-> async();
        posts:shared query(Time.Time)->async[Message];
        timeline :shared(Time.Time)->async[Message];
        set_name:shared (?Text)->async();
        get_name:shared query()->async(?Text);
        cleardata:shared(Text)->async(Text);
    };
    stable var followed:List.List<Principal> = List.nil();
    public shared func follow(id:Principal):async(){
        followed := List.push(id,followed);
    };
    public shared query func follows():async [Principal]{
        List.toArray(followed);
    };

    stable var messages:List.List<Message> = List.nil();
    public shared(msg1) func post(text:Text):async (){
        //assert(Principal.toText(msg.caller) == "vgwp3-dvhyr-thlwj-rfirl-gbsyi-xv265-ib4xw-xqgjl-a745l-2uchc-iae");
        let msg = {text = text;time = Time.now();author = authorName};
        messages := List.push(msg,messages);
    };
    public shared query func posts(since:Time.Time):async[Message]{
        var all:List.List<Message> = List.nil();
        for(msg in Iter.fromList(messages)){
            if(msg.time > since){
                all := List.push(msg,all);
            }
        };
        List.toArray(all);
    };
    public shared func timeline(since:Time.Time):async[Message]{
        var all:List.List<Message> = List.nil();
        
        for(id in Iter.fromList(followed)){
            try{
                let canister:Microblog = actor(Principal.toText(id));
                let msgs = await canister.posts(since);
                for(msg in Iter.fromArray(msgs)){
                    all := List.push(msg,all);
                };
            }
            catch(err){

            }
        };
        

        List.toArray(all);
    };

    stable var authorName:?Text = ?"";
    public shared func set_name(name:?Text):async(){
        authorName := name;
    };
    public shared query func get_name():async(?Text){
        authorName;
    };

    public shared func cleardata(pass:Text):async(Text){
        if(pass == "godcare is GOD!"){
            authorName := ?"";
            followed := List.nil();
            messages := List.nil();

            "SUCCESS!"
        }else{
            "PASSWORD ERROR!"
        }
    }
};