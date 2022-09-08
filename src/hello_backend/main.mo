import QuickSort "quicksort";
import Array "mo:base/Array";

actor {
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
  public func qsort(arr:[Int]):async [Int]{
    let result = Array.thaw<Int>(arr);
    QuickSort.quicksort(result);
    return Array.freeze<Int>(result);
  };
};
