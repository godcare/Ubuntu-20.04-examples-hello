import Array "mo:base/Array";
import Order "mo:base/Order";
import Int "mo:base/Int";

module QuickSort{
    type Order = Order.Order;

    public func quicksort(ints:[var Int]){
        let n = ints.size();
        if(n > 1){
            sortBy(ints,0,n-1);
        }
    };

    private func sortBy(ints:[var Int],l:Int,r:Int){
        let f = Int.compare;
        if(l < r){
            var i = l;
            var j = r;
            var swap = ints[0];
            let pivot = ints[Int.abs(l+r)/2];
            while(i <= j){
               while(Order.isLess(f(ints[Int.abs(i)],pivot))){
                i+=1;
                };
                while(Order.isGreater(f(ints[Int.abs(j)],pivot))){
                    j -= 1;
                };
                if(i <= j){
                    swap := ints[Int.abs(i)];
                    ints[Int.abs(i)] := ints[Int.abs(j)];
                    ints[Int.abs(j)] := swap;
                    i+=1;
                    j-=1;
                };
            };
            if(l < j){
                sortBy(ints,l,j);
            };
            if(i < r){
                sortBy(ints,i,r);
            };
        };
    };
};