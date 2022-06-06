import H "mo:base/HashMap";
import L "mo:base/List";
import P "mo:base/Principal";
import O "mo:base/Option";
import I "mo:base/Iter";

shared(msg) actor class Index() {
  stable var stableIndex : [(Principal, [Principal])] = [];

  var index : H.HashMap<Principal, L.List<Principal>> = 
    H.HashMap<Principal, L.List<Principal>>(1024, P.equal, P.hash);

  system func preupgrade() {
    stableIndex := I.toArray(
      H.map<Principal, L.List<Principal>, [Principal]>(
        index,
        P.equal,
        P.hash,
        func (owner : Principal, canisterIds : L.List<Principal>) : [Principal] {
          L.toArray<Principal>(canisterIds)
        }
      ).entries()
    );
  };

  system func postupgrade() {
    let iter = I.fromArray<(Principal, [Principal])>(stableIndex);
    let listIter = I.map<(Principal, [Principal]), (Principal, L.List<Principal>)>(
      iter,
      func ((owner, canisterIds) : (Principal, [Principal])) : (Principal, L.List<Principal>) {
        (owner, L.fromArray<Principal>(canisterIds))
      }
    );
    index := H.fromIter<Principal, L.List<Principal>>(
      listIter,
      1024,
      P.equal,
      P.hash
    );
  };

  public query func list() : async [Principal] {
    switch (index.get(msg.caller)) {
      case null [];
      case (?list) L.toArray(list);
    }
  };

  public func link(boxCanisterId : Principal) : async () {
    let existing = O.get(index.get(msg.caller), L.nil<Principal>());
    let newList = L.push(boxCanisterId, existing);
    index.put(msg.caller, newList);
  };

  public func unlink(boxCanisterId : Principal) : async () {
    let existing = O.get(index.get(msg.caller), L.nil<Principal>());
    let newList = L.filter<Principal>(existing, func (x : Principal) : Bool {
      x != boxCanisterId
    });
    index.put(msg.caller, newList);
  };
};
