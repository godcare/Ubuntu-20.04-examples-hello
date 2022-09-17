
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
stable var currentValue : Nat = 0;

  // Increment the counter with the increment function.
  public func increment() : async () {
    currentValue += 1;
  };

  // Read the counter value with a get function.
  public query func get() : async Nat {
    currentValue
  };

  // Write an arbitrary value with a set function.
  public func set(n: Nat) : async () {
    currentValue := n;
  };


  type HttpRequest = {
    body:Blob;
    headers:[HeaderField];
    method:Text;
    url:Text;
  };
  type HttpResponse = {
    body:Blob;
    headers:[HeaderField];
    status_code:Nat16;
  };
  type HeaderField = (Text,Text);
  public query func http_request(arg:HttpRequest):async HttpResponse{

    let str1:Text = Nat.toText(currentValue);
    let str = Text.concat("currentCount is ",str1);
    {
      body = Text.encodeUtf8(str);
      headers = [];
      status_code = 200;
    }
  };


};