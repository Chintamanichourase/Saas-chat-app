"use client";

import { useEffect } from "react";
import { onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { auth } from "@/firebase/firebase";
import { subscriptionRef } from "@/lib/converters/Subscription";
import { useSubscriptionStore } from "@/store/store";

function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const setSubscription = useSubscriptionStore((s) => s.setSubscription);

  useEffect(() => {
    // Wait until NextAuth AND Firebase Auth are ready
    if (status !== "authenticated") return;
    if (!auth.currentUser) return;

    return onSnapshot(
      subscriptionRef(auth.currentUser.uid), // ✅ Firebase UID ONLY
      (snapshot) => {
        if (snapshot.empty) {
          console.log("User has NO subscription");
          setSubscription(null);
        } else {
          console.log("User has subscription");
          setSubscription(snapshot.docs[0].data());
        }
      },
      (error) => {
        console.error("error getting document:", error);
      }
    );
  }, [status, setSubscription]);

  return <>{children}</>;
}

export default SubscriptionProvider;

// "use client"
// import { subscriptionRef } from "@/lib/converters/Subscription";
// import { useSubscriptionStore } from "@/store/store";
// import { onSnapshot } from "firebase/firestore";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";

// function SubscriptionProvider({children}:{children: React.ReactNode}) {
//   const { data: session } = useSession();

//   const setSubscription=useSubscriptionStore(
//     (state)=>state.setSubscription
//   );

//   useEffect(() => {
//     if (!session) return;

//     return onSnapshot(subscriptionRef(session?.user.id), (snapshot) => {
//       if (snapshot.empty) {
//         console.log("User has NO subscription");
//         // set no subscription
//         setSubscription(null);
//         return;
//       } else {
//         console.log("User has subscription");
//         // set Subscription
//         setSubscription(snapshot.docs[0].data());
//       }
//     }, (error)=>{
//         console.log("error getting document:",error);
//     });
//   }, [session, setSubscription]); // Include session as a dependency for useEffect

//   return <>{children}</>;
// }

// export default SubscriptionProvider;
